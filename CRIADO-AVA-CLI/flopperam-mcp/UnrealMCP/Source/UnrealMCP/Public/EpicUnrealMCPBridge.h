#pragma once

#include "CoreMinimal.h"
#include "EditorSubsystem.h"
#include "Sockets.h"
#include "SocketSubsystem.h"
#include "Http.h"
#include "Json.h"
#include "Interfaces/IPv4/IPv4Address.h"
#include "Interfaces/IPv4/IPv4Endpoint.h"
#include "Commands/EpicUnrealMCPEditorCommands.h"
#include "Commands/EpicUnrealMCPBlueprintCommands.h"
#include "Commands/EpicUnrealMCPBlueprintGraphCommands.h"
#include "Commands/EpicUnrealMCPBuildingCommands.h"
#include "EpicUnrealMCPBridge.generated.h"

class FMCPServerRunnable;

#define UNREALMCP_PLUGIN_VERSION TEXT("1.0.0")
#define UNREALMCP_PROTOCOL_VERSION TEXT("1.0")
#define UNREALMCP_IDLE_READ_TIMEOUT 60.0

/**
 * Editor subsystem for MCP Bridge
 * Handles communication between external tools and the Unreal Editor
 * through a TCP socket connection. Commands are received as JSON and
 * routed to appropriate command handlers.
 *
 * Request envelope:   {"id":"uuid-or-text","command":"name","params":{}}
 * Response envelope:  {"id":"...","status":"success|error","result":{},"error":{"code":"...","message":"..."}}
 */
UCLASS()
class UNREALMCP_API UEpicUnrealMCPBridge : public UEditorSubsystem
{
	GENERATED_BODY()

public:
	UEpicUnrealMCPBridge();
	virtual ~UEpicUnrealMCPBridge();

	// UEditorSubsystem implementation
	virtual void Initialize(FSubsystemCollectionBase& Collection) override;
	virtual void Deinitialize() override;

	// Server functions
	void StartServer();
	void StopServer();
	bool IsRunning() const { return bIsRunning; }

	// Command execution (RequestId injected on response when non-empty)
	FString ExecuteCommand(const FString& CommandType, const TSharedPtr<FJsonObject>& Params, const FString& RequestId = TEXT(""));

private:
	// Server state
	bool bIsRunning;
	TSharedPtr<FSocket> ListenerSocket;
	TSharedPtr<FSocket> ConnectionSocket;
	FRunnableThread* ServerThread;

	// Server configuration
	FIPv4Address ServerAddress;
	uint16 Port;

    // Command handler instances
    TSharedPtr<FEpicUnrealMCPEditorCommands> EditorCommands;
    TSharedPtr<FEpicUnrealMCPBlueprintCommands> BlueprintCommands;
    TSharedPtr<FEpicUnrealMCPBlueprintGraphCommands> BlueprintGraphCommands;
    TSharedPtr<FEpicUnrealMCPBuildingCommands> BuildingCommands;

    int32 TotalCommandsExecuted;
    double BridgeStartTime;
}; 