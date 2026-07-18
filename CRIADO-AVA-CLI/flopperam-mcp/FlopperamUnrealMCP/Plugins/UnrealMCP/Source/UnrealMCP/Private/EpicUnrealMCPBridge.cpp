#include "EpicUnrealMCPBridge.h"
#include "MCPServerRunnable.h"
#include "Sockets.h"
#include "SocketSubsystem.h"
#include "HAL/RunnableThread.h"
#include "Interfaces/IPv4/IPv4Address.h"
#include "Interfaces/IPv4/IPv4Endpoint.h"
#include "Dom/JsonObject.h"
#include "Dom/JsonValue.h"
#include "Serialization/JsonSerializer.h"
#include "Serialization/JsonReader.h"
#include "Serialization/JsonWriter.h"
#include "Engine/StaticMeshActor.h"
#include "Engine/DirectionalLight.h"
#include "Engine/PointLight.h"
#include "Engine/SpotLight.h"
#include "Camera/CameraActor.h"
#include "EditorAssetLibrary.h"
#include "AssetRegistry/AssetRegistryModule.h"
#include "JsonObjectConverter.h"
#include "GameFramework/Actor.h"
#include "Engine/Selection.h"
#include "Kismet/GameplayStatics.h"
#include "Async/Async.h"
// Add Blueprint related includes
#include "Engine/Blueprint.h"
#include "Engine/BlueprintGeneratedClass.h"
#include "Factories/BlueprintFactory.h"
#include "EdGraphSchema_K2.h"
#include "K2Node_Event.h"
#include "K2Node_VariableGet.h"
#include "K2Node_VariableSet.h"
#include "Components/StaticMeshComponent.h"
#include "Components/BoxComponent.h"
#include "Components/SphereComponent.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "Kismet2/KismetEditorUtilities.h"
// UE5.5 correct includes
#include "Engine/SimpleConstructionScript.h"
#include "Engine/SCS_Node.h"
#include "UObject/Field.h"
#include "UObject/FieldPath.h"
// Blueprint Graph specific includes
#include "EdGraph/EdGraph.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphPin.h"
#include "K2Node_CallFunction.h"
#include "K2Node_InputAction.h"
#include "K2Node_Self.h"
#include "GameFramework/InputSettings.h"
#include "EditorSubsystem.h"
#include "Subsystems/EditorActorSubsystem.h"
#include "HAL/PlatformTime.h"
#include "Misc/EngineVersion.h"
// Include our new command handler classes
#include "Commands/EpicUnrealMCPEditorCommands.h"
#include "Commands/EpicUnrealMCPBlueprintCommands.h"
#include "Commands/EpicUnrealMCPBlueprintGraphCommands.h"
#include "Commands/EpicUnrealMCPBuildingCommands.h"
#include "Commands/EpicUnrealMCPCommonUtils.h"

// Default settings
#define MCP_SERVER_HOST "127.0.0.1"
#define MCP_SERVER_PORT 55557

UEpicUnrealMCPBridge::UEpicUnrealMCPBridge()
{
    EditorCommands = MakeShared<FEpicUnrealMCPEditorCommands>();
    BlueprintCommands = MakeShared<FEpicUnrealMCPBlueprintCommands>();
    BlueprintGraphCommands = MakeShared<FEpicUnrealMCPBlueprintGraphCommands>();
    BuildingCommands = MakeShared<FEpicUnrealMCPBuildingCommands>();
    TotalCommandsExecuted = 0;
    BridgeStartTime = FPlatformTime::Seconds();
}

UEpicUnrealMCPBridge::~UEpicUnrealMCPBridge()
{
    EditorCommands.Reset();
    BlueprintCommands.Reset();
    BlueprintGraphCommands.Reset();
    BuildingCommands.Reset();
}

// Initialize subsystem
void UEpicUnrealMCPBridge::Initialize(FSubsystemCollectionBase& Collection)
{
    UE_LOG(LogTemp, Display, TEXT("EpicUnrealMCPBridge: Initializing"));
    
    bIsRunning = false;
    ListenerSocket = nullptr;
    ConnectionSocket = nullptr;
    ServerThread = nullptr;
    Port = MCP_SERVER_PORT;
    FIPv4Address::Parse(MCP_SERVER_HOST, ServerAddress);

    // Start the server automatically
    StartServer();
}

// Clean up resources when subsystem is destroyed
void UEpicUnrealMCPBridge::Deinitialize()
{
    UE_LOG(LogTemp, Display, TEXT("EpicUnrealMCPBridge: Shutting down"));
    StopServer();
    FEpicUnrealMCPEditorCommands::ShutdownPieTracking();
}

// Start the MCP server
void UEpicUnrealMCPBridge::StartServer()
{
    if (bIsRunning)
    {
        UE_LOG(LogTemp, Warning, TEXT("EpicUnrealMCPBridge: Server is already running"));
        return;
    }

    // Create socket subsystem
    ISocketSubsystem* SocketSubsystem = ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM);
    if (!SocketSubsystem)
    {
        UE_LOG(LogTemp, Error, TEXT("EpicUnrealMCPBridge: Failed to get socket subsystem"));
        return;
    }

    // Create listener socket
    TSharedPtr<FSocket> NewListenerSocket = MakeShareable(SocketSubsystem->CreateSocket(NAME_Stream, TEXT("UnrealMCPListener"), false));
    if (!NewListenerSocket.IsValid())
    {
        UE_LOG(LogTemp, Error, TEXT("EpicUnrealMCPBridge: Failed to create listener socket"));
        return;
    }

    // Allow address reuse for quick restarts
    NewListenerSocket->SetReuseAddr(true);
    NewListenerSocket->SetNonBlocking(true);

    // Bind to address
    FIPv4Endpoint Endpoint(ServerAddress, Port);
    if (!NewListenerSocket->Bind(*Endpoint.ToInternetAddr()))
    {
        UE_LOG(LogTemp, Error, TEXT("EpicUnrealMCPBridge: Failed to bind listener socket to %s:%d"), *ServerAddress.ToString(), Port);
        return;
    }

    // Start listening
    if (!NewListenerSocket->Listen(10))
    {
        UE_LOG(LogTemp, Error, TEXT("EpicUnrealMCPBridge: Failed to start listening"));
        return;
    }

    ListenerSocket = NewListenerSocket;
    bIsRunning = true;
    UE_LOG(LogTemp, Display, TEXT("EpicUnrealMCPBridge: Server started on %s:%d"), *ServerAddress.ToString(), Port);

    // Start server thread
    ServerThread = FRunnableThread::Create(
        new FMCPServerRunnable(this, ListenerSocket),
        TEXT("UnrealMCPServerThread"),
        0, TPri_Normal
    );

    if (!ServerThread)
    {
        UE_LOG(LogTemp, Error, TEXT("EpicUnrealMCPBridge: Failed to create server thread"));
        StopServer();
        return;
    }
}

// Stop the MCP server
void UEpicUnrealMCPBridge::StopServer()
{
    if (!bIsRunning)
    {
        return;
    }

    bIsRunning = false;

    // Clean up thread
    if (ServerThread)
    {
        ServerThread->Kill(true);
        delete ServerThread;
        ServerThread = nullptr;
    }

    // Close sockets
    if (ConnectionSocket.IsValid())
    {
        ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM)->DestroySocket(ConnectionSocket.Get());
        ConnectionSocket.Reset();
    }

    if (ListenerSocket.IsValid())
    {
        ISocketSubsystem::Get(PLATFORM_SOCKETSUBSYSTEM)->DestroySocket(ListenerSocket.Get());
        ListenerSocket.Reset();
    }

    UE_LOG(LogTemp, Display, TEXT("EpicUnrealMCPBridge: Server stopped"));
}

static void BuildErrorResponse(TSharedPtr<FJsonObject>& ResponseJson, const FString& ErrorCode, const FString& ErrorMessage)
{
    ResponseJson = MakeShareable(new FJsonObject);
    ResponseJson->SetStringField(TEXT("status"), TEXT("error"));
    TSharedPtr<FJsonObject> ErrObj = MakeShareable(new FJsonObject);
    ErrObj->SetStringField(TEXT("code"), ErrorCode);
    ErrObj->SetStringField(TEXT("message"), ErrorMessage);
    ResponseJson->SetObjectField(TEXT("error"), ErrObj);
}

static void InjectResponseId(TSharedPtr<FJsonObject>& ResponseJson, const FString& RequestId)
{
    if (!RequestId.IsEmpty())
    {
        ResponseJson->SetStringField(TEXT("id"), RequestId);
    }
}

// Execute a command received from a client
FString UEpicUnrealMCPBridge::ExecuteCommand(const FString& CommandType, const TSharedPtr<FJsonObject>& Params, const FString& RequestId)
{
    double StartTime = FPlatformTime::Seconds();
    TotalCommandsExecuted++;
    UE_LOG(LogTemp, Display, TEXT("EpicUnrealMCPBridge: [id=%s] cmd=%s (#%d)"), *RequestId, *CommandType, TotalCommandsExecuted);
    
    // Create a promise to wait for the result
    TPromise<FString> Promise;
    TFuture<FString> Future = Promise.GetFuture();
    
    // Queue execution on Game Thread
    AsyncTask(ENamedThreads::GameThread, [this, CommandType, Params, RequestId, Promise = MoveTemp(Promise)]() mutable
    {
        TSharedPtr<FJsonObject> ResponseJson = MakeShareable(new FJsonObject);
        
        try
        {
            TSharedPtr<FJsonObject> ResultJson;
            
            if (CommandType == TEXT("health") || CommandType == TEXT("get_server_info"))
            {
                ResultJson = MakeShareable(new FJsonObject);
                ResultJson->SetStringField(TEXT("plugin_version"), UNREALMCP_PLUGIN_VERSION);
                ResultJson->SetStringField(TEXT("protocol_version"), UNREALMCP_PROTOCOL_VERSION);
                ResultJson->SetStringField(TEXT("unreal_engine"), TEXT("5.6"));
                ResultJson->SetStringField(TEXT("server_state"), TEXT("running"));
                ResultJson->SetNumberField(TEXT("port"), MCP_SERVER_PORT);
                ResultJson->SetNumberField(TEXT("commands_count"), 87);
                TArray<TSharedPtr<FJsonValue>> Cats;
                Cats.Add(MakeShared<FJsonValueString>(TEXT("bridge")));
                Cats.Add(MakeShared<FJsonValueString>(TEXT("editor")));
                Cats.Add(MakeShared<FJsonValueString>(TEXT("blueprint")));
                Cats.Add(MakeShared<FJsonValueString>(TEXT("graph")));
                Cats.Add(MakeShared<FJsonValueString>(TEXT("building")));
                ResultJson->SetArrayField(TEXT("command_categories"), Cats);
            }
            else if (CommandType == TEXT("ping"))
            {
                ResultJson = MakeShareable(new FJsonObject);
                ResultJson->SetStringField(TEXT("message"), TEXT("pong"));
            }
            else if (CommandType == TEXT("create_test_report"))
            {
                ResultJson = MakeShareable(new FJsonObject);
                ResultJson->SetStringField(TEXT("plugin_version"), UNREALMCP_PLUGIN_VERSION);
                ResultJson->SetStringField(TEXT("protocol_version"), UNREALMCP_PROTOCOL_VERSION);
                ResultJson->SetStringField(TEXT("engine_version"), FEngineVersion::Current().ToString());
                ResultJson->SetNumberField(TEXT("total_commands_executed"), TotalCommandsExecuted);
                ResultJson->SetNumberField(TEXT("uptime_seconds"), FPlatformTime::Seconds() - BridgeStartTime);
                ResultJson->SetStringField(TEXT("server_state"), TEXT("running"));
                ResultJson->SetBoolField(TEXT("success"), true);
            }
            // Schema / introspection
            else if (CommandType == TEXT("get_command_schema") || CommandType == TEXT("list_commands"))
            {
                TSharedPtr<FJsonObject> Schema = MakeShareable(new FJsonObject);
                TArray<TSharedPtr<FJsonValue>> Cmds;

                auto AddCmd = [&](const TCHAR* Name, const TCHAR* Handler, const TCHAR* Desc) {
                    TSharedPtr<FJsonObject> C = MakeShareable(new FJsonObject);
                    C->SetStringField(TEXT("command"), Name);
                    C->SetStringField(TEXT("handler"), Handler);
                    C->SetStringField(TEXT("description"), Desc);
                    Cmds.Add(MakeShared<FJsonValueObject>(C));
                };

                AddCmd(TEXT("ping"), TEXT("bridge"), TEXT("Health check / pong"));
                AddCmd(TEXT("health"), TEXT("bridge"), TEXT("Server info: plugin version, protocol, UE, state, command count"));
                AddCmd(TEXT("get_server_info"), TEXT("bridge"), TEXT("Alias for health"));
                AddCmd(TEXT("get_command_schema"), TEXT("bridge"), TEXT("List all available commands"));
                AddCmd(TEXT("list_commands"), TEXT("bridge"), TEXT("Alias for get_command_schema"));
                AddCmd(TEXT("create_test_report"), TEXT("bridge"), TEXT("Session snapshot: commands executed, uptime, version"));

                AddCmd(TEXT("get_actors_in_level"), TEXT("editor"), TEXT("List all actors in the current level"));
                AddCmd(TEXT("find_actors_by_name"), TEXT("editor"), TEXT("Find actors by name pattern"));
                AddCmd(TEXT("spawn_actor"), TEXT("editor"), TEXT("Spawn a basic actor (StaticMeshActor, PointLight, etc.)"));
                AddCmd(TEXT("delete_actor"), TEXT("editor"), TEXT("Delete an actor by name"));
                AddCmd(TEXT("set_actor_transform"), TEXT("editor"), TEXT("Set actor location/rotation/scale"));
                AddCmd(TEXT("spawn_blueprint_actor"), TEXT("editor"), TEXT("Spawn an actor from a Blueprint"));
                AddCmd(TEXT("attach_actor_to_socket"), TEXT("editor"), TEXT("Attach an actor to a socket of another actor"));
                AddCmd(TEXT("search_assets"), TEXT("editor"), TEXT("Search assets by path, query, and class filters"));
                AddCmd(TEXT("get_asset_details"), TEXT("editor"), TEXT("Get detailed info about an asset"));
                AddCmd(TEXT("list_assets_in_path"), TEXT("editor"), TEXT("List all assets in a content path"));
                AddCmd(TEXT("get_project_info"), TEXT("editor"), TEXT("Project diagnostics: maps, plugins, input, engine version"));
                AddCmd(TEXT("add_widget_to_viewport"), TEXT("editor"), TEXT("Instantiate and add a Widget Blueprint to viewport"));
                AddCmd(TEXT("validate_project"), TEXT("editor"), TEXT("Project diagnostics: maps, plugins, actors, module state"));
                AddCmd(TEXT("compile_project_target"), TEXT("editor"), TEXT("Compile project target (informational - use VS/UBT externally)"));
                AddCmd(TEXT("run_map_check"), TEXT("editor"), TEXT("Run Map Check on current level (severity, message)"));
                AddCmd(TEXT("pie_start"), TEXT("editor"), TEXT("Start Play In Editor session"));
                AddCmd(TEXT("pie_stop"), TEXT("editor"), TEXT("Stop Play In Editor session"));
                AddCmd(TEXT("pie_state"), TEXT("editor"), TEXT("Check PIE state: stopped, queued, running"));

                AddCmd(TEXT("create_blueprint"), TEXT("blueprint"), TEXT("Create a new Blueprint"));
                AddCmd(TEXT("add_component_to_blueprint"), TEXT("blueprint"), TEXT("Add a component to a Blueprint SCS"));
                AddCmd(TEXT("remove_component_from_blueprint"), TEXT("blueprint"), TEXT("Remove a component from a Blueprint SCS"));
                AddCmd(TEXT("attach_component_to_blueprint"), TEXT("blueprint"), TEXT("Re-parent a component to another in Blueprint SCS"));
                AddCmd(TEXT("set_component_properties"), TEXT("blueprint"), TEXT("Set component visibility, active, transform, light props"));
                AddCmd(TEXT("get_blueprint_components"), TEXT("blueprint"), TEXT("List all components in a Blueprint with transforms"));
                AddCmd(TEXT("set_physics_properties"), TEXT("blueprint"), TEXT("Set physics properties on a Blueprint component"));
                AddCmd(TEXT("compile_blueprint"), TEXT("blueprint"), TEXT("Compile a Blueprint"));
                AddCmd(TEXT("set_static_mesh_properties"), TEXT("blueprint"), TEXT("Set static mesh and material on a component"));
                AddCmd(TEXT("set_component_static_mesh"), TEXT("blueprint"), TEXT("Assign a StaticMesh to a component"));
                AddCmd(TEXT("set_point_light_properties"), TEXT("blueprint"), TEXT("Set light properties on a PointLightComponent"));
                AddCmd(TEXT("set_mesh_material_color"), TEXT("blueprint"), TEXT("Set material color on a mesh component"));
                AddCmd(TEXT("get_available_materials"), TEXT("blueprint"), TEXT("Search for materials in the project"));
                AddCmd(TEXT("apply_material_to_actor"), TEXT("blueprint"), TEXT("Apply a material to an actor's mesh"));
                AddCmd(TEXT("apply_material_to_blueprint"), TEXT("blueprint"), TEXT("Apply a material to a Blueprint component"));
                AddCmd(TEXT("get_actor_material_info"), TEXT("blueprint"), TEXT("Get material info for an actor"));
                AddCmd(TEXT("get_blueprint_material_info"), TEXT("blueprint"), TEXT("Get material info for a Blueprint component"));
                AddCmd(TEXT("create_material_instance"), TEXT("blueprint"), TEXT("Create a MaterialInstanceConstant from a parent material"));
                AddCmd(TEXT("set_material_instance_parameter"), TEXT("blueprint"), TEXT("Set scalar/vector/texture params on a MaterialInstance"));
                AddCmd(TEXT("apply_material_to_component"), TEXT("blueprint"), TEXT("Apply material to component slot with previous material info"));
                AddCmd(TEXT("get_component_materials"), TEXT("blueprint"), TEXT("List all materials on a component"));
                AddCmd(TEXT("get_static_mesh_material_slots"), TEXT("blueprint"), TEXT("List material slots on a StaticMesh"));
                AddCmd(TEXT("read_blueprint_content"), TEXT("blueprint"), TEXT("Read Blueprint content (graph, variables, components)"));
                AddCmd(TEXT("analyze_blueprint_graph"), TEXT("blueprint"), TEXT("Deep analysis of a Blueprint graph"));
                AddCmd(TEXT("get_blueprint_variable_details"), TEXT("blueprint"), TEXT("Get variable details for a Blueprint"));
                AddCmd(TEXT("get_blueprint_function_details"), TEXT("blueprint"), TEXT("Get function details for a Blueprint"));
                AddCmd(TEXT("get_blueprint_summary"), TEXT("blueprint"), TEXT("Summary: parent class, components, variables, interfaces, graphs, compilation"));
                AddCmd(TEXT("get_blueprint_diagnostics"), TEXT("blueprint"), TEXT("Diagnostics: errors, warnings, orphan nodes, loose pins"));
                AddCmd(TEXT("create_input_action_asset"), TEXT("blueprint"), TEXT("Create an InputAction asset (Enhanced Input)"));
                AddCmd(TEXT("map_input_action"), TEXT("blueprint"), TEXT("Map an InputAction to an InputMappingContext"));
                AddCmd(TEXT("set_blueprint_property"), TEXT("blueprint"), TEXT("Set BP-level properties: parent_class, tick_enabled, auto_possess_player/ai"));
                AddCmd(TEXT("set_blueprint_default_value"), TEXT("blueprint"), TEXT("Set default value on a Blueprint variable"));
                AddCmd(TEXT("create_widget_blueprint"), TEXT("blueprint"), TEXT("Create a UMG Widget Blueprint (UserWidget)"));
                AddCmd(TEXT("set_component_collision"), TEXT("blueprint"), TEXT("Set collision: enabled, profile, object_type, generate_overlap_events"));
                AddCmd(TEXT("add_socket_to_component"), TEXT("blueprint"), TEXT("Add a socket to a StaticMesh or SkeletalMesh component"));
                AddCmd(TEXT("delete_blueprint"), TEXT("blueprint"), TEXT("Delete a Blueprint asset by path"));

                AddCmd(TEXT("add_blueprint_node"), TEXT("graph"), TEXT("Add a node to a Blueprint graph"));
                AddCmd(TEXT("connect_nodes"), TEXT("graph"), TEXT("Connect two graph node pins"));
                AddCmd(TEXT("create_variable"), TEXT("graph"), TEXT("Create a new Blueprint variable"));
                AddCmd(TEXT("set_blueprint_variable_properties"), TEXT("graph"), TEXT("Set properties on a Blueprint variable"));
                AddCmd(TEXT("add_event_node"), TEXT("graph"), TEXT("Add an event node to the EventGraph"));
                AddCmd(TEXT("add_input_action_node"), TEXT("graph"), TEXT("Add an InputAction node (enhanced input)"));
                AddCmd(TEXT("add_key_event_node"), TEXT("graph"), TEXT("Add a keyboard key event node"));
                AddCmd(TEXT("delete_node"), TEXT("graph"), TEXT("Delete a node from a Blueprint graph"));
                AddCmd(TEXT("set_node_property"), TEXT("graph"), TEXT("Set property on a graph node"));
                AddCmd(TEXT("create_function"), TEXT("graph"), TEXT("Create a new Blueprint function"));
                AddCmd(TEXT("add_function_input"), TEXT("graph"), TEXT("Add an input parameter to a function"));
                AddCmd(TEXT("add_function_output"), TEXT("graph"), TEXT("Add an output parameter to a function"));
                AddCmd(TEXT("delete_function"), TEXT("graph"), TEXT("Delete a Blueprint function"));
                AddCmd(TEXT("rename_function"), TEXT("graph"), TEXT("Rename a Blueprint function"));
                AddCmd(TEXT("add_get_node"), TEXT("graph"), TEXT("Add a variable Get node"));
                AddCmd(TEXT("call_function_on_object"), TEXT("graph"), TEXT("Add a function call node on a target object"));
                AddCmd(TEXT("add_blueprint_interface"), TEXT("graph"), TEXT("Add an interface to a Blueprint"));
                AddCmd(TEXT("remove_blueprint_interface"), TEXT("graph"), TEXT("Remove an interface from a Blueprint"));
                AddCmd(TEXT("get_blueprint_graph_nodes"), TEXT("graph"), TEXT("Get all nodes in a Blueprint graph with IDs and pins"));
                AddCmd(TEXT("disconnect_pins"), TEXT("graph"), TEXT("Disconnect pins on a node with dry_run support"));
                AddCmd(TEXT("delete_blueprint_node"), TEXT("graph"), TEXT("Delete a node by ID with dry_run, reports broken connections"));
                AddCmd(TEXT("add_enhanced_input_action_node"), TEXT("graph"), TEXT("Add EnhancedInputAction node (asset-ref, not legacy)"));
                AddCmd(TEXT("add_is_valid_guard"), TEXT("graph"), TEXT("Create a GetVariable→IsValid guard pattern"));

                AddCmd(TEXT("create_wall"), TEXT("building"), TEXT("Procedurally build a wall"));
                AddCmd(TEXT("create_staircase"), TEXT("building"), TEXT("Procedurally build a staircase"));
                AddCmd(TEXT("create_tower"), TEXT("building"), TEXT("Procedurally build a tower"));
                AddCmd(TEXT("construct_house"), TEXT("building"), TEXT("Procedurally build a house"));

                Schema->SetArrayField(TEXT("commands"), Cmds);
                Schema->SetNumberField(TEXT("count"), Cmds.Num());
                Schema->SetBoolField(TEXT("success"), true);
                ResultJson = Schema;
            }
            // Editor Commands (including actor manipulation)
            else if (CommandType == TEXT("get_actors_in_level") || 
                     CommandType == TEXT("find_actors_by_name") ||
                     CommandType == TEXT("spawn_actor") ||
                     CommandType == TEXT("delete_actor") || 
                     CommandType == TEXT("set_actor_transform") ||
                     CommandType == TEXT("spawn_blueprint_actor") ||
                     CommandType == TEXT("attach_actor_to_socket") ||
                     CommandType == TEXT("search_assets") ||
                     CommandType == TEXT("get_asset_details") ||
                     CommandType == TEXT("list_assets_in_path") ||
                     CommandType == TEXT("get_project_info") ||
                     CommandType == TEXT("add_widget_to_viewport") ||
                     CommandType == TEXT("validate_project") ||
                     CommandType == TEXT("compile_project_target") ||
                     CommandType == TEXT("run_map_check") ||
                     CommandType == TEXT("pie_start") ||
                     CommandType == TEXT("pie_stop") ||
                     CommandType == TEXT("pie_state"))
            {
                ResultJson = EditorCommands->HandleCommand(CommandType, Params);
            }
            // Blueprint Commands
            else if (CommandType == TEXT("create_blueprint") ||
                     CommandType == TEXT("add_component_to_blueprint") ||
                     CommandType == TEXT("remove_component_from_blueprint") ||
                     CommandType == TEXT("attach_component_to_blueprint") ||
                     CommandType == TEXT("set_component_properties") ||
                     CommandType == TEXT("get_blueprint_components") ||
                     CommandType == TEXT("set_physics_properties") ||
                     CommandType == TEXT("compile_blueprint") ||
                     CommandType == TEXT("set_static_mesh_properties") ||
                     CommandType == TEXT("set_component_static_mesh") ||
                     CommandType == TEXT("set_point_light_properties") ||
                     CommandType == TEXT("set_mesh_material_color") ||
                     CommandType == TEXT("get_available_materials") ||
                     CommandType == TEXT("apply_material_to_actor") ||
                     CommandType == TEXT("apply_material_to_blueprint") ||
                     CommandType == TEXT("get_actor_material_info") ||
                     CommandType == TEXT("get_blueprint_material_info") ||
                     CommandType == TEXT("create_material_instance") ||
                     CommandType == TEXT("set_material_instance_parameter") ||
                     CommandType == TEXT("apply_material_to_component") ||
                     CommandType == TEXT("get_component_materials") ||
                     CommandType == TEXT("get_static_mesh_material_slots") ||
                     CommandType == TEXT("read_blueprint_content") ||
                     CommandType == TEXT("analyze_blueprint_graph") ||
                     CommandType == TEXT("get_blueprint_variable_details") ||
                     CommandType == TEXT("get_blueprint_function_details") ||
                     CommandType == TEXT("create_input_action_asset") ||
                     CommandType == TEXT("map_input_action") ||
                     CommandType == TEXT("get_blueprint_summary") ||
                     CommandType == TEXT("get_blueprint_diagnostics") ||
                     CommandType == TEXT("set_blueprint_property") ||
                     CommandType == TEXT("set_blueprint_default_value") ||
                     CommandType == TEXT("create_widget_blueprint") ||
                     CommandType == TEXT("set_component_collision") ||
                     CommandType == TEXT("add_socket_to_component") ||
                     CommandType == TEXT("delete_blueprint"))
            {
                ResultJson = BlueprintCommands->HandleCommand(CommandType, Params);
            }
            // Blueprint Graph Commands (AVA EXTENDED)
            else if (CommandType == TEXT("add_blueprint_node") ||
                     CommandType == TEXT("connect_nodes") ||
                     CommandType == TEXT("create_variable") ||
                     CommandType == TEXT("set_blueprint_variable_properties") ||
                     CommandType == TEXT("add_event_node") ||
                     CommandType == TEXT("add_input_action_node") ||
                     CommandType == TEXT("add_key_event_node") ||
                     CommandType == TEXT("delete_node") ||
                     CommandType == TEXT("set_node_property") ||
                     CommandType == TEXT("create_function") ||
                     CommandType == TEXT("add_function_input") ||
                     CommandType == TEXT("add_function_output") ||
                     CommandType == TEXT("delete_function") ||
                     CommandType == TEXT("rename_function") ||
                     CommandType == TEXT("add_get_node") ||
                     CommandType == TEXT("call_function_on_object") ||
                     CommandType == TEXT("add_blueprint_interface") ||
                     CommandType == TEXT("remove_blueprint_interface") ||
                     CommandType == TEXT("get_blueprint_graph_nodes") ||
                     CommandType == TEXT("disconnect_pins") ||
                     CommandType == TEXT("delete_blueprint_node") ||
                     CommandType == TEXT("add_enhanced_input_action_node") ||
                     CommandType == TEXT("add_is_valid_guard"))
            {
                ResultJson = BlueprintGraphCommands->HandleCommand(CommandType, Params);
            }
            // Building Commands (AVA ADDITION: procedural construction)
            else if (CommandType == TEXT("create_wall") ||
                     CommandType == TEXT("create_staircase") ||
                     CommandType == TEXT("create_tower") ||
                     CommandType == TEXT("construct_house"))
            {
                ResultJson = BuildingCommands->HandleCommand(CommandType, Params);
            }
            else
            {
                BuildErrorResponse(ResponseJson, TEXT("UNKNOWN_COMMAND"),
                    FString::Printf(TEXT("Unknown command: %s"), *CommandType));
                InjectResponseId(ResponseJson, RequestId);
                
                FString ResultString;
                TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&ResultString);
                FJsonSerializer::Serialize(ResponseJson.ToSharedRef(), Writer);
                Promise.SetValue(ResultString);
                return;
            }
            
            // Check if the result contains an error
            bool bSuccess = true;
            FString ErrorCode = TEXT("UNKNOWN_ERROR");
            FString ErrorMessage;
            
            if (ResultJson->HasField(TEXT("success")))
            {
                bSuccess = ResultJson->GetBoolField(TEXT("success"));
                if (!bSuccess)
                {
                    if (ResultJson->HasField(TEXT("error")))
                    {
                        ErrorMessage = ResultJson->GetStringField(TEXT("error"));
                    }
                    if (ResultJson->HasField(TEXT("error_code")))
                    {
                        ErrorCode = ResultJson->GetStringField(TEXT("error_code"));
                    }
                }
            }
            
            if (bSuccess)
            {
                ResponseJson->SetStringField(TEXT("status"), TEXT("success"));
                ResponseJson->SetObjectField(TEXT("result"), ResultJson);
            }
            else
            {
                BuildErrorResponse(ResponseJson, ErrorCode, 
                    ErrorMessage.IsEmpty() ? TEXT("Command execution failed") : ErrorMessage);
            }
        }
        catch (const std::exception& e)
        {
            BuildErrorResponse(ResponseJson, TEXT("INTERNAL_ERROR"), UTF8_TO_TCHAR(e.what()));
        }
        
        InjectResponseId(ResponseJson, RequestId);
        
        FString ResultString;
        TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&ResultString);
        FJsonSerializer::Serialize(ResponseJson.ToSharedRef(), Writer);
        Promise.SetValue(ResultString);
    });
    
    // Timeout map: commands that spawn/create many objects are slowest
    static const double DefaultTimeout = 30.0;
    static const double InspectTimeout = 120.0;
    static const double ProceduralTimeout = 300.0;
    
    double TimeoutSeconds = DefaultTimeout;
    if (CommandType.Contains(TEXT("read_")) || CommandType.Contains(TEXT("analyze_")) ||
        CommandType.Contains(TEXT("get_blueprint_")) || CommandType.Contains(TEXT("get_actors_")) ||
        CommandType.Contains(TEXT("get_actor_")) || CommandType.Contains(TEXT("list_")) ||
        CommandType.Contains(TEXT("search_")))
    {
        TimeoutSeconds = InspectTimeout;
    }
    if (CommandType == TEXT("construct_house") || CommandType == TEXT("create_tower") ||
        CommandType == TEXT("create_wall") || CommandType == TEXT("create_staircase"))
    {
        TimeoutSeconds = ProceduralTimeout;
    }
    
    FString Result;
    if (Future.WaitFor(FTimespan::FromSeconds(TimeoutSeconds)))
    {
        Result = Future.Get();
        double Duration = FPlatformTime::Seconds() - StartTime;
        UE_LOG(LogTemp, Display, TEXT("EpicUnrealMCPBridge: [id=%s] cmd=%s OK (%.3fs)"), *RequestId, *CommandType, Duration);
    }
    else
    {
        double Duration = FPlatformTime::Seconds() - StartTime;
        UE_LOG(LogTemp, Error, TEXT("EpicUnrealMCPBridge: [id=%s] cmd=%s TIMEOUT after %.0fs (waited %.1fs). Server ready for new commands."), *RequestId, *CommandType, TimeoutSeconds, Duration);
        TSharedPtr<FJsonObject> ErrorJson = MakeShareable(new FJsonObject);
        BuildErrorResponse(ErrorJson, TEXT("TIMEOUT"),
            FString::Printf(TEXT("Command '%s' timed out after %.0fs on Game Thread. The server is ready for new commands."), *CommandType, TimeoutSeconds));
        if (!RequestId.IsEmpty())
        {
            ErrorJson->SetStringField(TEXT("id"), RequestId);
        }
        TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&Result);
        FJsonSerializer::Serialize(ErrorJson.ToSharedRef(), Writer);
    }
    
    return Result;
}
