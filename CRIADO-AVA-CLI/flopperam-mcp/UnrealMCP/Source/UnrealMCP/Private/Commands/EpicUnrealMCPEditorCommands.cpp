#include "Commands/EpicUnrealMCPEditorCommands.h"
#include "Commands/EpicUnrealMCPCommonUtils.h"
#include "Editor.h"
#include "EditorViewportClient.h"
#include "LevelEditorViewport.h"
#include "ImageUtils.h"
#include "HighResScreenshot.h"
#include "Engine/GameViewportClient.h"
#include "Misc/FileHelper.h"
#include "GameFramework/Actor.h"
#include "Engine/Selection.h"
#include "Kismet/GameplayStatics.h"
#include "Engine/StaticMeshActor.h"
#include "Engine/DirectionalLight.h"
#include "Engine/PointLight.h"
#include "Engine/SpotLight.h"
#include "Camera/CameraActor.h"
#include "Components/StaticMeshComponent.h"
#include "Components/SkeletalMeshComponent.h"
#include "EditorSubsystem.h"
#include "Subsystems/EditorActorSubsystem.h"
#include "Engine/Blueprint.h"
#include "Engine/BlueprintGeneratedClass.h"
#include "EditorAssetLibrary.h"
#include "AssetRegistry/AssetRegistryModule.h"
#include "UObject/ConstructorHelpers.h"
#include "Commands/EpicUnrealMCPBlueprintCommands.h"
#include "Blueprint/UserWidget.h"
#include "WidgetBlueprint.h"
#include "Blueprint/WidgetBlueprintGeneratedClass.h"
#include "Interfaces/IPluginManager.h"
#include "GameMapsSettings.h"
#include "GameFramework/InputSettings.h"
#include "Misc/EngineVersion.h"
#include "EngineUtils.h"

FEpicUnrealMCPEditorCommands::FEpicUnrealMCPEditorCommands()
{
}

FDelegateHandle FEpicUnrealMCPEditorCommands::PieEndDelegateHandle;
bool FEpicUnrealMCPEditorCommands::bPieStopRequested = false;
bool FEpicUnrealMCPEditorCommands::bPieEndDelegateFired = false;

void FEpicUnrealMCPEditorCommands::InitializePieTracking()
{
    if (PieEndDelegateHandle.IsValid()) return;
    PieEndDelegateHandle = FEditorDelegates::EndPIE.AddStatic(&FEpicUnrealMCPEditorCommands::OnEndPIE);
    UE_LOG(LogTemp, Display, TEXT("MCP EditorCommands: Registered EndPIE delegate for PIE lifecycle tracking"));
}

void FEpicUnrealMCPEditorCommands::ShutdownPieTracking()
{
    if (PieEndDelegateHandle.IsValid())
    {
        FEditorDelegates::EndPIE.Remove(PieEndDelegateHandle);
        PieEndDelegateHandle.Reset();
        UE_LOG(LogTemp, Display, TEXT("MCP EditorCommands: Unregistered EndPIE delegate"));
    }
    bPieStopRequested = false;
    bPieEndDelegateFired = false;
}

void FEpicUnrealMCPEditorCommands::OnEndPIE(bool bIsSimulating)
{
    bPieEndDelegateFired = true;
    bPieStopRequested = false;
    UE_LOG(LogTemp, Display, TEXT("MCP EditorCommands: EndPIE delegate fired (simulating=%d)"), bIsSimulating);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleCommand(const FString& CommandType, const TSharedPtr<FJsonObject>& Params)
{
    // Actor manipulation commands
    if (CommandType == TEXT("get_actors_in_level"))
    {
        return HandleGetActorsInLevel(Params);
    }
    else if (CommandType == TEXT("find_actors_by_name"))
    {
        return HandleFindActorsByName(Params);
    }
    else if (CommandType == TEXT("spawn_actor"))
    {
        return HandleSpawnActor(Params);
    }
    else if (CommandType == TEXT("delete_actor"))
    {
        return HandleDeleteActor(Params);
    }
    else if (CommandType == TEXT("set_actor_transform"))
    {
        return HandleSetActorTransform(Params);
    }
    // Blueprint actor spawning
    else if (CommandType == TEXT("spawn_blueprint_actor"))
    {
        return HandleSpawnBlueprintActor(Params);
    }
    // AVA ADDITION: Actor attachment
    else if (CommandType == TEXT("attach_actor_to_socket"))
    {
        return HandleAttachActorToSocket(Params);
    }
    // AVA V4: Asset discovery commands
    else if (CommandType == TEXT("search_assets"))
    {
        return HandleSearchAssets(Params);
    }
    else if (CommandType == TEXT("get_asset_details"))
    {
        return HandleGetAssetDetails(Params);
    }
    else if (CommandType == TEXT("list_assets_in_path"))
    {
        return HandleListAssetsInPath(Params);
    }
    // AVA V7: Project info and widget management
    else if (CommandType == TEXT("get_project_info"))
    {
        return HandleGetProjectInfo(Params);
    }
    else if (CommandType == TEXT("add_widget_to_viewport"))
    {
        return HandleAddWidgetToViewport(Params);
    }
    // AVA V8: Validation, compilation, PIE, map check
    else if (CommandType == TEXT("validate_project"))
    {
        return HandleValidateProject(Params);
    }
    else if (CommandType == TEXT("compile_project_target"))
    {
        return HandleCompileProjectTarget(Params);
    }
    else if (CommandType == TEXT("run_map_check"))
    {
        return HandleRunMapCheck(Params);
    }
    else if (CommandType == TEXT("pie_start"))
    {
        return HandlePieStart(Params);
    }
    else if (CommandType == TEXT("pie_stop"))
    {
        return HandlePieStop(Params);
    }
    else if (CommandType == TEXT("pie_state"))
    {
        return HandlePieState(Params);
    }
    
    return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Unknown editor command: %s"), *CommandType));
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleGetActorsInLevel(const TSharedPtr<FJsonObject>& Params)
{
    TArray<AActor*> AllActors;
    UGameplayStatics::GetAllActorsOfClass(GWorld, AActor::StaticClass(), AllActors);
    
    TArray<TSharedPtr<FJsonValue>> ActorArray;
    for (AActor* Actor : AllActors)
    {
        if (Actor)
        {
            ActorArray.Add(FEpicUnrealMCPCommonUtils::ActorToJson(Actor));
        }
    }
    
    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetArrayField(TEXT("actors"), ActorArray);
    
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleFindActorsByName(const TSharedPtr<FJsonObject>& Params)
{
    FString Pattern;
    if (!Params->TryGetStringField(TEXT("pattern"), Pattern))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'pattern' parameter"));
    }
    
    TArray<AActor*> AllActors;
    UGameplayStatics::GetAllActorsOfClass(GWorld, AActor::StaticClass(), AllActors);
    
    TArray<TSharedPtr<FJsonValue>> MatchingActors;
    for (AActor* Actor : AllActors)
    {
        if (Actor && Actor->GetName().Contains(Pattern))
        {
            MatchingActors.Add(FEpicUnrealMCPCommonUtils::ActorToJson(Actor));
        }
    }
    
    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetArrayField(TEXT("actors"), MatchingActors);
    
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleSpawnActor(const TSharedPtr<FJsonObject>& Params)
{
    // Get required parameters
    FString ActorType;
    if (!Params->TryGetStringField(TEXT("type"), ActorType))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'type' parameter"));
    }

    // Get actor name (required parameter)
    FString ActorName;
    if (!Params->TryGetStringField(TEXT("name"), ActorName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'name' parameter"));
    }

    // Get optional transform parameters
    FVector Location(0.0f, 0.0f, 0.0f);
    FRotator Rotation(0.0f, 0.0f, 0.0f);
    FVector Scale(1.0f, 1.0f, 1.0f);

    if (Params->HasField(TEXT("location")))
    {
        Location = FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location"));
    }
    if (Params->HasField(TEXT("rotation")))
    {
        Rotation = FEpicUnrealMCPCommonUtils::GetRotatorFromJson(Params, TEXT("rotation"));
    }
    if (Params->HasField(TEXT("scale")))
    {
        Scale = FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("scale"));
    }

    // Create the actor based on type
    AActor* NewActor = nullptr;
    UWorld* World = GEditor->GetEditorWorldContext().World();

    if (!World)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to get editor world"));
    }

    // Check if an actor with this name already exists
    TArray<AActor*> AllActors;
    UGameplayStatics::GetAllActorsOfClass(World, AActor::StaticClass(), AllActors);
    for (AActor* Actor : AllActors)
    {
        if (Actor && Actor->GetName() == ActorName)
        {
            return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Actor with name '%s' already exists"), *ActorName));
        }
    }

    FActorSpawnParameters SpawnParams;
    SpawnParams.Name = *ActorName;

    if (ActorType == TEXT("StaticMeshActor"))
    {
        AStaticMeshActor* NewMeshActor = World->SpawnActor<AStaticMeshActor>(AStaticMeshActor::StaticClass(), Location, Rotation, SpawnParams);
        if (NewMeshActor)
        {
            // Check for an optional static_mesh parameter to assign a mesh
            FString MeshPath;
            if (Params->TryGetStringField(TEXT("static_mesh"), MeshPath))
            {
                UStaticMesh* Mesh = Cast<UStaticMesh>(UEditorAssetLibrary::LoadAsset(MeshPath));
                if (Mesh)
                {
                    NewMeshActor->GetStaticMeshComponent()->SetStaticMesh(Mesh);
                }
                else
                {
                    UE_LOG(LogTemp, Warning, TEXT("Could not find static mesh at path: %s"), *MeshPath);
                }
            }
        }
        NewActor = NewMeshActor;
    }
    else if (ActorType == TEXT("PointLight"))
    {
        NewActor = World->SpawnActor<APointLight>(APointLight::StaticClass(), Location, Rotation, SpawnParams);
    }
    else if (ActorType == TEXT("SpotLight"))
    {
        NewActor = World->SpawnActor<ASpotLight>(ASpotLight::StaticClass(), Location, Rotation, SpawnParams);
    }
    else if (ActorType == TEXT("DirectionalLight"))
    {
        NewActor = World->SpawnActor<ADirectionalLight>(ADirectionalLight::StaticClass(), Location, Rotation, SpawnParams);
    }
    else if (ActorType == TEXT("CameraActor"))
    {
        NewActor = World->SpawnActor<ACameraActor>(ACameraActor::StaticClass(), Location, Rotation, SpawnParams);
    }
    else
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Unknown actor type: %s"), *ActorType));
    }

    if (NewActor)
    {
        // Set scale (since SpawnActor only takes location and rotation)
        FTransform Transform = NewActor->GetTransform();
        Transform.SetScale3D(Scale);
        NewActor->SetActorTransform(Transform);

        // Return the created actor's details
        return FEpicUnrealMCPCommonUtils::ActorToJsonObject(NewActor, true);
    }

    return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to create actor"));
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleDeleteActor(const TSharedPtr<FJsonObject>& Params)
{
    FString ActorName;
    if (!Params->TryGetStringField(TEXT("name"), ActorName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'name' parameter"));
    }

    TArray<AActor*> AllActors;
    UGameplayStatics::GetAllActorsOfClass(GWorld, AActor::StaticClass(), AllActors);
    
    for (AActor* Actor : AllActors)
    {
        if (Actor && Actor->GetName() == ActorName)
        {
            // Store actor info before deletion for the response
            TSharedPtr<FJsonObject> ActorInfo = FEpicUnrealMCPCommonUtils::ActorToJsonObject(Actor);
            
            // Delete the actor
            Actor->Destroy();
            
            TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
            ResultObj->SetObjectField(TEXT("deleted_actor"), ActorInfo);
            return ResultObj;
        }
    }
    
    return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Actor not found: %s"), *ActorName));
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleSetActorTransform(const TSharedPtr<FJsonObject>& Params)
{
    // Get actor name
    FString ActorName;
    if (!Params->TryGetStringField(TEXT("name"), ActorName))
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'name' parameter"));
    }

    // Find the actor
    AActor* TargetActor = nullptr;
    TArray<AActor*> AllActors;
    UGameplayStatics::GetAllActorsOfClass(GWorld, AActor::StaticClass(), AllActors);
    
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

    // Get transform parameters
    FTransform NewTransform = TargetActor->GetTransform();

    if (Params->HasField(TEXT("location")))
    {
        NewTransform.SetLocation(FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location")));
    }
    if (Params->HasField(TEXT("rotation")))
    {
        NewTransform.SetRotation(FQuat(FEpicUnrealMCPCommonUtils::GetRotatorFromJson(Params, TEXT("rotation"))));
    }
    if (Params->HasField(TEXT("scale")))
    {
        NewTransform.SetScale3D(FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("scale")));
    }

    // Set the new transform
    TargetActor->SetActorTransform(NewTransform);

    // Return updated actor info
    return FEpicUnrealMCPCommonUtils::ActorToJsonObject(TargetActor, true);
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleSpawnBlueprintActor(const TSharedPtr<FJsonObject>& Params)
{
    FEpicUnrealMCPBlueprintCommands BlueprintCommands;
    return BlueprintCommands.HandleCommand(TEXT("spawn_blueprint_actor"), Params);
}

// ──────────────────────────────────────────────────────────
// AVA ADDITION: Attach actor to a socket of another actor
// ──────────────────────────────────────────────────────────
TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleAttachActorToSocket(const TSharedPtr<FJsonObject>& Params)
{
    FString ChildName;
    if (!Params->TryGetStringField(TEXT("child"), ChildName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'child' parameter (name of the actor to attach)"));

    FString ParentName;
    if (!Params->TryGetStringField(TEXT("parent"), ParentName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'parent' parameter (name of the actor to attach to)"));

    FString SocketName;
    if (!Params->TryGetStringField(TEXT("socket"), SocketName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'socket' parameter (socket name, e.g. 'WeaponHand')"));

    UWorld* World = GEditor->GetEditorWorldContext().World();
    if (!World)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No editor world"));

    // Find parent actor
    AActor* ParentActor = nullptr;
    TArray<AActor*> AllActors;
    UGameplayStatics::GetAllActorsOfClass(World, AActor::StaticClass(), AllActors);
    for (AActor* A : AllActors)
    {
        if (A && A->GetName() == ParentName)
        {
            ParentActor = A;
            break;
        }
    }
    if (!ParentActor)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Parent actor not found: %s"), *ParentName));

    // Find child actor
    AActor* ChildActor = nullptr;
    for (AActor* A : AllActors)
    {
        if (A && A->GetName() == ChildName)
        {
            ChildActor = A;
            break;
        }
    }
    if (!ChildActor)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Child actor not found: %s"), *ChildName));

    // Find the parent's root component (or SkeletalMeshComponent)
    USceneComponent* ParentComponent = ParentActor->GetRootComponent();
    
    // Try to find a SkeletalMeshComponent if root is not one
    if (!ParentComponent || !ParentComponent->DoesSocketExist(*SocketName))
    {
        TArray<USkeletalMeshComponent*> SkelComps;
        ParentActor->GetComponents<USkeletalMeshComponent>(SkelComps);
        for (USkeletalMeshComponent* SkelComp : SkelComps)
        {
            if (SkelComp->DoesSocketExist(*SocketName))
            {
                ParentComponent = SkelComp;
                break;
            }
        }
    }

    if (!ParentComponent || !ParentComponent->DoesSocketExist(*SocketName))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Socket '%s' not found on parent '%s'"), *SocketName, *ParentName));

    // Perform the attachment
    ChildActor->AttachToComponent(ParentComponent, FAttachmentTransformRules::SnapToTargetNotIncludingScale, *SocketName);

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("child"), ChildName);
    ResultObj->SetStringField(TEXT("parent"), ParentName);
    ResultObj->SetStringField(TEXT("socket"), SocketName);
    ResultObj->SetBoolField(TEXT("attached"), true);
    return ResultObj;
}

// ──────────────────────────────────────────────────────────
// AVA V4: Asset discovery commands
// ──────────────────────────────────────────────────────────

static void AssetDataToJson(const FAssetData& AssetData, TSharedPtr<FJsonObject>& OutObj)
{
    OutObj->SetStringField(TEXT("name"), AssetData.AssetName.ToString());
    OutObj->SetStringField(TEXT("path"), AssetData.GetObjectPathString());
    OutObj->SetStringField(TEXT("package"), AssetData.PackageName.ToString());
    OutObj->SetStringField(TEXT("class"), AssetData.AssetClassPath.ToString());
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleSearchAssets(const TSharedPtr<FJsonObject>& Params)
{
    FString SearchPath = TEXT("/Game");
    Params->TryGetStringField(TEXT("path"), SearchPath);
    if (!SearchPath.StartsWith(TEXT("/"))) SearchPath = TEXT("/") + SearchPath;

    FString Query;
    Params->TryGetStringField(TEXT("query"), Query);

    TArray<TSharedPtr<FJsonValue>> ClassFilters;
    const TArray<TSharedPtr<FJsonValue>>* ClassArr;
    if (Params->TryGetArrayField(TEXT("asset_classes"), ClassArr))
    {
        ClassFilters = *ClassArr;
    }

    FAssetRegistryModule& AssetRegistryModule = FModuleManager::LoadModuleChecked<FAssetRegistryModule>("AssetRegistry");
    IAssetRegistry& AssetRegistry = AssetRegistryModule.Get();

    FARFilter Filter;
    Filter.PackagePaths.Add(*SearchPath);
    Filter.bRecursivePaths = true;

    TArray<FAssetData> Results;
    AssetRegistry.GetAssets(Filter, Results);

    TArray<TSharedPtr<FJsonValue>> AssetArray;
    int32 MatchCount = 0;

    for (const FAssetData& Asset : Results)
    {
        FString AssetName = Asset.AssetName.ToString();
        FString AssetClass = Asset.AssetClassPath.ToString();

        if (!Query.IsEmpty() && !AssetName.Contains(Query)) continue;

        if (ClassFilters.Num() > 0)
        {
            bool bClassMatch = false;
            for (const TSharedPtr<FJsonValue>& F : ClassFilters)
            {
                FString FilterClass = F->AsString();
                if (AssetClass.Contains(FilterClass))
                {
                    bClassMatch = true;
                    break;
                }
            }
            if (!bClassMatch) continue;
        }

        TSharedPtr<FJsonObject> AssetObj = MakeShared<FJsonObject>();
        AssetDataToJson(Asset, AssetObj);
        AssetArray.Add(MakeShared<FJsonValueObject>(AssetObj));
        MatchCount++;

        if (MatchCount >= 200) break;
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetNumberField(TEXT("count"), MatchCount);
    ResultObj->SetArrayField(TEXT("assets"), AssetArray);
    ResultObj->SetStringField(TEXT("search_path"), SearchPath);
    ResultObj->SetStringField(TEXT("query"), Query);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleGetAssetDetails(const TSharedPtr<FJsonObject>& Params)
{
    FString AssetPath;
    if (!Params->TryGetStringField(TEXT("asset_path"), AssetPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'asset_path' parameter"));

    UObject* Asset = UEditorAssetLibrary::LoadAsset(AssetPath);
    if (!Asset)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Asset not found: %s"), *AssetPath));

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetStringField(TEXT("name"), Asset->GetName());
    ResultObj->SetStringField(TEXT("path"), AssetPath);
    ResultObj->SetStringField(TEXT("class"), Asset->GetClass()->GetName());

    if (UBlueprint* BP = Cast<UBlueprint>(Asset))
    {
        ResultObj->SetStringField(TEXT("parent_class"), BP->ParentClass ? BP->ParentClass->GetName() : TEXT("None"));
        ResultObj->SetNumberField(TEXT("num_variables"), BP->NewVariables.Num());
        ResultObj->SetNumberField(TEXT("num_functions"), BP->FunctionGraphs.Num());
        ResultObj->SetBoolField(TEXT("has_event_graph"), BP->UbergraphPages.Num() > 0);
    }

    if (UStaticMesh* SM = Cast<UStaticMesh>(Asset))
    {
        ResultObj->SetNumberField(TEXT("num_material_slots"), SM->GetStaticMaterials().Num());
        ResultObj->SetNumberField(TEXT("num_lods"), SM->GetNumLODs());
    }

    if (UMaterialInterface* Mat = Cast<UMaterialInterface>(Asset))
    {
        ResultObj->SetBoolField(TEXT("is_material_instance"), Cast<UMaterialInstance>(Asset) != nullptr);
    }

    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleListAssetsInPath(const TSharedPtr<FJsonObject>& Params)
{
    FString Path = TEXT("/Game");
    Params->TryGetStringField(TEXT("path"), Path);
    if (!Path.StartsWith(TEXT("/"))) Path = TEXT("/") + Path;

    bool bRecursive = true;
    Params->TryGetBoolField(TEXT("recursive"), bRecursive);

    TArray<FString> AssetPaths = UEditorAssetLibrary::ListAssets(Path, bRecursive, false);
    TArray<TSharedPtr<FJsonValue>> AssetArray;
    int32 Count = 0;

    for (const FString& P : AssetPaths)
    {
        TSharedPtr<FJsonObject> A = MakeShared<FJsonObject>();
        A->SetStringField(TEXT("path"), P);
        AssetArray.Add(MakeShared<FJsonValueObject>(A));
        Count++;
        if (Count >= 500) break;
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetNumberField(TEXT("count"), Count);
    ResultObj->SetArrayField(TEXT("assets"), AssetArray);
    ResultObj->SetStringField(TEXT("path"), Path);
    ResultObj->SetBoolField(TEXT("success"), true);
    return ResultObj;
}

// ──────────────────────────────────────────────────────────
// AVA V7: Project info and widget management
// ──────────────────────────────────────────────────────────

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleGetProjectInfo(const TSharedPtr<FJsonObject>& Params)
{
    TSharedPtr<FJsonObject> Info = MakeShared<FJsonObject>();
    Info->SetStringField(TEXT("project_dir"), FPaths::ProjectDir());

    if (GEditor && GEditor->GetEditorWorldContext().World())
    {
        Info->SetStringField(TEXT("current_level"), GEditor->GetEditorWorldContext().World()->GetName());
    }

    TArray<TSharedPtr<FJsonValue>> PluginsArr;
    IPluginManager& PluginMgr = IPluginManager::Get();
    for (const TSharedRef<IPlugin>& Plugin : PluginMgr.GetEnabledPlugins())
    {
        TSharedPtr<FJsonObject> P = MakeShared<FJsonObject>();
        P->SetStringField(TEXT("name"), Plugin->GetName());
        P->SetStringField(TEXT("version"), Plugin->GetDescriptor().VersionName);
        PluginsArr.Add(MakeShared<FJsonValueObject>(P));
    }
    Info->SetArrayField(TEXT("enabled_plugins"), PluginsArr);

    TArray<TSharedPtr<FJsonValue>> Maps;
    FAssetRegistryModule& AssetRegistry = FModuleManager::LoadModuleChecked<FAssetRegistryModule>("AssetRegistry");
    TArray<FAssetData> MapAssets;
    AssetRegistry.Get().GetAssetsByClass(FTopLevelAssetPath(TEXT("/Script/Engine"), TEXT("World")), MapAssets, true);
    for (const FAssetData& Asset : MapAssets)
    {
        Maps.Add(MakeShared<FJsonValueString>(Asset.GetObjectPathString()));
    }
    Info->SetArrayField(TEXT("maps"), Maps);

    Info->SetStringField(TEXT("engine_version"), FEngineVersion::Current().ToString());
    Info->SetBoolField(TEXT("success"), true);
    return Info;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleAddWidgetToViewport(const TSharedPtr<FJsonObject>& Params)
{
    FString WidgetPath;
    if (!Params->TryGetStringField(TEXT("widget_path"), WidgetPath))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Missing 'widget_path' parameter"));

    UWidgetBlueprint* WidgetBP = Cast<UWidgetBlueprint>(UEditorAssetLibrary::LoadAsset(WidgetPath));
    if (!WidgetBP)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(FString::Printf(TEXT("Widget Blueprint not found: %s"), *WidgetPath));

    UClass* WidgetClass = WidgetBP->GeneratedClass;
    if (!WidgetClass || !WidgetClass->IsChildOf(UUserWidget::StaticClass()))
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Widget Blueprint has no valid UserWidget class"));

    UWorld* World = GEditor->GetEditorWorldContext().World();
    if (!World)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No editor world available"));

    UUserWidget* CreatedWidget = CreateWidget<UUserWidget>(World, WidgetClass);
    if (!CreatedWidget)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("Failed to create widget instance"));

    int32 ZOrder = 0;
    Params->TryGetNumberField(TEXT("z_order"), ZOrder);
    CreatedWidget->AddToViewport(ZOrder);

    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("widget_name"), CreatedWidget->GetName());
    Result->SetStringField(TEXT("widget_path"), WidgetPath);
    Result->SetNumberField(TEXT("z_order"), ZOrder);
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}

// ──────────────────────────────────────────────────────────
// AVA V8: Validation, compilation, PIE, map check
// ──────────────────────────────────────────────────────────

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleValidateProject(const TSharedPtr<FJsonObject>& Params)
{
    TSharedPtr<FJsonObject> Report = MakeShared<FJsonObject>();
    TArray<TSharedPtr<FJsonValue>> Warnings;
    TArray<TSharedPtr<FJsonValue>> Errors;

    // Check plugins
    IPluginManager& PluginMgr = IPluginManager::Get();
    Report->SetNumberField(TEXT("enabled_plugin_count"), PluginMgr.GetEnabledPlugins().Num());

    // Check current level
    UWorld* World = GEditor ? GEditor->GetEditorWorldContext().World() : nullptr;
    if (World)
    {
        Report->SetStringField(TEXT("current_level"), World->GetName());
        Report->SetNumberField(TEXT("actor_count"), World->GetCurrentLevel()->Actors.Num());
    }
    else
    {
        Errors.Add(MakeShared<FJsonValueString>(TEXT("No editor world available")));
    }

    // Check UnrealMCP plugin state
    bool bMCPEnabled = false;
    for (const TSharedRef<IPlugin>& Plugin : PluginMgr.GetEnabledPlugins())
    {
        if (Plugin->GetName() == TEXT("UnrealMCP"))
        {
            bMCPEnabled = true;
            Report->SetStringField(TEXT("unrealmcp_version"), Plugin->GetDescriptor().VersionName);
            break;
        }
    }
    if (!bMCPEnabled)
        Errors.Add(MakeShared<FJsonValueString>(TEXT("UnrealMCP plugin is not enabled")));
    else
        Report->SetBoolField(TEXT("unrealmcp_enabled"), true);

    Report->SetArrayField(TEXT("errors"), Errors);
    Report->SetArrayField(TEXT("warnings"), Warnings);
    Report->SetNumberField(TEXT("error_count"), Errors.Num());
    Report->SetNumberField(TEXT("warning_count"), Warnings.Num());
    Report->SetBoolField(TEXT("is_valid"), Errors.Num() == 0);
    Report->SetBoolField(TEXT("success"), true);
    return Report;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleCompileProjectTarget(const TSharedPtr<FJsonObject>& Params)
{
    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("message"), TEXT("Project compilation must be triggered via Visual Studio or UBT. Use 'Build' in VS or RunUAT BuildCookRun. Use compile_blueprint for Blueprint-level compilation."));
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandleRunMapCheck(const TSharedPtr<FJsonObject>& Params)
{
    if (!GEditor)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("GEditor not available"));

    UWorld* World = GEditor->GetEditorWorldContext().World();
    if (!World)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No editor world available"));

    double StartTime = FPlatformTime::Seconds();
    TArray<TSharedPtr<FJsonValue>> Issues;

    for (TActorIterator<AActor> It(World); It; ++It)
    {
        AActor* Actor = *It;
        if (!Actor) continue;

        const FString ClassName = Actor->GetClass()->GetName();
        const FString ActorName = Actor->GetName();
        if (ClassName.Contains(TEXT("DebugDraw")) ||
            ClassName.Contains(TEXT("GameplayDebugger")) ||
            ClassName.Contains(TEXT("Chaos")) ||
            ClassName.Contains(TEXT("WorldSettings")) ||
            ActorName.Contains(TEXT("Chaos")) ||
            ActorName.Contains(TEXT("DebugDraw")) ||
            ActorName.Contains(TEXT("GameplayDebugger")) ||
            ActorName.StartsWith(TEXT("LightingScenario")))
        {
            continue;
        }

        if (AStaticMeshActor* MeshActor = Cast<AStaticMeshActor>(Actor))
        {
            UStaticMeshComponent* MeshComp = MeshActor->GetStaticMeshComponent();
            if (MeshComp && !MeshComp->GetStaticMesh())
            {
                TSharedPtr<FJsonObject> I = MakeShared<FJsonObject>();
                I->SetStringField(TEXT("severity"), TEXT("Warning"));
                I->SetStringField(TEXT("actor"), Actor->GetName());
                I->SetStringField(TEXT("message"), TEXT("StaticMeshActor has no mesh assigned"));
                Issues.Add(MakeShared<FJsonValueObject>(I));
            }
        }

        if (!Actor->GetRootComponent() && !Actor->IsA<AInfo>())
        {
            TSharedPtr<FJsonObject> I = MakeShared<FJsonObject>();
            I->SetStringField(TEXT("severity"), TEXT("Error"));
            I->SetStringField(TEXT("actor"), Actor->GetName());
            I->SetStringField(TEXT("message"), TEXT("Actor has no root component"));
            Issues.Add(MakeShared<FJsonValueObject>(I));
        }
    }

    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("level"), World->GetName());
    Result->SetNumberField(TEXT("duration_seconds"), FPlatformTime::Seconds() - StartTime);
    Result->SetNumberField(TEXT("issue_count"), Issues.Num());
    Result->SetArrayField(TEXT("issues"), Issues);
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandlePieStart(const TSharedPtr<FJsonObject>& Params)
{
    if (!GEditor)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("GEditor not available"));
    if (GEditor->IsPlaySessionInProgress())
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("PIE is already running"));

    InitializePieTracking();
    bPieStopRequested = false;
    bPieEndDelegateFired = false;

    FRequestPlaySessionParams PlayParams;
    GEditor->RequestPlaySession(PlayParams);

    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("state"), TEXT("starting"));
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandlePieStop(const TSharedPtr<FJsonObject>& Params)
{
    if (!GEditor)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("GEditor not available"));
    if (!GEditor->IsPlaySessionInProgress())
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("PIE is not running"));

    InitializePieTracking();
    bPieStopRequested = true;
    bPieEndDelegateFired = false;

    GEditor->RequestEndPlayMap();

    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("state"), TEXT("stopping"));
    Result->SetBoolField(TEXT("accepted"), true);
    Result->SetBoolField(TEXT("completed"), false);
    Result->SetStringField(TEXT("message"), TEXT("PIE stop requested. Poll pie_state until state=stopped before proceeding."));
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}

TSharedPtr<FJsonObject> FEpicUnrealMCPEditorCommands::HandlePieState(const TSharedPtr<FJsonObject>& Params)
{
    if (!GEditor)
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("GEditor not available"));

    bool bIsPlaySession = GEditor->IsPlaySessionInProgress();

    // Delegate is the authoritative source: if EndPIE fired, PIE is truly stopped
    // regardless of what IsPlaySessionInProgress() says (handles edge cases)
    bool bRunning;
    if (bPieStopRequested && bPieEndDelegateFired)
    {
        bRunning = false;
    }
    else
    {
        bRunning = bIsPlaySession;
    }

    // Clean up tracking flags when PIE is definitively stopped
    if (!bRunning)
    {
        bPieStopRequested = false;
        bPieEndDelegateFired = false;
    }

    TSharedPtr<FJsonObject> Result = MakeShared<FJsonObject>();
    Result->SetStringField(TEXT("state"), bRunning ? TEXT("running") : TEXT("stopped"));
    Result->SetBoolField(TEXT("is_running"), bRunning);
    Result->SetBoolField(TEXT("stop_requested"), bPieStopRequested);
    Result->SetBoolField(TEXT("delegate_fired"), bPieEndDelegateFired);
    Result->SetBoolField(TEXT("success"), true);
    return Result;
}
