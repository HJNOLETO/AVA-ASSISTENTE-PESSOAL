#pragma once

#include "CoreMinimal.h"
#include "Json.h"

/**
 * Handler class for Blueprint-related MCP commands
 */
class FEpicUnrealMCPBlueprintCommands
{
public:
    	FEpicUnrealMCPBlueprintCommands();

    // Handle blueprint commands
    TSharedPtr<FJsonObject> HandleCommand(const FString& CommandType, const TSharedPtr<FJsonObject>& Params);

private:
    // Specific blueprint command handlers (only used functions)
    TSharedPtr<FJsonObject> HandleCreateBlueprint(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleAddComponentToBlueprint(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSetPhysicsProperties(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleCompileBlueprint(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSpawnBlueprintActor(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSetStaticMeshProperties(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSetMeshMaterialColor(const TSharedPtr<FJsonObject>& Params);
    
    // AVA ADDITIONS: Component property setters
    TSharedPtr<FJsonObject> HandleSetComponentStaticMesh(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSetPointLightProperties(const TSharedPtr<FJsonObject>& Params);
    
    // Material management functions
    TSharedPtr<FJsonObject> HandleGetAvailableMaterials(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleApplyMaterialToActor(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleApplyMaterialToBlueprint(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleGetActorMaterialInfo(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleGetBlueprintMaterialInfo(const TSharedPtr<FJsonObject>& Params);

    // Blueprint analysis functions
    TSharedPtr<FJsonObject> HandleReadBlueprintContent(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleAnalyzeBlueprintGraph(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleGetBlueprintVariableDetails(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleGetBlueprintFunctionDetails(const TSharedPtr<FJsonObject>& Params);

    // AVA V4: Component lifecycle commands
    TSharedPtr<FJsonObject> HandleRemoveComponentFromBlueprint(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleAttachComponentToBlueprint(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSetComponentProperties(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleGetBlueprintComponents(const TSharedPtr<FJsonObject>& Params);

    // AVA V4: Material instance commands
    TSharedPtr<FJsonObject> HandleCreateMaterialInstance(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSetMaterialInstanceParameter(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleApplyMaterialToComponent(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleGetComponentMaterials(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleGetStaticMeshMaterialSlots(const TSharedPtr<FJsonObject>& Params);

    // AVA V5: Enhanced Input asset management
    TSharedPtr<FJsonObject> HandleCreateInputActionAsset(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleMapInputAction(const TSharedPtr<FJsonObject>& Params);

    // AVA V6: Blueprint inspection and diagnostics
    TSharedPtr<FJsonObject> HandleGetBlueprintSummary(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleGetBlueprintDiagnostics(const TSharedPtr<FJsonObject>& Params);

    // AVA V7: Game systems
    TSharedPtr<FJsonObject> HandleSetBlueprintProperty(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSetBlueprintDefaultValue(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleCreateWidgetBlueprint(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleSetComponentCollision(const TSharedPtr<FJsonObject>& Params);
    TSharedPtr<FJsonObject> HandleAddSocketToComponent(const TSharedPtr<FJsonObject>& Params);

    // Asset lifecycle
    TSharedPtr<FJsonObject> HandleDeleteBlueprint(const TSharedPtr<FJsonObject>& Params);


}; 