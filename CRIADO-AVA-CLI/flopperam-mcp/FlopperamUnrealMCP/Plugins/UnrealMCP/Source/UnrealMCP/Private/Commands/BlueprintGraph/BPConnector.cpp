#include "Commands/BlueprintGraph/BPConnector.h"
#include "Commands/EpicUnrealMCPCommonUtils.h"
#include "Engine/Blueprint.h"
#include "K2Node.h"
#include "EdGraph/EdGraph.h"
#include "EdGraph/EdGraphPin.h"
#include "EdGraphSchema_K2.h"
#include "Kismet2/KismetEditorUtilities.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "EditorAssetLibrary.h"
#include "ScopedTransaction.h"

TSharedPtr<FJsonObject> FBPConnector::ConnectNodes(const TSharedPtr<FJsonObject>& Params)
{
    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();

    // Extraire paramètres
    FString BlueprintName = Params->GetStringField(TEXT("blueprint_name"));
    FString SourceNodeId = Params->GetStringField(TEXT("source_node_id"));
    FString SourcePinName = Params->GetStringField(TEXT("source_pin_name"));
    FString TargetNodeId = Params->GetStringField(TEXT("target_node_id"));
    FString TargetPinName = Params->GetStringField(TEXT("target_pin_name"));

    bool bDryRun = false;
    Params->TryGetBoolField(TEXT("dry_run"), bDryRun);

    FString FunctionName;
    Params->TryGetStringField(TEXT("function_name"), FunctionName);

    // Charger Blueprint - handle both full paths and simple names
    UBlueprint* Blueprint = nullptr;
    FString BlueprintPath = BlueprintName;

    // If no path prefix, assume /Game/Blueprints/
    if (!BlueprintPath.StartsWith(TEXT("/")))
    {
        BlueprintPath = TEXT("/Game/Blueprints/") + BlueprintPath;
    }

    // Add .Blueprint suffix if not present
    if (!BlueprintPath.Contains(TEXT(".")))
    {
        BlueprintPath += TEXT(".") + FPaths::GetBaseFilename(BlueprintPath);
    }

    // Try to load the Blueprint
    Blueprint = LoadObject<UBlueprint>(nullptr, *BlueprintPath);

    // If not found, try with UEditorAssetLibrary
    if (!Blueprint)
    {
        FString AssetPath = BlueprintPath;
        if (UEditorAssetLibrary::DoesAssetExist(AssetPath))
        {
            UObject* Asset = UEditorAssetLibrary::LoadAsset(AssetPath);
            Blueprint = Cast<UBlueprint>(Asset);
        }
    }

    if (!Blueprint)
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), TEXT("Blueprint not found"));
        return Result;
    }

    // Get graph
    UEdGraph* Graph = nullptr;

    if (!FunctionName.IsEmpty())
    {
        // Strategy 1: Try exact name match with GetFName()
        for (UEdGraph* FuncGraph : Blueprint->FunctionGraphs)
        {
            if (FuncGraph && (FuncGraph->GetFName().ToString() == FunctionName ||
                              (FuncGraph->GetOuter() && FuncGraph->GetOuter()->GetFName().ToString() == FunctionName)))
            {
                Graph = FuncGraph;
                break;
            }
        }

        // Strategy 2: Fallback - partial match for auto-generated names
        if (!Graph)
        {
            for (UEdGraph* FuncGraph : Blueprint->FunctionGraphs)
            {
                if (FuncGraph && FuncGraph->GetFName().ToString().Contains(FunctionName))
                {
                    Graph = FuncGraph;
                    break;
                }
            }
        }

        if (!Graph)
        {
            Result->SetBoolField(TEXT("success"), false);
            Result->SetStringField(TEXT("error"), FString::Printf(TEXT("Function graph not found: %s"), *FunctionName));
            return Result;
        }
    }
    else
    {
        // Use event graph if no function specified
        if (Blueprint->UbergraphPages.Num() == 0)
        {
            Result->SetBoolField(TEXT("success"), false);
            Result->SetStringField(TEXT("error"), TEXT("Blueprint has no event graph"));
            return Result;
        }

        Graph = Blueprint->UbergraphPages[0];
    }

    if (!Graph)
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), TEXT("Graph not found"));
        return Result;
    }

    // Find nodes
    UK2Node* SourceNode = FindNodeById(Graph, SourceNodeId);
    UK2Node* TargetNode = FindNodeById(Graph, TargetNodeId);

    if (!SourceNode || !TargetNode)
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), TEXT("Node not found"));
        return Result;
    }

    // Trouver pins
    UEdGraphPin* SourcePin = FindPinByName(SourceNode, SourcePinName, EGPD_Output);
    UEdGraphPin* TargetPin = FindPinByName(TargetNode, TargetPinName, EGPD_Input);

    if (!SourcePin || !TargetPin)
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), TEXT("Pin not found"));
        return Result;
    }

    // Validate compatibility
    if (!ArePinsCompatible(SourcePin, TargetPin))
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), TEXT("Pins not compatible"));
        return Result;
    }

    if (bDryRun)
    {
        Result->SetBoolField(TEXT("success"), true);
        Result->SetBoolField(TEXT("dry_run"), true);
        TSharedPtr<FJsonObject> Plan = MakeShared<FJsonObject>();
        Plan->SetStringField(TEXT("source_node"), SourceNodeId);
        Plan->SetStringField(TEXT("source_pin"), SourcePinName);
        Plan->SetStringField(TEXT("target_node"), TargetNodeId);
        Plan->SetStringField(TEXT("target_pin"), TargetPinName);
        Plan->SetStringField(TEXT("connection_type"), SourcePin->PinType.PinCategory.ToString());
        Result->SetObjectField(TEXT("planned_connection"), Plan);
        return Result;
    }

    // Create connection
    FScopedTransaction Transaction(NSLOCTEXT("UnrealMCP", "ConnectGraphNodes", "MCP: Connect Graph Nodes"));
    Blueprint->Modify();
    SourcePin->MakeLinkTo(TargetPin);

    // Recompile
    Blueprint->MarkPackageDirty();
    FKismetEditorUtilities::CompileBlueprint(Blueprint);

    // Return
    Result->SetBoolField(TEXT("success"), true);

    TSharedPtr<FJsonObject> ConnectionInfo = MakeShared<FJsonObject>();
    ConnectionInfo->SetStringField(TEXT("source_node"), SourceNodeId);
    ConnectionInfo->SetStringField(TEXT("source_pin"), SourcePinName);
    ConnectionInfo->SetStringField(TEXT("target_node"), TargetNodeId);
    ConnectionInfo->SetStringField(TEXT("target_pin"), TargetPinName);
    ConnectionInfo->SetStringField(TEXT("connection_type"), SourcePin->PinType.PinCategory.ToString());

    Result->SetObjectField(TEXT("connection"), ConnectionInfo);

    return Result;
}

UK2Node* FBPConnector::FindNodeById(UEdGraph* Graph, const FString& NodeId)
{
    if (!Graph)
    {
        return nullptr;
    }

    for (UEdGraphNode* Node : Graph->Nodes)
    {
        if (!Node)
        {
            continue;
        }

        // Try matching by NodeGuid first
        if (Node->NodeGuid.ToString().Equals(NodeId, ESearchCase::IgnoreCase))
        {
            UK2Node* K2Node = Cast<UK2Node>(Node);
            return K2Node;  // Return even if nullptr (caller will handle)
        }

        // Try matching by GetName()
        if (Node->GetName().Equals(NodeId, ESearchCase::IgnoreCase))
        {
            UK2Node* K2Node = Cast<UK2Node>(Node);
            return K2Node;  // Return even if nullptr (caller will handle)
        }
    }

    return nullptr;
}

UEdGraphPin* FBPConnector::FindPinByName(UK2Node* Node, const FString& PinName, EEdGraphPinDirection Direction)
{
    for (UEdGraphPin* Pin : Node->Pins)
    {
        if (Pin->PinName.ToString() == PinName && Pin->Direction == Direction)
        {
            return Pin;
        }
    }
    return nullptr;
}

bool FBPConnector::ArePinsCompatible(UEdGraphPin* SourcePin, UEdGraphPin* TargetPin)
{
    if (SourcePin->Direction != EGPD_Output || TargetPin->Direction != EGPD_Input)
    {
        return false;
    }

    const UEdGraphSchema_K2* K2Schema = GetDefault<UEdGraphSchema_K2>();
    if (K2Schema)
    {
        return K2Schema->CanCreateConnection(SourcePin, TargetPin).Response != ECanCreateConnectionResponse::CONNECT_RESPONSE_DISALLOW;
    }

    return SourcePin->PinType.PinCategory == TargetPin->PinType.PinCategory;
}

TSharedPtr<FJsonObject> FBPConnector::DisconnectPins(const TSharedPtr<FJsonObject>& Params)
{
    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();

    FString BlueprintName;
    if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), TEXT("Missing 'blueprint_name' parameter"));
        return Result;
    }

    FString NodeId;
    if (!Params->TryGetStringField(TEXT("node_id"), NodeId))
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), TEXT("Missing 'node_id' parameter"));
        return Result;
    }

    FString PinName;
    if (!Params->TryGetStringField(TEXT("pin_name"), PinName))
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), TEXT("Missing 'pin_name' parameter"));
        return Result;
    }

    bool bAllPins = false;
    Params->TryGetBoolField(TEXT("all_pins"), bAllPins);
    bool bDryRun = false;
    Params->TryGetBoolField(TEXT("dry_run"), bDryRun);

    FString BlueprintPath = BlueprintName;
    if (!BlueprintPath.StartsWith(TEXT("/")))
        BlueprintPath = TEXT("/Game/Blueprints/") + BlueprintPath;
    if (!BlueprintPath.Contains(TEXT(".")))
        BlueprintPath += TEXT(".") + FPaths::GetBaseFilename(BlueprintPath);

    UBlueprint* Blueprint = LoadObject<UBlueprint>(nullptr, *BlueprintPath);
    if (!Blueprint && UEditorAssetLibrary::DoesAssetExist(BlueprintPath))
        Blueprint = Cast<UBlueprint>(UEditorAssetLibrary::LoadAsset(BlueprintPath));
    if (!Blueprint)
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), TEXT("Blueprint not found"));
        return Result;
    }

    FString FunctionName;
    Params->TryGetStringField(TEXT("function_name"), FunctionName);

    UEdGraph* Graph = nullptr;
    if (!FunctionName.IsEmpty())
    {
        for (UEdGraph* G : Blueprint->FunctionGraphs)
            if (G && G->GetName().Contains(FunctionName)) { Graph = G; break; }
    }
    else if (Blueprint->UbergraphPages.Num() > 0)
    {
        Graph = Blueprint->UbergraphPages[0];
    }
    if (!Graph)
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), TEXT("Graph not found"));
        return Result;
    }

    UEdGraphNode* TargetNode = nullptr;
    for (UEdGraphNode* Node : Graph->Nodes)
    {
        if (Node && (Node->NodeGuid.ToString() == NodeId || Node->GetName() == NodeId))
            { TargetNode = Node; break; }
    }
    if (!TargetNode)
    {
        Result->SetBoolField(TEXT("success"), false);
        Result->SetStringField(TEXT("error"), FString::Printf(TEXT("Node not found: %s"), *NodeId));
        return Result;
    }

    TArray<TSharedPtr<FJsonValue>> BrokenConns;

    if (bAllPins)
    {
        for (UEdGraphPin* Pin : TargetNode->Pins)
        {
            if (!Pin || Pin->PinName.ToString() != PinName) continue;
            TArray<UEdGraphPin*> Links = Pin->LinkedTo;
            for (UEdGraphPin* Linked : Links)
            {
                TSharedPtr<FJsonObject> C = MakeShared<FJsonObject>();
                C->SetStringField(TEXT("this_pin"), Pin->PinName.ToString());
                C->SetStringField(TEXT("linked_node"), Linked->GetOwningNode()->GetName());
                C->SetStringField(TEXT("linked_pin"), Linked->PinName.ToString());
                BrokenConns.Add(MakeShared<FJsonValueObject>(C));
                if (!bDryRun)
                {
                    Pin->BreakLinkTo(Linked);
                }
            }
            break;
        }
    }
    else
    {
        UEdGraphPin* PinToBreak = nullptr;
        for (UEdGraphPin* Pin : TargetNode->Pins)
        {
            if (Pin && Pin->PinName.ToString() == PinName) { PinToBreak = Pin; break; }
        }
        if (!PinToBreak)
        {
            Result->SetBoolField(TEXT("success"), false);
            Result->SetStringField(TEXT("error"), FString::Printf(TEXT("Pin not found: %s on node %s"), *PinName, *NodeId));
            return Result;
        }

        TArray<UEdGraphPin*> Links = PinToBreak->LinkedTo;
        for (UEdGraphPin* Linked : Links)
        {
            TSharedPtr<FJsonObject> C = MakeShared<FJsonObject>();
            C->SetStringField(TEXT("this_pin"), PinToBreak->PinName.ToString());
            C->SetStringField(TEXT("linked_node"), Linked->GetOwningNode()->GetName());
            C->SetStringField(TEXT("linked_pin"), Linked->PinName.ToString());
            BrokenConns.Add(MakeShared<FJsonValueObject>(C));
            if (!bDryRun)
            {
                PinToBreak->BreakLinkTo(Linked);
            }
        }
    }

    if (!bDryRun)
    {
        Blueprint->Modify();
        FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
        FKismetEditorUtilities::CompileBlueprint(Blueprint);
    }

    Result->SetBoolField(TEXT("success"), true);
    Result->SetStringField(TEXT("node_id"), NodeId);
    Result->SetStringField(TEXT("pin_name"), PinName);
    Result->SetNumberField(TEXT("broken_connections"), BrokenConns.Num());
    Result->SetArrayField(TEXT("broken"), BrokenConns);
    Result->SetBoolField(TEXT("dry_run"), bDryRun);
    return Result;
}