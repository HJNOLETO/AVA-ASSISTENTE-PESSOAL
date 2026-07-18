import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/rebuild_result.txt", "w")
eal = unreal.EditorAssetLibrary
mel = unreal.MaterialEditingLibrary
at = unreal.AssetToolsHelpers.get_asset_tools()
out = "/Game/Pirate/Materials"

# Delete existentes
for name in ["M_CaveMaster","MI_Cave_Walls","MI_Cave_Floor_Mossy","MI_Cave_RockySteppe"]:
    for d in [out, out+"/Cave"]:
        p = f"{d}/{name}"
        if eal.does_asset_exist(p):
            eal.delete_asset(p)
            f.write(f"Deleted {p}\n")

if not eal.does_directory_exist(out):
    eal.make_directory(out)

mat = at.create_asset("M_CaveMaster", out, unreal.Material, unreal.MaterialFactoryNew())
f.write(f"Material: {mat is not None}\n")
if not mat:
    f.write("FATAL\n"); f.close(); exit()

# Build graph
def expr(cls, x, y):
    return mel.create_material_expression(mat, cls, x, y)
def conn(src, dst, sp="", dp=""):
    mel.connect_material_expressions(src, sp, dst, dp)

x, dx = -900, 300

bc = expr(unreal.MaterialExpressionTextureSampleParameter2D, x, 0)
bc.set_editor_property("parameter_name", "BaseColor"); x += dx
nrm = expr(unreal.MaterialExpressionTextureSampleParameter2D, x, 0)
nrm.set_editor_property("parameter_name", "Normal")
nrm.set_editor_property("sampler_type", unreal.MaterialSamplerType.SAMPLERTYPE_NORMAL); x += dx
ordp = expr(unreal.MaterialExpressionTextureSampleParameter2D, x, 0)
ordp.set_editor_property("parameter_name", "ORDp")
ordp.set_editor_property("sampler_type", unreal.MaterialSamplerType.SAMPLERTYPE_LINEAR_COLOR); x += dx

tc = expr(unreal.MaterialExpressionTextureCoordinate, x+dx, -200)
tc.set_editor_property("coordinate_index", 0)
tiling = expr(unreal.MaterialExpressionScalarParameter, x+dx, 0)
tiling.set_editor_property("parameter_name", "Tiling")
tiling.set_editor_property("default_value", 1.0)
mul_uv = expr(unreal.MaterialExpressionMultiply, x+dx, 120)
conn(tc, mul_uv); conn(tiling, mul_uv, "", "B")
conn(mul_uv, bc, "", "Coordinates")
conn(mul_uv, nrm, "", "Coordinates")
conn(mul_uv, ordp, "", "Coordinates")

tint = expr(unreal.MaterialExpressionVectorParameter, x+dx*2, 0)
tint.set_editor_property("parameter_name", "Tint")
tint.set_editor_property("default_value", unreal.LinearColor(1,1,1,1))
mul_bc = expr(unreal.MaterialExpressionMultiply, x+dx*2, 80)
conn(bc, mul_bc); conn(tint, mul_bc, "", "B")

ao_i = expr(unreal.MaterialExpressionScalarParameter, x+dx*2, 180)
ao_i.set_editor_property("parameter_name", "AO_Intensity"); ao_i.set_editor_property("default_value", 1.0)
m_r = expr(unreal.MaterialExpressionComponentMask, x+dx*2, 260)
m_r.set_editor_property("r", True); m_r.set_editor_property("g", False); m_r.set_editor_property("b", False)
om = expr(unreal.MaterialExpressionOneMinus, x+dx*2, 340)
conn(ordp, m_r); conn(m_r, om)
aom = expr(unreal.MaterialExpressionMultiply, x+dx*2, 420)
conn(om, aom); conn(ao_i, aom, "", "B")
aoc = expr(unreal.MaterialExpressionClamp, x+dx*2, 500)
conn(aom, aoc)
bcf = expr(unreal.MaterialExpressionMultiply, x+dx*2, 580)
conn(mul_bc, bcf); conn(aoc, bcf, "", "B")

r_min = expr(unreal.MaterialExpressionScalarParameter, x+dx*3, 0)
r_min.set_editor_property("parameter_name", "RoughnessMin"); r_min.set_editor_property("default_value", 0.5)
r_max = expr(unreal.MaterialExpressionScalarParameter, x+dx*3, 80)
r_max.set_editor_property("parameter_name", "RoughnessMax"); r_max.set_editor_property("default_value", 1.0)
m_g = expr(unreal.MaterialExpressionComponentMask, x+dx*3, 160)
m_g.set_editor_property("r", False); m_g.set_editor_property("g", True); m_g.set_editor_property("b", False)
conn(ordp, m_g)
rm = expr(unreal.MaterialExpressionMultiply, x+dx*3, 240)
conn(m_g, rm); conn(r_max, rm, "", "B")
rc = expr(unreal.MaterialExpressionClamp, x+dx*3, 320)
conn(rm, rc)
rf = expr(unreal.MaterialExpressionAdd, x+dx*3, 400)
conn(rc, rf); conn(r_min, rf, "", "B")

spec = expr(unreal.MaterialExpressionScalarParameter, x+dx*3, 500)
spec.set_editor_property("parameter_name", "Specular"); spec.set_editor_property("default_value", 0.1)
metal = expr(unreal.MaterialExpressionScalarParameter, x+dx*3, 580)
metal.set_editor_property("parameter_name", "Metallic"); metal.set_editor_property("default_value", 0.0)

# OUTPUTS
mel.connect_material_property(bcf, "", unreal.MaterialProperty.MP_BASE_COLOR)
mel.connect_material_property(nrm, "", unreal.MaterialProperty.MP_NORMAL)
mel.connect_material_property(rf, "", unreal.MaterialProperty.MP_ROUGHNESS)
mel.connect_material_property(spec, "", unreal.MaterialProperty.MP_SPECULAR)
mel.connect_material_property(metal, "", unreal.MaterialProperty.MP_METALLIC)

mel.recompile_material(mat)
eal.save_loaded_asset(mat)
f.write("M_CaveMaster OK\n")

# INSTANCIAS
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
    mi = at.create_asset(name, out, unreal.MaterialInstanceConstant, factory)
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

f.write("\nALL DONE\n"); f.close()
