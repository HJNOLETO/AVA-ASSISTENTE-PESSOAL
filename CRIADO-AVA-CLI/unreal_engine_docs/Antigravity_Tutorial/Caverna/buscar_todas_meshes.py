import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/mesh_search.txt", "w")
reg = unreal.AssetRegistryHelpers.get_asset_registry()
sm_filter = unreal.ARFilter(class_names=["StaticMesh"], recursive_paths=True)
meshes = reg.get_assets(sm_filter)

cave = []
all_m = []
for m in meshes:
    n = str(m.asset_name)
    p = str(m.package_name)
    all_m.append(f"{n}|{p}")
    if "cave" in n.lower() or "caverna" in n.lower() or "rock" in n.lower() or "cliff" in n.lower() or "stone" in n.lower():
        cave.append(f"{n}|{p}")

f.write("--- CAVE / ROCK / STONE MESHES ---\n")
for c in cave:
    f.write(c + "\n")
f.write(f"\nTotal: {len(cave)}\n")
f.write(f"\nTotal ALL meshes: {len(all_m)}\n")
f.close()
