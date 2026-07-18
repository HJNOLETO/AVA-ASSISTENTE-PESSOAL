"""
Script: Criar Material Robusto de Caverna
Projeto: TheLostPirate | UE 5.1
Executar no Python Console do Unreal Editor
"""

import unreal

# ─── PATHS ───────────────────────────────────────────────────────────────
OUTPUT_PATH = "/Game/Pirate/Materials/Cave"
MEGASCANS = "/Game/Megascans/Surfaces"

ROCK_CLIFF_BASECOLOR = f"{MEGASCANS}/Rock_Cliff_vl1lbbylw/T_Rock_Cliff_vl1lbbylw_1K_D"
ROCK_CLIFF_NORMAL    = f"{MEGASCANS}/Rock_Cliff_vl1lbbylw/T_Rock_Cliff_vl1lbbylw_1K_N"
ROCK_CLIFF_ORDP      = f"{MEGASCANS}/Rock_Cliff_vl1lbbylw/T_RockCliff_vl1lbbylw_1K_ORDp"

MOSSY_GROUND_BASECOLOR = f"{MEGASCANS}/Mossy_Ground_xeunbh1/T_Mossy_Ground_xeunbh1_1K_D"
MOSSY_GROUND_NORMAL    = f"{MEGASCANS}/Mossy_Ground_xeunbh1/T_Mossy_Ground_xeunbh1_1K_N"
MOSSY_GROUND_ORDP      = f"{MEGASCANS}/Mossy_Ground_xeunbh1/T_MossyGround_xeunbh1_1K_ORDp"

ROCKY_STEPPE_BASECOLOR = f"{MEGASCANS}/Rocky_Steppe_uknicjmmw/T_Rocky_Steppe_uknicjmmw_1K_D"
ROCKY_STEPPE_NORMAL    = f"{MEGASCANS}/Rocky_Steppe_uknicjmmw/T_Rocky_Steppe_uknicjmmw_1K_N"
ROCKY_STEPPE_ORDP      = f"{MEGASCANS}/Rocky_Steppe_uknicjmmw/T_RockySteppe_uknicjmmw_1K_ORDp"


def ensure_dir():
    if not unreal.EditorAssetLibrary.does_directory_exist(OUTPUT_PATH):
        unreal.EditorAssetLibrary.make_directory(OUTPUT_PATH)
        print(f"[OK] Criada pasta: {OUTPUT_PATH}")
    else:
        print(f"[OK] Pasta ja existe: {OUTPUT_PATH}")


def load_texture(path):
    if unreal.EditorAssetLibrary.does_asset_exist(path):
        return unreal.EditorAssetLibrary.load_asset(path)
    print(f"[AVISO] Textura nao encontrada: {path}")
    return None


def expr(material, expression_class, x, y):
    """Cria um material expression node. UE 5.1: 4 args (material, class, x, y)."""
    return unreal.MaterialEditingLibrary.create_material_expression(material, expression_class, x, y)


def create_master_material():
    mat_name = "M_CaveMaster"
    mat_path = f"{OUTPUT_PATH}/{mat_name}"

    if unreal.EditorAssetLibrary.does_asset_exist(mat_path):
        print(f"[SKIP] {mat_name} ja existe em {mat_path}")
        return unreal.EditorAssetLibrary.load_asset(mat_path)

    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    mat = asset_tools.create_asset(mat_name, OUTPUT_PATH, unreal.Material, unreal.MaterialFactoryNew())

    if not mat:
        print(f"[ERRO] Falha ao criar material {mat_name}")
        return None

    print(f"[CRIADO] {mat_name}")

    me = unreal.MaterialEditingLibrary
    x, dx = -800, 320

    # ── TEXTURE PARAMETERS ────────────────────────────────────────────
    bc_param = expr(mat, unreal.MaterialExpressionTextureSampleParameter2D, x, 0)
    bc_param.set_editor_property("parameter_name", "BaseColor")
    x += dx

    nrm_param = expr(mat, unreal.MaterialExpressionTextureSampleParameter2D, x, 0)
    nrm_param.set_editor_property("parameter_name", "Normal")
    nrm_param.set_editor_property("sampler_type", unreal.MaterialSamplerType.SAMPLERTYPE_NORMAL)
    x += dx

    ord_param = expr(mat, unreal.MaterialExpressionTextureSampleParameter2D, x, 0)
    ord_param.set_editor_property("parameter_name", "ORDp")
    ord_param.set_editor_property("sampler_type", unreal.MaterialSamplerType.SAMPLERTYPE_LINEAR_COLOR)
    x += dx

    # ── UV * TILING ──────────────────────────────────────────────────
    texcoord = expr(mat, unreal.MaterialExpressionTextureCoordinate, x, 200)
    texcoord.set_editor_property("coordinate_index", 0)

    tiling = expr(mat, unreal.MaterialExpressionScalarParameter, x + dx, 0)
    tiling.set_editor_property("parameter_name", "Tiling")
    tiling.set_editor_property("default_value", 1.0)

    mul_uv = expr(mat, unreal.MaterialExpressionMultiply, x + dx, 160)
    me.connect_material_expressions(texcoord, "", mul_uv, "A")
    me.connect_material_expressions(tiling, "", mul_uv, "B")

    me.connect_material_expressions(mul_uv, "", bc_param, "Coordinates")
    me.connect_material_expressions(mul_uv, "", nrm_param, "Coordinates")
    me.connect_material_expressions(mul_uv, "", ord_param, "Coordinates")

    # ── BASE COLOR: Tint ─────────────────────────────────────────────
    tint = expr(mat, unreal.MaterialExpressionVectorParameter, x + dx * 2, 0)
    tint.set_editor_property("parameter_name", "Tint")
    tint.set_editor_property("default_value", unreal.LinearColor(1.0, 1.0, 1.0, 1.0))

    mult_bc_tint = expr(mat, unreal.MaterialExpressionMultiply, x + dx * 2, 80)
    me.connect_material_expressions(bc_param, "", mult_bc_tint, "A")
    me.connect_material_expressions(tint, "", mult_bc_tint, "B")

    # ── AO (Occlusion) do ORDp canal R ───────────────────────────────
    ao_intensity = expr(mat, unreal.MaterialExpressionScalarParameter, x + dx * 2, 180)
    ao_intensity.set_editor_property("parameter_name", "AO_Intensity")
    ao_intensity.set_editor_property("default_value", 1.0)

    mask_r = expr(mat, unreal.MaterialExpressionComponentMask, x + dx * 2, 260)
    mask_r.set_editor_property("r", True)
    mask_r.set_editor_property("g", False)
    mask_r.set_editor_property("b", False)
    me.connect_material_expressions(ord_param, "", mask_r, "")

    one_minus_ao = expr(mat, unreal.MaterialExpressionOneMinus, x + dx * 2, 340)
    me.connect_material_expressions(mask_r, "", one_minus_ao, "")

    ao_scale = expr(mat, unreal.MaterialExpressionMultiply, x + dx * 2, 420)
    me.connect_material_expressions(one_minus_ao, "", ao_scale, "A")
    me.connect_material_expressions(ao_intensity, "", ao_scale, "B")

    clamp_ao = expr(mat, unreal.MaterialExpressionClamp, x + dx * 2, 500)
    me.connect_material_expressions(ao_scale, "", clamp_ao, "")

    multiply_bc_ao = expr(mat, unreal.MaterialExpressionMultiply, x + dx * 2, 580)
    me.connect_material_expressions(mult_bc_tint, "", multiply_bc_ao, "A")
    me.connect_material_expressions(clamp_ao, "", multiply_bc_ao, "B")

    # ── ROUGHNESS do ORDp canal G ────────────────────────────────────
    roughness_min = expr(mat, unreal.MaterialExpressionScalarParameter, x + dx * 3, 0)
    roughness_min.set_editor_property("parameter_name", "RoughnessMin")
    roughness_min.set_editor_property("default_value", 0.5)

    roughness_max = expr(mat, unreal.MaterialExpressionScalarParameter, x + dx * 3, 80)
    roughness_max.set_editor_property("parameter_name", "RoughnessMax")
    roughness_max.set_editor_property("default_value", 1.0)

    mask_g = expr(mat, unreal.MaterialExpressionComponentMask, x + dx * 3, 160)
    mask_g.set_editor_property("r", False)
    mask_g.set_editor_property("g", True)
    mask_g.set_editor_property("b", False)
    me.connect_material_expressions(ord_param, "", mask_g, "")

    # roughness = RoughnessMin + Roughness(ord) * (RoughnessMax - RoughnessMin)
    # Simplificado: roughness = RoughnessMin + mask_g * RoughnessMax
    roughness_scale = expr(mat, unreal.MaterialExpressionMultiply, x + dx * 3, 240)
    me.connect_material_expressions(mask_g, "", roughness_scale, "A")
    me.connect_material_expressions(roughness_max, "", roughness_scale, "B")

    roughness_clamp = expr(mat, unreal.MaterialExpressionClamp, x + dx * 3, 320)
    me.connect_material_expressions(roughness_scale, "", roughness_clamp, "")

    roughness_final = expr(mat, unreal.MaterialExpressionAdd, x + dx * 3, 400)
    me.connect_material_expressions(roughness_clamp, "", roughness_final, "A")
    me.connect_material_expressions(roughness_min, "", roughness_final, "B")

    # ── SPECULAR ─────────────────────────────────────────────────────
    spec = expr(mat, unreal.MaterialExpressionScalarParameter, x + dx * 3, 500)
    spec.set_editor_property("parameter_name", "Specular")
    spec.set_editor_property("default_value", 0.1)

    # ── METALLIC ─────────────────────────────────────────────────────
    metal = expr(mat, unreal.MaterialExpressionScalarParameter, x + dx * 3, 580)
    metal.set_editor_property("parameter_name", "Metallic")
    metal.set_editor_property("default_value", 0.0)

    # ── MAIN OUTPUT CONNECTIONS ──────────────────────────────────────
    me.connect_material_property(multiply_bc_ao, "Multiply", unreal.MaterialProperty.MP_BASE_COLOR)
    me.connect_material_property(nrm_param, "Normal", unreal.MaterialProperty.MP_NORMAL)
    me.connect_material_property(roughness_final, "Add", unreal.MaterialProperty.MP_ROUGHNESS)
    me.connect_material_property(spec, "", unreal.MaterialProperty.MP_SPECULAR)
    me.connect_material_property(metal, "", unreal.MaterialProperty.MP_METALLIC)

    # ── SAVE ─────────────────────────────────────────────────────────
    unreal.MaterialEditingLibrary.recompile_material(mat)
    unreal.EditorAssetLibrary.save_asset(mat_path)
    unreal.EditorAssetLibrary.save_loaded_asset(mat)

    print(f"[OK] {mat_name} criado e compilado em {mat_path}")
    return mat


def create_material_instance(parent_material, instance_name, textures_dict, params_override=None):
    instance_path = f"{OUTPUT_PATH}/{instance_name}"

    if unreal.EditorAssetLibrary.does_asset_exist(instance_path):
        print(f"[SKIP] {instance_name} ja existe")
        return unreal.EditorAssetLibrary.load_asset(instance_path)

    asset_tools = unreal.AssetToolsHelpers.get_asset_tools()
    mi = asset_tools.create_asset(
        instance_name, OUTPUT_PATH,
        unreal.MaterialInstanceConstant,
        unreal.MaterialInstanceConstantFactoryNew()
    )

    if not mi:
        print(f"[ERRO] Falha ao criar {instance_name}")
        return None

    mi.set_editor_property("parent", parent_material)

    for param, path in textures_dict.items():
        tex = load_texture(path)
        if tex:
            mi.set_texture_parameter_value_editor_only(param, tex)
            print(f"  [OK] {param} <- {path.split('/')[-1]}")

    if params_override:
        for param, value in params_override.items():
            mi.set_scalar_parameter_value_editor_only(param, value)

    unreal.EditorAssetLibrary.save_asset(instance_path)
    unreal.EditorAssetLibrary.save_loaded_asset(mi)
    print(f"[OK] {instance_name} criado")
    return mi


# ═══════════════════════════════════════════════════════════════════════════
# EXECUCAO
# ═══════════════════════════════════════════════════════════════════════════

print("=" * 60)
print("CRIANDO MATERIAL PAI E FILHOS DE CAVERNA")
print("=" * 60)

ensure_dir()

print("\n--- MATERIAL PAI ---")
master = create_master_material()

if master:
    print("\n--- PAREDES DA CAVERNA (Rock_Cliff) ---")
    create_material_instance(
        master, "MI_Cave_Walls",
        {"BaseColor": ROCK_CLIFF_BASECOLOR, "Normal": ROCK_CLIFF_NORMAL, "ORDp": ROCK_CLIFF_ORDP},
        {"Tiling": 3.0, "RoughnessMin": 0.6, "RoughnessMax": 0.9, "Specular": 0.05}
    )

    print("\n--- CHAO DA CAVERNA (Mossy_Ground) ---")
    create_material_instance(
        master, "MI_Cave_Floor_Mossy",
        {"BaseColor": MOSSY_GROUND_BASECOLOR, "Normal": MOSSY_GROUND_NORMAL, "ORDp": MOSSY_GROUND_ORDP},
        {"Tiling": 2.0, "RoughnessMin": 0.5, "RoughnessMax": 0.85, "Specular": 0.0}
    )

    print("\n--- DETALHES ROCHOSOS (Rocky_Steppe) ---")
    create_material_instance(
        master, "MI_Cave_RockySteppe",
        {"BaseColor": ROCKY_STEPPE_BASECOLOR, "Normal": ROCKY_STEPPE_NORMAL, "ORDp": ROCKY_STEPPE_ORDP},
        {"Tiling": 2.5, "RoughnessMin": 0.55, "RoughnessMax": 0.95, "Specular": 0.08}
    )

print("\n" + "=" * 60)
print("PRONTO! Materiais criados em:")
print(f"  {OUTPUT_PATH}/M_CaveMaster (Material Pai)")
print(f"  {OUTPUT_PATH}/MI_Cave_Walls (Paredes)")
print(f"  {OUTPUT_PATH}/MI_Cave_Floor_Mossy (Chao com Musgo)")
print(f"  {OUTPUT_PATH}/MI_Cave_RockySteppe (Detalhes Rochosos)")
print("=" * 60)
