#include "MCPServerRunnable.h"
#include "EpicUnrealMCPBridge.h"
#include "Sockets.h"
#include "SocketSubsystem.h"
#include "Interfaces/IPv4/IPv4Address.h"
#include "Dom/JsonObject.h"
#include "Dom/JsonValue.h"
#include "Serialization/JsonSerializer.h"
#include "Serialization/JsonReader.h"
#include "JsonObjectConverter.h"
#include "Misc/ScopeLock.h"
#include "HAL/PlatformTime.h"

static void SendErrorResponse(TSharedPtr<FSocket> Socket, const FString& RequestId, const FString& ErrorCode, const FString& ErrorMessage)
{
    TSharedPtr<FJsonObject> ErrRsp = MakeShareable(new FJsonObject);
    ErrRsp->SetStringField(TEXT("status"), TEXT("error"));
    TSharedPtr<FJsonObject> ErrObj = MakeShareable(new FJsonObject);
    ErrObj->SetStringField(TEXT("code"), ErrorCode);
    ErrObj->SetStringField(TEXT("message"), ErrorMessage);
    ErrRsp->SetObjectField(TEXT("error"), ErrObj);
    if (!RequestId.IsEmpty())
    {
        ErrRsp->SetStringField(TEXT("id"), RequestId);
    }
    FString Response;
    TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&Response);
    FJsonSerializer::Serialize(ErrRsp.ToSharedRef(), Writer);
    
    FString Framed = Response + TEXT("\n");
    FTCHARToUTF8 UTF8Response(*Framed);
    const uint8* Data = (const uint8*)UTF8Response.Get();
    int32 TotalSize = UTF8Response.Length();
    int32 Sent = 0;
    while (Sent < TotalSize)
    {
        int32 Chunk = 0;
        if (!Socket->Send(Data + Sent, TotalSize - Sent, Chunk)) break;
        Sent += Chunk;
    }
}

static void ExtractRequestId(const TSharedPtr<FJsonObject>& JsonObject, FString& OutRequestId)
{
    // Try string first (UUID/text), then number (backward compat)
    if (!JsonObject->TryGetStringField(TEXT("id"), OutRequestId))
    {
        int32 NumId = -1;
        if (JsonObject->TryGetNumberField(TEXT("id"), NumId))
        {
            OutRequestId = FString::FromInt(NumId);
        }
    }
}

FMCPServerRunnable::FMCPServerRunnable(UEpicUnrealMCPBridge* InBridge, TSharedPtr<FSocket> InListenerSocket)
    : Bridge(InBridge)
    , ListenerSocket(InListenerSocket)
    , bRunning(true)
{
    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Created server runnable"));
}

FMCPServerRunnable::~FMCPServerRunnable()
{
    // Clean up client socket if still open
    if (ClientSocket.IsValid())
    {
        ClientSocket->Close();
        ClientSocket.Reset();
    }
}

bool FMCPServerRunnable::Init()
{
    return true;
}

static void SendResponse(TSharedPtr<FSocket> Socket, const FString& Response)
{
    FString Framed = Response + TEXT("\n");
    FTCHARToUTF8 UTF8Response(*Framed);
    const uint8* Data = (const uint8*)UTF8Response.Get();
    int32 TotalSize = UTF8Response.Length();
    int32 Sent = 0;
    while (Sent < TotalSize)
    {
        int32 Chunk = 0;
        if (!Socket->Send(Data + Sent, TotalSize - Sent, Chunk))
        {
            break;
        }
        Sent += Chunk;
    }
}

uint32 FMCPServerRunnable::Run()
{
    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Server thread starting..."));
    
    while (bRunning)
    {
        bool bPending = false;
        if (ListenerSocket->HasPendingConnection(bPending) && bPending)
        {
            UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Client connection pending, accepting..."));
            
            TSharedPtr<FSocket> NewClientSocket = MakeShareable(ListenerSocket->Accept(TEXT("MCPClient")));
            if (NewClientSocket.IsValid())
            {
                UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Client connection accepted"));
                
                NewClientSocket->SetNoDelay(true);
                int32 SocketBufferSize = 65536;
                NewClientSocket->SetSendBufferSize(SocketBufferSize, SocketBufferSize);
                NewClientSocket->SetReceiveBufferSize(SocketBufferSize, SocketBufferSize);
                NewClientSocket->SetNonBlocking(true);
                
                FString AccumulatedData;
                uint8 Buffer[8192];
                double LastDataTime = FPlatformTime::Seconds();
                
                while (bRunning)
                {
                    // Idle read timeout: if no data for too long, disconnect the idle client
                    double Now = FPlatformTime::Seconds();
                    if (Now - LastDataTime > UNREALMCP_IDLE_READ_TIMEOUT)
                    {
                        UE_LOG(LogTemp, Warning, TEXT("MCPServerRunnable: Client idle timeout (%.0fs), disconnecting"), UNREALMCP_IDLE_READ_TIMEOUT);
                        break;
                    }
                    
                    int32 BytesRead = 0;
                    if (NewClientSocket->Recv(Buffer, sizeof(Buffer) - 1, BytesRead))
                    {
                        if (BytesRead == 0)
                        {
                            UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Client disconnected (zero bytes)"));
                            break;
                        }

                        Buffer[BytesRead] = '\0';
                        FString ReceivedChunk = UTF8_TO_TCHAR(Buffer);
                        AccumulatedData += ReceivedChunk;
                        LastDataTime = FPlatformTime::Seconds();

                        int32 NewlineIdx;
                        while ((NewlineIdx = AccumulatedData.Find(TEXT("\n"))) != INDEX_NONE)
                        {
                            FString Message = AccumulatedData.Left(NewlineIdx).TrimStartAndEnd();
                            AccumulatedData.RightChopInline(NewlineIdx + 1);

                            if (Message.IsEmpty()) continue;

                            TSharedPtr<FJsonObject> JsonObject;
                            TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Message);
                            
                            if (FJsonSerializer::Deserialize(Reader, JsonObject))
                            {
                                FString CommandType;
                                if (JsonObject->TryGetStringField(TEXT("command"), CommandType) ||
                                    JsonObject->TryGetStringField(TEXT("type"), CommandType))
                                {
                                    FString RequestId;
                                    ExtractRequestId(JsonObject, RequestId);

                                    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: cmd=%s id=%s"), *CommandType, *RequestId);

                                    TSharedPtr<FJsonObject> Params = MakeShared<FJsonObject>();
                                    const TSharedPtr<FJsonValue>* ParamsValue = JsonObject->Values.Find(TEXT("params"));
                                    if (ParamsValue && ParamsValue->IsValid() && (*ParamsValue)->Type == EJson::Object)
                                    {
                                        Params = (*ParamsValue)->AsObject();
                                    }

                                    FString Response = Bridge->ExecuteCommand(CommandType, Params, RequestId);

                                    SendResponse(NewClientSocket, Response);
                                }
                                else
                                {
                                    UE_LOG(LogTemp, Warning, TEXT("MCPServerRunnable: Missing 'command' or 'type' field"));
                                    FString RequestId;
                                    ExtractRequestId(JsonObject, RequestId);
                                    SendErrorResponse(NewClientSocket, RequestId, TEXT("MISSING_COMMAND"),
                                        TEXT("Request must contain a 'command' or 'type' field"));
                                }
                            }
                            else
                            {
                                UE_LOG(LogTemp, Warning, TEXT("MCPServerRunnable: Failed to parse JSON: '%s'"), *Message.Left(120));
                                SendErrorResponse(NewClientSocket, TEXT(""), TEXT("PARSE_ERROR"),
                                    TEXT("Failed to parse JSON request. Ensure the payload is valid JSON terminated by newline."));
                            }
                        }
                    }
                    else
                    {
                        int32 LastError = (int32)ISocketSubsystem::Get()->GetLastErrorCode();
                        
                        if (LastError == SE_EWOULDBLOCK) 
                        {
                            FPlatformProcess::Sleep(0.01f);
                        }
                        else if (LastError == SE_EINTR)
                        {
                            continue;
                        }
                        else 
                        {
                            UE_LOG(LogTemp, Warning, TEXT("MCPServerRunnable: Client disconnect, error: %d"), LastError);
                            break;
                        }
                    }
                }

                // Cleanly close the client socket before accepting the next connection
                UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Closing client connection..."));
                if (NewClientSocket.IsValid())
                {
                    NewClientSocket->Close();
                }
                NewClientSocket.Reset();
                
                // Brief pause so OS releases the port fully
                FPlatformProcess::Sleep(0.5f);
                UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Ready for next client."));
            }
            else
            {
                UE_LOG(LogTemp, Warning, TEXT("MCPServerRunnable: Failed to accept client connection"));
            }
        }
        
        FPlatformProcess::Sleep(0.1f);
    }
    
    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Server thread stopping"));
    return 0;
}

void FMCPServerRunnable::Stop()
{
    bRunning = false;
}

void FMCPServerRunnable::Exit()
{
}

void FMCPServerRunnable::HandleClientConnection(TSharedPtr<FSocket> InClientSocket)
{
    if (!InClientSocket.IsValid())
    {
        UE_LOG(LogTemp, Error, TEXT("MCPServerRunnable: Invalid client socket passed to HandleClientConnection"));
        return;
    }

    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Starting to handle client connection"));
    
    // Set socket options for better connection stability
    InClientSocket->SetNonBlocking(false);
    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Set socket to blocking mode"));
    
    // Properly read full message with timeout
    const int32 MaxBufferSize = 4096;
    uint8 Buffer[MaxBufferSize];
    FString MessageBuffer;
    
    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Starting message receive loop"));
    
    while (bRunning && InClientSocket.IsValid())
    {
        // Log socket state
        bool bIsConnected = InClientSocket->GetConnectionState() == SCS_Connected;
        UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Socket state - Connected: %s"), 
               bIsConnected ? TEXT("true") : TEXT("false"));
        
        // Log pending data status before receive
        uint32 PendingDataSize = 0;
        bool HasPendingData = InClientSocket->HasPendingData(PendingDataSize);
        UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Before Recv - HasPendingData=%s, Size=%d"), 
               HasPendingData ? TEXT("true") : TEXT("false"), PendingDataSize);
        
        // Try to receive data with timeout
        int32 BytesRead = 0;
        bool bReadSuccess = false;
        
        UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Attempting to receive data..."));
        bReadSuccess = InClientSocket->Recv(Buffer, MaxBufferSize - 1, BytesRead, ESocketReceiveFlags::None);
        
        UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Recv attempt complete - Success=%s, BytesRead=%d"), 
               bReadSuccess ? TEXT("true") : TEXT("false"), BytesRead);
        
        if (BytesRead > 0)
        {
            // Log raw data for debugging
            FString HexData;
            for (int32 i = 0; i < FMath::Min(BytesRead, 50); ++i)
            {
                HexData += FString::Printf(TEXT("%02X "), Buffer[i]);
            }
            UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Raw data (first 50 bytes hex): %s%s"), 
                   *HexData, BytesRead > 50 ? TEXT("...") : TEXT(""));
            
            // Convert and log received data
            Buffer[BytesRead] = 0; // Null terminate
            FString ReceivedData = UTF8_TO_TCHAR(Buffer);
            UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Received data as string: '%s'"), *ReceivedData);
            
            // Append to message buffer
            MessageBuffer.Append(ReceivedData);
            
            // Process complete messages (messages are terminated with newline)
            if (MessageBuffer.Contains(TEXT("\n")))
            {
                UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Newline detected in buffer, processing messages"));
                
                TArray<FString> Messages;
                MessageBuffer.ParseIntoArray(Messages, TEXT("\n"), true);
                
                UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Found %d message(s) in buffer"), Messages.Num());
                
                // Process all complete messages
                for (int32 i = 0; i < Messages.Num() - 1; ++i)
                {
                    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Processing message %d: '%s'"), 
                           i + 1, *Messages[i]);
                    ProcessMessage(InClientSocket, Messages[i]);
                }
                
                // Keep any incomplete message in the buffer
                MessageBuffer = Messages.Last();
                UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Remaining buffer after processing: %s"), 
                       *MessageBuffer);
            }
            else
            {
                UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: No complete message yet (no newline detected)"));
            }
        }
        else if (!bReadSuccess)
        {
            UE_LOG(LogTemp, Warning, TEXT("MCPServerRunnable: Connection closed or error occurred - Last error: %d"), 
                   (int32)ISocketSubsystem::Get()->GetLastErrorCode());
            break;
        }
        
        // Small sleep to prevent tight loop
        FPlatformProcess::Sleep(0.01f);
    }
    
    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Exited message receive loop"));
}

void FMCPServerRunnable::ProcessMessage(TSharedPtr<FSocket> Client, const FString& Message)
{
    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Processing message: %s"), *Message.Left(200));
    
    // Parse message as JSON
    TSharedPtr<FJsonObject> JsonMessage;
    TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Message);
    
    if (!FJsonSerializer::Deserialize(Reader, JsonMessage) || !JsonMessage.IsValid())
    {
        UE_LOG(LogTemp, Warning, TEXT("MCPServerRunnable: Failed to parse message as JSON"));
        SendErrorResponse(Client, TEXT(""), TEXT("PARSE_ERROR"), TEXT("Failed to parse JSON request"));
        return;
    }
    
    // Extract command type and parameters using MCP protocol format
    FString CommandType;
    TSharedPtr<FJsonObject> Params = MakeShareable(new FJsonObject());
    
    if (!JsonMessage->TryGetStringField(TEXT("command"), CommandType) &&
        !JsonMessage->TryGetStringField(TEXT("type"), CommandType))
    {
        UE_LOG(LogTemp, Warning, TEXT("MCPServerRunnable: Message missing 'command' or 'type' field"));
        FString RequestId;
        ExtractRequestId(JsonMessage, RequestId);
        SendErrorResponse(Client, RequestId, TEXT("MISSING_COMMAND"),
            TEXT("Request must contain a 'command' or 'type' field"));
        return;
    }
    
    // Extract request id (optional, supports both string and number)
    FString RequestId;
    ExtractRequestId(JsonMessage, RequestId);
    
    // Parameters are optional in MCP protocol
    if (JsonMessage->HasField(TEXT("params")))
    {
        TSharedPtr<FJsonValue> ParamsValue = JsonMessage->TryGetField(TEXT("params"));
        if (ParamsValue.IsValid() && ParamsValue->Type == EJson::Object)
        {
            Params = ParamsValue->AsObject();
        }
    }
    
    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Executing command: %s id=%s"), *CommandType, *RequestId);
    
    // Execute command (id is now handled by the Bridge)
    FString Response = Bridge->ExecuteCommand(CommandType, Params, RequestId);
    
    // Send response with newline terminator
    Response += TEXT("\n");

    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Sending response (%d bytes): %s"),
           Response.Len(), *Response.Left(300));

    // Convert to UTF8 once
    FTCHARToUTF8 UTF8Response(*Response);
    const uint8* DataToSend = (const uint8*)UTF8Response.Get();
    int32 TotalDataSize = UTF8Response.Length();
    int32 TotalBytesSent = 0;

    // Send all data in a loop (TCP may not send everything at once)
    while (TotalBytesSent < TotalDataSize)
    {
        int32 BytesSent = 0;
        if (!Client->Send(DataToSend + TotalBytesSent, TotalDataSize - TotalBytesSent, BytesSent))
        {
            UE_LOG(LogTemp, Error, TEXT("MCPServerRunnable: Failed to send response after %d/%d bytes"),
                   TotalBytesSent, TotalDataSize);
            return;
        }

        TotalBytesSent += BytesSent;
    }

    UE_LOG(LogTemp, Display, TEXT("MCPServerRunnable: Response sent successfully (%d bytes)"),
           TotalBytesSent);
}
