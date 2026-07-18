#include "Commands/EpicUnrealMCPBlueprintCommands.h"
#include "Commands/EpicUnrealMCPCommonUtils.h"
#include "Engine/Blueprint.h"
#include "Engine/BlueprintGeneratedClass.h"
#include "Factories/BlueprintFactory.h"
#include "EdGraphSchema_K2.h"
#include "K2Node_Event.h"
#include "K2Node_FunctionEntry.h"
#include "K2Node_FunctionResult.h"
#include "K2Node_VariableGet.h"
#include "K2Node_VariableSet.h"
#include "Components/StaticMeshComponent.h"
#include "Components/BoxComponent.h"
#include "Components/SphereComponent.h"
#include "Components/PrimitiveComponent.h"
#include "Components/PointLightComponent.h"
#include "Components/LightComponent.h"
#include "Components/SpotLightComponent.h"
#include "Materials/MaterialInterface.h"
#include "Materials/MaterialInstanceDynamic.h"
#include "Materials/Material.h"
#include "Materials/MaterialInstanceConstant.h"
#include "Materials/MaterialInstance.h"
#include "PhysicalMaterials/PhysicalMaterial.h"
#include "Engine/Engine.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "Kismet2/KismetEditorUtilities.h"
#include "Engine/SimpleConstructionScript.h"
#include "Engine/SCS_Node.h"
#include "UObject/Field.h"
#include "UObject/FieldPath.h"
#include "EditorAssetLibrary.h"
#include "AssetRegistry/AssetRegistryModule.h"
#include "GameFramework/Actor.h"
#include "GameFramework/Pawn.h"
#include "Kismet/GameplayStatics.h"
#include "Factories/MaterialInstanceConstantFactoryNew.h"
#include "AssetToolsModule.h"
#include "IAssetTools.h"
#include "InputAction.h"
#include "InputMappingContext.h"
#include "Blueprint/UserWidget.h"
#include "WidgetBlueprint.h"
#include "Blueprint/WidgetBlueprintGeneratedClass.h"
#include "Engine/SkeletalMeshSocket.h"
#include "Engine/StaticMeshSocket.h"
#include "Components/SkeletalMeshComponent.h"
#include "GameFramework/Pawn.h"

FEpicUnrealMCPBlueprintCommands::FEpicUnrealMCPBlueprintCommands()
{
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleCommand(const FString& CommandType, const TSharedPtr<FJsonObject>& Params)
{
    if (CommandType == TEXT("create_blueprint"))
    {
        return HandleCreateBlueprint(Params);
    }
    else if (CommandType == TEXT("add_component_to_blueprint"))
    {
        return HandleAddComponentToBlueprint(Params);
    }
    else if (CommandType == TEXT("set_physics_properties"))
    {
        return HandleSetPhysicsProperties(Params);
    }
    else if (CommandType == TEXT("compile_blueprint"))
    {
        return HandleCompileBlueprint(Params);
    }
    else if (CommandType == TEXT("set_static_mesh_properties"))
    {
        return HandleSetStaticMeshProperties(Params);
    }
    // AVA ADDITIONS: Component property setters
    else if (CommandType == TEXT("set_component_static_mesh"))
    {
        return HandleSetComponentStaticMesh(Params);
    }
    else if (CommandType == TEXT("set_point_light_properties"))
    {
        return HandleSetPointLightProperties(Params);
    }
    else if (CommandType == TEXT("spawn_blueprint_actor"))
    {
        return HandleSpawnBlueprintActor(Params);
    }
    else if (CommandType == TEXT("set_mesh_material_color"))
    {
        return HandleSetMeshMaterialColor(Params);
    }
    // Material management commands
    else if (CommandType == TEXT("get_available_materials"))
    {
        return HandleGetAvailableMaterials(Params);
    }
    else if (CommandType == TEXT("apply_material_to_actor"))
    {
        return HandleApplyMaterialToActor(Params);
    }
    else if (CommandType == TEXT("apply_material_to_blueprint"))
    {
        return HandleApplyMaterialToBlueprint(Params);
    }
    else if (CommandType == TEXT("get_actor_material_info"))
    {
        return HandleGetActorMaterialInfo(Params);
    }
    else if (CommandType == TEXT("get_blueprint_material_info"))
    {
        return HandleGetBlueprintMaterialInfo(Params);
    }
    // Blueprint analysis commands
    else if (CommandType == TEXT("read_blueprint_content"))
    {
        return HandleReadBlueprintContent(Params);
    }
    else if (CommandType == TEXT("analyze_blueprint_graph"))
    {
        return HandleAnalyzeBlueprintGraph(Params);
    }
    else if (CommandType == TEXT("get_blueprint_variable_details"))
    {
        return HandleGetBlueprintVariableDetails(Params);
    }
    else if (CommandType == TEXT("get_blueprint_function_details"))
    {
        return HandleGetBlueprintFunctionDetails(Params);
    }
    // AVA V4: Component lifecycle commands
    else if (CommandType == TEXT("remove_component_from_blueprint"))
    {
        return HandleRemoveComponentFromBlueprint(Params);
    }
    else if (CommandType == TEXT("attach_component_to_blueprint"))
    {
        return HandleAttachComponentToBlueprint(Params);
    }
    else if (CommandType == TEXT("set_component_properties"))
    {
        return HandleSetComponentProperties(Params);
    }
    else if (CommandType == TEXT("get_blueprint_components"))
    {
        return HandleGetBlueprintComponents(Params);
    }
    // AVA V4: Material instance commands
    else if (CommandType == TEXT("create_material_instance"))
    {
        return HandleCreateMaterialInstance(Params);
    }
    else if (CommandType == TEXT("set_material_instance_parameter"))
    {
        return HandleSetMaterialInstanceParameter(Params);
    }
    else if (CommandType == TEXT("apply_material_to_component"))
    {
        return HandleApplyMaterialToComponent(Params);
    }
    else if (CommandType == TEXT("get_component_materials"))
    {
        return HandleGetComponentMaterials(Params);
    }
    else if (CommandType == TEXT("get_static_mesh_material_slots"))
    {
        return HandleGetStaticMeshMaterialSlots(Params);
    }
    // AVA V5: Enhanced Input asset management
    else if (CommandType == TEXT("create_input_action_asset"))
    {
        return HandleCreateInputActionAsset(Params);
    }
    else if (CommandType == TEXT("map_input_action"))
    {
        return HandleMapInputAction(Params);
    }
    // AVA V6: Blueprint inspection and diagnostics
    else if (CommandType == TEXT("get_blueprint_summary"))
    {
        return HandleGetBlueprintSummary(Params);
    }
    else if (CommandType == TEXT("get_blueprint_diagnostics"))
    {
        return HandleGetBlueprintDiagnostics(Params);
    }
    // AVA V7: Game systems
    else if (CommandType == TEXT("set_blueprint_property"))
    {
        return HandleSetBlueprintProperty(Params);
    }
    else if (CommandType == TEXT("set_blueprint_default_value"))
    {
        return HandleSetBlueprintDefaultValue(Params);
    }
    else if (CommandType == TEXT("create_widget_blueprint"))
    {
        return HandleCreateWidgetBlueprint(Params);
    }
    else if (CommandType == TEXT("set_component_collision"))
    {
        return HandleSetComponentCollision(Params);
    }
    else if (CommandType == TEXT("add_socket_to_component"))
    {
        return HandleAddSocketToComponent(Params);
    }
    // Asset lifecycle
    else if (CommandType == TEXT("delete_blueprint"))
    {
        return HandleDeleteBlueprint(Params);
    }

    return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Unknown blueprint command: %s"), *CommandType));
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleCreateBlueprint(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'name' parameter"));
    }

    // Determine save path (accept save_path param; default to /Game/Blueprints/)
    FString PackagePath = TEXT("/Game/Blueprints/");
    Params->TryGetStringField(TEXT("save_path"), PackagePath);
    if (!PackagePath.EndsWith(TEXT("/")))
        PackagePath += TEXT("/");
    if (!PackagePath.StartsWith(TEXT("/Game/")))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Invalid save_path '%s'. Must start with /Game/"), *PackagePath));

    FString AssetName = BlueprintName;
    if (UEditorAssetLibrary::DoesAssetExist(PackagePath + AssetName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint already exists: %s%s"), *PackagePath, *AssetName));
    }

    // Create the blueprint factory
    UBlueprintFactory* Factory = NewObject<UBlueprintFactory>();
    
    // Handle parent class
    FString ParentClass;
    Params->TryGetStringField(TEXT("parent_class"), ParentClass);
    
    // Default to Actor if no parent class specified
    UClass* SelectedParentClass = AActor::StaticClass();
    
    // Try to find the specified parent class
    if (!ParentClass.IsEmpty())
    {
        FString ClassName = ParentClass;
        if (!ClassName.StartsWith(TEXT("A")))
        {
            ClassName = TEXT("A") + ClassName;
        }
        
        // First try direct StaticClass lookup for common classes
        UClass* FoundClass = nullptr;
        if (ClassName == TEXT("APawn"))
        {
            FoundClass = APawn::StaticClass();
        }
        else if (ClassName == TEXT("AActor"))
        {
            FoundClass = AActor::StaticClass();
        }
        else
        {
            // Try loading the class using LoadClass which is more reliable than FindObject
            const FString ClassPath = FString::Printf(TEXT("/Script/Engine.%s"), *ClassName);
            FoundClass = LoadClass<AActor>(nullptr, *ClassPath);
            
            if (!FoundClass)
            {
                // Try alternate paths if not found
                const FString GameClassPath = FString::Printf(TEXT("/Script/Game.%s"), *ClassName);
                FoundClass = LoadClass<AActor>(nullptr, *GameClassPath);
            }
        }

        if (FoundClass)
        {
            SelectedParentClass = FoundClass;
            UE_LOG(LogTemp, Log, TEXT("Successfully set parent class to '%s'"), *ClassName);
        }
        else
        {
            // Fallback: try to use another Blueprint as parent class
            if (ParentClass.Contains(TEXT("/")))
            {
                FString AssetName = FPaths::GetBaseFilename(ParentClass);
                FString FullPath = ParentClass;
                if (!FullPath.Contains(TEXT(".")))
                {
                    FullPath = FString::Printf(TEXT("%s.%s"), *ParentClass, *AssetName);
                }
                UBlueprint* ParentBP = LoadObject<UBlueprint>(nullptr, *FullPath);
                if (!ParentBP)
                {
                    ParentBP = Cast<UBlueprint>(UEditorAssetLibrary::LoadAsset(ParentClass));
                }
                if (ParentBP && ParentBP->GeneratedClass)
                {
                    FoundClass = ParentBP->GeneratedClass;
                    SelectedParentClass = FoundClass;
                    UE_LOG(LogTemp, Log, TEXT("Using Blueprint '%s' as parent class (GeneratedClass: %s)"), *ParentClass, *FoundClass->GetName());
                }
            }
            if (!FoundClass)
            {
                UE_LOG(LogTemp, Warning, TEXT("Could not find specified parent class '%s' at paths: /Script/Engine.%s or /Script/Game.%s, defaulting to AActor"), 
                    *ClassName, *ClassName, *ClassName);
            }
        }
    }
    
    Factory->ParentClass = SelectedParentClass;

    // Create the blueprint
    UPackage* Package = CreatePackage(*(PackagePath + AssetName));
    UBlueprint* NewBlueprint = Cast<UBlueprint>(Factory->FactoryCreateNew(UBlueprint::StaticClass(), Package, *AssetName, RF_Standalone | RF_Public, nullptr, GWarn));

    if (NewBlueprint)
    {
        // Notify the asset registry
        FAssetRegistryModule::AssetCreated(NewBlueprint);

        // Mark the package dirty
        Package->MarkPackageDirty();

        TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
        ResultObj->SetStringField(TEXT("name"), AssetName);
        ResultObj->SetStringField(TEXT("path"), PackagePath + AssetName);
        ResultObj->SetStringField(TEXT("save_path"), PackagePath);
        ResultObj->SetBoolField(TEXT("success"), true);
        return ResultObj;
    }

    return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to create blueprint"));
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleAddComponentToBlueprint(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString ComponentType;
    if (!Params->TryGetStringField(TEXT("component_type"), ComponentType))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'type' parameter"));
    }

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'name' parameter"));
    }

    // Find the blueprint
    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));
    }

    // Dynamically find the component class by name
    // AVA FIX V3: Use LoadClass with /Script/Engine. prefix
    UClass* ComponentClass = nullptr;
    TArray<FString> Candidates;

    // Try the exact name as full path first (e.g. /Script/Engine.SpotLightComponent)
    ComponentClass = LoadClass<UActorComponent>(nullptr, *ComponentType);
    
    if (!ComponentClass)
    {
        // Build candidate names if bare name was given
        // Always try the raw name first (with /Script/Engine. prefix)
        Candidates.Add(ComponentType);
        
        if (ComponentType.StartsWith(TEXT("U")))
        {
            FString CleanName = ComponentType.RightChop(1);
            Candidates.Add(CleanName);
            if (!CleanName.EndsWith(TEXT("Component")))
            {
                Candidates.Add(CleanName + TEXT("Component"));
            }
        }
        else
        {
            Candidates.Add(TEXT("U") + ComponentType);
        }
        if (!ComponentType.EndsWith(TEXT("Component")))
        {
            Candidates.Add(ComponentType + TEXT("Component"));
            Candidates.Add(TEXT("U") + ComponentType + TEXT("Component"));
        }
        
        TArray<FString> Prefixes;
        Prefixes.Add(TEXT("/Script/Engine."));
        Prefixes.Add(TEXT("/Script/UMG."));
        
        for (const FString& Prefix : Prefixes)
        {
            if (ComponentClass) break;
            for (const FString& Candidate : Candidates)
            {
                FString FullPath = Prefix + Candidate;
                ComponentClass = LoadClass<UActorComponent>(nullptr, *FullPath);
                if (ComponentClass) break;
            }
        }
    }
    
    // Fallback: search for Blueprint components via AssetRegistry
    if (!ComponentClass || !ComponentClass->IsChildOf(UActorComponent::StaticClass()))
    {
        FAssetRegistryModule& AssetRegistryModule = FModuleManager::LoadModuleChecked<FAssetRegistryModule>(TEXT("AssetRegistry"));
        IAssetRegistry& AssetRegistry = AssetRegistryModule.Get();
        TArray<FAssetData> AssetList;
        AssetRegistry.GetAssetsByPath(FName("/Game/"), AssetList, true);
        for (const FAssetData& Asset : AssetList)
        {
            FString AssetName = Asset.AssetName.ToString();
            bool bNameMatches = false;
            for (const FString& Candidate : Candidates)
            {
                if (AssetName.Equals(Candidate, ESearchCase::IgnoreCase) ||
                    AssetName.Contains(Candidate))
                {
                    bNameMatches = true;
                    break;
                }
            }
            if (!bNameMatches && AssetName.Contains(ComponentType))
            {
                bNameMatches = true;
            }
            if (bNameMatches)
            {
                UBlueprint* CompBP = Cast<UBlueprint>(Asset.GetAsset());
                if (CompBP && CompBP->GeneratedClass && 
                    CompBP->GeneratedClass->IsChildOf(UActorComponent::StaticClass()))
                {
                    ComponentClass = CompBP->GeneratedClass;
                    UE_LOG(LogTemp, Log, TEXT("Found Blueprint component %s via AssetRegistry"), *AssetName);
                    break;
                }
            }
        }
    }
    
    // Verify that the class is a valid component type
    if (!ComponentClass || !ComponentClass->IsChildOf(UActorComponent::StaticClass()))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Unknown component type: %s. Tried: %s"), *ComponentType, *FString::Join(Candidates, TEXT(", "))));
    }

    // Add the component to the blueprint
    USCS_Node* NewNode = Blueprint->SimpleConstructionScript->CreateNode(ComponentClass, *ComponentName);
    if (NewNode)
    {
        // Set transform if provided
        USceneComponent* SceneComponent = Cast<USceneComponent>(NewNode->ComponentTemplate);
        if (SceneComponent)
        {
            if (Params->HasField(TEXT("location")))
            {
                SceneComponent->SetRelativeLocation(FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location")));
            }
            if (Params->HasField(TEXT("rotation")))
            {
                SceneComponent->SetRelativeRotation(FEpicUnrealMCPCommonUtils::GetRotatorFromJson(Params, TEXT("rotation")));
            }
            if (Params->HasField(TEXT("scale")))
            {
                SceneComponent->SetRelativeScale3D(FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("scale")));
            }
        }

        // Add to root if no parent specified
        Blueprint->SimpleConstructionScript->AddNode(NewNode);

        // Compile the blueprint
        FKismetEditorUtilities::CompileBlueprint(Blueprint);

        TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
        ResultObj->SetStringField(TEXT("component_name"), ComponentName);
        ResultObj->SetStringField(TEXT("component_type"), ComponentType);
        return ResultObj;
    }

    return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to add component to blueprint"));
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSetPhysicsProperties(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));
    }

    // Find the blueprint
    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));
    }

    // Find the component
    USCS_Node* ComponentNode = nullptr;
    for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
    {
        if (Node && Node->GetVariableName().ToString() == ComponentName)
        {
            ComponentNode = Node;
            break;
        }
    }

    if (!ComponentNode)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));
    }

    UPrimitiveComponent* PrimComponent = Cast<UPrimitiveComponent>(ComponentNode->ComponentTemplate);
    if (!PrimComponent)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a primitive component"));
    }

    // Set physics properties
    if (Params->HasField(TEXT("simulate_physics")))
    {
        PrimComponent->SetSimulatePhysics(Params->GetBoolField(TEXT("simulate_physics")));
    }

    if (Params->HasField(TEXT("mass")))
    {
        float Mass = Params->GetNumberField(TEXT("mass"));
        // In UE5.5, use proper overrideMass instead of just scaling
        PrimComponent->SetMassOverrideInKg(NAME_None, Mass);
        UE_LOG(LogTemp, Display, TEXT("Set mass for component %s to %f kg"), *ComponentName, Mass);
    }

    if (Params->HasField(TEXT("linear_damping")))
    {
        PrimComponent->SetLinearDamping(Params->GetNumberField(TEXT("linear_damping")));
    }

    if (Params->HasField(TEXT("angular_damping")))
    {
        PrimComponent->SetAngularDamping(Params->GetNumberField(TEXT("angular_damping")));
    }

    // Mark the blueprint as modified
    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("component"), ComponentName);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleCompileBlueprint(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    double StartTime = FPlatformTime::Seconds();

    EBlueprintStatus StatusBefore = Blueprint->Status;
    FKismetEditorUtilities::CompileBlueprint(Blueprint);
    EBlueprintStatus StatusAfter = Blueprint->Status;

    double Duration = FPlatformTime::Seconds() - StartTime;

    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("name"), BlueprintName);
    Result->SetStringField(TEXT("parent_class"), Blueprint->ParentClass ? Blueprint->ParentClass->GetName() : TEXT("None"));
    Result->SetStringField(TEXT("status_before"), StaticEnum<EBlueprintStatus>()->GetNameStringByValue((int64)StatusBefore));
    Result->SetStringField(TEXT("status_after"), StaticEnum<EBlueprintStatus>()->GetNameStringByValue((int64)StatusAfter));
    Result->SetBoolField(TEXT("compiled"), StatusAfter != BS_Error);
    Result->SetBoolField(TEXT("has_errors"), StatusAfter == BS_Error);
    Result->SetNumberField(TEXT("duration_ms"), Duration * 1000.0);
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSpawnBlueprintActor(const TSharedPtr<FJsonObject>& Params)
{
    UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: Starting blueprint actor spawn"));
    
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        UE_LOG(LogTemp, Error, TEXT("HandleSpawnBlueprintActor: Missing blueprint_name parameter"));
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString ActorName;
    if (!Params->TryGetStringField(TEXT("actor_name"), ActorName))
    {
        UE_LOG(LogTemp, Error, TEXT("HandleSpawnBlueprintActor: Missing actor_name parameter"));
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'actor_name' parameter"));
    }

    UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: Looking for blueprint '%s'"), *BlueprintName);

    // Find the blueprint
    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
    {
        UE_LOG(LogTemp, Error, TEXT("HandleSpawnBlueprintActor: Blueprint not found: %s"), *BlueprintName);
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));
    }

    UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: Blueprint found, getting transform parameters"));

    // Get transform parameters
    FVector Location(0.0f, 0.0f, 0.0f);
    FRotator Rotation(0.0f, 0.0f, 0.0f);

    if (Params->HasField(TEXT("location")))
    {
        Location = FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location"));
        UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: Location set to (%f, %f, %f)"), Location.X, Location.Y, Location.Z);
    }
    if (Params->HasField(TEXT("rotation")))
    {
        Rotation = FEpicUnrealMCPCommonUtils::GetRotatorFromJson(Params, TEXT("rotation"));
        UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: Rotation set to (%f, %f, %f)"), Rotation.Pitch, Rotation.Yaw, Rotation.Roll);
    }

    UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: Getting editor world"));

    // Spawn the actor
    UWorld* World = GEditor->GetEditorWorldContext().World();
    if (!World)
    {
        UE_LOG(LogTemp, Error, TEXT("HandleSpawnBlueprintActor: Failed to get editor world"));
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to get editor world"));
    }

    UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: Creating spawn transform"));

    FTransform SpawnTransform;
    SpawnTransform.SetLocation(Location);
    SpawnTransform.SetRotation(FQuat(Rotation));

    // Add a small delay to allow the engine to process the newly compiled class
    FPlatformProcess::Sleep(0.2f);

    UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: About to spawn actor from blueprint '%s' with GeneratedClass: %s"), 
           *BlueprintName, Blueprint->GeneratedClass ? *Blueprint->GeneratedClass->GetName() : TEXT("NULL"));

    AActor* NewActor = World->SpawnActor<AActor>(Blueprint->GeneratedClass, SpawnTransform);
    
    UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: SpawnActor completed, NewActor: %s"), 
           NewActor ? *NewActor->GetName() : TEXT("NULL"));
    
    if (NewActor)
    {
        UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: Setting actor label to '%s'"), *ActorName);
        NewActor->SetActorLabel(*ActorName);
        
        UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: About to convert actor to JSON"));
        TSharedPtr<FJsonObject> Result = FEpicUnrealMCPCommonUtils::ActorToJsonObject(NewActor, true);
        
        UE_LOG(LogTemp, Warning, TEXT("HandleSpawnBlueprintActor: JSON conversion completed, returning result"));
        return Result;
    }

    UE_LOG(LogTemp, Error, TEXT("HandleSpawnBlueprintActor: Failed to spawn blueprint actor"));
    return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to spawn blueprint actor"));
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSetStaticMeshProperties(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));
    }

    // Find the blueprint
    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));
    }

    // Find the component
    USCS_Node* ComponentNode = nullptr;
    for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
    {
        if (Node && Node->GetVariableName().ToString() == ComponentName)
        {
            ComponentNode = Node;
            break;
        }
    }

    if (!ComponentNode)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));
    }

    UStaticMeshComponent* MeshComponent = Cast<UStaticMeshComponent>(ComponentNode->ComponentTemplate);
    if (!MeshComponent)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a static mesh component"));
    }

    // Set static mesh properties
    if (Params->HasField(TEXT("static_mesh")))
    {
        FString MeshPath = Params->GetStringField(TEXT("static_mesh"));
        UStaticMesh* Mesh = Cast<UStaticMesh>(UEditorAssetLibrary::LoadAsset(MeshPath));
        if (Mesh)
        {
            MeshComponent->SetStaticMesh(Mesh);
        }
    }

    if (Params->HasField(TEXT("material")))
    {
        FString MaterialPath = Params->GetStringField(TEXT("material"));
        UMaterialInterface* Material = Cast<UMaterialInterface>(UEditorAssetLibrary::LoadAsset(MaterialPath));
        if (Material)
        {
            MeshComponent->SetMaterial(0, Material);
        }
    }

    // Mark the blueprint as modified
    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("component"), ComponentName);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSetMeshMaterialColor(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));
    }

    // Find the blueprint
    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));
    }

    // Find the component
    USCS_Node* ComponentNode = nullptr;
    for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
    {
        if (Node && Node->GetVariableName().ToString() == ComponentName)
        {
            ComponentNode = Node;
            break;
        }
    }

    if (!ComponentNode)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));
    }

    // Try to cast to StaticMeshComponent or PrimitiveComponent
    UPrimitiveComponent* PrimComponent = Cast<UPrimitiveComponent>(ComponentNode->ComponentTemplate);
    if (!PrimComponent)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a primitive component"));
    }

    // Get color parameter
    TArray<float> ColorArray;
    const TArray<TSharedPtr<FJsonValue>>* ColorJsonArray;
    if (!Params->TryGetArrayField(TEXT("color"), ColorJsonArray) || ColorJsonArray->Num() != 4)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("'color' must be an array of 4 float values [R, G, B, A]"));
    }

    for (const TSharedPtr<FJsonValue>& Value : *ColorJsonArray)
    {
        ColorArray.Add(FMath::Clamp(Value->AsNumber(), 0.0f, 1.0f));
    }

    FLinearColor Color(ColorArray[0], ColorArray[1], ColorArray[2], ColorArray[3]);

    // Get material slot index
    int32 MaterialSlot = 0;
    if (Params->HasField(TEXT("material_slot")))
    {
        MaterialSlot = Params->GetIntegerField(TEXT("material_slot"));
    }

    // Get parameter name
    FString ParameterName = TEXT("BaseColor");
    Params->TryGetStringField(TEXT("parameter_name"), ParameterName);

    // Get or create material
    UMaterialInterface* Material = nullptr;
    
    // Check if a specific material path was provided
    FString MaterialPath;
    if (Params->TryGetStringField(TEXT("material_path"), MaterialPath))
    {
        Material = Cast<UMaterialInterface>(UEditorAssetLibrary::LoadAsset(MaterialPath));
        if (!Material)
        {
            return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Failed to load material: %s"), *MaterialPath));
        }
    }
    else
    {
        // Use existing material on the component
        Material = PrimComponent->GetMaterial(MaterialSlot);
        if (!Material)
        {
            // Try to use a default material
            Material = Cast<UMaterialInterface>(UEditorAssetLibrary::LoadAsset(TEXT("/Engine/BasicShapes/BasicShapeMaterial")));
            if (!Material)
            {
                return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No material found on component and failed to load default material"));
            }
        }
    }

    // Create a dynamic material instance
    UMaterialInstanceDynamic* DynMaterial = UMaterialInstanceDynamic::Create(Material, PrimComponent);
    if (!DynMaterial)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to create dynamic material instance"));
    }

    // Set the color parameter
    DynMaterial->SetVectorParameterValue(*ParameterName, Color);

    // Apply the material to the component
    PrimComponent->SetMaterial(MaterialSlot, DynMaterial);

    // Mark the blueprint as modified
    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

    // Log success
    UE_LOG(LogTemp, Log, TEXT("Successfully set material color on component %s: R=%f, G=%f, B=%f, A=%f"), 
        *ComponentName, Color.R, Color.G, Color.B, Color.A);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("component"), ComponentName);
    ResultObj->SetNumberField(TEXT("material_slot"), MaterialSlot);
    ResultObj->SetStringField(TEXT("parameter_name"), ParameterName);
    
    TArray<TSharedPtr<FJsonValue>> ColorResultArray;
    ColorResultArray.Add(MakeShared<FJsonValueNumber>(Color.R));
    ColorResultArray.Add(MakeShared<FJsonValueNumber>(Color.G));
    ColorResultArray.Add(MakeShared<FJsonValueNumber>(Color.B));
    ColorResultArray.Add(MakeShared<FJsonValueNumber>(Color.A));
    ResultObj->SetArrayField(TEXT("color"), ColorResultArray);
    
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleGetAvailableMaterials(const TSharedPtr<FJsonObject>& Params)
{
    // Get parameters - make search path completely dynamic
    FString SearchPath;
    if (!Params->TryGetStringField(TEXT("search_path"), SearchPath))
    {
        // Default to empty string to search everywhere
        SearchPath = TEXT("");
    }
    
    bool bIncludeEngineMaterials = true;
    if (Params->HasField(TEXT("include_engine_materials")))
    {
        bIncludeEngineMaterials = Params->GetBoolField(TEXT("include_engine_materials"));
    }

    // Get asset registry module
    FAssetRegistryModule& AssetRegistryModule = FModuleManager::LoadModuleChecked<FAssetRegistryModule>(TEXT("AssetRegistry"));
    IAssetRegistry& AssetRegistry = AssetRegistryModule.Get();

    // Create filter for materials
    FARFilter Filter;
    Filter.ClassPaths.Add(UMaterialInterface::StaticClass()->GetClassPathName());
    Filter.ClassPaths.Add(UMaterial::StaticClass()->GetClassPathName());
    Filter.ClassPaths.Add(UMaterialInstanceConstant::StaticClass()->GetClassPathName());
    Filter.ClassPaths.Add(UMaterialInstanceDynamic::StaticClass()->GetClassPathName());
    
    // Add search paths dynamically
    if (!SearchPath.IsEmpty())
    {
        // Ensure the path starts with /
        if (!SearchPath.StartsWith(TEXT("/")))
        {
            SearchPath = TEXT("/") + SearchPath;
        }
        // Ensure the path ends with / for proper directory search
        if (!SearchPath.EndsWith(TEXT("/")))
        {
            SearchPath += TEXT("/");
        }
        Filter.PackagePaths.Add(*SearchPath);
        UE_LOG(LogTemp, Log, TEXT("Searching for materials in: %s"), *SearchPath);
    }
    else
    {
        // Search in common game content locations
        Filter.PackagePaths.Add(TEXT("/Game/"));
        UE_LOG(LogTemp, Log, TEXT("Searching for materials in all game content"));
    }
    
    if (bIncludeEngineMaterials)
    {
        Filter.PackagePaths.Add(TEXT("/Engine/"));
        UE_LOG(LogTemp, Log, TEXT("Including Engine materials in search"));
    }
    
    Filter.bRecursivePaths = true;

    // Get assets from registry
    TArray<FAssetData> AssetDataArray;
    AssetRegistry.GetAssets(Filter, AssetDataArray);
    
    UE_LOG(LogTemp, Log, TEXT("Asset registry found %d materials"), AssetDataArray.Num());

    // Also try manual search using EditorAssetLibrary for more comprehensive results
    TArray<FString> AllAssetPaths;
    if (!SearchPath.IsEmpty())
    {
        AllAssetPaths = UEditorAssetLibrary::ListAssets(SearchPath, true, false);
    }
    else
    {
        AllAssetPaths = UEditorAssetLibrary::ListAssets(TEXT("/Game/"), true, false);
    }
    
    // Filter for materials from the manual search
    for (const FString& AssetPath : AllAssetPaths)
    {
        if (AssetPath.Contains(TEXT("Material")) && !AssetPath.Contains(TEXT(".uasset")))
        {
            UObject* Asset = UEditorAssetLibrary::LoadAsset(AssetPath);
            if (Asset && Asset->IsA<UMaterialInterface>())
            {
                // Check if we already have this asset from registry search
                bool bAlreadyFound = false;
                for (const FAssetData& ExistingData : AssetDataArray)
                {
                    if (ExistingData.GetObjectPathString() == AssetPath)
                    {
                        bAlreadyFound = true;
                        break;
                    }
                }
                
                if (!bAlreadyFound)
                {
                    // Create FAssetData manually for this asset
                    FAssetData ManualAssetData(Asset);
                    AssetDataArray.Add(ManualAssetData);
                }
            }
        }
    }

    UE_LOG(LogTemp, Log, TEXT("Total materials found after manual search: %d"), AssetDataArray.Num());

    // Convert to JSON
    TArray<TSharedPtr<FJsonValue>> MaterialArray;
    for (const FAssetData& AssetData : AssetDataArray)
    {
        TSharedPtr<FJsonObject> MaterialObj = MakeShared<FJsonObject>();
        MaterialObj->SetStringField(TEXT("name"), AssetData.AssetName.ToString());
        MaterialObj->SetStringField(TEXT("path"), AssetData.GetObjectPathString());
        MaterialObj->SetStringField(TEXT("package"), AssetData.PackageName.ToString());
        MaterialObj->SetStringField(TEXT("class"), AssetData.AssetClassPath.ToString());
        
        MaterialArray.Add(MakeShared<FJsonValueObject>(MaterialObj));
        
        UE_LOG(LogTemp, Verbose, TEXT("Found material: %s at %s"), *AssetData.AssetName.ToString(), *AssetData.GetObjectPathString());
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetArrayField(TEXT("materials"), MaterialArray);
    ResultObj->SetNumberField(TEXT("count"), MaterialArray.Num());
    ResultObj->SetStringField(TEXT("search_path_used"), SearchPath.IsEmpty() ? TEXT("/Game/") : SearchPath);
    
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleApplyMaterialToActor(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString ActorName;
    if (!Params->TryGetStringField(TEXT("actor_name"), ActorName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'actor_name' parameter"));
    }

    FString MaterialPath;
    if (!Params->TryGetStringField(TEXT("material_path"), MaterialPath))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'material_path' parameter"));
    }

    int32 MaterialSlot = 0;
    if (Params->HasField(TEXT("material_slot")))
    {
        MaterialSlot = Params->GetIntegerField(TEXT("material_slot"));
    }

    // Find the actor
    AActor* TargetActor = nullptr;
    UWorld* World = GEditor->GetEditorWorldContext().World();
    if (!World)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to get editor world"));
    }
    
    TArray<AActor*> AllActors;
    UGameplayStatics::GetAllActorsOfClass(World, AActor::StaticClass(), AllActors);
    
    for (AActor* Actor : AllActors)
    {
        if (Actor && Actor->GetName() == ActorName)
        {
            TargetActor = Actor;
            break;
        }
    }

    if (!TargetActor)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Actor not found: %s"), *ActorName));
    }

    // Load the material
    UMaterialInterface* Material = Cast<UMaterialInterface>(UEditorAssetLibrary::LoadAsset(MaterialPath));
    if (!Material)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Failed to load material: %s"), *MaterialPath));
    }

    // Find mesh components and apply material
    TArray<UStaticMeshComponent*> MeshComponents;
    TargetActor->GetComponents<UStaticMeshComponent>(MeshComponents);
    
    bool bAppliedToAny = false;
    for (UStaticMeshComponent* MeshComp : MeshComponents)
    {
        if (MeshComp)
        {
            MeshComp->SetMaterial(MaterialSlot, Material);
            bAppliedToAny = true;
        }
    }

    if (!bAppliedToAny)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No mesh components found on actor"));
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("actor_name"), ActorName);
    ResultObj->SetStringField(TEXT("material_path"), MaterialPath);
    ResultObj->SetNumberField(TEXT("material_slot"), MaterialSlot);
    ResultObj->SetBoolField(TEXT("success"), true);
    
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleApplyMaterialToBlueprint(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));
    }

    FString MaterialPath;
    if (!Params->TryGetStringField(TEXT("material_path"), MaterialPath))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'material_path' parameter"));
    }

    int32 MaterialSlot = 0;
    if (Params->HasField(TEXT("material_slot")))
    {
        MaterialSlot = Params->GetIntegerField(TEXT("material_slot"));
    }

    // Find the blueprint
    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));
    }

    // Find the component
    USCS_Node* ComponentNode = nullptr;
    for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
    {
        if (Node && Node->GetVariableName().ToString() == ComponentName)
        {
            ComponentNode = Node;
            break;
        }
    }

    if (!ComponentNode)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));
    }

    UPrimitiveComponent* PrimComponent = Cast<UPrimitiveComponent>(ComponentNode->ComponentTemplate);
    if (!PrimComponent)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a primitive component"));
    }

    // Load the material
    UMaterialInterface* Material = Cast<UMaterialInterface>(UEditorAssetLibrary::LoadAsset(MaterialPath));
    if (!Material)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Failed to load material: %s"), *MaterialPath));
    }

    // Apply the material
    PrimComponent->SetMaterial(MaterialSlot, Material);

    // Mark the blueprint as modified
    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint_name"), BlueprintName);
    ResultObj->SetStringField(TEXT("component_name"), ComponentName);
    ResultObj->SetStringField(TEXT("material_path"), MaterialPath);
    ResultObj->SetNumberField(TEXT("material_slot"), MaterialSlot);
    ResultObj->SetBoolField(TEXT("success"), true);
    
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleGetActorMaterialInfo(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString ActorName;
    if (!Params->TryGetStringField(TEXT("actor_name"), ActorName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'actor_name' parameter"));
    }

    // Find the actor
    AActor* TargetActor = nullptr;
    UWorld* World = GEditor->GetEditorWorldContext().World();
    if (!World)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to get editor world"));
    }
    
    TArray<AActor*> AllActors;
    UGameplayStatics::GetAllActorsOfClass(World, AActor::StaticClass(), AllActors);
    
    for (AActor* Actor : AllActors)
    {
        if (Actor && Actor->GetName() == ActorName)
        {
            TargetActor = Actor;
            break;
        }
    }

    if (!TargetActor)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Actor not found: %s"), *ActorName));
    }

    // Get mesh components and their materials
    TArray<UStaticMeshComponent*> MeshComponents;
    TargetActor->GetComponents<UStaticMeshComponent>(MeshComponents);
    
    TArray<TSharedPtr<FJsonValue>> MaterialSlots;
    
    for (UStaticMeshComponent* MeshComp : MeshComponents)
    {
        if (MeshComp)
        {
            for (int32 i = 0; i < MeshComp->GetNumMaterials(); i++)
            {
                TSharedPtr<FJsonObject> SlotInfo = MakeShared<FJsonObject>();
                SlotInfo->SetNumberField(TEXT("slot"), i);
                SlotInfo->SetStringField(TEXT("component"), MeshComp->GetName());
                
                UMaterialInterface* Material = MeshComp->GetMaterial(i);
                if (Material)
                {
                    SlotInfo->SetStringField(TEXT("material_name"), Material->GetName());
                    SlotInfo->SetStringField(TEXT("material_path"), Material->GetPathName());
                    SlotInfo->SetStringField(TEXT("material_class"), Material->GetClass()->GetName());
                }
                else
                {
                    SlotInfo->SetStringField(TEXT("material_name"), TEXT("None"));
                    SlotInfo->SetStringField(TEXT("material_path"), TEXT(""));
                    SlotInfo->SetStringField(TEXT("material_class"), TEXT(""));
                }
                
                MaterialSlots.Add(MakeShared<FJsonValueObject>(SlotInfo));
            }
        }
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("actor_name"), ActorName);
    ResultObj->SetArrayField(TEXT("material_slots"), MaterialSlots);
    ResultObj->SetNumberField(TEXT("total_slots"), MaterialSlots.Num());
    
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleGetBlueprintMaterialInfo(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));
    }

    // Find the blueprint
    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));
    }

    // Find the component
    USCS_Node* ComponentNode = nullptr;
    for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
    {
        if (Node && Node->GetVariableName().ToString() == ComponentName)
        {
            ComponentNode = Node;
            break;
        }
    }

    if (!ComponentNode)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));
    }

    UStaticMeshComponent* MeshComponent = Cast<UStaticMeshComponent>(ComponentNode->ComponentTemplate);
    if (!MeshComponent)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a static mesh component"));
    }

    // Get material slot information
    TArray<TSharedPtr<FJsonValue>> MaterialSlots;
    int32 NumMaterials = 0;
    
    // Check if we have a static mesh assigned
    UStaticMesh* StaticMesh = MeshComponent->GetStaticMesh();
    if (StaticMesh)
    {
        NumMaterials = StaticMesh->GetNumSections(0); // Get number of material slots for LOD 0
        
        for (int32 i = 0; i < NumMaterials; i++)
        {
            TSharedPtr<FJsonObject> SlotInfo = MakeShared<FJsonObject>();
            SlotInfo->SetNumberField(TEXT("slot"), i);
            SlotInfo->SetStringField(TEXT("component"), ComponentName);
            
            UMaterialInterface* Material = MeshComponent->GetMaterial(i);
            if (Material)
            {
                SlotInfo->SetStringField(TEXT("material_name"), Material->GetName());
                SlotInfo->SetStringField(TEXT("material_path"), Material->GetPathName());
                SlotInfo->SetStringField(TEXT("material_class"), Material->GetClass()->GetName());
            }
            else
            {
                SlotInfo->SetStringField(TEXT("material_name"), TEXT("None"));
                SlotInfo->SetStringField(TEXT("material_path"), TEXT(""));
                SlotInfo->SetStringField(TEXT("material_class"), TEXT(""));
            }
            
            MaterialSlots.Add(MakeShared<FJsonValueObject>(SlotInfo));
        }
    }
    else
    {
        // If no static mesh is assigned, we can't determine material slots
        UE_LOG(LogTemp, Warning, TEXT("No static mesh assigned to component %s in blueprint %s"), *ComponentName, *BlueprintName);
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint_name"), BlueprintName);
    ResultObj->SetStringField(TEXT("component_name"), ComponentName);
    ResultObj->SetArrayField(TEXT("material_slots"), MaterialSlots);
    ResultObj->SetNumberField(TEXT("total_slots"), MaterialSlots.Num());
    ResultObj->SetBoolField(TEXT("has_static_mesh"), StaticMesh != nullptr);
    
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleReadBlueprintContent(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintPath;
    if (!Params->TryGetStringField(TEXT("blueprint_path"), BlueprintPath))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_path' parameter"));
    }

    // Get optional parameters
    bool bIncludeEventGraph = true;
    bool bIncludeFunctions = true;
    bool bIncludeVariables = true;
    bool bIncludeComponents = true;
    bool bIncludeInterfaces = true;

    Params->TryGetBoolField(TEXT("include_event_graph"), bIncludeEventGraph);
    Params->TryGetBoolField(TEXT("include_functions"), bIncludeFunctions);
    Params->TryGetBoolField(TEXT("include_variables"), bIncludeVariables);
    Params->TryGetBoolField(TEXT("include_components"), bIncludeComponents);
    Params->TryGetBoolField(TEXT("include_interfaces"), bIncludeInterfaces);

    // Load the blueprint
    UBlueprint* Blueprint = Cast<UBlueprint>(UEditorAssetLibrary::LoadAsset(BlueprintPath));
    if (!Blueprint)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Failed to load blueprint: %s"), *BlueprintPath));
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint_path"), BlueprintPath);
    ResultObj->SetStringField(TEXT("blueprint_name"), Blueprint->GetName());
    ResultObj->SetStringField(TEXT("parent_class"), Blueprint->ParentClass ? Blueprint->ParentClass->GetName() : TEXT("None"));

    // Include variables if requested
    if (bIncludeVariables)
    {
        TArray<TSharedPtr<FJsonValue>> VariableArray;
        for (const FBPVariableDescription& Variable : Blueprint->NewVariables)
        {
            TSharedPtr<FJsonObject> VarObj = MakeShared<FJsonObject>();
            VarObj->SetStringField(TEXT("name"), Variable.VarName.ToString());
            VarObj->SetStringField(TEXT("type"), Variable.VarType.PinCategory.ToString());
            VarObj->SetStringField(TEXT("default_value"), Variable.DefaultValue);
            VarObj->SetBoolField(TEXT("is_editable"), (Variable.PropertyFlags & CPF_Edit) != 0);
            VariableArray.Add(MakeShared<FJsonValueObject>(VarObj));
        }
        ResultObj->SetArrayField(TEXT("variables"), VariableArray);
    }

    // Include functions if requested
    if (bIncludeFunctions)
    {
        TArray<TSharedPtr<FJsonValue>> FunctionArray;
        for (UEdGraph* Graph : Blueprint->FunctionGraphs)
        {
            if (Graph)
            {
                TSharedPtr<FJsonObject> FuncObj = MakeShared<FJsonObject>();
                FuncObj->SetStringField(TEXT("name"), Graph->GetName());
                FuncObj->SetStringField(TEXT("graph_type"), TEXT("Function"));
                
                // Count nodes in function
                int32 NodeCount = Graph->Nodes.Num();
                FuncObj->SetNumberField(TEXT("node_count"), NodeCount);
                
                FunctionArray.Add(MakeShared<FJsonValueObject>(FuncObj));
            }
        }
        ResultObj->SetArrayField(TEXT("functions"), FunctionArray);
    }

    // Include event graph if requested
    if (bIncludeEventGraph)
    {
        TSharedPtr<FJsonObject> EventGraphObj = MakeShared<FJsonObject>();
        
        // Find the main event graph
        for (UEdGraph* Graph : Blueprint->UbergraphPages)
        {
            if (Graph && Graph->GetName() == TEXT("EventGraph"))
            {
                EventGraphObj->SetStringField(TEXT("name"), Graph->GetName());
                EventGraphObj->SetNumberField(TEXT("node_count"), Graph->Nodes.Num());
                
                // Get basic node information
                TArray<TSharedPtr<FJsonValue>> NodeArray;
                for (UEdGraphNode* Node : Graph->Nodes)
                {
                    if (Node)
                    {
                        TSharedPtr<FJsonObject> NodeObj = MakeShared<FJsonObject>();
                        NodeObj->SetStringField(TEXT("name"), Node->GetName());
                        NodeObj->SetStringField(TEXT("class"), Node->GetClass()->GetName());
                        NodeObj->SetStringField(TEXT("title"), Node->GetNodeTitle(ENodeTitleType::FullTitle).ToString());
                        NodeArray.Add(MakeShared<FJsonValueObject>(NodeObj));
                    }
                }
                EventGraphObj->SetArrayField(TEXT("nodes"), NodeArray);
                break;
            }
        }
        
        ResultObj->SetObjectField(TEXT("event_graph"), EventGraphObj);
    }

    // Include components if requested
    if (bIncludeComponents)
    {
        TArray<TSharedPtr<FJsonValue>> ComponentArray;
        if (Blueprint->SimpleConstructionScript)
        {
            for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
            {
                if (Node && Node->ComponentTemplate)
                {
                    TSharedPtr<FJsonObject> CompObj = MakeShared<FJsonObject>();
                    CompObj->SetStringField(TEXT("name"), Node->GetVariableName().ToString());
                    CompObj->SetStringField(TEXT("class"), Node->ComponentTemplate->GetClass()->GetName());
                    CompObj->SetBoolField(TEXT("is_root"), Node == Blueprint->SimpleConstructionScript->GetDefaultSceneRootNode());
                    ComponentArray.Add(MakeShared<FJsonValueObject>(CompObj));
                }
            }
        }
        ResultObj->SetArrayField(TEXT("components"), ComponentArray);
    }

    // Include interfaces if requested
    if (bIncludeInterfaces)
    {
        TArray<TSharedPtr<FJsonValue>> InterfaceArray;
        for (const FBPInterfaceDescription& Interface : Blueprint->ImplementedInterfaces)
        {
            TSharedPtr<FJsonObject> InterfaceObj = MakeShared<FJsonObject>();
            InterfaceObj->SetStringField(TEXT("name"), Interface.Interface ? Interface.Interface->GetName() : TEXT("Unknown"));
            InterfaceArray.Add(MakeShared<FJsonValueObject>(InterfaceObj));
        }
        ResultObj->SetArrayField(TEXT("interfaces"), InterfaceArray);
    }

    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleAnalyzeBlueprintGraph(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintPath;
    if (!Params->TryGetStringField(TEXT("blueprint_path"), BlueprintPath))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_path' parameter"));
    }

    FString GraphName = TEXT("EventGraph");
    Params->TryGetStringField(TEXT("graph_name"), GraphName);

    // Get optional parameters
    bool bIncludeNodeDetails = true;
    bool bIncludePinConnections = true;
    bool bTraceExecutionFlow = true;

    Params->TryGetBoolField(TEXT("include_node_details"), bIncludeNodeDetails);
    Params->TryGetBoolField(TEXT("include_pin_connections"), bIncludePinConnections);
    Params->TryGetBoolField(TEXT("trace_execution_flow"), bTraceExecutionFlow);

    // Load the blueprint
    UBlueprint* Blueprint = Cast<UBlueprint>(UEditorAssetLibrary::LoadAsset(BlueprintPath));
    if (!Blueprint)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Failed to load blueprint: %s"), *BlueprintPath));
    }

    // Find the specified graph
    UEdGraph* TargetGraph = nullptr;
    
    // Check event graphs first
    for (UEdGraph* Graph : Blueprint->UbergraphPages)
    {
        if (Graph && Graph->GetName() == GraphName)
        {
            TargetGraph = Graph;
            break;
        }
    }
    
    // Check function graphs if not found
    if (!TargetGraph)
    {
        for (UEdGraph* Graph : Blueprint->FunctionGraphs)
        {
            if (Graph && Graph->GetName() == GraphName)
            {
                TargetGraph = Graph;
                break;
            }
        }
    }

    if (!TargetGraph)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Graph not found: %s"), *GraphName));
    }

    TSharedPtr<FJsonObject> GraphData = MakeShared<FJsonObject>();
    GraphData->SetStringField(TEXT("graph_name"), TargetGraph->GetName());
    GraphData->SetStringField(TEXT("graph_type"), TargetGraph->GetClass()->GetName());

    // Analyze nodes
    TArray<TSharedPtr<FJsonValue>> NodeArray;
    TArray<TSharedPtr<FJsonValue>> ConnectionArray;

    for (UEdGraphNode* Node : TargetGraph->Nodes)
    {
        if (Node)
        {
            TSharedPtr<FJsonObject> NodeObj = MakeShared<FJsonObject>();
            NodeObj->SetStringField(TEXT("name"), Node->GetName());
            NodeObj->SetStringField(TEXT("class"), Node->GetClass()->GetName());
            NodeObj->SetStringField(TEXT("title"), Node->GetNodeTitle(ENodeTitleType::FullTitle).ToString());

            if (bIncludeNodeDetails)
            {
                NodeObj->SetNumberField(TEXT("pos_x"), Node->NodePosX);
                NodeObj->SetNumberField(TEXT("pos_y"), Node->NodePosY);
                NodeObj->SetBoolField(TEXT("can_rename"), Node->bCanRenameNode);
            }

            // Include pin information if requested
            if (bIncludePinConnections)
            {
                TArray<TSharedPtr<FJsonValue>> PinArray;
                for (UEdGraphPin* Pin : Node->Pins)
                {
                    if (Pin)
                    {
                        TSharedPtr<FJsonObject> PinObj = MakeShared<FJsonObject>();
                        PinObj->SetStringField(TEXT("name"), Pin->PinName.ToString());
                        PinObj->SetStringField(TEXT("type"), Pin->PinType.PinCategory.ToString());
                        PinObj->SetStringField(TEXT("direction"), Pin->Direction == EGPD_Input ? TEXT("Input") : TEXT("Output"));
                        PinObj->SetNumberField(TEXT("connections"), Pin->LinkedTo.Num());
                        
                        // Record connections for this pin
                        for (UEdGraphPin* LinkedPin : Pin->LinkedTo)
                        {
                            if (LinkedPin && LinkedPin->GetOwningNode())
                            {
                                TSharedPtr<FJsonObject> ConnObj = MakeShared<FJsonObject>();
                                ConnObj->SetStringField(TEXT("from_node"), Pin->GetOwningNode()->GetName());
                                ConnObj->SetStringField(TEXT("from_pin"), Pin->PinName.ToString());
                                ConnObj->SetStringField(TEXT("to_node"), LinkedPin->GetOwningNode()->GetName());
                                ConnObj->SetStringField(TEXT("to_pin"), LinkedPin->PinName.ToString());
                                ConnectionArray.Add(MakeShared<FJsonValueObject>(ConnObj));
                            }
                        }
                        
                        PinArray.Add(MakeShared<FJsonValueObject>(PinObj));
                    }
                }
                NodeObj->SetArrayField(TEXT("pins"), PinArray);
            }

            NodeArray.Add(MakeShared<FJsonValueObject>(NodeObj));
        }
    }

    GraphData->SetArrayField(TEXT("nodes"), NodeArray);
    GraphData->SetArrayField(TEXT("connections"), ConnectionArray);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint_path"), BlueprintPath);
    ResultObj->SetObjectField(TEXT("graph_data"), GraphData);
    ResultObj->SetBoolField(TEXT("success"), true);

    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleGetBlueprintVariableDetails(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintPath;
    if (!Params->TryGetStringField(TEXT("blueprint_path"), BlueprintPath))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_path' parameter"));
    }

    FString VariableName;
    bool bSpecificVariable = Params->TryGetStringField(TEXT("variable_name"), VariableName);

    // Load the blueprint
    UBlueprint* Blueprint = Cast<UBlueprint>(UEditorAssetLibrary::LoadAsset(BlueprintPath));
    if (!Blueprint)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Failed to load blueprint: %s"), *BlueprintPath));
    }

    TArray<TSharedPtr<FJsonValue>> VariableArray;

    for (const FBPVariableDescription& Variable : Blueprint->NewVariables)
    {
        // If looking for specific variable, skip others
        if (bSpecificVariable && Variable.VarName.ToString() != VariableName)
        {
            continue;
        }

        TSharedPtr<FJsonObject> VarObj = MakeShared<FJsonObject>();
        VarObj->SetStringField(TEXT("name"), Variable.VarName.ToString());
        VarObj->SetStringField(TEXT("type"), Variable.VarType.PinCategory.ToString());
        VarObj->SetStringField(TEXT("sub_category"), Variable.VarType.PinSubCategory.ToString());
        VarObj->SetStringField(TEXT("default_value"), Variable.DefaultValue);
        VarObj->SetStringField(TEXT("friendly_name"), Variable.FriendlyName.IsEmpty() ? Variable.VarName.ToString() : Variable.FriendlyName);
        
        // Get tooltip from metadata (VarTooltip doesn't exist in UE 5.5)
        FString TooltipValue;
        if (Variable.HasMetaData(FBlueprintMetadata::MD_Tooltip))
        {
            TooltipValue = Variable.GetMetaData(FBlueprintMetadata::MD_Tooltip);
        }
        VarObj->SetStringField(TEXT("tooltip"), TooltipValue);
        
        VarObj->SetStringField(TEXT("category"), Variable.Category.ToString());

        // Property flags
        VarObj->SetBoolField(TEXT("is_editable"), (Variable.PropertyFlags & CPF_Edit) != 0);
        VarObj->SetBoolField(TEXT("is_blueprint_visible"), (Variable.PropertyFlags & CPF_BlueprintVisible) != 0);
        VarObj->SetBoolField(TEXT("is_editable_in_instance"), (Variable.PropertyFlags & CPF_DisableEditOnInstance) == 0);
        VarObj->SetBoolField(TEXT("is_config"), (Variable.PropertyFlags & CPF_Config) != 0);

        // Replication
        VarObj->SetNumberField(TEXT("replication"), (int32)Variable.ReplicationCondition);

        VariableArray.Add(MakeShared<FJsonValueObject>(VarObj));
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint_path"), BlueprintPath);
    
    if (bSpecificVariable)
    {
        ResultObj->SetStringField(TEXT("variable_name"), VariableName);
        if (VariableArray.Num() > 0)
        {
            ResultObj->SetObjectField(TEXT("variable"), VariableArray[0]->AsObject());
        }
        else
        {
            return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Variable not found: %s"), *VariableName));
        }
    }
    else
    {
        ResultObj->SetArrayField(TEXT("variables"), VariableArray);
        ResultObj->SetNumberField(TEXT("variable_count"), VariableArray.Num());
    }

    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleGetBlueprintFunctionDetails(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintPath;
    if (!Params->TryGetStringField(TEXT("blueprint_path"), BlueprintPath))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_path' parameter"));
    }

    FString FunctionName;
    bool bSpecificFunction = Params->TryGetStringField(TEXT("function_name"), FunctionName);

    bool bIncludeGraph = true;
    Params->TryGetBoolField(TEXT("include_graph"), bIncludeGraph);

    // Load the blueprint
    UBlueprint* Blueprint = Cast<UBlueprint>(UEditorAssetLibrary::LoadAsset(BlueprintPath));
    if (!Blueprint)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Failed to load blueprint: %s"), *BlueprintPath));
    }

    TArray<TSharedPtr<FJsonValue>> FunctionArray;

    for (UEdGraph* Graph : Blueprint->FunctionGraphs)
    {
        if (!Graph) continue;

        // If looking for specific function, skip others
        if (bSpecificFunction && Graph->GetName() != FunctionName)
        {
            continue;
        }

        TSharedPtr<FJsonObject> FuncObj = MakeShared<FJsonObject>();
        FuncObj->SetStringField(TEXT("name"), Graph->GetName());
        FuncObj->SetStringField(TEXT("graph_type"), TEXT("Function"));

        // Get function signature from graph
        TArray<TSharedPtr<FJsonValue>> InputPins;
        TArray<TSharedPtr<FJsonValue>> OutputPins;

        // Find function entry and result nodes
        for (UEdGraphNode* Node : Graph->Nodes)
        {
            if (Node)
            {
                if (Node->GetClass()->GetName().Contains(TEXT("FunctionEntry")))
                {
                    // Process input parameters
                    for (UEdGraphPin* Pin : Node->Pins)
                    {
                        if (Pin && Pin->Direction == EGPD_Output && Pin->PinName != TEXT("then"))
                        {
                            TSharedPtr<FJsonObject> PinObj = MakeShared<FJsonObject>();
                            PinObj->SetStringField(TEXT("name"), Pin->PinName.ToString());
                            PinObj->SetStringField(TEXT("type"), Pin->PinType.PinCategory.ToString());
                            InputPins.Add(MakeShared<FJsonValueObject>(PinObj));
                        }
                    }
                }
                else if (Node->GetClass()->GetName().Contains(TEXT("FunctionResult")))
                {
                    // Process output parameters
                    for (UEdGraphPin* Pin : Node->Pins)
                    {
                        if (Pin && Pin->Direction == EGPD_Input && Pin->PinName != TEXT("exec"))
                        {
                            TSharedPtr<FJsonObject> PinObj = MakeShared<FJsonObject>();
                            PinObj->SetStringField(TEXT("name"), Pin->PinName.ToString());
                            PinObj->SetStringField(TEXT("type"), Pin->PinType.PinCategory.ToString());
                            OutputPins.Add(MakeShared<FJsonValueObject>(PinObj));
                        }
                    }
                }
            }
        }

        FuncObj->SetArrayField(TEXT("input_parameters"), InputPins);
        FuncObj->SetArrayField(TEXT("output_parameters"), OutputPins);
        FuncObj->SetNumberField(TEXT("node_count"), Graph->Nodes.Num());

        // Include graph details if requested
        if (bIncludeGraph)
        {
            TArray<TSharedPtr<FJsonValue>> NodeArray;
            for (UEdGraphNode* Node : Graph->Nodes)
            {
                if (Node)
                {
                    TSharedPtr<FJsonObject> NodeObj = MakeShared<FJsonObject>();
                    NodeObj->SetStringField(TEXT("name"), Node->GetName());
                    NodeObj->SetStringField(TEXT("class"), Node->GetClass()->GetName());
                    NodeObj->SetStringField(TEXT("title"), Node->GetNodeTitle(ENodeTitleType::FullTitle).ToString());
                    NodeArray.Add(MakeShared<FJsonValueObject>(NodeObj));
                }
            }
            FuncObj->SetArrayField(TEXT("graph_nodes"), NodeArray);
        }

        FunctionArray.Add(MakeShared<FJsonValueObject>(FuncObj));
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint_path"), BlueprintPath);
    
    if (bSpecificFunction)
    {
        ResultObj->SetStringField(TEXT("function_name"), FunctionName);
        if (FunctionArray.Num() > 0)
        {
            ResultObj->SetObjectField(TEXT("function"), FunctionArray[0]->AsObject());
        }
        else
        {
            return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Function not found: %s"), *FunctionName));
        }
    }
    else
    {
        ResultObj->SetArrayField(TEXT("functions"), FunctionArray);
        ResultObj->SetNumberField(TEXT("function_count"), FunctionArray.Num());
    }

    return ResultObj;
}

// ──────────────────────────────────────────────────────────
// AVA ADDITIONS
// ──────────────────────────────────────────────────────────

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSetComponentStaticMesh(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));

    FString MeshPath;
    if (!Params->TryGetStringField(TEXT("static_mesh"), MeshPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'static_mesh' parameter (asset path)"));

    // Aliases for backward compatibility
    if (MeshPath.IsEmpty()) Params->TryGetStringField(TEXT("mesh"), MeshPath);
    if (MeshPath.IsEmpty()) Params->TryGetStringField(TEXT("mesh_path"), MeshPath);

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    USCS_Node* ComponentNode = nullptr;
    for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
    {
        if (Node && Node->GetVariableName().ToString() == ComponentName)
        {
            ComponentNode = Node;
            break;
        }
    }
    if (!ComponentNode)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));

    UStaticMeshComponent* MeshComp = Cast<UStaticMeshComponent>(ComponentNode->ComponentTemplate);
    if (!MeshComp)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a StaticMeshComponent"));

    UStaticMesh* Mesh = Cast<UStaticMesh>(UEditorAssetLibrary::LoadAsset(MeshPath));
    if (!Mesh)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("StaticMesh not found: %s"), *MeshPath));

    MeshComp->SetStaticMesh(Mesh);
    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetStringField(TEXT("component"), ComponentName);
    ResultObj->SetStringField(TEXT("mesh"), MeshPath);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSetPointLightProperties(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    USCS_Node* ComponentNode = nullptr;
    for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
    {
        if (Node && Node->GetVariableName().ToString() == ComponentName)
        {
            ComponentNode = Node;
            break;
        }
    }
    if (!ComponentNode)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));

    UPointLightComponent* LightComp = Cast<UPointLightComponent>(ComponentNode->ComponentTemplate);
    if (!LightComp)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a PointLightComponent"));

    // Apply properties
    if (Params->HasField(TEXT("intensity")))
        LightComp->SetIntensity(Params->GetNumberField(TEXT("intensity")));
    if (Params->HasField(TEXT("light_color")))
    {
        TArray<float> C;
        const TArray<TSharedPtr<FJsonValue>>* Arr;
        if (Params->TryGetArrayField(TEXT("light_color"), Arr) && Arr->Num() >= 3)
        {
            FColor LightColor(
                FMath::Clamp((*Arr)[0]->AsNumber() * 255.0, 0.0, 255.0),
                FMath::Clamp((*Arr)[1]->AsNumber() * 255.0, 0.0, 255.0),
                FMath::Clamp((*Arr)[2]->AsNumber() * 255.0, 0.0, 255.0)
            );
            LightComp->SetLightColor(LightColor);
        }
    }
    if (Params->HasField(TEXT("attenuation_radius")))
        LightComp->SetAttenuationRadius(Params->GetNumberField(TEXT("attenuation_radius")));
    if (Params->HasField(TEXT("cast_shadows")))
        LightComp->SetCastShadows(Params->GetBoolField(TEXT("cast_shadows")));
    if (Params->HasField(TEXT("source_radius")))
        LightComp->SetSourceRadius(Params->GetNumberField(TEXT("source_radius")));

    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetStringField(TEXT("component"), ComponentName);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

// ──────────────────────────────────────────────────────────
// AVA V4: Component lifecycle commands
// ──────────────────────────────────────────────────────────

static USCS_Node* FindComponentNode(UBlueprint* Blueprint, const FString& ComponentName)
{
    if (!Blueprint || !Blueprint->SimpleConstructionScript) return nullptr;
    for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
    {
        if (Node && Node->GetVariableName().ToString() == ComponentName)
            return Node;
    }
    return nullptr;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleRemoveComponentFromBlueprint(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));

    bool bForce = false;
    Params->TryGetBoolField(TEXT("force"), bForce);

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    USCS_Node* Node = FindComponentNode(Blueprint, ComponentName);
    if (!Node)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));

    if (!bForce && Node == Blueprint->SimpleConstructionScript->GetDefaultSceneRootNode())
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Cannot remove root component without 'force': true"));

    FString ComponentClass = Node->ComponentTemplate ? Node->ComponentTemplate->GetClass()->GetName() : TEXT("Unknown");
    Blueprint->SimpleConstructionScript->RemoveNode(Node);

    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetStringField(TEXT("removed_component"), ComponentName);
    ResultObj->SetStringField(TEXT("component_class"), ComponentClass);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleAttachComponentToBlueprint(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));

    FString ParentComponentName;
    if (!Params->TryGetStringField(TEXT("parent_component_name"), ParentComponentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'parent_component_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    USCS_Node* ChildNode = FindComponentNode(Blueprint, ComponentName);
    if (!ChildNode)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));

    USCS_Node* ParentNode = FindComponentNode(Blueprint, ParentComponentName);
    if (!ParentNode)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Parent component not found: %s"), *ParentComponentName));

	USceneComponent* ChildTemplate = Cast<USceneComponent>(ChildNode->ComponentTemplate);
	if (!ChildTemplate)
		return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component must be a SceneComponent to re-parent"));

	FString SocketName;
	Params->TryGetStringField(TEXT("socket_name"), SocketName);

	ChildNode->Modify();
	Blueprint->SimpleConstructionScript->RemoveNode(ChildNode);
	ParentNode->AddChildNode(ChildNode);
	ParentNode->Modify();

	if (Params->HasField(TEXT("location")))
		ChildTemplate->SetRelativeLocation(FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location")));
	if (Params->HasField(TEXT("rotation")))
		ChildTemplate->SetRelativeRotation(FEpicUnrealMCPCommonUtils::GetRotatorFromJson(Params, TEXT("rotation")));
	if (Params->HasField(TEXT("scale")))
		ChildTemplate->SetRelativeScale3D(FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("scale")));

	if (!SocketName.IsEmpty())
	{
		USceneComponent* ParentTemplate = Cast<USceneComponent>(ParentNode->ComponentTemplate);
		if (ParentTemplate)
			ChildTemplate->AttachToComponent(ParentTemplate, FAttachmentTransformRules::KeepRelativeTransform, *SocketName);
	}

    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetStringField(TEXT("component"), ComponentName);
    ResultObj->SetStringField(TEXT("parent"), ParentComponentName);
    ResultObj->SetStringField(TEXT("socket"), SocketName);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSetComponentProperties(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    USCS_Node* Node = FindComponentNode(Blueprint, ComponentName);
    if (!Node)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));

    UActorComponent* Template = Node->ComponentTemplate;
    TSharedPtr<FJsonObject> AppliedObj = MakeShared<FJsonObject>();
    int32 AppliedCount = 0;

    if (Params->HasField(TEXT("visible")))
    {
        if (USceneComponent* SceneComp = Cast<USceneComponent>(Template))
        {
            SceneComp->SetVisibility(Params->GetBoolField(TEXT("visible")));
            AppliedObj->SetBoolField(TEXT("visible"), Params->GetBoolField(TEXT("visible")));
            AppliedCount++;
        }
    }

    if (Params->HasField(TEXT("active")))
    {
        Template->SetActive(Params->GetBoolField(TEXT("active")));
        AppliedObj->SetBoolField(TEXT("active"), Params->GetBoolField(TEXT("active")));
        AppliedCount++;
    }

    if (Params->HasField(TEXT("location")))
    {
        if (USceneComponent* SceneComp = Cast<USceneComponent>(Template))
        {
            FVector Loc = FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location"));
            SceneComp->SetRelativeLocation(Loc);
            TArray<TSharedPtr<FJsonValue>> Arr;
            Arr.Add(MakeShared<FJsonValueNumber>(Loc.X));
            Arr.Add(MakeShared<FJsonValueNumber>(Loc.Y));
            Arr.Add(MakeShared<FJsonValueNumber>(Loc.Z));
            AppliedObj->SetArrayField(TEXT("location"), Arr);
            AppliedCount++;
        }
    }

    if (Params->HasField(TEXT("rotation")))
    {
        if (USceneComponent* SceneComp = Cast<USceneComponent>(Template))
        {
            FRotator Rot = FEpicUnrealMCPCommonUtils::GetRotatorFromJson(Params, TEXT("rotation"));
            SceneComp->SetRelativeRotation(Rot);
            TArray<TSharedPtr<FJsonValue>> Arr;
            Arr.Add(MakeShared<FJsonValueNumber>(Rot.Pitch));
            Arr.Add(MakeShared<FJsonValueNumber>(Rot.Yaw));
            Arr.Add(MakeShared<FJsonValueNumber>(Rot.Roll));
            AppliedObj->SetArrayField(TEXT("rotation"), Arr);
            AppliedCount++;
        }
    }

    if (UPointLightComponent* LightComp = Cast<UPointLightComponent>(Template))
    {
        if (Params->HasField(TEXT("intensity")))
        {
            LightComp->SetIntensity(Params->GetNumberField(TEXT("intensity")));
            AppliedObj->SetNumberField(TEXT("intensity"), Params->GetNumberField(TEXT("intensity")));
            AppliedCount++;
        }
        if (Params->HasField(TEXT("attenuation_radius")))
        {
            LightComp->SetAttenuationRadius(Params->GetNumberField(TEXT("attenuation_radius")));
            AppliedObj->SetNumberField(TEXT("attenuation_radius"), Params->GetNumberField(TEXT("attenuation_radius")));
            AppliedCount++;
        }
        if (Params->HasField(TEXT("inner_cone_angle")))
        {
            if (USpotLightComponent* SpotComp = Cast<USpotLightComponent>(Template))
            {
                SpotComp->SetInnerConeAngle(Params->GetNumberField(TEXT("inner_cone_angle")));
                AppliedObj->SetNumberField(TEXT("inner_cone_angle"), Params->GetNumberField(TEXT("inner_cone_angle")));
                AppliedCount++;
            }
        }
        if (Params->HasField(TEXT("outer_cone_angle")))
        {
            if (USpotLightComponent* SpotComp = Cast<USpotLightComponent>(Template))
            {
                SpotComp->SetOuterConeAngle(Params->GetNumberField(TEXT("outer_cone_angle")));
                AppliedObj->SetNumberField(TEXT("outer_cone_angle"), Params->GetNumberField(TEXT("outer_cone_angle")));
                AppliedCount++;
            }
        }
        if (Params->HasField(TEXT("cast_shadows")))
        {
            LightComp->SetCastShadows(Params->GetBoolField(TEXT("cast_shadows")));
            AppliedObj->SetBoolField(TEXT("cast_shadows"), Params->GetBoolField(TEXT("cast_shadows")));
            AppliedCount++;
        }
    }

    if (AppliedCount == 0)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No recognized properties provided"));

    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetStringField(TEXT("component"), ComponentName);
    ResultObj->SetNumberField(TEXT("properties_set"), AppliedCount);
    ResultObj->SetObjectField(TEXT("applied"), AppliedObj);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleGetBlueprintComponents(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    bool bIncludeTransforms = true;
    Params->TryGetBoolField(TEXT("include_transforms"), bIncludeTransforms);

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    TArray<TSharedPtr<FJsonValue>> CompArray;
    if (Blueprint->SimpleConstructionScript)
    {
        for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
        {
            if (!Node || !Node->ComponentTemplate) continue;

            TSharedPtr<FJsonObject> CompObj = MakeShared<FJsonObject>();
            CompObj->SetStringField(TEXT("name"), Node->GetVariableName().ToString());
            CompObj->SetStringField(TEXT("class"), Node->ComponentTemplate->GetClass()->GetName());

	FString ParentName = TEXT("Root");
		for (USCS_Node* PotentialParent : Blueprint->SimpleConstructionScript->GetAllNodes())
		{
			if (PotentialParent->GetChildNodes().Contains(Node))
			{
				ParentName = PotentialParent->GetVariableName().ToString();
				break;
			}
		}
		CompObj->SetStringField(TEXT("parent"), ParentName);

            if (bIncludeTransforms)
            {
                if (USceneComponent* SceneComp = Cast<USceneComponent>(Node->ComponentTemplate))
                {
                    TArray<TSharedPtr<FJsonValue>> LocArr, RotArr, ScaleArr;
                    FVector Loc = SceneComp->GetRelativeLocation();
                    FRotator Rot = SceneComp->GetRelativeRotation();
                    FVector Scale = SceneComp->GetRelativeScale3D();
                    LocArr.Add(MakeShared<FJsonValueNumber>(Loc.X)); LocArr.Add(MakeShared<FJsonValueNumber>(Loc.Y)); LocArr.Add(MakeShared<FJsonValueNumber>(Loc.Z));
                    RotArr.Add(MakeShared<FJsonValueNumber>(Rot.Pitch)); RotArr.Add(MakeShared<FJsonValueNumber>(Rot.Yaw)); RotArr.Add(MakeShared<FJsonValueNumber>(Rot.Roll));
                    ScaleArr.Add(MakeShared<FJsonValueNumber>(Scale.X)); ScaleArr.Add(MakeShared<FJsonValueNumber>(Scale.Y)); ScaleArr.Add(MakeShared<FJsonValueNumber>(Scale.Z));
                    CompObj->SetArrayField(TEXT("location"), LocArr);
                    CompObj->SetArrayField(TEXT("rotation"), RotArr);
                    CompObj->SetArrayField(TEXT("scale"), ScaleArr);
                }
            }

            CompArray.Add(MakeShared<FJsonValueObject>(CompObj));
        }
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetArrayField(TEXT("components"), CompArray);
    ResultObj->SetNumberField(TEXT("count"), CompArray.Num());
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

// ──────────────────────────────────────────────────────────
// AVA V4: Material instance commands
// ──────────────────────────────────────────────────────────

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleCreateMaterialInstance(const TSharedPtr<FJsonObject>& Params)
{
    FString ParentMaterialPath;
    if (!Params->TryGetStringField(TEXT("parent_material"), ParentMaterialPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'parent_material' parameter"));

    FString InstanceName;
    if (!Params->TryGetStringField(TEXT("instance_name"), InstanceName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'instance_name' parameter"));

    FString PackagePath = TEXT("/Game/Materials/");
    Params->TryGetStringField(TEXT("save_path"), PackagePath);
    if (!PackagePath.EndsWith(TEXT("/"))) PackagePath += TEXT("/");

    UMaterialInterface* ParentMaterial = Cast<UMaterialInterface>(UEditorAssetLibrary::LoadAsset(ParentMaterialPath));
    if (!ParentMaterial)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Parent material not found: %s"), *ParentMaterialPath));

    FAssetToolsModule& AssetToolsModule = FModuleManager::LoadModuleChecked<FAssetToolsModule>("AssetTools");
    FString FullPath = PackagePath + InstanceName;
    UObject* NewAsset = AssetToolsModule.Get().CreateAsset(InstanceName, PackagePath, UMaterialInstanceConstant::StaticClass(), nullptr);

    if (!NewAsset)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to create material instance"));

    UMaterialInstanceConstant* NewInstance = Cast<UMaterialInstanceConstant>(NewAsset);
    if (!NewInstance)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Created asset is not a MaterialInstanceConstant"));

    NewInstance->SetParentEditorOnly(ParentMaterial);
    NewInstance->MarkPackageDirty();
    NewInstance->PostEditChange();

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("instance_name"), InstanceName);
    ResultObj->SetStringField(TEXT("instance_path"), FullPath);
    ResultObj->SetStringField(TEXT("parent_material"), ParentMaterialPath);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSetMaterialInstanceParameter(const TSharedPtr<FJsonObject>& Params)
{
    FString InstancePath;
    if (!Params->TryGetStringField(TEXT("instance_path"), InstancePath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'instance_path' parameter"));

    FString ParameterName;
    if (!Params->TryGetStringField(TEXT("parameter_name"), ParameterName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'parameter_name' parameter"));

    UMaterialInstanceConstant* Instance = Cast<UMaterialInstanceConstant>(UEditorAssetLibrary::LoadAsset(InstancePath));
    if (!Instance)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Material instance not found: %s"), *InstancePath));

    TSharedPtr<FJsonObject> AppliedObj = MakeShared<FJsonObject>();
    int32 AppliedCount = 0;

    if (Params->HasField(TEXT("scalar_value")))
    {
        float Val = Params->GetNumberField(TEXT("scalar_value"));
        Instance->SetScalarParameterValueEditorOnly(FMaterialParameterInfo(*ParameterName), Val);
        AppliedObj->SetNumberField(TEXT("scalar_value"), Val);
        AppliedCount++;
    }

    if (Params->HasField(TEXT("vector_value")))
    {
        const TArray<TSharedPtr<FJsonValue>>* Arr;
        if (Params->TryGetArrayField(TEXT("vector_value"), Arr) && Arr->Num() >= 3)
        {
            FLinearColor Color(Arr->IsValidIndex(0) ? (*Arr)[0]->AsNumber() : 0.0f,
                               Arr->IsValidIndex(1) ? (*Arr)[1]->AsNumber() : 0.0f,
                               Arr->IsValidIndex(2) ? (*Arr)[2]->AsNumber() : 0.0f,
                               Arr->IsValidIndex(3) ? (*Arr)[3]->AsNumber() : 1.0f);
            Instance->SetVectorParameterValueEditorOnly(FMaterialParameterInfo(*ParameterName), Color);
            AppliedObj->SetArrayField(TEXT("vector_value"), *Arr);
            AppliedCount++;
        }
    }

    if (Params->HasField(TEXT("texture_path")))
    {
        FString TexPath = Params->GetStringField(TEXT("texture_path"));
        UTexture* Tex = Cast<UTexture>(UEditorAssetLibrary::LoadAsset(TexPath));
        if (Tex)
        {
            Instance->SetTextureParameterValueEditorOnly(FMaterialParameterInfo(*ParameterName), Tex);
            AppliedObj->SetStringField(TEXT("texture_path"), TexPath);
            AppliedCount++;
        }
    }

    if (AppliedCount == 0)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No parameter value provided (scalar_value, vector_value, or texture_path)"));

    Instance->MarkPackageDirty();
    Instance->PostEditChange();

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("instance_path"), InstancePath);
    ResultObj->SetStringField(TEXT("parameter_name"), ParameterName);
    ResultObj->SetObjectField(TEXT("applied"), AppliedObj);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleApplyMaterialToComponent(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));

    FString MaterialPath;
    if (!Params->TryGetStringField(TEXT("material_path"), MaterialPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'material_path' parameter"));

    int32 MaterialSlot = 0;
    Params->TryGetNumberField(TEXT("material_slot"), MaterialSlot);

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    USCS_Node* Node = FindComponentNode(Blueprint, ComponentName);
    if (!Node)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));

    UPrimitiveComponent* PrimComp = Cast<UPrimitiveComponent>(Node->ComponentTemplate);
    if (!PrimComp)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a primitive component"));

    UMaterialInterface* Material = Cast<UMaterialInterface>(UEditorAssetLibrary::LoadAsset(MaterialPath));
    if (!Material)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Material not found: %s"), *MaterialPath));

    if (MaterialSlot < 0 || MaterialSlot >= PrimComp->GetNumMaterials())
    {
        MaterialSlot = 0;
    }

    UMaterialInterface* PreviousMaterial = PrimComp->GetMaterial(MaterialSlot);
    FString PreviousPath = PreviousMaterial ? PreviousMaterial->GetPathName() : TEXT("None");

    PrimComp->SetMaterial(MaterialSlot, Material);

    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetStringField(TEXT("component"), ComponentName);
    ResultObj->SetNumberField(TEXT("material_slot"), MaterialSlot);
    ResultObj->SetStringField(TEXT("material_path"), MaterialPath);
    ResultObj->SetStringField(TEXT("previous_material"), PreviousPath);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleGetComponentMaterials(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    USCS_Node* Node = FindComponentNode(Blueprint, ComponentName);
    if (!Node)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));

    UPrimitiveComponent* PrimComp = Cast<UPrimitiveComponent>(Node->ComponentTemplate);
    if (!PrimComp)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a primitive component"));

    TArray<TSharedPtr<FJsonValue>> MatSlots;
    int32 NumSlots = PrimComp->GetNumMaterials();
    for (int32 i = 0; i < NumSlots; i++)
    {
        TSharedPtr<FJsonObject> SlotObj = MakeShared<FJsonObject>();
        SlotObj->SetNumberField(TEXT("slot_index"), i);
        UMaterialInterface* Mat = PrimComp->GetMaterial(i);
        if (Mat)
        {
            SlotObj->SetStringField(TEXT("material_name"), Mat->GetName());
            SlotObj->SetStringField(TEXT("material_path"), Mat->GetPathName());
            SlotObj->SetStringField(TEXT("class"), Mat->GetClass()->GetName());
        }
        else
        {
            SlotObj->SetStringField(TEXT("material_name"), TEXT("None"));
            SlotObj->SetStringField(TEXT("material_path"), TEXT(""));
            SlotObj->SetStringField(TEXT("class"), TEXT("None"));
        }
        MatSlots.Add(MakeShared<FJsonValueObject>(SlotObj));
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetStringField(TEXT("component"), ComponentName);
    ResultObj->SetArrayField(TEXT("material_slots"), MatSlots);
    ResultObj->SetNumberField(TEXT("total_slots"), NumSlots);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleGetStaticMeshMaterialSlots(const TSharedPtr<FJsonObject>& Params)
{
    FString MeshPath;
    if (!Params->TryGetStringField(TEXT("mesh_path"), MeshPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'mesh_path' parameter"));

    UStaticMesh* Mesh = Cast<UStaticMesh>(UEditorAssetLibrary::LoadAsset(MeshPath));
    if (!Mesh)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("StaticMesh not found: %s"), *MeshPath));

    TArray<TSharedPtr<FJsonValue>> Slots;
    int32 NumMaterials = Mesh->GetStaticMaterials().Num();
    for (int32 i = 0; i < NumMaterials; i++)
    {
        const FStaticMaterial& StaticMat = Mesh->GetStaticMaterials()[i];
        TSharedPtr<FJsonObject> SlotObj = MakeShared<FJsonObject>();
        SlotObj->SetNumberField(TEXT("slot_index"), i);
        SlotObj->SetStringField(TEXT("slot_name"), StaticMat.MaterialSlotName.ToString());
        if (StaticMat.MaterialInterface)
        {
            SlotObj->SetStringField(TEXT("material_name"), StaticMat.MaterialInterface->GetName());
            SlotObj->SetStringField(TEXT("material_path"), StaticMat.MaterialInterface->GetPathName());
        }
        else
        {
            SlotObj->SetStringField(TEXT("material_name"), TEXT("None"));
            SlotObj->SetStringField(TEXT("material_path"), TEXT(""));
        }
        Slots.Add(MakeShared<FJsonValueObject>(SlotObj));
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("mesh_path"), MeshPath);
    ResultObj->SetStringField(TEXT("mesh_name"), Mesh->GetName());
    ResultObj->SetArrayField(TEXT("material_slots"), Slots);
    ResultObj->SetNumberField(TEXT("total_slots"), NumMaterials);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

// ──────────────────────────────────────────────────────────
// AVA V5: Enhanced Input asset management
// ──────────────────────────────────────────────────────────

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleCreateInputActionAsset(const TSharedPtr<FJsonObject>& Params)
{
    FString ActionName;
    if (!Params->TryGetStringField(TEXT("action_name"), ActionName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'action_name' parameter"));

    FString PackagePath = TEXT("/Game/Input/");
    Params->TryGetStringField(TEXT("save_path"), PackagePath);
    if (!PackagePath.EndsWith(TEXT("/"))) PackagePath += TEXT("/");

    FString FullPath = PackagePath + ActionName;
    if (UEditorAssetLibrary::DoesAssetExist(FullPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Input Action already exists: %s"), *FullPath));

    UPackage* Package = CreatePackage(*FullPath);
    if (!Package)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to create package"));

    UInputAction* NewAction = NewObject<UInputAction>(Package, UInputAction::StaticClass(), *ActionName, RF_Public | RF_Standalone);
    if (!NewAction)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to create InputAction"));

    FAssetRegistryModule::AssetCreated(NewAction);
    Package->MarkPackageDirty();

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("action_name"), ActionName);
    ResultObj->SetStringField(TEXT("action_path"), FullPath);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleMapInputAction(const TSharedPtr<FJsonObject>& Params)
{
    FString ActionAssetPath;
    if (!Params->TryGetStringField(TEXT("action_asset_path"), ActionAssetPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'action_asset_path' parameter"));

    FString MappingContextPath;
    if (!Params->TryGetStringField(TEXT("mapping_context_path"), MappingContextPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'mapping_context_path' parameter"));

    UInputAction* Action = Cast<UInputAction>(UEditorAssetLibrary::LoadAsset(ActionAssetPath));
    if (!Action)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("InputAction not found: %s"), *ActionAssetPath));

    UInputMappingContext* MappingContext = Cast<UInputMappingContext>(UEditorAssetLibrary::LoadAsset(MappingContextPath));
    if (!MappingContext)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("InputMappingContext not found: %s"), *MappingContextPath));

    FString KeyName;
    Params->TryGetStringField(TEXT("key"), KeyName);
    if (KeyName.IsEmpty())
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'key' parameter"));

    MappingContext->MapKey(Action, FKey(*KeyName));
    MappingContext->MarkPackageDirty();

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("action_path"), ActionAssetPath);
    ResultObj->SetStringField(TEXT("mapping_context"), MappingContextPath);
    ResultObj->SetStringField(TEXT("key"), KeyName);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleGetBlueprintSummary(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    TSharedPtr<FJsonObject> Summary = MakeShared<FJsonObject>();

    Summary->SetStringField(TEXT("blueprint_name"), Blueprint->GetName());
    Summary->SetStringField(TEXT("blueprint_path"), Blueprint->GetPathName());

    FString ParentClass = Blueprint->ParentClass ? Blueprint->ParentClass->GetName() : TEXT("None");
    Summary->SetStringField(TEXT("parent_class"), ParentClass);

    TSharedPtr<FJsonObject> CompStatus = MakeShared<FJsonObject>();
    CompStatus->SetStringField(TEXT("status"), StaticEnum<EBlueprintStatus>()->GetNameStringByValue((int64)Blueprint->Status));
    CompStatus->SetBoolField(TEXT("is_up_to_date"), Blueprint->Status != BS_Dirty);
    CompStatus->SetBoolField(TEXT("has_errors"), Blueprint->Status == BS_Error);
    CompStatus->SetStringField(TEXT("last_compile"), (Blueprint->Status == BS_UpToDate || Blueprint->Status == BS_UpToDateWithWarnings) ? TEXT("up_to_date") : TEXT("stale"));
    Summary->SetObjectField(TEXT("compilation"), CompStatus);

    TArray<TSharedPtr<FJsonValue>> CompArr;
    if (Blueprint->SimpleConstructionScript)
    {
        for (USCS_Node* Node : Blueprint->SimpleConstructionScript->GetAllNodes())
        {
            if (!Node) continue;
            TSharedPtr<FJsonObject> C = MakeShared<FJsonObject>();
            C->SetStringField(TEXT("name"), Node->GetVariableName().ToString());
            if (Node->ComponentTemplate)
            {
                C->SetStringField(TEXT("class"), Node->ComponentTemplate->GetClass()->GetName());
            }
            if (Node->ParentComponentOrVariableName != NAME_None)
            {
                C->SetStringField(TEXT("parent"), Node->ParentComponentOrVariableName.ToString());
            }
            CompArr.Add(MakeShared<FJsonValueObject>(C));
        }
    }
    Summary->SetArrayField(TEXT("components"), CompArr);

    TArray<TSharedPtr<FJsonValue>> VarArr;
    for (const FBPVariableDescription& Var : Blueprint->NewVariables)
    {
        TSharedPtr<FJsonObject> V = MakeShared<FJsonObject>();
        V->SetStringField(TEXT("name"), Var.VarName.ToString());
        V->SetStringField(TEXT("type"), Var.VarType.PinCategory.ToString());
        if (Var.VarType.PinSubCategoryObject.IsValid())
        {
            UObject* SubCat = Var.VarType.PinSubCategoryObject.Get();
            if (SubCat) V->SetStringField(TEXT("sub_type"), SubCat->GetName());
        }
        VarArr.Add(MakeShared<FJsonValueObject>(V));
    }
    Summary->SetArrayField(TEXT("variables"), VarArr);

    TArray<TSharedPtr<FJsonValue>> IntfArr;
    for (const FBPInterfaceDescription& Iface : Blueprint->ImplementedInterfaces)
    {
        TSharedPtr<FJsonObject> I = MakeShared<FJsonObject>();
        I->SetStringField(TEXT("name"), Iface.Interface ? Iface.Interface->GetName() : TEXT("None"));
        IntfArr.Add(MakeShared<FJsonValueObject>(I));
    }
    Summary->SetArrayField(TEXT("interfaces"), IntfArr);

    TArray<TSharedPtr<FJsonValue>> GraphArr;
    for (UEdGraph* G : Blueprint->UbergraphPages)
    {
        if (!G) continue;
        TSharedPtr<FJsonObject> Gr = MakeShared<FJsonObject>();
        Gr->SetStringField(TEXT("name"), G->GetName());
        Gr->SetStringField(TEXT("type"), TEXT("event_graph"));
        Gr->SetNumberField(TEXT("node_count"), G->Nodes.Num());
        GraphArr.Add(MakeShared<FJsonValueObject>(Gr));
    }
    for (UEdGraph* G : Blueprint->FunctionGraphs)
    {
        if (!G) continue;
        TSharedPtr<FJsonObject> Gr = MakeShared<FJsonObject>();
        Gr->SetStringField(TEXT("name"), G->GetName());
        Gr->SetStringField(TEXT("type"), TEXT("function"));
        Gr->SetNumberField(TEXT("node_count"), G->Nodes.Num());
        GraphArr.Add(MakeShared<FJsonValueObject>(Gr));
    }
    Summary->SetArrayField(TEXT("graphs"), GraphArr);

    Summary->SetNumberField(TEXT("total_graph_count"), Blueprint->UbergraphPages.Num() + Blueprint->FunctionGraphs.Num());
    Summary->SetBoolField(TEXT("success"), true);
    return Summary;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleGetBlueprintDiagnostics(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    TSharedPtr<FJsonObject> Diag = MakeShared<FJsonObject>();
    Diag->SetStringField(TEXT("blueprint_name"), Blueprint->GetName());

    TArray<TSharedPtr<FJsonValue>> Warnings;
    TArray<TSharedPtr<FJsonValue>> Errors;

    if (Blueprint->Status == BS_Error)
    {
        Errors.Add(MakeShared<FJsonValueString>(TEXT("Blueprint has compilation errors (Status = BS_Error)")));
    }
    if (Blueprint->Status == BS_Dirty)
    {
        Warnings.Add(MakeShared<FJsonValueString>(TEXT("Blueprint is not up-to-date. Consider recompiling.")));
    }

    TArray<UEdGraph*> AllGraphs;
    AllGraphs.Append(Blueprint->UbergraphPages);
    AllGraphs.Append(Blueprint->FunctionGraphs);

    TArray<TSharedPtr<FJsonValue>> OrphanNodes;
    TArray<TSharedPtr<FJsonValue>> LooseRequiredPins;

    for (UEdGraph* Graph : AllGraphs)
    {
        if (!Graph) continue;
        for (UEdGraphNode* Node : Graph->Nodes)
        {
            if (!Node) continue;
            UK2Node* K2Node = Cast<UK2Node>(Node);
            if (!K2Node) continue;

            bool bHasExecIn = false;
            bool bHasExecOut = false;
            bool bConnectedExecIn = false;
            bool bConnectedExecOut = false;

            TArray<TSharedPtr<FJsonValue>> NodeLoosePins;

            for (UEdGraphPin* Pin : K2Node->Pins)
            {
                if (!Pin) continue;
                if (Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Exec)
                {
                    if (Pin->Direction == EGPD_Input)  { bHasExecIn = true; if (Pin->LinkedTo.Num() > 0) bConnectedExecIn = true; }
                    if (Pin->Direction == EGPD_Output) { bHasExecOut = true; if (Pin->LinkedTo.Num() > 0) bConnectedExecOut = true; }
                    if (Pin->LinkedTo.Num() == 0 && !Pin->bHidden && Pin->Direction == EGPD_Output && Pin->PinName != UEdGraphSchema_K2::PN_Then)
                    {
                        TSharedPtr<FJsonObject> L = MakeShared<FJsonObject>();
                        L->SetStringField(TEXT("graph"), Graph->GetName());
                        L->SetStringField(TEXT("node_id"), K2Node->GetName());
                        L->SetStringField(TEXT("node_title"), K2Node->GetNodeTitle(ENodeTitleType::ListView).ToString());
                        L->SetStringField(TEXT("pin"), Pin->PinName.ToString());
                        L->SetStringField(TEXT("issue"), TEXT("unconnected_exec_output"));
                        NodeLoosePins.Add(MakeShared<FJsonValueObject>(L));
                    }
                }
            }

            for (const auto& LP : NodeLoosePins)
            {
                LooseRequiredPins.Add(LP);
            }

            if (!bConnectedExecIn && !bConnectedExecOut)
            {
                bool bIsEntry = Cast<UK2Node_FunctionEntry>(K2Node) != nullptr;
                bool bIsResult = Cast<UK2Node_FunctionResult>(K2Node) != nullptr;
                bool bIsEvent = Cast<UK2Node_Event>(K2Node) != nullptr;
                if (!bIsEntry && !bIsResult && !bIsEvent)
                {
                    TSharedPtr<FJsonObject> O = MakeShared<FJsonObject>();
                    O->SetStringField(TEXT("graph"), Graph->GetName());
                    O->SetStringField(TEXT("node_id"), K2Node->GetName());
                    O->SetStringField(TEXT("node_title"), K2Node->GetNodeTitle(ENodeTitleType::ListView).ToString());
                    O->SetStringField(TEXT("class"), K2Node->GetClass()->GetName());
                    O->SetBoolField(TEXT("has_exec_pins"), bHasExecIn || bHasExecOut);
                    OrphanNodes.Add(MakeShared<FJsonValueObject>(O));
                }
            }
        }
    }

    Diag->SetArrayField(TEXT("errors"), Errors);
    Diag->SetArrayField(TEXT("warnings"), Warnings);
    Diag->SetNumberField(TEXT("orphan_node_count"), OrphanNodes.Num());
    Diag->SetArrayField(TEXT("orphan_nodes"), OrphanNodes);
    Diag->SetNumberField(TEXT("loose_pin_count"), LooseRequiredPins.Num());
    Diag->SetArrayField(TEXT("loose_pins"), LooseRequiredPins);
    Diag->SetNumberField(TEXT("error_count"), Errors.Num());
    Diag->SetNumberField(TEXT("warning_count"), Warnings.Num());
    Diag->SetBoolField(TEXT("success"), true);
    return Diag;
}

// ──────────────────────────────────────────────────────────
// AVA V7: Game systems
// ──────────────────────────────────────────────────────────

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSetBlueprintProperty(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    TSharedPtr<FJsonObject> Applied = MakeShared<FJsonObject>();
    int32 Count = 0;

    if (Params->HasField(TEXT("parent_class")))
    {
        FString ParentClass;
        Params->TryGetStringField(TEXT("parent_class"), ParentClass);
        UClass* NewParent = LoadClass<AActor>(nullptr, *ParentClass);
        if (!NewParent)
            NewParent = LoadObject<UClass>(nullptr, *ParentClass);
        if (!NewParent && !ParentClass.StartsWith(TEXT("/Script/")))
            NewParent = LoadClass<AActor>(nullptr, *(TEXT("/Script/Engine.") + ParentClass));
        if (NewParent && NewParent->IsChildOf(Blueprint->ParentClass ? Blueprint->ParentClass->GetSuperClass() : AActor::StaticClass()))
        {
            Blueprint->ParentClass = NewParent;
            Applied->SetStringField(TEXT("parent_class"), ParentClass);
            Count++;
        }
        else
        {
            return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Invalid parent class: %s"), *ParentClass));
        }
    }

    if (Params->HasField(TEXT("tick_enabled")))
    {
        bool bEnabled = Params->GetBoolField(TEXT("tick_enabled"));
        // Set tick on the Blueprint's generated class default object
        if (UClass* GenClass = Blueprint->GeneratedClass)
        {
            if (AActor* CDO = Cast<AActor>(GenClass->GetDefaultObject()))
            {
                CDO->PrimaryActorTick.bCanEverTick = bEnabled;
                CDO->PrimaryActorTick.bStartWithTickEnabled = bEnabled;
                Applied->SetBoolField(TEXT("tick_enabled"), bEnabled);
                Count++;
            }
        }
    }

    if (Params->HasField(TEXT("auto_possess_player")))
    {
        FString PossessMode;
        Params->TryGetStringField(TEXT("auto_possess_player"), PossessMode);
        if (UClass* GenClass = Blueprint->GeneratedClass)
        {
            if (APawn* CDO = Cast<APawn>(GenClass->GetDefaultObject()))
            {
                EAutoReceiveInput::Type Mode = EAutoReceiveInput::Disabled;
                if (PossessMode == TEXT("Player0")) Mode = EAutoReceiveInput::Player0;
                else if (PossessMode == TEXT("Player1")) Mode = EAutoReceiveInput::Player1;
                CDO->AutoPossessPlayer = Mode;
                Applied->SetStringField(TEXT("auto_possess_player"), PossessMode);
                Count++;
            }
        }
    }

    if (Params->HasField(TEXT("auto_possess_ai")))
    {
        FString PossessMode;
        Params->TryGetStringField(TEXT("auto_possess_ai"), PossessMode);
        if (UClass* GenClass = Blueprint->GeneratedClass)
        {
            if (APawn* CDO = Cast<APawn>(GenClass->GetDefaultObject()))
            {
                EAutoPossessAI Mode = EAutoPossessAI::Disabled;
                if (PossessMode == TEXT("PlacedInWorld")) Mode = EAutoPossessAI::PlacedInWorld;
                else if (PossessMode == TEXT("Spawned")) Mode = EAutoPossessAI::Spawned;
                else if (PossessMode == TEXT("PlacedInWorldOrSpawned")) Mode = EAutoPossessAI::PlacedInWorldOrSpawned;
                CDO->AutoPossessAI = Mode;
                Applied->SetStringField(TEXT("auto_possess_ai"), PossessMode);
                Count++;
            }
        }
    }

    if (Count == 0)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No recognized properties provided. Supported: parent_class, tick_enabled, auto_possess_player, auto_possess_ai"));

    Blueprint->Modify();
    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("blueprint"), BlueprintName);
    Result->SetNumberField(TEXT("properties_set"), Count);
    Result->SetObjectField(TEXT("applied"), Applied);
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSetBlueprintDefaultValue(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString VariableName;
    if (!Params->TryGetStringField(TEXT("variable_name"), VariableName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'variable_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    for (FBPVariableDescription& Var : Blueprint->NewVariables)
    {
        if (Var.VarName.ToString() == VariableName)
        {
            FString NewValue;
            Params->TryGetStringField(TEXT("value"), NewValue);
            Var.DefaultValue = NewValue;

            Blueprint->Modify();
            FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
            FKismetEditorUtilities::CompileBlueprint(Blueprint);

            TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
            Result->SetStringField(TEXT("variable"), VariableName);
            Result->SetStringField(TEXT("value"), NewValue);
            Result->SetBoolField(TEXT("success"), true);
            return Result;
        }
    }

    return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Variable not found: %s"), *VariableName));
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleCreateWidgetBlueprint(const TSharedPtr<FJsonObject>& Params)
{
    FString WidgetName;
    if (!Params->TryGetStringField(TEXT("name"), WidgetName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'name' parameter"));

    FString SavePath = TEXT("/Game/Blueprints/");
    Params->TryGetStringField(TEXT("save_path"), SavePath);

    FString FullPath = SavePath + WidgetName;
    if (UEditorAssetLibrary::DoesAssetExist(FullPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Widget already exists: %s"), *FullPath));

    UWidgetBlueprint* NewWidget = Cast<UWidgetBlueprint>(
        FKismetEditorUtilities::CreateBlueprint(
            UUserWidget::StaticClass(),
            CreatePackage(*FullPath),
            *WidgetName,
            BPTYPE_Normal,
            UWidgetBlueprint::StaticClass(),
            UWidgetBlueprintGeneratedClass::StaticClass()
        )
    );

    if (!NewWidget)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to create Widget Blueprint"));

    NewWidget->MarkPackageDirty();
    FAssetRegistryModule::AssetCreated(NewWidget);

    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("name"), WidgetName);
    Result->SetStringField(TEXT("path"), FullPath);
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleSetComponentCollision(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    USCS_Node* Node = nullptr;
    for (USCS_Node* N : Blueprint->SimpleConstructionScript->GetAllNodes())
        if (N && N->GetVariableName().ToString() == ComponentName) { Node = N; break; }
    if (!Node)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));

    UPrimitiveComponent* Prim = Cast<UPrimitiveComponent>(Node->ComponentTemplate);
    if (!Prim)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a PrimitiveComponent (no collision)"));

    TSharedPtr<FJsonObject> Applied = MakeShared<FJsonObject>();
    int32 Count = 0;

    if (Params->HasField(TEXT("collision_enabled")))
    {
        FString Mode;
        Params->TryGetStringField(TEXT("collision_enabled"), Mode);
        ECollisionEnabled::Type Enabled = ECollisionEnabled::QueryAndPhysics;
        if (Mode == TEXT("NoCollision")) Enabled = ECollisionEnabled::NoCollision;
        else if (Mode == TEXT("QueryOnly")) Enabled = ECollisionEnabled::QueryOnly;
        else if (Mode == TEXT("PhysicsOnly")) Enabled = ECollisionEnabled::PhysicsOnly;
        else if (Mode == TEXT("QueryAndPhysics")) Enabled = ECollisionEnabled::QueryAndPhysics;
        Prim->SetCollisionEnabled(Enabled);
        Applied->SetStringField(TEXT("collision_enabled"), Mode);
        Count++;
    }

    if (Params->HasField(TEXT("collision_profile")))
    {
        FString ProfileName;
        Params->TryGetStringField(TEXT("collision_profile"), ProfileName);
        Prim->SetCollisionProfileName(*ProfileName);
        Applied->SetStringField(TEXT("collision_profile"), ProfileName);
        Count++;
    }

    if (Params->HasField(TEXT("collision_object_type")))
    {
        FString ObjType;
        Params->TryGetStringField(TEXT("collision_object_type"), ObjType);
        ECollisionChannel Channel = ECC_WorldStatic;
        UEnum* Enum = StaticEnum<ECollisionChannel>();
        int64 Val = Enum->GetValueByNameString(ObjType);
        if (Val != INDEX_NONE) Channel = (ECollisionChannel)Val;
        Prim->SetCollisionObjectType(Channel);
        Applied->SetStringField(TEXT("collision_object_type"), ObjType);
        Count++;
    }

    if (Params->HasField(TEXT("generate_overlap_events")))
    {
        bool bGen = Params->GetBoolField(TEXT("generate_overlap_events"));
        Prim->SetGenerateOverlapEvents(bGen);
        Applied->SetBoolField(TEXT("generate_overlap_events"), bGen);
        Count++;
    }

    if (Count == 0)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No recognized collision properties. Supported: collision_enabled, collision_profile, collision_object_type, generate_overlap_events"));

    Blueprint->Modify();
    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("component"), ComponentName);
    Result->SetNumberField(TEXT("properties_set"), Count);
    Result->SetObjectField(TEXT("applied"), Applied);
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleAddSocketToComponent(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ComponentName;
    if (!Params->TryGetStringField(TEXT("component_name"), ComponentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'component_name' parameter"));

    FString SocketName;
    if (!Params->TryGetStringField(TEXT("socket_name"), SocketName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'socket_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    USCS_Node* Node = nullptr;
    for (USCS_Node* N : Blueprint->SimpleConstructionScript->GetAllNodes())
        if (N && N->GetVariableName().ToString() == ComponentName) { Node = N; break; }
    if (!Node)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Component not found: %s"), *ComponentName));

    USceneComponent* SceneComp = Cast<USceneComponent>(Node->ComponentTemplate);
    if (!SceneComp)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a SceneComponent"));

    UStaticMeshComponent* MeshComp = Cast<UStaticMeshComponent>(SceneComp);
    USkeletalMeshComponent* SkelComp = Cast<USkeletalMeshComponent>(SceneComp);
    if (!MeshComp && !SkelComp)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Component is not a mesh component (Static or Skeletal)"));

    FVector SocketLoc(0, 0, 0);
    FRotator SocketRot(0, 0, 0);
    if (Params->HasField(TEXT("location")))
        SocketLoc = FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location"));
    if (Params->HasField(TEXT("rotation")))
        SocketRot = FEpicUnrealMCPCommonUtils::GetRotatorFromJson(Params, TEXT("rotation"));

    if (MeshComp)
    {
        UStaticMesh* Mesh = MeshComp->GetStaticMesh();
        if (Mesh)
        {
            UStaticMeshSocket* Socket = NewObject<UStaticMeshSocket>(Mesh);
            Socket->SocketName = *SocketName;
            Socket->RelativeLocation = SocketLoc;
            Socket->RelativeRotation = SocketRot;
            Mesh->Sockets.Add(Socket);
            Mesh->MarkPackageDirty();
        }
        else
            return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("StaticMeshComponent has no StaticMesh assigned"));
    }
    else if (SkelComp)
    {
        USkeletalMesh* SkelMesh = SkelComp->GetSkeletalMeshAsset();
        if (SkelMesh)
        {
            USkeletalMeshSocket* Socket = NewObject<USkeletalMeshSocket>(SkelMesh, *SocketName);
            Socket->SocketName = *SocketName;
            Socket->RelativeLocation = SocketLoc;
            Socket->RelativeRotation = SocketRot;
            SkelMesh->AddSocket(Socket);
            SkelMesh->MarkPackageDirty();
        }
        else
            return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("SkeletalMeshComponent has no SkeletalMesh assigned"));
    }

    Blueprint->Modify();
    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("socket_name"), SocketName);
    Result->SetStringField(TEXT("component"), ComponentName);
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintCommands::HandleDeleteBlueprint(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintPath;
    if (!Params->TryGetStringField(TEXT("blueprint_path"), BlueprintPath))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_path' parameter"));
    }

    if (!UEditorAssetLibrary::DoesAssetExist(BlueprintPath))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Asset not found: %s"), *BlueprintPath));
    }

    bool bDeleted = UEditorAssetLibrary::DeleteAsset(BlueprintPath);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetBoolField(TEXT("deleted"), bDeleted);
    ResultObj->SetStringField(TEXT("path"), BlueprintPath);
    ResultObj->SetBoolField(TEXT("success"), bDeleted);
    return ResultObj;
}