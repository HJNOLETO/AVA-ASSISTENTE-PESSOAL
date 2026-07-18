#pragma once

#include "CoreMinimal.h"
#include "Dom/JsonObject.h"

/**
 * AVA ADDITION: Procedural building commands for the UnrealMCP plugin.
 * 
 * Commands:
 *   create_wall      - Builds a wall from cube blocks
 *   create_staircase  - Builds a staircase
 *   create_tower      - Builds a tower (square or cylindrical)
 *   construct_house   - Builds a simple house
 */
class FEpicUnrealMCPBuildingCommands
{
public:
    FEpicUnrealMCPBuildingCommands();
    
    /** Main command dispatcher */
    TSharedPtr<FJsonObject> HandleCommand(const FString& CommandType, const TSharedPtr<FJsonObject>& Params);

private:
    /** Build a wall of cube blocks */
    TSharedPtr<FJsonObject> HandleCreateWall(const TSharedPtr<FJsonObject>& Params);
    
    /** Build a staircase */
    TSharedPtr<FJsonObject> HandleCreateStaircase(const TSharedPtr<FJsonObject>& Params);
    
    /** Build a tower (square or cylindrical) */
    TSharedPtr<FJsonObject> HandleCreateTower(const TSharedPtr<FJsonObject>& Params);
    
    /** Build a simple house (4 walls + roof) */
    TSharedPtr<FJsonObject> HandleConstructHouse(const TSharedPtr<FJsonObject>& Params);
};
