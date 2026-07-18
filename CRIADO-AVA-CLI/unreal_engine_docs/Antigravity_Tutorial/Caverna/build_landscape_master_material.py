"""
build_landscape_master_material.py
------------------------------------
Cria o Master Material de Landscape "M_PirataPerdido_Landscape" via
Unreal Python API (unreal.MaterialEditingLibrary).

FILOSOFIA DO MATERIAL
----------------------
  PERTO da câmera:
    - Textura lida no mip 0 (nitidez máxima)
    - Tiling em escala de detalhe (parametrizável por instância)
    - Normal map em força total

  LONGE da câmera:
    - A MESMA amostra de textura (não uma segunda!) usa um mip level
      crescente, dirigido pela distância -> menos banda/cache de GPU,
      sem custo extra de leitura.
    - O Normal Map esmaece em direção a "flat" -> reduz aliasing
      especular e custo de shading.
    - Uma ÚNICA textura de ruído (macro variation), compartilhada
      entre as 3 camadas, quebra o padrão de repetição visível de
      longe — sem precisar de uma segunda amostra completa por camada
      (que era o que o grafo original fazia, 1x por canal x 3 camadas).

  Isso troca um truque puramente cosmético (e caro) por um que é
  cosmético E barato.

COMO RODAR
----------
  1. Ajuste TEXTURE_PATHS abaixo com os caminhos reais dos seus assets
     (Megascans, etc). Pode deixar None e atribuir depois no editor.
  2. No UE5: Window > Developer Tools > Output Log > aba "Python" (ou
     Editor Utility Widget com Python), ou via Remote Execution.
  3. Execute:
       exec(open(r"CAMINHO/build_landscape_master_material.py").read())

AVISOS IMPORTANTES (leia antes de rodar)
-----------------------------------------
  - Este script é um SCAFFOLD funcional, não um produto testado em
    todas as versões de engine. Três pontos costumam variar entre
    versões do UE5 e merecem revisão visual no Material Editor depois
    de rodar:
      a) O pino "MipValue" do MaterialExpressionTextureSample só
         existe/aparece quando mip_value_mode = MVM_MipLevel. O nome
         exato do enum pode ser unreal.MaterialExpressionMipValueMode
         em algumas versões. O script tenta e avisa no log se falhar
         (você conecta manualmente em 10 segundos no editor).
      b) MaterialExpressionLandscapeLayerBlend usa uma struct array
         dinâmica (Layers). Os pinos "Layer <Nome>" e "Height <Nome>"
         só aparecem DEPOIS que a lista de layers é setada — por isso
         a ordem no código (set "layers" antes de conectar) importa.
      c) unreal.LayerBlendType e unreal.MaterialProperty podem ter
         nomes ligeiramente diferentes (ex.: LB_HEIGHT_BLEND vs
         HeightBlend) dependendo da versão — se der AttributeError,
         rode `dir(unreal.LayerBlendType)` no console pra ver o nome
         certo e ajuste a constante no topo do arquivo.
  - Depois de rodar, abra o material e dê um Apply + confira o preview
    antes de criar Material Instances.
"""

import unreal

MEL = unreal.MaterialEditingLibrary
AssetTools = unreal.AssetToolsHelpers.get_asset_tools()

MATERIAL_PATH = "/Game/Materials/Landscape"
MATERIAL_NAME = "M_PirataPerdido_Landscape"

LAYERS = ["Sand", "Grass", "Rock"]

# Preencha com os caminhos reais (ex: "/Game/Megascans/Surfaces/.../T_..._D")
TEXTURE_PATHS = {
    "Sand":  {"Color": None, "Normal": None, "ORDp": None},
    "Grass": {"Color": None, "Normal": None, "ORDp": None},
    "Rock":  {"Color": None, "Normal": None, "ORDp": None},
}
# Textura de ruído cinza, tiling enorme, usada 1x só pra quebrar
# repetição visível de longe (ex: "/Game/Textures/T_MacroNoise")
MACRO_VARIATION_TEXTURE = None


def load_texture(path):
    if not path:
        return None
    tex = unreal.EditorAssetLibrary.load_asset(path)
    if tex is None:
        unreal.log_warning(f"[Landscape Material] Textura não encontrada: {path}")
    return tex


def create_material():
    factory = unreal.MaterialFactoryNew()
    mat = AssetTools.create_asset(MATERIAL_NAME, MATERIAL_PATH, unreal.Material, factory)
    mat.set_editor_property("material_domain", unreal.MaterialDomain.MD_SURFACE)
    mat.set_editor_property("blend_mode", unreal.BlendMode.BLEND_OPAQUE)
    mat.set_editor_property("shading_model", unreal.MaterialShadingModel.MSM_DEFAULT_LIT)
    return mat


def add_scalar_param(mat, name, default, x, y):
    node = MEL.create_material_expression(mat, unreal.MaterialExpressionScalarParameter, x, y)
    node.set_editor_property("parameter_name", name)
    node.set_editor_property("default_value", default)
    return node


def build_distance_alpha(mat):
    """0.0 = perto da câmera, 1.0 = longe (já saturado). Também retorna
    o valor de mip bias (0 -> MaxMipBiasFar) pra alimentar as amostras."""
    world_pos = MEL.create_material_expression(mat, unreal.MaterialExpressionWorldPosition, -2400, 0)
    cam_pos = MEL.create_material_expression(mat, unreal.MaterialExpressionCameraPositionWS, -2400, 150)

    dist = MEL.create_material_expression(mat, unreal.MaterialExpressionDistance, -2150, 60)
    MEL.connect_material_expressions(world_pos, "", dist, "A")
    MEL.connect_material_expressions(cam_pos, "", dist, "B")

    fade_start = add_scalar_param(mat, "DetailFadeStartDistance", 800.0, -2400, 300)
    fade_end = add_scalar_param(mat, "DetailFadeEndDistance", 3000.0, -2400, 380)

    sub_a = MEL.create_material_expression(mat, unreal.MaterialExpressionSubtract, -1950, 60)
    MEL.connect_material_expressions(dist, "", sub_a, "A")
    MEL.connect_material_expressions(fade_start, "", sub_a, "B")

    sub_b = MEL.create_material_expression(mat, unreal.MaterialExpressionSubtract, -1950, 200)
    MEL.connect_material_expressions(fade_end, "", sub_b, "A")
    MEL.connect_material_expressions(fade_start, "", sub_b, "B")

    div = MEL.create_material_expression(mat, unreal.MaterialExpressionDivide, -1750, 100)
    MEL.connect_material_expressions(sub_a, "", div, "A")
    MEL.connect_material_expressions(sub_b, "", div, "B")

    clamp = MEL.create_material_expression(mat, unreal.MaterialExpressionClamp, -1550, 100)
    clamp.set_editor_property("min_default", 0.0)
    clamp.set_editor_property("max_default", 1.0)
    MEL.connect_material_expressions(div, "", clamp, "Input")

    max_mip_bias = add_scalar_param(mat, "MaxMipBiasFar", 5.0, -1550, 260)
    mip_mult = MEL.create_material_expression(mat, unreal.MaterialExpressionMultiply, -1350, 180)
    MEL.connect_material_expressions(clamp, "", mip_mult, "A")
    MEL.connect_material_expressions(max_mip_bias, "", mip_mult, "B")

    return clamp, mip_mult


def channel_mask(mat, source, r, g, b, x, y):
    cm = MEL.create_material_expression(mat, unreal.MaterialExpressionComponentMask, x, y)
    cm.set_editor_property("r", r)
    cm.set_editor_property("g", g)
    cm.set_editor_property("b", b)
    MEL.connect_material_expressions(source, "", cm, "Input")
    return cm


def make_texture_sample(mat, tex, uv_node, mip_bias, x, y, label):
    node = MEL.create_material_expression(mat, unreal.MaterialExpressionTextureSample, x, y)
    if tex:
        node.set_editor_property("texture", tex)
    MEL.connect_material_expressions(uv_node, "", node, "UVs")
    try:
        node.set_editor_property("mip_value_mode", unreal.MipValueMode.MVM_MIP_LEVEL)
    except Exception as e:
        unreal.log_warning(f"[{label}] mip_value_mode não setado automaticamente ({e}); ajuste manualmente.")
    try:
        MEL.connect_material_expressions(mip_bias, "", node, "MipValue")
    except Exception as e:
        unreal.log_warning(f"[{label}] conecte manualmente o pino 'MipValue' (nome pode variar por versão).")
    return node


def build_layer_sampling(mat, layer_name, tex_color, tex_normal, tex_ordp, mip_bias, base_x, base_y):
    tiling = add_scalar_param(mat, f"{layer_name}_DetailTiling", 8.0, base_x - 250, base_y - 150)
    coords = MEL.create_material_expression(mat, unreal.MaterialExpressionLandscapeLayerCoords, base_x - 250, base_y)
    coords.set_editor_property("mapping_scale", 1.0)

    uv_mult = MEL.create_material_expression(mat, unreal.MaterialExpressionMultiply, base_x - 100, base_y)
    MEL.connect_material_expressions(coords, "", uv_mult, "A")
    MEL.connect_material_expressions(tiling, "", uv_mult, "B")

    color_node = make_texture_sample(mat, tex_color, uv_mult, mip_bias, base_x + 150, base_y - 150, f"{layer_name}_Color")
    normal_node = make_texture_sample(mat, tex_normal, uv_mult, mip_bias, base_x + 150, base_y + 50, f"{layer_name}_Normal")
    ordp_node = make_texture_sample(mat, tex_ordp, uv_mult, mip_bias, base_x + 150, base_y + 250, f"{layer_name}_ORDp")

    return color_node, normal_node, ordp_node


def build_normal_fade(mat, normal_node, distance_alpha, x, y):
    flat_normal = MEL.create_material_expression(mat, unreal.MaterialExpressionConstant3Vector, x, y - 80)
    flat_normal.set_editor_property("constant", unreal.LinearColor(0.5, 0.5, 1.0, 1.0))

    fade_amount = add_scalar_param(mat, "NormalFadeFar", 0.75, x, y - 200)
    fade_mult = MEL.create_material_expression(mat, unreal.MaterialExpressionMultiply, x + 160, y - 140)
    MEL.connect_material_expressions(distance_alpha, "", fade_mult, "A")
    MEL.connect_material_expressions(fade_amount, "", fade_mult, "B")

    lerp = MEL.create_material_expression(mat, unreal.MaterialExpressionLinearInterpolate, x + 320, y)
    MEL.connect_material_expressions(normal_node, "", lerp, "A")
    MEL.connect_material_expressions(flat_normal, "", lerp, "B")
    MEL.connect_material_expressions(fade_mult, "", lerp, "Alpha")
    return lerp


def build_macro_variation(mat, macro_tex, distance_alpha, x, y):
    """1 única amostra de ruído (tiling enorme) pra quebrar repetição
    de longe. Retorna um multiplicador (1.0 perto -> ruído longe)."""
    coords = MEL.create_material_expression(mat, unreal.MaterialExpressionLandscapeLayerCoords, x - 250, y)
    coords.set_editor_property("mapping_scale", 0.02)

    sample = MEL.create_material_expression(mat, unreal.MaterialExpressionTextureSample, x, y)
    if macro_tex:
        sample.set_editor_property("texture", macro_tex)
    MEL.connect_material_expressions(coords, "", sample, "UVs")

    strength = add_scalar_param(mat, "MacroVariationStrengthFar", 0.25, x, y - 150)
    mult = MEL.create_material_expression(mat, unreal.MaterialExpressionMultiply, x + 160, y - 80)
    MEL.connect_material_expressions(distance_alpha, "", mult, "A")
    MEL.connect_material_expressions(strength, "", mult, "B")

    one_const = MEL.create_material_expression(mat, unreal.MaterialExpressionConstant, x + 160, y + 40)
    one_const.set_editor_property("r", 1.0)

    lerp = MEL.create_material_expression(mat, unreal.MaterialExpressionLinearInterpolate, x + 320, y)
    MEL.connect_material_expressions(one_const, "", lerp, "A")
    MEL.connect_material_expressions(sample, "", lerp, "B")
    MEL.connect_material_expressions(mult, "", lerp, "Alpha")
    return lerp


def make_layer_blend(mat, layer_inputs, x, y):
    """layer_inputs: lista de (nome_camada, expr_cor, expr_altura)."""
    node = MEL.create_material_expression(mat, unreal.MaterialExpressionLandscapeLayerBlend, x, y)

    layers = []
    for layer_name, _color_expr, _height_expr in layer_inputs:
        entry = unreal.LayerBlendInput()
        entry.set_editor_property("layer_name", layer_name)
        entry.set_editor_property("blend_type", unreal.LayerBlendType.LB_HEIGHT_BLEND)
        layers.append(entry)
    node.set_editor_property("layers", layers)

    for layer_name, color_expr, height_expr in layer_inputs:
        if color_expr is not None:
            MEL.connect_material_expressions(color_expr, "", node, f"Layer {layer_name}")
        if height_expr is not None:
            MEL.connect_material_expressions(height_expr, "", node, f"Height {layer_name}")
    return node


def main():
    # Se ja existe, deletar antes
    full_path = f"{MATERIAL_PATH}/{MATERIAL_NAME}"
    if unreal.EditorAssetLibrary.does_asset_exist(full_path):
        unreal.EditorAssetLibrary.delete_asset(full_path)
        unreal.log(f"Deleted existing: {full_path}")

    mat = create_material()
    distance_alpha, mip_bias = build_distance_alpha(mat)

    color_layers, normal_layers, ao_layers, rough_layers, height_layers = [], [], [], [], []

    y_step = 700
    for i, layer_name in enumerate(LAYERS):
        base_y = i * y_step
        tex_color = load_texture(TEXTURE_PATHS[layer_name]["Color"])
        tex_normal = load_texture(TEXTURE_PATHS[layer_name]["Normal"])
        tex_ordp = load_texture(TEXTURE_PATHS[layer_name]["ORDp"])

        color_node, normal_node, ordp_node = build_layer_sampling(
            mat, layer_name, tex_color, tex_normal, tex_ordp, mip_bias, -900, base_y
        )
        normal_faded = build_normal_fade(mat, normal_node, distance_alpha, -400, base_y)

        # ORDp empacotado: R=AO, G=Roughness, B=Height/Displacement
        ao_mask = channel_mask(mat, ordp_node, True, False, False, -150, base_y + 220)
        rough_mask = channel_mask(mat, ordp_node, False, True, False, -150, base_y + 300)
        height_mask = channel_mask(mat, ordp_node, False, False, True, -150, base_y + 380)

        color_layers.append((layer_name, color_node, height_mask))
        normal_layers.append((layer_name, normal_faded, height_mask))
        ao_layers.append((layer_name, ao_mask, height_mask))
        rough_layers.append((layer_name, rough_mask, height_mask))

    final_color = make_layer_blend(mat, color_layers, 250, 0)
    final_normal = make_layer_blend(mat, normal_layers, 250, 700)
    final_ao = make_layer_blend(mat, ao_layers, 250, 1400)
    final_rough = make_layer_blend(mat, rough_layers, 250, 2100)

    macro_tex = load_texture(MACRO_VARIATION_TEXTURE)
    macro_lerp = build_macro_variation(mat, macro_tex, distance_alpha, 650, -150)

    final_color_mult = MEL.create_material_expression(mat, unreal.MaterialExpressionMultiply, 900, 0)
    MEL.connect_material_expressions(final_color, "", final_color_mult, "A")
    MEL.connect_material_expressions(macro_lerp, "", final_color_mult, "B")

    # Tenta conectar outputs com fallback de pinos
    def connect_output(node, prop, label):
        if node is None:
            unreal.log_warning(f"[{label}] Node is None, skipping.")
            return False
        for pin in ["", "Result", "Output"]:
            try:
                MEL.connect_material_property(node, pin, prop)
                unreal.log(f"[{label}] Connected with pin='{pin}'")
                return True
            except:
                continue
        unreal.log_warning(f"[{label}] Nao foi possivel conectar.")
        return False
    connect_output(final_color_mult, unreal.MaterialProperty.MP_BASE_COLOR, "BaseColor")
    connect_output(final_normal, unreal.MaterialProperty.MP_NORMAL, "Normal")
    connect_output(final_ao, unreal.MaterialProperty.MP_AMBIENT_OCCLUSION, "AO")
    connect_output(final_rough, unreal.MaterialProperty.MP_ROUGHNESS, "Roughness")

    MEL.recompile_material(mat)
    unreal.EditorAssetLibrary.save_loaded_asset(mat)
    unreal.log(f"Material criado: {mat.get_path_name()}")
    unreal.log("Parâmetros expostos pra Material Instances: DetailFadeStartDistance, "
               "DetailFadeEndDistance, MaxMipBiasFar, NormalFadeFar, "
               "MacroVariationStrengthFar, <Camada>_DetailTiling.")


if __name__ == "__main__":
    main()
