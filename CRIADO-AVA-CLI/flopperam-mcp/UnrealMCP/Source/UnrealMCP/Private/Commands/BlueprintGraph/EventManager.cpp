#include "Commands/BlueprintGraph/EventManager.h"
#include "Engine/Blueprint.h"
#include "Engine/BlueprintGeneratedClass.h"
#include "Engine/SimpleConstructionScript.h"
#include "Engine/SCS_Node.h"
#include "EdGraph/EdGraph.h"
#include "EdGraphSchema_K2.h"
#include "K2Node_Event.h"
#include "K2Node_CallFunction.h"
#include "K2Node_VariableGet.h"
#include "K2Node_VariableSet.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "Kismet2/KismetEditorUtilities.h"
#include "EditorAssetLibrary.h"

TSharedPtr<FJsonObject> FEventManager::AddEventNode(const TSharedPtr<FJsonObject>& Params)
{
	if (!Params.IsValid())
	{
		return CreateErrorResponse(TEXT("Invalid parameters"));
	}

	FString BlueprintName;
	if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
	{
		return CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));
	}

	FString EventName;
	if (!Params->TryGetStringField(TEXT("event_name"), EventName))
	{
		return CreateErrorResponse(TEXT("Missing 'event_name' parameter"));
	}

	FString InterfaceName;
	bool bIsInterfaceEvent = Params->TryGetStringField(TEXT("interface_name"), InterfaceName) && !InterfaceName.IsEmpty();

	FVector2D Position(0.0f, 0.0f);
	double PosX = 0.0, PosY = 0.0;
	if (Params->TryGetNumberField(TEXT("pos_x"), PosX)) Position.X = static_cast<float>(PosX);
	if (Params->TryGetNumberField(TEXT("pos_y"), PosY)) Position.Y = static_cast<float>(PosY);

	UBlueprint* Blueprint = LoadBlueprint(BlueprintName);
	if (!Blueprint)
	{
		return CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));
	}

	if (Blueprint->UbergraphPages.Num() == 0)
	{
		return CreateErrorResponse(TEXT("Blueprint has no event graph"));
	}

	UEdGraph* Graph = Blueprint->UbergraphPages[0];
	if (!Graph)
	{
		return CreateErrorResponse(TEXT("Failed to get Blueprint event graph"));
	}

	UK2Node_Event* EventNode = nullptr;

	if (bIsInterfaceEvent)
	{
		UClass* InterfaceClass = nullptr;

		FString CleanPath = InterfaceName;
		if (!CleanPath.EndsWith(TEXT("_C")))
		{
			CleanPath += TEXT("_C");
		}
		InterfaceClass = LoadObject<UClass>(nullptr, *CleanPath);

		if (!InterfaceClass)
		{
			FString ShortPath = InterfaceName;
			if (ShortPath.EndsWith(TEXT("_C")))
				ShortPath = ShortPath.LeftChop(2);
			InterfaceClass = LoadObject<UClass>(nullptr, *ShortPath);
		}

		if (!InterfaceClass)
		{
			return CreateErrorResponse(FString::Printf(TEXT("Interface class not found: %s (tried: %s)"),
				*InterfaceName, *CleanPath));
		}

		UFunction* InterfaceFunc = InterfaceClass->FindFunctionByName(FName(*EventName));
		if (!InterfaceFunc)
		{
			return CreateErrorResponse(FString::Printf(TEXT("Function '%s' not found in interface %s"), *EventName, *InterfaceName));
		}

		EventNode = NewObject<UK2Node_Event>(Graph);
		EventNode->EventReference.SetExternalMember(FName(*EventName), InterfaceClass);
		EventNode->NodePosX = static_cast<int32>(Position.X);
		EventNode->NodePosY = static_cast<int32>(Position.Y);
		Graph->AddNode(EventNode, true);
		EventNode->PostPlacedNewNode();
		EventNode->AllocateDefaultPins();

		UE_LOG(LogTemp, Display, TEXT("Created interface event '%s' from interface '%s' (ID: %s)"),
			*EventName, *CleanPath, *EventNode->NodeGuid.ToString());
	}
	else
	{
		UK2Node_Event* ExistingNode = FindExistingEventNode(Graph, EventName);
		if (ExistingNode)
		{
			return CreateSuccessResponse(ExistingNode);
		}

		EventNode = CreateEventNode(Graph, EventName, Position);
		if (!EventNode)
		{
			return CreateErrorResponse(FString::Printf(TEXT("Failed to create event node: %s"), *EventName));
		}
	}

	Graph->NotifyGraphChanged();
	FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

	return CreateSuccessResponse(EventNode);
}

UK2Node_Event* FEventManager::CreateEventNode(UEdGraph* Graph, const FString& EventName, const FVector2D& Position)
{
	if (!Graph) return nullptr;

	UBlueprint* Blueprint = FBlueprintEditorUtils::FindBlueprintForGraph(Graph);
	if (!Blueprint) return nullptr;

	UK2Node_Event* ExistingNode = FindExistingEventNode(Graph, EventName);
	if (ExistingNode)
	{
		UE_LOG(LogTemp, Display, TEXT("Using existing event node '%s' (ID: %s)"),
			*EventName, *ExistingNode->NodeGuid.ToString());
		return ExistingNode;
	}

	UClass* BlueprintClass = Blueprint->GeneratedClass;
	if (!BlueprintClass)
	{
		UE_LOG(LogTemp, Error, TEXT("Blueprint has no generated class"));
		return nullptr;
	}

	UFunction* EventFunction = BlueprintClass->FindFunctionByName(FName(*EventName));
	if (!EventFunction)
	{
		UE_LOG(LogTemp, Error, TEXT("Failed to find function for event name: %s"), *EventName);
		return nullptr;
	}

	UK2Node_Event* EventNode = NewObject<UK2Node_Event>(Graph);
	EventNode->EventReference.SetExternalMember(FName(*EventName), BlueprintClass);
	EventNode->NodePosX = static_cast<int32>(Position.X);
	EventNode->NodePosY = static_cast<int32>(Position.Y);
	Graph->AddNode(EventNode, true);
	EventNode->PostPlacedNewNode();
	EventNode->AllocateDefaultPins();

	UE_LOG(LogTemp, Display, TEXT("Created new event node '%s' (ID: %s)"),
		*EventName, *EventNode->NodeGuid.ToString());

	return EventNode;
}

UK2Node_Event* FEventManager::FindExistingEventNode(UEdGraph* Graph, const FString& EventName)
{
	if (!Graph) return nullptr;
	for (UEdGraphNode* Node : Graph->Nodes)
	{
		UK2Node_Event* EventNode = Cast<UK2Node_Event>(Node);
		if (EventNode && EventNode->EventReference.GetMemberName() == FName(*EventName))
		{
			return EventNode;
		}
	}
	return nullptr;
}

UBlueprint* FEventManager::LoadBlueprint(const FString& BlueprintName)
{
	return FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
}

// ──── add_get_node: Create a variable Get node in the graph ────
TSharedPtr<FJsonObject> FEventManager::AddGetNode(const TSharedPtr<FJsonObject>& Params)
{
	FString BlueprintName;
	if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
		return CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

	FString VariableName;
	if (!Params->TryGetStringField(TEXT("variable_name"), VariableName))
		return CreateErrorResponse(TEXT("Missing 'variable_name' parameter"));

	FVector2D Position(0.0f, 0.0f);
	double PosX = 0.0, PosY = 0.0;
	if (Params->TryGetNumberField(TEXT("pos_x"), PosX)) Position.X = static_cast<float>(PosX);
	if (Params->TryGetNumberField(TEXT("pos_y"), PosY)) Position.Y = static_cast<float>(PosY);

	UBlueprint* Blueprint = LoadBlueprint(BlueprintName);
	if (!Blueprint)
		return CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

	if (Blueprint->UbergraphPages.Num() == 0)
		return CreateErrorResponse(TEXT("Blueprint has no event graph"));

	UEdGraph* Graph = Blueprint->UbergraphPages[0];
	if (!Graph)
		return CreateErrorResponse(TEXT("Failed to get Blueprint event graph"));

	UK2Node_VariableGet* GetNode = NewObject<UK2Node_VariableGet>(Graph);
	GetNode->VariableReference.SetSelfMember(FName(*VariableName));
	GetNode->NodePosX = static_cast<int32>(Position.X);
	GetNode->NodePosY = static_cast<int32>(Position.Y);
	Graph->AddNode(GetNode, true);
	GetNode->PostPlacedNewNode();
	GetNode->AllocateDefaultPins();

	Graph->NotifyGraphChanged();
	FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

	TSharedPtr<FJsonObject> Response = MakeShareable(new FJsonObject);
	Response->SetBoolField(TEXT("success"), true);
	Response->SetStringField(TEXT("node_id"), GetNode->NodeGuid.ToString());
	Response->SetStringField(TEXT("variable_name"), VariableName);
	Response->SetNumberField(TEXT("pos_x"), GetNode->NodePosX);
	Response->SetNumberField(TEXT("pos_y"), GetNode->NodePosY);
	return Response;
}

// ──── call_function_on_object: Call a function on a target object reference ────
// V6: Supports chain target ("WeaponSystem.CurrentWeapon") with auto-wired self pins
TSharedPtr<FJsonObject> FEventManager::AddCallFunctionOnObject(const TSharedPtr<FJsonObject>& Params)
{
	FString BlueprintName;
	if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
		return CreateErrorResponse(TEXT("Missing 'blueprint_name' parameter"));

	FString FunctionName;
	if (!Params->TryGetStringField(TEXT("function_name"), FunctionName))
		return CreateErrorResponse(TEXT("Missing 'function_name' parameter"));

	FString TargetClassName;
	if (!Params->TryGetStringField(TEXT("target_class"), TargetClassName))
		return CreateErrorResponse(TEXT("Missing 'target_class' parameter"));

	// NEW: Optional chain target (e.g. "WeaponSystem.CurrentWeapon")
	FString Target;
	Params->TryGetStringField(TEXT("target"), Target);

	// NEW: Optional function graph name (to target a function graph, not EventGraph)
	FString GraphFunctionName;
	Params->TryGetStringField(TEXT("function_graph"), GraphFunctionName);

	FVector2D Position(0.0f, 0.0f);
	double PosX = 0.0, PosY = 0.0;
	if (Params->TryGetNumberField(TEXT("pos_x"), PosX)) Position.X = static_cast<float>(PosX);
	if (Params->TryGetNumberField(TEXT("pos_y"), PosY)) Position.Y = static_cast<float>(PosY);

	UBlueprint* Blueprint = LoadBlueprint(BlueprintName);
	if (!Blueprint)
		return CreateErrorResponse(FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));

	// Resolve graph (support function graph or event graph)
	UEdGraph* Graph = nullptr;

	if (!GraphFunctionName.IsEmpty())
	{
		for (UEdGraph* FuncGraph : Blueprint->FunctionGraphs)
		{
			if (FuncGraph && (FuncGraph->GetFName().ToString() == GraphFunctionName ||
							  (FuncGraph->GetOuter() && FuncGraph->GetOuter()->GetFName().ToString() == GraphFunctionName)))
			{
				Graph = FuncGraph;
				break;
			}
		}
		if (!Graph)
		{
			for (UEdGraph* FuncGraph : Blueprint->FunctionGraphs)
			{
				if (FuncGraph && FuncGraph->GetFName().ToString().Contains(GraphFunctionName))
				{
					Graph = FuncGraph;
					break;
				}
			}
		}
		if (!Graph)
			return CreateErrorResponse(FString::Printf(TEXT("Function graph not found: %s"), *GraphFunctionName));
	}
	else
	{
		if (Blueprint->UbergraphPages.Num() == 0)
			return CreateErrorResponse(TEXT("Blueprint has no event graph"));
		Graph = Blueprint->UbergraphPages[0];
		if (!Graph)
			return CreateErrorResponse(TEXT("Failed to get Blueprint event graph"));
	}

	// Load target class
	UClass* TargetClass = LoadObject<UClass>(nullptr, *TargetClassName);
	if (!TargetClass)
	{
		FString AltPath = TargetClassName + TEXT("_C");
		TargetClass = LoadObject<UClass>(nullptr, *AltPath);
	}
	if (!TargetClass)
		return CreateErrorResponse(FString::Printf(TEXT("Target class not found: %s"), *TargetClassName));

	UFunction* TargetFunction = TargetClass->FindFunctionByName(FName(*FunctionName));
	if (!TargetFunction)
		return CreateErrorResponse(FString::Printf(TEXT("Function '%s' not found in class %s"), *FunctionName, *TargetClassName));

	// ──── V6: Chain support ────
	TArray<TSharedPtr<FJsonObject>> ChainNodeJsons;
	UK2Node* LastChainNode = nullptr;
	FString LastChainPinName;

	if (!Target.IsEmpty())
	{
		TArray<FString> Parts;
		Target.ParseIntoArray(Parts, TEXT("."), true);

		if (Parts.Num() > 0)
		{
			// Step 1: First element is a self-member (component or variable on this BP)
			UK2Node_VariableGet* FirstGet = NewObject<UK2Node_VariableGet>(Graph);
			FirstGet->VariableReference.SetSelfMember(FName(*Parts[0]));
			FirstGet->NodePosX = static_cast<int32>(Position.X);
			FirstGet->NodePosY = static_cast<int32>(Position.Y);
			Graph->AddNode(FirstGet, true);
			FirstGet->PostPlacedNewNode();
			FirstGet->AllocateDefaultPins();
			LastChainNode = FirstGet;
			LastChainPinName = Parts[0];

			TSharedPtr<FJsonObject> FirstJson = MakeShareable(new FJsonObject);
			FirstJson->SetStringField(TEXT("node_id"), FirstGet->NodeGuid.ToString());
			FirstJson->SetStringField(TEXT("type"), TEXT("VariableGet"));
			FirstJson->SetStringField(TEXT("variable"), Parts[0]);
			FirstJson->SetNumberField(TEXT("pos_x"), FirstGet->NodePosX);
			FirstJson->SetNumberField(TEXT("pos_y"), FirstGet->NodePosY);
			ChainNodeJsons.Add(FirstJson);

			// Step 2-3: Subsequent elements - drill down via ExternalMember
			for (int32 i = 1; i < Parts.Num(); i++)
			{
				// Find the class of the previous node's output to scope the variable lookup
				UClass* ElementClass = nullptr;

				// Try to resolve from pin type
				UEdGraphPin* PrevPin = LastChainNode->FindPin(FName(*LastChainPinName));
				if (PrevPin && PrevPin->PinType.PinSubCategoryObject.IsValid())
				{
					ElementClass = Cast<UClass>(PrevPin->PinType.PinSubCategoryObject.Get());
				}

				// Fallback: try to find from component template
				if (!ElementClass && i == 1 && Blueprint->SimpleConstructionScript)
				{
					const TArray<USCS_Node*>& SCSNodes = Blueprint->SimpleConstructionScript->GetAllNodes();
					for (USCS_Node* SCSNode : SCSNodes)
					{
						if (SCSNode && SCSNode->GetVariableName().ToString() == Parts[0])
						{
							if (SCSNode->ComponentClass)
							{
								ElementClass = SCSNode->ComponentClass;
							}
							break;
						}
					}
				}

				if (ElementClass)
				{
					// Find the property on the target class
					FProperty* MemberProp = FindFProperty<FProperty>(ElementClass, FName(*Parts[i]));
					if (MemberProp)
					{
						UK2Node_VariableGet* SubGet = NewObject<UK2Node_VariableGet>(Graph);
						SubGet->VariableReference.SetFromField<FProperty>(MemberProp, false); // bSelfContext = false → creates target pin
						SubGet->NodePosX = static_cast<int32>(Position.X + (i * 250.0));
						SubGet->NodePosY = static_cast<int32>(Position.Y);
						Graph->AddNode(SubGet, true);
						SubGet->PostPlacedNewNode();
						SubGet->AllocateDefaultPins();

						// Wire previous output to this node's target/Self pin
						if (PrevPin)
						{
							UEdGraphPin* TargetPin = SubGet->FindPin(UEdGraphSchema_K2::PN_Self);
							if (TargetPin)
							{
								PrevPin->MakeLinkTo(TargetPin);
							}
						}

						LastChainNode = SubGet;
						LastChainPinName = Parts[i];

						TSharedPtr<FJsonObject> SubJson = MakeShareable(new FJsonObject);
						SubJson->SetStringField(TEXT("node_id"), SubGet->NodeGuid.ToString());
						SubJson->SetStringField(TEXT("type"), TEXT("VariableGet"));
						SubJson->SetStringField(TEXT("variable"), Parts[i]);
						SubJson->SetStringField(TEXT("from_class"), ElementClass->GetName());
						SubJson->SetNumberField(TEXT("pos_x"), SubGet->NodePosX);
						SubJson->SetNumberField(TEXT("pos_y"), SubGet->NodePosY);
						ChainNodeJsons.Add(SubJson);
					}
					else
					{
						return CreateErrorResponse(FString::Printf(TEXT("Property '%s' not found on class '%s'"), *Parts[i], *ElementClass->GetName()));
					}
				}
				else
				{
					return CreateErrorResponse(FString::Printf(TEXT("Could not resolve class for part '%s' in chain"), *Parts[i-1]));
				}
			}
		}
	}

	// ──── Create CallFunction node ────
	UK2Node_CallFunction* CallNode = NewObject<UK2Node_CallFunction>(Graph);
	CallNode->SetFromFunction(TargetFunction);
	CallNode->NodePosX = static_cast<int32>(Position.X + (ChainNodeJsons.Num() * 250.0));
	CallNode->NodePosY = static_cast<int32>(Position.Y);
	Graph->AddNode(CallNode, true);
	CallNode->PostPlacedNewNode();
	CallNode->AllocateDefaultPins();

	// Wire self pin if we have chain nodes (V6: auto-wire!)
	if (LastChainNode)
	{
		UEdGraphPin* SelfPin = CallNode->FindPin(UEdGraphSchema_K2::PN_Self);
		UEdGraphPin* LastPin = LastChainNode->FindPin(FName(*LastChainPinName));
		if (SelfPin && LastPin)
		{
			LastPin->MakeLinkTo(SelfPin);
		}
	}

	Graph->NotifyGraphChanged();
	FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);

	// ──── Response ────
	TSharedPtr<FJsonObject> Response = MakeShareable(new FJsonObject);
	Response->SetBoolField(TEXT("success"), true);
	Response->SetStringField(TEXT("call_node_id"), CallNode->NodeGuid.ToString());
	Response->SetStringField(TEXT("function_name"), FunctionName);
	Response->SetStringField(TEXT("target_class"), TargetClassName);

	TArray<TSharedPtr<FJsonValue>> ChainArr;
	for (const auto& ChainJson : ChainNodeJsons)
	{
		ChainArr.Add(MakeShareable(new FJsonValueObject(ChainJson)));
	}
	if (ChainArr.Num() > 0)
	{
		Response->SetArrayField(TEXT("chain_nodes"), ChainArr);
		Response->SetBoolField(TEXT("self_pin_wired"), true);
	}
	Response->SetNumberField(TEXT("pos_x"), CallNode->NodePosX);
	Response->SetNumberField(TEXT("pos_y"), CallNode->NodePosY);

	return Response;
}

TSharedPtr<FJsonObject> FEventManager::CreateSuccessResponse(const UK2Node_Event* EventNode)
{
	TSharedPtr<FJsonObject> Response = MakeShareable(new FJsonObject);
	Response->SetBoolField(TEXT("success"), true);
	Response->SetStringField(TEXT("node_id"), EventNode->NodeGuid.ToString());
	Response->SetStringField(TEXT("event_name"), EventNode->EventReference.GetMemberName().ToString());
	Response->SetNumberField(TEXT("pos_x"), EventNode->NodePosX);
	Response->SetNumberField(TEXT("pos_y"), EventNode->NodePosY);
	return Response;
}

TSharedPtr<FJsonObject> FEventManager::CreateErrorResponse(const FString& ErrorMessage)
{
	TSharedPtr<FJsonObject> Response = MakeShareable(new FJsonObject);
	Response->SetBoolField(TEXT("success"), false);
	Response->SetStringField(TEXT("error"), ErrorMessage);
	return Response;
}
