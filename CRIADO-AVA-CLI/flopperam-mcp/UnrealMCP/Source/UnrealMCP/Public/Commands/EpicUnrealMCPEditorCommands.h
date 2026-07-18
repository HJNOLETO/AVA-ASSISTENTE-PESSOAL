#pragma once

#include "CoreMinimal.h"
#include "Json.h"
#include "Delegates/Delegate.h"

/**
 * Handler class for Editor-related MCP commands
 * Handles viewport control, actor manipulation, and level management
 */
class UNREALMCP_API FEpicUnrealMCPEditorCommands
{
public:
    	FEpicUnrealMCPEditorCommands();

    // Handle editor commands
    TSharedPtr<FJsonObject> HandleCommand(const FString& CommandType, const TSharedPtr<FJsonObject>& Params);

    // PIE lifecycle tracking
    static void InitializePieTracking();
    static void ShutdownPieTracking();

private:
    // Actor manipulation commands
    TSharedPtr<FJsonObject> HandleGetActorsInLevel(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleFindActorsByName(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSpawnActor(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleDeleteActor(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSetActorTransform(const TSharedPtr<FJsonObject>& Params);

    // Blueprint actor spawning
    TSharedPtr<FJsonObject> HandleSpawnBlueprintActor(const TSharedPtr<FJsonObject>& Params);
    
    // AVA ADDITION: Actor attachment
    TSharedPtr<FJsonObject> HandleAttachActorToSocket(const TSharedPtr<FJsonObject>& Params);
    
    // AVA V4: Asset discovery commands
    TSharedPtr<FJsonObject> HandleSearchAssets(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleGetAssetDetails(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleListAssetsInPath(const TSharedPtr<FJsonObject>& Params);

    // AVA V7: Project info and widget management
    TSharedPtr<FJsonObject> HandleGetProjectInfo(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleAddWidgetToViewport(const TSharedPtr<FJsonObject>& Params);

    // AVA V8: Validation, compilation, PIE, map check
    TSharedPtr<FJsonObject> HandleValidateProject(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleCompileProjectTarget(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleRunMapCheck(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandlePieStart(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandlePieStop(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandlePieState(const TSharedPtr<FJsonObject>& Params);

    // PIE lifecycle delegate
    static void OnEndPIE(bool bIsSimulating);
    static FDelegateHandle PieEndDelegateHandle;
    static bool bPieStopRequested;
    static bool bPieEndDelegateFired;
}; 