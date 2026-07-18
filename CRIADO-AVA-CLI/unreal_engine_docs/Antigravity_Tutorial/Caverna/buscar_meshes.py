import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/cave_actors.txt", "w")

level = unreal.EditorLevelLibrary
actors = level.get_all_level_actors()

f.write(f"Total actors in level: {len(actors)}\n\n")

# Actors with Cave/Caverna in label
cave_actors = []
for a in actors:
    label = str(a.get_actor_label())
    cls = str(a.get_class().get_name())
    if "cave" in label.lower() or "caverna" in label.lower():
        cave_actors.append((label, cls))
        f.write(f"[CAVE LABEL] {label} ({cls})\n")

# Actors with StaticMeshComponent referencing cave mesh
for a in actors:
    comps = a.get_components_by_class(unreal.StaticMeshComponent)
    for c in comps:
        sm = c.static_mesh
        if sm:
            mesh_name = str(sm.get_name())
            if "cave" in mesh_name.lower():
                f.write(f"[CAVE MESH] Actor: {a.get_actor_label()} -> Mesh: {mesh_name} ({sm.get_path_name()})\n")

# Top 30 actor labels for reference
f.write("\n--- First 30 actors ---\n")
for a in actors[:30]:
    f.write(f"  {a.get_actor_label()} ({a.get_class().get_name()})\n")

# Search all StaticMeshes in project with 'cave'
f.write("\n--- All Cave StaticMeshes ---\n")
reg = unreal.AssetRegistryHelpers.get_asset_registry()
mesh_filter = unreal.ARFilter(class_names=["StaticMesh"], recursive_paths=True)
all_meshes = reg.get_assets(mesh_filter)
for m in all_meshes:
    name = str(m.asset_name)
    if "cave" in name.lower():
        f.write(f"  {name} -> {m.package_name}\n")

f.close()
