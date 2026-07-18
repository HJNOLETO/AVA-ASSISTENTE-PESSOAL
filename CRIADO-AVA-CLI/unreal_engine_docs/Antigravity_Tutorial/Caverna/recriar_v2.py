import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/rebuild_result.txt", "w")
eal = unreal.EditorAssetLibrary
mel = unreal.MaterialEditingLibrary
at = unreal.AssetToolsHelpers.get_asset_tools()

output_dir = "/Game/Pirate/Materials/Cave"
mat_path = f"{output_dir}/M_CaveMaster"

# Limpar
for name in ["M_CaveMaster"]:
    for d in [output_dir, "/Game/Pirate/Materials"]:
        p = f"{d}/{name}"
        if eal.does_asset_exist(p):
            eal.delete_asset(p)
            f.write(f"Deleted {p}\n")

if eal.does_directory_exist(output_dir):
    eal.delete_directory(output_dir)
    f.write("Deleted Cave dir\n")

if not eal.does_directory_exist("/Game/Pirate/Materials"):
    eal.make_directory("/Game/Pirate/Materials")
eal.make_directory(output_dir)
f.write("Recreated Cave dir\n")

# Criar material
mat = at.create_asset("M_CaveMaster", output_dir, unreal.Material, unreal.MaterialFactoryNew())
f.write(f"Created M_CaveMaster: {mat is not None}\n")

if not mat:
    f.write("FATAL: cannot create material\n")
    f.close()
    exit()

# Helper
def expr(cls, x, y):
    return mel.create_material_expression(mat, cls, x, y)

def conn(src, dst, sp="", dp=""):
    mel.connect_material_expressions(src, sp, dst, dp)

x, dx = -900, 300

# TEXTURES
bc = expr(unreal.MaterialExpressionTextureSampleParameter2D, x, 0)
bc.set_editor_property("parameter_name", "BaseColor"); x += dx

nrm = expr(unreal.MaterialExpressionTextureSampleParameter2D, x, 0)
nrm.set_editor_property("parameter_name", "Normal")
nrm.set_editor_property("sampler_type", unreal.MaterialSamplerType.SAMPLERTYPE_NORMAL); x += dx

ordp = expr(unreal.MaterialExpressionTextureSampleParameter2D, x, 0)
ordp.set_editor_property("parameter_name", "ORDp")
ordp.set_editor_property("sampler_type", unreal.MaterialSamplerType.SAMPLERTYPE_LINEAR_COLOR); x += dx

# TILING
tc = expr(unreal.MaterialExpressionTextureCoordinate, x + dx, -200)
tc.set_editor_property("coordinate_index", 0)

tiling = expr(unreal.MaterialExpressionScalarParameter, x + dx, 0)
tiling.set_editor_property("parameter_name", "Tiling")
tiling.set_editor_property("default_value", 1.0)

mul_uv = expr(unreal.MaterialExpressionMultiply, x + dx, 120)
conn(tc, mul_uv); conn(tiling, mul_uv, "", "B")
conn(mul_uv, bc, "", "Coordinates")
conn(mul_uv, nrm, "", "Coordinates")
conn(mul_uv, ordp, "", "Coordinates")

# TINT
tint = expr(unreal.MaterialExpressionVectorParameter, x + dx*2, 0)
tint.set_editor_property("parameter_name", "Tint")
tint.set_editor_property("default_value", unreal.LinearColor(1,1,1,1))

mult_bc = expr(unreal.MaterialExpressionMultiply, x + dx*2, 80)
conn(bc, mult_bc); conn(tint, mult_bc, "", "B")

# AO (R)
ao_i = expr(unreal.MaterialExpressionScalarParameter, x + dx*2, 180)
ao_i.set_editor_property("parameter_name", "AO_Intensity"); ao_i.set_editor_property("default_value", 1.0)

mask_r = expr(unreal.MaterialExpressionComponentMask, x + dx*2, 260)
mask_r.set_editor_property("r", True); mask_r.set_editor_property("g", False); mask_r.set_editor_property("b", False)

one_m = expr(unreal.MaterialExpressionOneMinus, x + dx*2, 340)
conn(ordp, mask_r); conn(mask_r, one_m)

ao_m = expr(unreal.MaterialExpressionMultiply, x + dx*2, 420)
conn(one_m, ao_m); conn(ao_i, ao_m, "", "B")

ao_c = expr(unreal.MaterialExpressionClamp, x + dx*2, 500)
conn(ao_m, ao_c)

bc_f = expr(unreal.MaterialExpressionMultiply, x + dx*2, 580)
conn(mult_bc, bc_f); conn(ao_c, bc_f, "", "B")

# ROUGHNESS (G)
r_min = expr(unreal.MaterialExpressionScalarParameter, x + dx*3, 0)
r_min.set_editor_property("parameter_name", "RoughnessMin"); r_min.set_editor_property("default_value", 0.5)

r_max = expr(unreal.MaterialExpressionScalarParameter, x + dx*3, 80)
r_max.set_editor_property("parameter_name", "RoughnessMax"); r_max.set_editor_property("default_value", 1.0)

mask_g = expr(unreal.MaterialExpressionComponentMask, x + dx*3, 160)
mask_g.set_editor_property("r", False); mask_g.set_editor_property("g", True); mask_g.set_editor_property("b", False)
conn(ordp, mask_g)

r_m = expr(unreal.MaterialExpressionMultiply, x + dx*3, 240)
conn(mask_g, r_m); conn(r_max, r_m, "", "B")

r_c = expr(unreal.MaterialExpressionClamp, x + dx*3, 320)
conn(r_m, r_c)

r_f = expr(unreal.MaterialExpressionAdd, x + dx*3, 400)
conn(r_c, r_f); conn(r_min, r_f, "", "B")

# SPEC/METAL
spec = expr(unreal.MaterialExpressionScalarParameter, x + dx*3, 500)
spec.set_editor_property("parameter_name", "Specular"); spec.set_editor_property("default_value", 0.1)

metal = expr(unreal.MaterialExpressionScalarParameter, x + dx*3, 580)
metal.set_editor_property("parameter_name", "Metallic"); metal.set_editor_property("default_value", 0.0)

# MAIN OUTPUTS - empty pin = default output
mel.connect_material_property(bc_f, "", unreal.MaterialProperty.MP_BASE_COLOR)
mel.connect_material_property(nrm, "", unreal.MaterialProperty.MP_NORMAL)
mel.connect_material_property(r_f, "", unreal.MaterialProperty.MP_ROUGHNESS)
mel.connect_material_property(spec, "", unreal.MaterialProperty.MP_SPECULAR)
mel.connect_material_property(metal, "", unreal.MaterialProperty.MP_METALLIC)
f.write("All 5 main outputs connected\n")

mel.recompile_material(mat)
eal.save_loaded_asset(mat)
f.write("Compiled M_CaveMaster\n")

# INSTANCIAS
f.write("\nInstances:\n")
configs = [
    ("MI_Cave_Walls", [
        ("BaseColor","/Game/Megascans/Surfaces/Rock_Cliff_vl1lbbylw/T_Rock_Cliff_vl1lbbylw_1K_D"),
        ("Normal","/Game/Megascans/Surfaces/Rock_Cliff_vl1lbbylw/T_Rock_Cliff_vl1lbbylw_1K_N"),
        ("ORDp","/Game/Megascans/Surfaces/Rock_Cliff_vl1lbbylw/T_RockCliff_vl1lbbylw_1K_ORDp"),
    ], {"Tiling":3.0,"RoughnessMin":0.6,"RoughnessMax":0.9,"Specular":0.05}),
    ("MI_Cave_Floor_Mossy", [
        ("BaseColor","/Game/Megascans/Surfaces/Mossy_Ground_xeunbh1/T_Mossy_Ground_xeunbh1_1K_D"),
        ("Normal","/Game/Megascans/Surfaces/Mossy_Ground_xeunbh1/T_Mossy_Ground_xeunbh1_1K_N"),
        ("ORDp","/Game/Megascans/Surfaces/Mossy_Ground_xeunbh1/T_MossyGround_xeunbh1_1K_ORDp"),
    ], {"Tiling":2.0,"RoughnessMin":0.5,"RoughnessMax":0.85,"Specular":0.0}),
    ("MI_Cave_RockySteppe", [
        ("BaseColor","/Game/Megascans/Surfaces/Rocky_Steppe_uknicjmmw/T_Rocky_Steppe_uknicjmmw_1K_D"),
        ("Normal","/Game/Megascans/Surfaces/Rocky_Steppe_uknicjmmw/T_Rocky_Steppe_uknicjmmw_1K_N"),
        ("ORDp","/Game/Megascans/Surfaces/Rocky_Steppe_uknicjmmw/T_RockySteppe_uknicjmmw_1K_ORDp"),
    ], {"Tiling":2.5,"RoughnessMin":0.55,"RoughnessMax":0.95,"Specular":0.08}),
]

for name, texs, scalars in configs:
    factory = unreal.MaterialInstanceConstantFactoryNew()
    mi = at.create_asset(name, output_dir, unreal.MaterialInstanceConstant, factory)
    if mi:
        mi.set_editor_property("parent", mat)
        for p, tp in texs:
            tex = eal.load_asset(tp)
            if tex:
                mel.set_material_instance_texture_parameter_value(mi, p, tex)
        for p, v in scalars.items():
            mel.set_material_instance_scalar_parameter_value(mi, p, v)
        eal.save_loaded_asset(mi)
        f.write(f"OK {name}\n")
    else:
        f.write(f"FAIL {name}\n")

f.write("\nALL DONE\n")
f.close()
