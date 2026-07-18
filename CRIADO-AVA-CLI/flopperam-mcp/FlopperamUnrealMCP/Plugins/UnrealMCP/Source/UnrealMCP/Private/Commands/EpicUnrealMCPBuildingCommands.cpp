#include "Commands/EpicUnrealMCPBuildingCommands.h"
#include "Commands/EpicUnrealMCPCommonUtils.h"
#include "Engine/StaticMeshActor.h"
#include "Engine/StaticMesh.h"
#include "Engine/World.h"
#include "Editor.h"
#include "EditorAssetLibrary.h"
#include "GameFramework/Actor.h"
#include "Kismet/GameplayStatics.h"

FEpicUnrealMCPBuildingCommands::FEpicUnrealMCPBuildingCommands()
{
}

TSharedPtr<FJsonObject> FEpicUnrealMCPBuildingCommands::HandleCommand(
    const FString& CommandType, const TSharedPtr<FJsonObject>& Params)
{
    if (CommandType == TEXT("create_wall"))
    {
        return HandleCreateWall(Params);
    }
    else if (CommandType == TEXT("create_staircase"))
    {
        return HandleCreateStaircase(Params);
    }
    else if (CommandType == TEXT("create_tower"))
    {
        return HandleCreateTower(Params);
    }
    else if (CommandType == TEXT("construct_house"))
    {
        return HandleConstructHouse(Params);
    }

    return FEpicUnrealMCPCommonUtils::CreateErrorResponse(
        FString::Printf(TEXT("Unknown building command: %s"), *CommandType));
}

// ──────────────────────────────────────────────────────────
// Helper: spawn a single cube mesh actor
// ──────────────────────────────────────────────────────────
static AStaticMeshActor* SpawnCubeBlock(
    UWorld* World,
    const FVector& Location,
    const FRotator& Rotation,
    const FName& Name)
{
    if (!World) return nullptr;

    // Check for duplicate name using GetAllActorsOfClass
    TArray<AActor*> AllActors;
    UGameplayStatics::GetAllActorsOfClass(World, AStaticMeshActor::StaticClass(), AllActors);
    for (AActor* Actor : AllActors)
    {
        if (Actor->GetName() == Name.ToString())
        {
            AStaticMeshActor* ExistingBlock = Cast<AStaticMeshActor>(Actor);
            if (ExistingBlock)
            {
                ExistingBlock->SetActorLocation(Location);
                ExistingBlock->SetActorRotation(Rotation);
                return ExistingBlock;
            }
        }
    }

    FActorSpawnParameters SpawnParams;
    SpawnParams.Name = Name;
    SpawnParams.SpawnCollisionHandlingOverride = ESpawnActorCollisionHandlingMethod::AlwaysSpawn;

    AStaticMeshActor* Block = World->SpawnActor<AStaticMeshActor>(
        AStaticMeshActor::StaticClass(), Location, Rotation, SpawnParams);

    if (Block)
    {
        // Load the default cube mesh
        UStaticMesh* CubeMesh = Cast<UStaticMesh>(
            UEditorAssetLibrary::LoadAsset(TEXT("/Engine/BasicShapes/Cube.Cube")));
        if (CubeMesh)
        {
            UStaticMeshComponent* MeshComp = Block->GetStaticMeshComponent();
            if (MeshComp)
            {
                MeshComp->SetStaticMesh(CubeMesh);
                MeshComp->SetMobility(EComponentMobility::Movable);
            }
        }
    }

    return Block;
}

// ──────────────────────────────────────────────────────────
// CREATE WALL
// Params: length (blocks), height (blocks), block_size, location, orientation ("x"/"y")
// ──────────────────────────────────────────────────────────
TSharedPtr<FJsonObject> FEpicUnrealMCPBuildingCommands::HandleCreateWall(
    const TSharedPtr<FJsonObject>& Params)
{
    int32 Length = 5;
    int32 Height = 2;
    float BlockSize = 100.0f;
    FVector Location(0.0f, 0.0f, 0.0f);
    FString Orientation = TEXT("x");
    FString NamePrefix = TEXT("WallBlock");

    Params->TryGetNumberField(TEXT("length"), Length);
    Params->TryGetNumberField(TEXT("height"), Height);
    Params->TryGetNumberField(TEXT("block_size"), BlockSize);
    if (Params->HasField(TEXT("location")))
    {
        Location = FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location"));
    }
    Params->TryGetStringField(TEXT("orientation"), Orientation);
    Params->TryGetStringField(TEXT("name_prefix"), NamePrefix);

    UWorld* World = GEditor->GetEditorWorldContext().World();
    if (!World)
    {
        return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No editor world"));
    }

    bool bAlongX = Orientation.ToLower() != TEXT("y");
    TArray<TSharedPtr<FJsonValue>> Blocks;
    int32 BlockCount = 0;

    for (int32 y = 0; y < Height; y++)
    {
        for (int32 x = 0; x < Length; x++)
        {
            FVector Pos = Location;
            if (bAlongX)
            {
                Pos.X += x * BlockSize;
                Pos.Z += y * BlockSize;
            }
            else
            {
                Pos.Y += x * BlockSize;
                Pos.Z += y * BlockSize;
            }

            FName BlockName(*FString::Printf(TEXT("%s_%d"), *NamePrefix, BlockCount));
            AStaticMeshActor* Block = SpawnCubeBlock(World, Pos, FRotator::ZeroRotator, BlockName);

            if (Block)
            {
                TSharedPtr<FJsonObject> BlockObj = MakeShared<FJsonObject>();
                BlockObj->SetStringField(TEXT("name"), Block->GetName());
                BlockObj->SetStringField(TEXT("class"), TEXT("StaticMeshActor"));
                TArray<TSharedPtr<FJsonValue>> LocArr;
                LocArr.Add(MakeShared<FJsonValueNumber>(Pos.X));
                LocArr.Add(MakeShared<FJsonValueNumber>(Pos.Y));
                LocArr.Add(MakeShared<FJsonValueNumber>(Pos.Z));
                BlockObj->SetArrayField(TEXT("location"), LocArr);
                Blocks.Add(MakeShared<FJsonValueObject>(BlockObj));
                BlockCount++;
            }
        }
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetArrayField(TEXT("blocks"), Blocks);
    ResultObj->SetNumberField(TEXT("count"), BlockCount);
    return ResultObj;
}

// ──────────────────────────────────────────────────────────
// CREATE STAIRCASE
// Params: steps, step_size [x,y,z], location, name_prefix
// ──────────────────────────────────────────────────────────
TSharedPtr<FJsonObject> FEpicUnrealMCPBuildingCommands::HandleCreateStaircase(
    const TSharedPtr<FJsonObject>& Params)
{
    int32 Steps = 5;
    FVector StepSize(100.0f, 100.0f, 50.0f);
    FVector Location(0.0f, 0.0f, 0.0f);
    FString NamePrefix = TEXT("StairBlock");

    Params->TryGetNumberField(TEXT("steps"), Steps);
    if (Params->HasField(TEXT("step_size")))
    {
        StepSize = FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("step_size"));
    }
    if (Params->HasField(TEXT("location")))
    {
        Location = FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location"));
    }
    Params->TryGetStringField(TEXT("name_prefix"), NamePrefix);

    UWorld* World = GEditor->GetEditorWorldContext().World();
    if (!World) return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No editor world"));

    TArray<TSharedPtr<FJsonValue>> Blocks;
    for (int32 i = 0; i < Steps; i++)
    {
        FVector Pos = Location;
        Pos.X += i * StepSize.X;
        Pos.Z += i * StepSize.Z;

        FName BlockName(*FString::Printf(TEXT("%s_%d"), *NamePrefix, i));
        AStaticMeshActor* Block = SpawnCubeBlock(World, Pos, FRotator::ZeroRotator, BlockName);

        if (Block)
        {
            // Scale each step to match step_size
            Block->SetActorScale3D(FVector(
                StepSize.X / 100.0f,
                StepSize.Y / 100.0f,
                StepSize.Z / 100.0f
            ));

            TSharedPtr<FJsonObject> BlockObj = MakeShared<FJsonObject>();
            BlockObj->SetStringField(TEXT("name"), Block->GetName());
            Blocks.Add(MakeShared<FJsonValueObject>(BlockObj));
        }
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetArrayField(TEXT("blocks"), Blocks);
    ResultObj->SetNumberField(TEXT("count"), Steps);
    return ResultObj;
}

// ──────────────────────────────────────────────────────────
// CREATE TOWER
// Params: height (blocks), base_size (blocks), block_size, location, style ("square"/"cylindrical")
// ──────────────────────────────────────────────────────────
TSharedPtr<FJsonObject> FEpicUnrealMCPBuildingCommands::HandleCreateTower(
    const TSharedPtr<FJsonObject>& Params)
{
    int32 Height = 6;
    int32 BaseSize = 3;
    float BlockSize = 100.0f;
    FVector Location(0.0f, 0.0f, 0.0f);
    FString Style = TEXT("square");
    FString NamePrefix = TEXT("TowerBlock");

    Params->TryGetNumberField(TEXT("height"), Height);
    Params->TryGetNumberField(TEXT("base_size"), BaseSize);
    Params->TryGetNumberField(TEXT("block_size"), BlockSize);
    if (Params->HasField(TEXT("location")))
    {
        Location = FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location"));
    }
    Params->TryGetStringField(TEXT("style"), Style);
    Params->TryGetStringField(TEXT("name_prefix"), NamePrefix);

    UWorld* World = GEditor->GetEditorWorldContext().World();
    if (!World) return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No editor world"));

    TArray<TSharedPtr<FJsonValue>> Blocks;
    int32 BlockCount = 0;
    bool bCylindrical = Style.ToLower() == TEXT("cylindrical");

    for (int32 z = 0; z < Height; z++)
    {
        if (bCylindrical)
        {
            // Place blocks in a circle
            int32 RadiusInBlocks = BaseSize;
            for (int32 a = 0; a < BaseSize * 4; a++)
            {
                float Angle = (float)a / (BaseSize * 4) * 2.0f * PI;
                FVector Pos = Location;
                Pos.X += FMath::Cos(Angle) * RadiusInBlocks * BlockSize;
                Pos.Y += FMath::Sin(Angle) * RadiusInBlocks * BlockSize;
                Pos.Z += z * BlockSize;

                FName BlockName(*FString::Printf(TEXT("%s_%d"), *NamePrefix, BlockCount));
                AStaticMeshActor* Block = SpawnCubeBlock(World, Pos, FRotator::ZeroRotator, BlockName);
                if (Block)
                {
                    TSharedPtr<FJsonObject> BlockObj = MakeShared<FJsonObject>();
                    BlockObj->SetStringField(TEXT("name"), Block->GetName());
                    Blocks.Add(MakeShared<FJsonValueObject>(BlockObj));
                    BlockCount++;
                }
            }
        }
        else
        {
            // Square tower: only edges
            for (int32 x = 0; x < BaseSize; x++)
            {
                for (int32 y = 0; y < BaseSize; y++)
                {
                    // Only place blocks on the edges
                    if (Height > 1 && x > 0 && x < BaseSize - 1 && y > 0 && y < BaseSize - 1)
                    {
                        continue;
                    }

                    FVector Pos = Location;
                    Pos.X += x * BlockSize;
                    Pos.Y += y * BlockSize;
                    Pos.Z += z * BlockSize;

                    FName BlockName(*FString::Printf(TEXT("%s_%d"), *NamePrefix, BlockCount));
                    AStaticMeshActor* Block = SpawnCubeBlock(World, Pos, FRotator::ZeroRotator, BlockName);
                    if (Block)
                    {
                        TSharedPtr<FJsonObject> BlockObj = MakeShared<FJsonObject>();
                        BlockObj->SetStringField(TEXT("name"), Block->GetName());
                        Blocks.Add(MakeShared<FJsonValueObject>(BlockObj));
                        BlockCount++;
                    }
                }
            }
        }
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetArrayField(TEXT("blocks"), Blocks);
    ResultObj->SetNumberField(TEXT("count"), BlockCount);
    ResultObj->SetStringField(TEXT("style"), Style);
    return ResultObj;
}

// ──────────────────────────────────────────────────────────
// CONSTRUCT HOUSE
// Params: width, depth, height, location, name_prefix
// ──────────────────────────────────────────────────────────
TSharedPtr<FJsonObject> FEpicUnrealMCPBuildingCommands::HandleConstructHouse(
    const TSharedPtr<FJsonObject>& Params)
{
    int32 Width = 5;
    int32 Depth = 4;
    int32 Height = 3;
    float BlockSize = 100.0f;
    FVector Location(0.0f, 0.0f, 0.0f);
    FString NamePrefix = TEXT("HouseBlock");

    Params->TryGetNumberField(TEXT("width"), Width);
    Params->TryGetNumberField(TEXT("depth"), Depth);
    Params->TryGetNumberField(TEXT("height"), Height);
    Params->TryGetNumberField(TEXT("block_size"), BlockSize);
    if (Params->HasField(TEXT("location")))
    {
        Location = FEpicUnrealMCPCommonUtils::GetVectorFromJson(Params, TEXT("location"));
    }
    Params->TryGetStringField(TEXT("name_prefix"), NamePrefix);

    UWorld* World = GEditor->GetEditorWorldContext().World();
    if (!World) return FEpicUnrealMCPCommonUtils::CreateErrorResponse(TEXT("No editor world"));

    TArray<TSharedPtr<FJsonValue>> Blocks;
    int32 BlockCount = 0;

    for (int32 z = 0; z < Height; z++)
    {
        for (int32 x = 0; x < Width; x++)
        {
            for (int32 y = 0; y < Depth; y++)
            {
                // Wall blocks: edges only for floors above ground
                bool bIsWall = (x == 0 || x == Width - 1 || y == 0 || y == Depth - 1);

                if (z == 0)
                {
                    // Floor: all blocks
                    if (!bIsWall) continue; // Skip floor interior for simplicity
                }
                else if (!bIsWall)
                {
                    continue; // Only walls above ground
                }

                FVector Pos = Location;
                Pos.X += x * BlockSize;
                Pos.Y += y * BlockSize;
                Pos.Z += z * BlockSize;

                FName BlockName(*FString::Printf(TEXT("%s_%d"), *NamePrefix, BlockCount));
                AStaticMeshActor* Block = SpawnCubeBlock(World, Pos, FRotator::ZeroRotator, BlockName);
                if (Block)
                {
                    TSharedPtr<FJsonObject> BlockObj = MakeShared<FJsonObject>();
                    BlockObj->SetStringField(TEXT("name"), Block->GetName());
                    Blocks.Add(MakeShared<FJsonValueObject>(BlockObj));
                    BlockCount++;
                }
            }
        }
    }

    // Roof: an extra layer on top
    for (int32 x = -1; x <= Width; x++)
    {
        for (int32 y = -1; y <= Depth; y++)
        {
            FVector Pos = Location;
            Pos.X += x * BlockSize;
            Pos.Y += y * BlockSize;
            Pos.Z += Height * BlockSize;

            FName BlockName(*FString::Printf(TEXT("%s_Roof_%d"), *NamePrefix, BlockCount));
            AStaticMeshActor* Block = SpawnCubeBlock(World, Pos, FRotator::ZeroRotator, BlockName);
            if (Block)
            {
                TSharedPtr<FJsonObject> BlockObj = MakeShared<FJsonObject>();
                BlockObj->SetStringField(TEXT("name"), Block->GetName());
                Blocks.Add(MakeShared<FJsonValueObject>(BlockObj));
                BlockCount++;
            }
        }
    }

    TSharedPtr<FJsonObject> ResultObj = MakeShared<FJsonObject>();
    ResultObj->SetArrayField(TEXT("blocks"), Blocks);
    ResultObj->SetNumberField(TEXT("count"), BlockCount);
    return ResultObj;
}
