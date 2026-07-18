import unreal

eal = unreal.EditorAssetLibrary
mel = unreal.MaterialEditingLibrary
at = unreal.AssetToolsHelpers.get_asset_tools()
output = "/Game/Pirate/Materials/Cave"

# Limpar
for name in ["MI_Test1", "MI_Cave_Walls", "MI_Cave_Floor_Mossy", "MI_Cave_RockySteppe"]:
    path = f"{output}/{name}"
    if eal.does_asset_exist(path):
        eal.delete_asset(path)

mat = eal.load_asset(f"{output}/M_CaveMaster")

# Texturas Megascans
tex_paths = {
    "Rock_Cliff": {
        "BaseColor": "/Game/Megascans/Surfaces/Rock_Cliff_vl1lbbylw/T_Rock_Cliff_vl1lbbylw_1K_D",
        "Normal":    "/Game/Megascans/Surfaces/Rock_Cliff_vl1lbbylw/T_Rock_Cliff_vl1lbbylw_1K_N",
        "ORDp":      "/Game/Megascans/Surfaces/Rock_Cliff_vl1lbbylw/T_RockCliff_vl1lbbylw_1K_ORDp",
    },
    "Mossy_Ground": {
        "BaseColor": "/Game/Megascans/Surfaces/Mossy_Ground_xeunbh1/T_Mossy_Ground_xeunbh1_1K_D",
        "Normal":    "/Game/Megascans/Surfaces/Mossy_Ground_xeunbh1/T_Mossy_Ground_xeunbh1_1K_N",
        "ORDp":      "/Game/Megascans/Surfaces/Mossy_Ground_xeunbh1/T_MossyGround_xeunbh1_1K_ORDp",
    },
    "Rocky_Steppe": {
        "BaseColor": "/Game/Megascans/Surfaces/Rocky_Steppe_uknicjmmw/T_Rocky_Steppe_uknicjmmw_1K_D",
        "Normal":    "/Game/Megascans/Surfaces/Rocky_Steppe_uknicjmmw/T_Rocky_Steppe_uknicjmmw_1K_N",
        "ORDp":      "/Game/Megascans/Surfaces/Rocky_Steppe_uknicjmmw/T_RockySteppe_uknicjmmw_1K_ORDp",
    }
}

configs = [
    ("MI_Cave_Walls",        tex_paths["Rock_Cliff"],    {"Tiling": 3.0, "RoughnessMin": 0.6, "RoughnessMax": 0.9, "Specular": 0.05}),
    ("MI_Cave_Floor_Mossy",  tex_paths["Mossy_Ground"],  {"Tiling": 2.0, "RoughnessMin": 0.5, "RoughnessMax": 0.85, "Specular": 0.0}),
    ("MI_Cave_RockySteppe",  tex_paths["Rocky_Steppe"],  {"Tiling": 2.5, "RoughnessMin": 0.55, "RoughnessMax": 0.95, "Specular": 0.08}),
]

for name, textures, scalars in configs:
    factory = unreal.MaterialInstanceConstantFactoryNew()
    mi = at.create_asset(name, output, unreal.MaterialInstanceConstant, factory)
    if not mi:
        print(f"FAIL create {name}")
        continue

    mi.set_editor_property("parent", mat)

    for param, tex_path in textures.items():
        tex = eal.load_asset(tex_path)
        if tex:
            mel.set_material_instance_texture_parameter_value(mi, param, tex)

    for param, val in scalars.items():
        mel.set_material_instance_scalar_parameter_value(mi, param, val)

    eal.save_loaded_asset(mi)
    print(f"OK {name}")

print("ALL DONE")
