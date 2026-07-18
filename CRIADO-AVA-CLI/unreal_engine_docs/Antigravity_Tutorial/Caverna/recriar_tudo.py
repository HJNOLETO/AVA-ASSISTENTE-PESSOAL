import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/rebuild_result.txt", "w")
output = "/Game/Pirate/Materials/Cave"
eal = unreal.EditorAssetLibrary
mel = unreal.MaterialEditingLibrary
at = unreal.AssetToolsHelpers.get_asset_tools()

# 1. Deletar instancias primeiro
for mi in ["MI_Cave_Walls", "MI_Cave_Floor_Mossy", "MI_Cave_RockySteppe"]:
    path = f"{output}/{mi}"
    if eal.does_asset_exist(path):
        eal.delete_asset(path)
        f.write(f"Deleted {mi}\n")

# 2. Deletar material pai
if eal.does_asset_exist(f"{output}/M_CaveMaster"):
    eal.delete_asset(f"{output}/M_CaveMaster")
    f.write("Deleted M_CaveMaster\n")

# 3. Criar material pai
mat = at.create_asset("M_CaveMaster", output, unreal.Material, unreal.MaterialFactoryNew())
f.write(f"Created M_CaveMaster: {mat is not None}\n")

if not mat:
    f.write("FAILED - aborting\n")
    f.close()
    exit()

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

mult_bc_tint = expr(unreal.MaterialExpressionMultiply, x + dx*2, 80)
conn(bc, mult_bc_tint); conn(tint, mult_bc_tint, "", "B")

# AO (R canal)
ao_intensity = expr(unreal.MaterialExpressionScalarParameter, x + dx*2, 180)
ao_intensity.set_editor_property("parameter_name", "AO_Intensity")
ao_intensity.set_editor_property("default_value", 1.0)

mask_r = expr(unreal.MaterialExpressionComponentMask, x + dx*2, 260)
mask_r.set_editor_property("r", True); mask_r.set_editor_property("g", False); mask_r.set_editor_property("b", False)

one_minus = expr(unreal.MaterialExpressionOneMinus, x + dx*2, 340)
conn(ordp, mask_r); conn(mask_r, one_minus)

ao_mul = expr(unreal.MaterialExpressionMultiply, x + dx*2, 420)
conn(one_minus, ao_mul); conn(ao_intensity, ao_mul, "", "B")

ao_clamp = expr(unreal.MaterialExpressionClamp, x + dx*2, 500)
conn(ao_mul, ao_clamp)

bc_final = expr(unreal.MaterialExpressionMultiply, x + dx*2, 580)
conn(mult_bc_tint, bc_final); conn(ao_clamp, bc_final, "", "B")

# ROUGHNESS (G canal)
r_min = expr(unreal.MaterialExpressionScalarParameter, x + dx*3, 0)
r_min.set_editor_property("parameter_name", "RoughnessMin")
r_min.set_editor_property("default_value", 0.5)

r_max = expr(unreal.MaterialExpressionScalarParameter, x + dx*3, 80)
r_max.set_editor_property("parameter_name", "RoughnessMax")
r_max.set_editor_property("default_value", 1.0)

mask_g = expr(unreal.MaterialExpressionComponentMask, x + dx*3, 160)
mask_g.set_editor_property("r", False); mask_g.set_editor_property("g", True); mask_g.set_editor_property("b", False)
conn(ordp, mask_g)

r_mul = expr(unreal.MaterialExpressionMultiply, x + dx*3, 240)
conn(mask_g, r_mul); conn(r_max, r_mul, "", "B")

r_clamp = expr(unreal.MaterialExpressionClamp, x + dx*3, 320)
conn(r_mul, r_clamp)

r_final = expr(unreal.MaterialExpressionAdd, x + dx*3, 400)
conn(r_clamp, r_final); conn(r_min, r_final, "", "B")

# SPECULAR / METALLIC
spec = expr(unreal.MaterialExpressionScalarParameter, x + dx*3, 500)
spec.set_editor_property("parameter_name", "Specular")
spec.set_editor_property("default_value", 0.1)

metal = expr(unreal.MaterialExpressionScalarParameter, x + dx*3, 580)
metal.set_editor_property("parameter_name", "Metallic")
metal.set_editor_property("default_value", 0.0)

# MAIN OUTPUTS
mel.connect_material_property(bc_final, "", unreal.MaterialProperty.MP_BASE_COLOR)
f.write("BaseColor connected\n")
mel.connect_material_property(nrm, "", unreal.MaterialProperty.MP_NORMAL)
f.write("Normal connected\n")
mel.connect_material_property(r_final, "", unreal.MaterialProperty.MP_ROUGHNESS)
f.write("Roughness connected\n")
mel.connect_material_property(spec, "", unreal.MaterialProperty.MP_SPECULAR)
f.write("Specular connected\n")
mel.connect_material_property(metal, "", unreal.MaterialProperty.MP_METALLIC)
f.write("Metallic connected\n")

# COMPILE
mel.recompile_material(mat)
eal.save_loaded_asset(mat)
f.write("\nCOMPILED M_CaveMaster\n")

# RECRIAR INSTANCIAS
f.write("\n--- RECRIANDO INSTANCIAS ---\n")

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

for name, texs, scalars in configs:
    factory = unreal.MaterialInstanceConstantFactoryNew()
    mi = at.create_asset(name, output, unreal.MaterialInstanceConstant, factory)
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
