import unreal

at = unreal.AssetToolsHelpers.get_asset_tools()
eal = unreal.EditorAssetLibrary
output = "/Game/Pirate/Materials/Cave"

# Limpar
for name in ["MI_Cave_Walls", "MI_Cave_Floor_Mossy", "MI_Cave_RockySteppe", "MI_Test"]:
    path = f"{output}/{name}"
    if eal.does_asset_exist(path):
        eal.delete_asset(path)

# Carregar material pai
mat = eal.load_asset(f"{output}/M_CaveMaster")

# Texturas por material
configs = [
    ("MI_Cave_Walls", [
        ("BaseColor", "/Game/Megascans/Surfaces/Rock_Cliff_vl1lbbylw/T_Rock_Cliff_vl1lbbylw_1K_D"),
        ("Normal",   "/Game/Megascans/Surfaces/Rock_Cliff_vl1lbbylw/T_Rock_Cliff_vl1lbbylw_1K_N"),
        ("ORDp",     "/Game/Megascans/Surfaces/Rock_Cliff_vl1lbbylw/T_RockCliff_vl1lbbylw_1K_ORDp"),
    ], {"Tiling": 3.0, "RoughnessMin": 0.6, "RoughnessMax": 0.9, "Specular": 0.05}),
    ("MI_Cave_Floor_Mossy", [
        ("BaseColor", "/Game/Megascans/Surfaces/Mossy_Ground_xeunbh1/T_Mossy_Ground_xeunbh1_1K_D"),
        ("Normal",   "/Game/Megascans/Surfaces/Mossy_Ground_xeunbh1/T_Mossy_Ground_xeunbh1_1K_N"),
        ("ORDp",     "/Game/Megascans/Surfaces/Mossy_Ground_xeunbh1/T_MossyGround_xeunbh1_1K_ORDp"),
    ], {"Tiling": 2.0, "RoughnessMin": 0.5, "RoughnessMax": 0.85, "Specular": 0.0}),
    ("MI_Cave_RockySteppe", [
        ("BaseColor", "/Game/Megascans/Surfaces/Rocky_Steppe_uknicjmmw/T_Rocky_Steppe_uknicjmmw_1K_D"),
        ("Normal",   "/Game/Megascans/Surfaces/Rocky_Steppe_uknicjmmw/T_Rocky_Steppe_uknicjmmw_1K_N"),
        ("ORDp",     "/Game/Megascans/Surfaces/Rocky_Steppe_uknicjmmw/T_RockySteppe_uknicjmmw_1K_ORDp"),
    ], {"Tiling": 2.5, "RoughnessMin": 0.55, "RoughnessMax": 0.95, "Specular": 0.08}),
]

for name, texture_pairs, scalars in configs:
    factory = unreal.MaterialInstanceConstantFactoryNew()
    factory.initial_parent = mat
    mi = at.create_asset(name, output, unreal.MaterialInstanceConstant, factory)
    if mi:
        for param, tex_path in texture_pairs:
            tex = eal.load_asset(tex_path)
            if tex:
                mi.set_texture_parameter_value_editor_only(param, tex)
        for param, val in scalars.items():
            mi.set_scalar_parameter_value_editor_only(param, val)
        pkg = mi.get_package()
        unreal.EditorLoadingAndSavingUtils.save_packages([pkg], False)
        print(f"OK {name}")
    else:
        print(f"FAIL {name}")

print("DONE")
