#include "Commands/BlueprintGraph/InterfaceManager.h"
#include "Commands/EpicUnrealMCPCommonUtils.h"
#include "Engine/Blueprint.h"
#include "Engine/BlueprintGeneratedClass.h"
#include "Kismet2/BlueprintEditorUtils.h"
#include "Kismet2/KismetEditorUtilities.h"
#include "AssetRegistry/AssetRegistryModule.h"

TSharedPtr<FJsonObject> FInterfaceManager::AddInterface(const TSharedPtr<FJsonObject>& Params)
{
	TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();

	FString BlueprintName;
	if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
	{
		Result->SetBoolField(TEXT("success"), false);
		Result->SetStringField(TEXT("error"), TEXT("Missing 'blueprint_name' parameter"));
		return Result;
	}

	FString InterfacePath;
	if (!Params->TryGetStringField(TEXT("interface_path"), InterfacePath))
	{
		Result->SetBoolField(TEXT("success"), false);
		Result->SetStringField(TEXT("error"), TEXT("Missing 'interface_path' parameter"));
		return Result;
	}

	UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
	if (!Blueprint)
	{
		Result->SetBoolField(TEXT("success"), false);
		Result->SetStringField(TEXT("error"), FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));
		return Result;
	}

	UClass* InterfaceClass = LoadObject<UClass>(nullptr, *InterfacePath);
	if (!InterfaceClass)
	{
		FString ObjectPath = InterfacePath;
		if (!ObjectPath.EndsWith(TEXT("_C")))
		{
			ObjectPath += TEXT("_C");
		}
		InterfaceClass = LoadObject<UClass>(nullptr, *ObjectPath);
	}

	if (!InterfaceClass)
	{
		FAssetRegistryModule& AssetRegistry = FModuleManager::LoadModuleChecked<FAssetRegistryModule>("AssetRegistry");
		FString PackagePath = InterfacePath;
		if (PackagePath.StartsWith(TEXT("/Game/")))
		{
			FString CleanPath = PackagePath;
			CleanPath.RemoveFromEnd(TEXT("_C"));
			InterfaceClass = LoadObject<UClass>(nullptr, *CleanPath);
		}

		if (!InterfaceClass)
		{
			Result->SetBoolField(TEXT("success"), false);
			Result->SetStringField(TEXT("error"), FString::Printf(TEXT("Interface class not found: %s. Try the full path like /Game/Blueprints/Weapons/BP_WeaponInterface.BP_WeaponInterface_C"), *InterfacePath));
			return Result;
		}
	}

	if (!InterfaceClass->HasAnyClassFlags(CLASS_Interface))
	{
		Result->SetBoolField(TEXT("success"), false);
		Result->SetStringField(TEXT("error"), FString::Printf(TEXT("Class is not an interface: %s"), *InterfacePath));
		return Result;
	}

	for (const FBPInterfaceDescription& ExistingInterface : Blueprint->ImplementedInterfaces)
	{
		if (ExistingInterface.Interface == InterfaceClass)
		{
			Result->SetBoolField(TEXT("success"), true);
			Result->SetBoolField(TEXT("already_implemented"), true);
			Result->SetStringField(TEXT("interface"), InterfaceClass->GetName());
			Result->SetStringField(TEXT("message"), TEXT("Interface already implemented"));
			return Result;
		}
	}

	FBPInterfaceDescription NewInterface;
	NewInterface.Interface = InterfaceClass;

	Blueprint->ImplementedInterfaces.Add(NewInterface);
	FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
	Blueprint->MarkPackageDirty();
	FKismetEditorUtilities::CompileBlueprint(Blueprint);

	Result->SetBoolField(TEXT("success"), true);
	Result->SetBoolField(TEXT("already_implemented"), false);
	Result->SetStringField(TEXT("interface"), InterfaceClass->GetName());
	Result->SetStringField(TEXT("blueprint"), Blueprint->GetName());
	Result->SetStringField(TEXT("message"), FString::Printf(TEXT("Interface %s added to %s and compiled"), *InterfaceClass->GetName(), *Blueprint->GetName()));

	return Result;
}

TSharedPtr<FJsonObject> FInterfaceManager::RemoveInterface(const TSharedPtr<FJsonObject>& Params)
{
	TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();

	FString BlueprintName;
	if (!Params->TryGetStringField(TEXT("blueprint_name"), BlueprintName))
	{
		Result->SetBoolField(TEXT("success"), false);
		Result->SetStringField(TEXT("error"), TEXT("Missing 'blueprint_name' parameter"));
		return Result;
	}

	FString InterfacePath;
	if (!Params->TryGetStringField(TEXT("interface_path"), InterfacePath))
	{
		Result->SetBoolField(TEXT("success"), false);
		Result->SetStringField(TEXT("error"), TEXT("Missing 'interface_path' parameter"));
		return Result;
	}

	UBlueprint* Blueprint = FEpicUnrealMCPCommonUtils::FindBlueprint(BlueprintName);
	if (!Blueprint)
	{
		Result->SetBoolField(TEXT("success"), false);
		Result->SetStringField(TEXT("error"), FString::Printf(TEXT("Blueprint not found: %s"), *BlueprintName));
		return Result;
	}

	UClass* InterfaceClass = LoadObject<UClass>(nullptr, *InterfacePath);
	if (!InterfaceClass)
	{
		Result->SetBoolField(TEXT("success"), false);
		Result->SetStringField(TEXT("error"), TEXT("Interface class not found"));
		return Result;
	}

	int32 RemovedCount = 0;
	for (int32 i = Blueprint->ImplementedInterfaces.Num() - 1; i >= 0; i--)
	{
		if (Blueprint->ImplementedInterfaces[i].Interface == InterfaceClass)
		{
			Blueprint->ImplementedInterfaces.RemoveAt(i);
			RemovedCount++;
		}
	}

	if (RemovedCount > 0)
	{
		Blueprint->MarkPackageDirty();
		FBlueprintEditorUtils::MarkBlueprintAsModified(Blueprint);
		FKismetEditorUtilities::CompileBlueprint(Blueprint);

		Result->SetBoolField(TEXT("success"), true);
		Result->SetNumberField(TEXT("removed_count"), RemovedCount);
		Result->SetStringField(TEXT("message"), FString::Printf(TEXT("Removed %d interface(s)"), RemovedCount));
	}
	else
	{
		Result->SetBoolField(TEXT("success"), false);
		Result->SetStringField(TEXT("error"), TEXT("Interface not found in blueprint"));
	}

	return Result;
}
