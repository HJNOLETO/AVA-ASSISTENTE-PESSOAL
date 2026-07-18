import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/apply_result.txt", "w")

# Aplicar MI_Cave_Walls ao Complex_Rock e SM_Rock
target_meshes = [
    "/Game/AdvancedLocomotionV4/Environment/Meshes/Complex_Rock",
    "/Game/StarterContent/Props/SM_Rock",
    "/Game/Necropolis/Placeables/Rocks/SM_rock_cliff_01",
    "/Game/Necropolis/Placeables/Rocks/SM_rock_cliff_02",
    "/Game/Necropolis/Placeables/Rocks/SM_rock_boulder_01",
]

mi_walls = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/Cave/MI_Cave_Walls")
mi_floor = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/Cave/MI_Cave_Floor_Mossy")

f.write(f"MI_Cave_Walls loaded: {mi_walls is not None}\n")
f.write(f"MI_Cave_Floor_Mossy loaded: {mi_floor is not None}\n\n")

for mesh_path in target_meshes:
    try:
        mesh = unreal.EditorAssetLibrary.load_asset(mesh_path)
        if not mesh:
            f.write(f"SKIP (not found): {mesh_path}\n")
            continue

        f.write(f"\n--- Processing: {mesh.get_name()} ---\n")

        # Apply material to the mesh's material slots
        for i in range(mesh.get_num_sections(0)):
            # For StaticMesh, set material at slot index
            mesh.set_material(i, mi_walls)
            f.write(f"  Slot {i}: set to MI_Cave_Walls\n")

        unreal.EditorAssetLibrary.save_loaded_asset(mesh)
        f.write(f"  SAVED\n")

    except Exception as e:
        f.write(f"  ERROR: {e}\n")

f.write("\nDONE\n")
f.close()
