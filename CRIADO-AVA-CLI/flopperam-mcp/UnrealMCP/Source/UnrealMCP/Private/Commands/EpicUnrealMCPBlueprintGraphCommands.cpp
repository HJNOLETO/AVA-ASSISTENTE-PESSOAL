#include "Commands/EpicUnrealMCPBlueprintGraphCommands.h"
#include "Commands/EpicUnrealMCPCommonUtils.h"
#include "Commands/BlueprintGraph/NodeManager.h"
#include "Commands/BlueprintGraph/BPConnector.h"
#include "Commands/BlueprintGraph/BPVariables.h"
#include "Commands/BlueprintGraph/EventManager.h"
#include "Commands/BlueprintGraph/NodeDeleter.h"
#include "Commands/BlueprintGraph/NodePropertyManager.h"
#include "Commands/BlueprintGraph/InterfaceManager.h"
#include "Commands/BlueprintGraph/Function/FunctionManager.h"
#include "Commands/BlueprintGraph/Function/FunctionIO.h"
#include "Engine/Blueprint.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "Kismet2/KismetEditorUtilities.h"
#include "EdGraph/EdGraph.h"
#include "EdGraph/EdGraphNode.h"
#include "EdGraph/EdGraphPin.h"
#include "K2Node_InputAction.h"
#include "K2Node_InputKey.h"
#include "K2Node_CallFunction.h"
#include "K2Node_VariableGet.h"
#include "K2Node_Self.h"
#include "EditorAssetLibrary.h"
#include "InputAction.h"
#include "ScopedTransaction.h"
#include "Kismet/GameplayStatics.h"
#include "Kismet/KismetSystemLibrary.h"

FEpicUnrealMCPBlueprintGraphCommands::FEpicUnrealMCPBlueprintGraphCommands()
{
}

FEpicUnrealMCPBlueprintGraphCommands::~FEpicUnrealMCPBlueprintGraphCommands()
{
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleCommand(const FString& CommandType, const TSharedPtr<FJsonObject>& Params)
{
    if (CommandType == TEXT("add_blueprint_node"))
    {
        return HandleAddBlueprintNode(Params);
    }
    else if (CommandType == TEXT("connect_nodes"))
    {
        return HandleConnectNodes(Params);
    }
    else if (CommandType == TEXT("create_variable"))
    {
        return HandleCreateVariable(Params);
    }
    else if (CommandType == TEXT("set_blueprint_variable_properties"))
    {
        return HandleSetVariableProperties(Params);
    }
    else if (CommandType == TEXT("add_event_node"))
    {
        return HandleAddEventNode(Params);
    }
    else if (CommandType == TEXT("delete_node"))
    {
        return HandleDeleteNode(Params);
    }
    else if (CommandType == TEXT("set_node_property"))
    {
        return HandleSetNodeProperty(Params);
    }
    else if (CommandType == TEXT("create_function"))
    {
        return HandleCreateFunction(Params);
    }
    else if (CommandType == TEXT("add_function_input"))
    {
        return HandleAddFunctionInput(Params);
    }
    else if (CommandType == TEXT("add_function_output"))
    {
        return HandleAddFunctionOutput(Params);
    }
    else if (CommandType == TEXT("delete_function"))
    {
        return HandleDeleteFunction(Params);
    }
    else if (CommandType == TEXT("rename_function"))
    {
        return HandleRenameFunction(Params);
    }
    else if (CommandType == TEXT("add_get_node"))
    {
        return HandleAddGetNode(Params);
    }
    else if (CommandType == TEXT("call_function_on_object"))
    {
        return HandleCallFunctionOnObject(Params);
    }
    else if (CommandType == TEXT("add_blueprint_interface"))
    {
        return HandleAddBlueprintInterface(Params);
    }
    else if (CommandType == TEXT("remove_blueprint_interface"))
    {
        return HandleRemoveBlueprintInterface(Params);
    }
    // AVA V4: Input and graph node introspection
    else if (CommandType == TEXT("add_input_action_node"))
    {
        return HandleAddInputActionNode(Params);
    }
    else if (CommandType == TEXT("add_key_event_node"))
    {
        return HandleAddKeyEventNode(Params);
    }
    else if (CommandType == TEXT("get_blueprint_graph_nodes"))
    {
        return HandleGetBlueprintGraphNodes(Params);
    }
    // AVA V6: Safe graph editing
    else if (CommandType == TEXT("disconnect_pins"))
    {
        return HandleDisconnectPins(Params);
    }
    else if (CommandType == TEXT("delete_blueprint_node"))
    {
        return HandleDeleteBlueprintNode(Params);
    }
    else if (CommandType == TEXT("add_enhanced_input_action_node"))
    {
        return HandleAddEnhancedInputActionNode(Params);
    }
    else if (CommandType == TEXT("add_is_valid_guard"))
    {
        return HandleAddIsValidGuard(Params);
    }

    return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Unknown blueprint graph command: %s"), *CommandType));
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleAddBlueprintNode(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString NodeType;
    if (!Params->TryGetStringField(TEXT("node_type"), NodeType))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'node_type' parameter"));
    }

    UE_LOG(LogTemp, Display, TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleAddBlueprintNode: Adding %s node to blueprint '%s'"), *NodeType, *BlueprintName);

    // Use the NodeManager to add the node
    return FBlueprintNodeManager::AddNode(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleAddBlueprintInterface(const TSharedPtr<FJsonObject>& Params)
{
    return FInterfaceManager::AddInterface(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleRemoveBlueprintInterface(const TSharedPtr<FJsonObject>& Params)
{
    return FInterfaceManager::RemoveInterface(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleConnectNodes(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString SourceNodeId;
    if (!Params->TryGetStringField(TEXT("source_node_id"), SourceNodeId))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'source_node_id' parameter"));
    }

    FString SourcePinName;
    if (!Params->TryGetStringField(TEXT("source_pin_name"), SourcePinName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'source_pin_name' parameter"));
    }

    FString TargetNodeId;
    if (!Params->TryGetStringField(TEXT("target_node_id"), TargetNodeId))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'target_node_id' parameter"));
    }

    FString TargetPinName;
    if (!Params->TryGetStringField(TEXT("target_pin_name"), TargetPinName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'target_pin_name' parameter"));
    }

    UE_LOG(LogTemp, Display, TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleConnectNodes: Connecting %s.%s to %s.%s in blueprint '%s'"),
        *SourceNodeId, *SourcePinName, *TargetNodeId, *TargetPinName, *BlueprintName);

    // Use the BPConnector to connect the nodes
    return FBPConnector::ConnectNodes(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleCreateVariable(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString VariableName;
    if (!Params->TryGetStringField(TEXT("variable_name"), VariableName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'variable_name' parameter"));
    }

    FString VariableType;
    if (!Params->TryGetStringField(TEXT("variable_type"), VariableType))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'variable_type' parameter"));
    }

    UE_LOG(LogTemp, Display, TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleCreateVariable: Creating %s variable '%s' in blueprint '%s'"),
        *VariableType, *VariableName, *BlueprintName);

    // Use the BPVariables to create the variable
    return FBPVariables::CreateVariable(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleSetVariableProperties(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString VariableName;
    if (!Params->TryGetStringField(TEXT("variable_name"), VariableName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'variable_name' parameter"));
    }

    UE_LOG(LogTemp, Display, TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleSetVariableProperties: Modifying variable '%s' in blueprint '%s'"),
        *VariableName, *BlueprintName);

    // Use the BPVariables to set the variable properties
    return FBPVariables::SetVariableProperties(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleAddEventNode(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString EventName;
    if (!Params->TryGetStringField(TEXT("event_name"), EventName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'event_name' parameter"));
    }

    UE_LOG(LogTemp, Display, TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleAddEventNode: Adding event '%s' to blueprint '%s'"),
        *EventName, *BlueprintName);

    // Use the EventManager to add the event node
    return FEventManager::AddEventNode(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleDeleteNode(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString NodeID;
    if (!Params->TryGetStringField(TEXT("node_id"), NodeID))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'node_id' parameter"));
    }

    UE_LOG(LogTemp, Display,
        TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleDeleteNode: Deleting node '%s' from blueprint '%s'"),
        *NodeID, *BlueprintName);

    return FNodeDeleter::DeleteNode(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleSetNodeProperty(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString NodeID;
    if (!Params->TryGetStringField(TEXT("node_id"), NodeID))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'node_id' parameter"));
    }

    // Check if this is semantic mode (action parameter) or legacy mode (property_name)
    bool bHasAction = Params->HasField(TEXT("action"));

    if (bHasAction)
    {
        // Semantic mode - delegate directly to SetNodeProperty
        FString Action;
        Params->TryGetStringField(TEXT("action"), Action);
        UE_LOG(LogTemp, Display,
            TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleSetNodeProperty: Semantic mode - action '%s' on node '%s' in blueprint '%s'"),
            *Action, *NodeID, *BlueprintName);
    }
    else
    {
        // Legacy mode - require property_name
        FString PropertyName;
        if (!Params->TryGetStringField(TEXT("property_name"), PropertyName))
        {
            return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'property_name' parameter"));
        }

        UE_LOG(LogTemp, Display,
            TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleSetNodeProperty: Legacy mode - Setting '%s' on node '%s' in blueprint '%s'"),
            *PropertyName, *NodeID, *BlueprintName);
    }

    return FNodePropertyManager::SetNodeProperty(Params);
}


TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleCreateFunction(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString FunctionName;
    if (!Params->TryGetStringField(TEXT("function_name"), FunctionName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'function_name' parameter"));
    }

    UE_LOG(LogTemp, Display, TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleCreateFunction: Creating function '%s' in blueprint '%s'"),
        *FunctionName, *BlueprintName);

    return FFunctionManager::CreateFunction(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleAddFunctionInput(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString FunctionName;
    if (!Params->TryGetStringField(TEXT("function_name"), FunctionName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'function_name' parameter"));
    }

    FString ParamName;
    if (!Params->TryGetStringField(TEXT("param_name"), ParamName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'param_name' parameter"));
    }

    UE_LOG(LogTemp, Display, TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleAddFunctionInput: Adding input '%s' to function '%s' in blueprint '%s'"),
        *ParamName, *FunctionName, *BlueprintName);

    return FFunctionIO::AddFunctionInput(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleAddFunctionOutput(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString FunctionName;
    if (!Params->TryGetStringField(TEXT("function_name"), FunctionName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'function_name' parameter"));
    }

    FString ParamName;
    if (!Params->TryGetStringField(TEXT("param_name"), ParamName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'param_name' parameter"));
    }

    UE_LOG(LogTemp, Display, TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleAddFunctionOutput: Adding output '%s' to function '%s' in blueprint '%s'"),
        *ParamName, *FunctionName, *BlueprintName);

    return FFunctionIO::AddFunctionOutput(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleDeleteFunction(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString FunctionName;
    if (!Params->TryGetStringField(TEXT("function_name"), FunctionName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'function_name' parameter"));
    }

    UE_LOG(LogTemp, Display, TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleDeleteFunction: Deleting function '%s' from blueprint '%s'"),
        *FunctionName, *BlueprintName);

    return FFunctionManager::DeleteFunction(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleRenameFunction(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
    }

    FString OldFunctionName;
    if (!Params->TryGetStringField(TEXT("old_function_name"), OldFunctionName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'old_function_name' parameter"));
    }

    FString NewFunctionName;
    if (!Params->TryGetStringField(TEXT("new_function_name"), NewFunctionName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'new_function_name' parameter"));
    }

    UE_LOG(LogTemp, Display, TEXT("FEpicUnrealMCPBlueprintGraphCommands::HandleRenameFunction: Renaming function '%s' to '%s' in blueprint '%s'"),
        *OldFunctionName, *NewFunctionName, *BlueprintName);

    return FFunctionManager::RenameFunction(Params);
}

// AVA ADDITION: Add variable Get node
TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleAddGetNode(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString VariableName;
    if (!Params->TryGetStringField(TEXT("variable_name"), VariableName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'variable_name' parameter"));

    UE_LOG(LogTemp, Display, TEXT("Adding get node for variable '%s' in blueprint '%s'"), *VariableName, *BlueprintName);
    return FEventManager::AddGetNode(Params);
}

// AVA ADDITION: Call function on target object
TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleCallFunctionOnObject(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString FunctionName;
    if (!Params->TryGetStringField(TEXT("function_name"), FunctionName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'function_name' parameter"));

    FString TargetClass;
    if (!Params->TryGetStringField(TEXT("target_class"), TargetClass))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'target_class' parameter"));

    UE_LOG(LogTemp, Display, TEXT("Calling function '%s' on target '%s' in blueprint '%s'"), *FunctionName, *TargetClass, *BlueprintName);
    return FEventManager::AddCallFunctionOnObject(Params);
}

// ──────────────────────────────────────────────────────────
// AVA V4: Input and graph node introspection
// ──────────────────────────────────────────────────────────

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleAddInputActionNode(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ActionName;
    if (!Params->TryGetStringField(TEXT("action_name"), ActionName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'action_name' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    UEdGraph* EventGraph = FEpicUnrealMCPCommonUtils::FindOrCreateEventGraph(Blueprint);
    if (!EventGraph)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Could not find or create event graph"));

    FVector2D Position(200.0f, 200.0f);
    if (Params->HasField(TEXT("position")))
    {
        const TArray<TSharedPtr<FJsonValue>>* PosArr;
        if (Params->TryGetArrayField(TEXT("position"), PosArr) && PosArr->Num() >= 2)
        {
            Position = FVector2D((*PosArr)[0]->AsNumber(), (*PosArr)[1]->AsNumber());
        }
    }

    UK2Node_InputAction* InputNode = NewObject<UK2Node_InputAction>(EventGraph);
    InputNode->InputActionName = *ActionName;
    InputNode->CreateNewGuid();
    InputNode->PostPlacedNewNode();
    InputNode->AllocateDefaultPins();
    InputNode->NodePosX = Position.X;
    InputNode->NodePosY = Position.Y;
    EventGraph->AddNode(InputNode, false, false);

    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("node_id"), InputNode->GetName());
    ResultObj->SetStringField(TEXT("node_guid"), InputNode->NodeGuid.ToString());
    ResultObj->SetStringField(TEXT("action_name"), ActionName);
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleAddKeyEventNode(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString KeyName;
    if (!Params->TryGetStringField(TEXT("key"), KeyName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'key' parameter"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    UEdGraph* EventGraph = FEpicUnrealMCPCommonUtils::FindOrCreateEventGraph(Blueprint);
    if (!EventGraph)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Could not find or create event graph"));

    FVector2D Position(200.0f, 200.0f);
    if (Params->HasField(TEXT("position")))
    {
        const TArray<TSharedPtr<FJsonValue>>* PosArr;
        if (Params->TryGetArrayField(TEXT("position"), PosArr) && PosArr->Num() >= 2)
        {
            Position = FVector2D((*PosArr)[0]->AsNumber(), (*PosArr)[1]->AsNumber());
        }
    }

    UK2Node_InputKey* KeyNode = NewObject<UK2Node_InputKey>(EventGraph);
    KeyNode->InputKey = FKey(*KeyName);
    KeyNode->CreateNewGuid();
    KeyNode->PostPlacedNewNode();
    KeyNode->AllocateDefaultPins();
    KeyNode->NodePosX = Position.X;
    KeyNode->NodePosY = Position.Y;
    EventGraph->AddNode(KeyNode, false, false);

    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("node_id"), KeyNode->GetName());
    ResultObj->SetStringField(TEXT("node_guid"), KeyNode->NodeGuid.ToString());
    ResultObj->SetStringField(TEXT("key"), KeyName);
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleGetBlueprintGraphNodes(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString GraphName = TEXT("EventGraph");
    Params->TryGetStringField(TEXT("graph_name"), GraphName);

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    UEdGraph* TargetGraph = nullptr;
    for (UEdGraph* G : Blueprint->UbergraphPages)
    {
        if (G && G->GetName() == GraphName) { TargetGraph = G; break; }
    }
    if (!TargetGraph)
    {
        for (UEdGraph* G : Blueprint->FunctionGraphs)
        {
            if (G && G->GetName() == GraphName) { TargetGraph = G; break; }
        }
    }
    if (!TargetGraph)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Graph not found: %s"), *GraphName));

    TArray<TSharedPtr<FJsonValue>> NodesArr;
    for (UEdGraphNode* Node : TargetGraph->Nodes)
    {
        if (!Node) continue;

        TSharedPtr<FJsonObject> N = MakeShared<FJsonObject>();
        N->SetStringField(TEXT("node_id"), Node->GetName());
        N->SetStringField(TEXT("node_guid"), Node->NodeGuid.ToString());
        N->SetStringField(TEXT("class"), Node->GetClass()->GetName());
        N->SetStringField(TEXT("title"), Node->GetNodeTitle(ENodeTitleType::FullTitle).ToString());
        N->SetNumberField(TEXT("x"), Node->NodePosX);
        N->SetNumberField(TEXT("y"), Node->NodePosY);

        TArray<TSharedPtr<FJsonValue>> PinsArr;
        for (UEdGraphPin* Pin : Node->Pins)
        {
            if (!Pin) continue;
            TSharedPtr<FJsonObject> P = MakeShared<FJsonObject>();
            P->SetStringField(TEXT("name"), Pin->PinName.ToString());
            P->SetStringField(TEXT("type"), Pin->PinType.PinCategory.ToString());
            P->SetStringField(TEXT("direction"), Pin->Direction == EGPD_Input ? TEXT("Input") : TEXT("Output"));
            P->SetNumberField(TEXT("connections"), Pin->LinkedTo.Num());
            PinsArr.Add(MakeShared<FJsonValueObject>(P));
        }
        N->SetArrayField(TEXT("pins"), PinsArr);
        NodesArr.Add(MakeShared<FJsonValueObject>(N));
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetStringField(TEXT("graph"), GraphName);
    ResultObj->SetNumberField(TEXT("node_count"), NodesArr.Num());
    ResultObj->SetArrayField(TEXT("nodes"), NodesArr);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

// ──────────────────────────────────────────────────────────
// AVA V6: Safe graph editing
// ──────────────────────────────────────────────────────────

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleDisconnectPins(const TSharedPtr<FJsonObject>& Params)
{
    return FBPConnector::DisconnectPins(Params);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleDeleteBlueprintNode(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString NodeID;
    if (!Params->TryGetStringField(TEXT("node_id"), NodeID))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'node_id' parameter"));

    bool bDryRun = false;
    Params->TryGetBoolField(TEXT("dry_run"), bDryRun);

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    FString FunctionName;
    Params->TryGetStringField(TEXT("function_name"), FunctionName);

    UEdGraph* Graph = nullptr;
    if (!FunctionName.IsEmpty())
    {
        for (UEdGraph* G : Blueprint->FunctionGraphs)
        {
            if (G && G->GetName().Contains(FunctionName)) { Graph = G; break; }
        }
    }
    else if (Blueprint->UbergraphPages.Num() > 0)
    {
        Graph = Blueprint->UbergraphPages[0];
    }
    if (!Graph)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Graph not found"));

    UEdGraphNode* NodeToDelete = nullptr;
    for (UEdGraphNode* Node : Graph->Nodes)
    {
        if (Node && (Node->NodeGuid.ToString() == NodeID || Node->GetName() == NodeID))
        {
            NodeToDelete = Node;
            break;
        }
    }
    if (!NodeToDelete)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Node not found: %s"), *NodeID));

    TArray<TSharedPtr<FJsonValue>> BrokenConns;
    for (UEdGraphPin* Pin : NodeToDelete->Pins)
    {
        for (UEdGraphPin* Linked : Pin->LinkedTo)
        {
            TSharedPtr<FJsonObject> C = MakeShared<FJsonObject>();
            C->SetStringField(TEXT("this_pin"), Pin->PinName.ToString());
            C->SetStringField(TEXT("linked_node"), Linked->GetOwningNode()->GetName());
            C->SetStringField(TEXT("linked_pin"), Linked->PinName.ToString());
            BrokenConns.Add(MakeShared<FJsonValueObject>(C));
        }
    }

    if (bDryRun)
    {
        TSharedPtr<FJsonObject> Plan = MakeShared<FJsonObject>();
        Plan->SetStringField(TEXT("action"), TEXT("delete_node"));
        Plan->SetStringField(TEXT("node_id"), NodeID);
        Plan->SetStringField(TEXT("node_title"), NodeToDelete->GetNodeTitle(ENodeTitleType::FullTitle).ToString());
        Plan->SetStringField(TEXT("node_class"), NodeToDelete->GetClass()->GetName());
        Plan->SetArrayField(TEXT("connections_to_break"), BrokenConns);
        Plan->SetNumberField(TEXT("connections_count"), BrokenConns.Num());
        Plan->SetBoolField(TEXT("dry_run"), true);
        Plan->SetBoolField(TEXT("success"), true);
        return Plan;
    }

    FScopedTransaction Transaction(NSLOCTEXT("UnrealMCP", "DeleteBlueprintNode", "MCP: Delete Graph Node"));
    Blueprint->Modify();
    NodeToDelete->BreakAllNodeLinks();
    Graph->RemoveNode(NodeToDelete);
    Graph->NotifyGraphChanged();
    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("deleted_node_id"), NodeID);
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetArrayField(TEXT("broken_connections"), BrokenConns);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleAddEnhancedInputActionNode(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString ActionAssetPath;
    if (!Params->TryGetStringField(TEXT("action_asset_path"), ActionAssetPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'action_asset_path' parameter (e.g. /Game/Input/IA_Jump)"));

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    UObject* ActionAsset = UEditorAssetLibrary::LoadAsset(ActionAssetPath);
    if (!ActionAsset)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("InputAction asset not found at: %s"), *ActionAssetPath));

    UEdGraph* EventGraph = FEpicUnrealMCPCommonUtils::FindOrCreateEventGraph(Blueprint);
    if (!EventGraph)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Could not find or create event graph"));

    FVector2D Position(200.0f, 200.0f);
    if (Params->HasField(TEXT("position")))
    {
        const TArray<TSharedPtr<FJsonValue>>* PosArr;
        if (Params->TryGetArrayField(TEXT("position"), PosArr) && PosArr->Num() >= 2)
            Position = FVector2D((*PosArr)[0]->AsNumber(), (*PosArr)[1]->AsNumber());
    }

    UClass* EnhancedInputActionClass = LoadClass<UK2Node>(nullptr, TEXT("/Script/EnhancedInputEditor.K2Node_EnhancedInputAction"));
    if (!EnhancedInputActionClass)
        EnhancedInputActionClass = LoadClass<UK2Node>(nullptr, TEXT("/Script/EnhancedInput.K2Node_EnhancedInputAction"));
    if (!EnhancedInputActionClass)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("UK2Node_EnhancedInputAction class not found. Ensure the EnhancedInput plugin is enabled."));

    UK2Node* InputNode = NewObject<UK2Node>(EventGraph, EnhancedInputActionClass);
    // Set InputAction property via reflection (avoids compile-time dependency on UK2Node_EnhancedInputAction)
    FProperty* InputActionProperty = EnhancedInputActionClass->FindPropertyByName(TEXT("InputAction"));
    if (FObjectProperty* ObjProp = CastField<FObjectProperty>(InputActionProperty))
    {
        ObjProp->SetObjectPropertyValue_InContainer(InputNode, ActionAsset);
    }
    else
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Could not find 'InputAction' property on node"));
    }
    InputNode->CreateNewGuid();
    InputNode->PostPlacedNewNode();
    InputNode->AllocateDefaultPins();
    InputNode->NodePosX = Position.X;
    InputNode->NodePosY = Position.Y;
    EventGraph->AddNode(InputNode, false, false);

    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("node_id"), InputNode->GetName());
    ResultObj->SetStringField(TEXT("node_guid"), InputNode->NodeGuid.ToString());
    ResultObj->SetStringField(TEXT("action_asset"), ActionAssetPath);
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBlueprintGraphCommands::HandleAddIsValidGuard(const TSharedPtr<FJsonObject>& Params)
{
    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

    FString VariableName;
    if (!Params->TryGetStringField(TEXT("variable_name"), VariableName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'variable_name' parameter"));

    FString FunctionGraph;
    Params->TryGetStringField(TEXT("function_graph"), FunctionGraph);

    UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
    if (!Blueprint)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

    UEdGraph* Graph = nullptr;
    if (!FunctionGraph.IsEmpty())
    {
        for (UEdGraph* G : Blueprint->FunctionGraphs)
            if (G && G->GetName().Contains(FunctionGraph)) { Graph = G; break; }
    }
    else if (Blueprint->UbergraphPages.Num() > 0)
    {
        Graph = Blueprint->UbergraphPages[0];
    }
    if (!Graph)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Graph not found"));

    FVector2D Pos(200.0f, 200.0f);
    if (Params->HasField(TEXT("position")))
    {
        const TArray<TSharedPtr<FJsonValue>>* PosArr;
        if (Params->TryGetArrayField(TEXT("position"), PosArr) && PosArr->Num() >= 2)
            Pos = FVector2D((*PosArr)[0]->AsNumber(), (*PosArr)[1]->AsNumber());
    }

    UK2Node_VariableGet* GetNode = NewObject<UK2Node_VariableGet>(Graph);
    FName VarName(*VariableName);
    GetNode->VariableReference.SetSelfMember(VarName);
    GetNode->CreateNewGuid();
    GetNode->PostPlacedNewNode();
    GetNode->AllocateDefaultPins();
    GetNode->NodePosX = Pos.X;
    GetNode->NodePosY = Pos.Y;
    Graph->AddNode(GetNode, false, false);

    UK2Node_CallFunction* IsValidNode = NewObject<UK2Node_CallFunction>(Graph);
    UFunction* IsValidFunc = UKismetSystemLibrary::StaticClass()->FindFunctionByName(TEXT("IsValid"));
    if (!IsValidFunc)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Could not find UKismetSystemLibrary::IsValid function"));
    }
    IsValidNode->SetFromFunction(IsValidFunc);
    IsValidNode->CreateNewGuid();
    IsValidNode->PostPlacedNewNode();
    IsValidNode->AllocateDefaultPins();
    IsValidNode->NodePosX = Pos.X + 300.0f;
    IsValidNode->NodePosY = Pos.Y;
    Graph->AddNode(IsValidNode, false, false);

    TArray<TSharedPtr<FJsonValue>> WiredConnections;

    UEdGraphPin* GetDataOut = nullptr;
    for (UEdGraphPin* Pin : GetNode->Pins)
        if (Pin && Pin->Direction == EGPD_Output && Pin->PinName != UEdGraphSchema_K2::PN_Then)
            { GetDataOut = Pin; break; }

    UEdGraphPin* IsValidInput = nullptr;
    for (UEdGraphPin* Pin : IsValidNode->Pins)
        if (Pin && Pin->Direction == EGPD_Input && Pin->PinName == UEdGraphSchema_K2::PN_Execute)
            { IsValidInput = Pin; break; }

    UEdGraphPin* IsValidObjectIn = nullptr;
    for (UEdGraphPin* Pin : IsValidNode->Pins)
        if (Pin && Pin->Direction == EGPD_Input && Pin->PinType.PinCategory == UEdGraphSchema_K2::PC_Object)
            { IsValidObjectIn = Pin; break; }

    if (GetDataOut && IsValidObjectIn)
    {
        GetDataOut->MakeLinkTo(IsValidObjectIn);
        TSharedPtr<FJsonObject> C = MakeShared<FJsonObject>();
        C->SetStringField(TEXT("from_node"), GetNode->GetName());
        C->SetStringField(TEXT("from_pin"), GetDataOut->PinName.ToString());
        C->SetStringField(TEXT("to_node"), IsValidNode->GetName());
        C->SetStringField(TEXT("to_pin"), IsValidObjectIn->PinName.ToString());
        WiredConnections.Add(MakeShared<FJsonValueObject>(C));
    }

    FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("get_node_id"), GetNode->GetName());
    ResultObj->SetStringField(TEXT("is_valid_node_id"), IsValidNode->GetName());
    ResultObj->SetStringField(TEXT("variable"), VariableName);
    ResultObj->SetStringField(TEXT("blueprint"), BlueprintName);
    ResultObj->SetArrayField(TEXT("wired_connections"), WiredConnections);
    ResultObj->SetStringField(TEXT("valid_exec_pin"), IsValidNode->Pins.Num() > 0 ? TEXT("then") : TEXT("not_found"));
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}
