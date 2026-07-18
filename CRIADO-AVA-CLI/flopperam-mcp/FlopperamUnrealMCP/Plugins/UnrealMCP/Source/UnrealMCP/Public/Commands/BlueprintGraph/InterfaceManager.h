#pragma once

#include "CoreMinimal.h"
#include "Dom/JsonObject.h"

class UNREALMCP_API FInterfaceManager
{
public:
	static TSharedPtr<FJsonObject> AddInterface(const TSharedPtr<FJsonObject>& Params);
	static TSharedPtr<FJsonObject> RemoveInterface(const TSharedPtr<FJsonObject>& Params);
};
