import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/conexoes_finais.txt", "w")
mat = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/Cave/M_CaveMaster")
mel = unreal.MaterialEditingLibrary

n = mel.get_num_material_expressions(mat)
f.write(f"Nodos: {n}\n")

# Listar todos os nodes por classe via posicao
f.write("\n=== NODES (por indice) ===\n")
for i in range(n):
    try:
        e = mel.get_material_expression_node_position(mat, i)
        f.write(f"[{i}] pos={e}\n")
    except Exception as ex:
        f.write(f"[{i}] ERR: {ex}\n")

f.write("\n=== MAIN OUTPUTS ===\n")
props = [
    (unreal.MaterialProperty.MP_BASE_COLOR, "BaseColor"),
    (unreal.MaterialProperty.MP_METALLIC, "Metallic"),
    (unreal.MaterialProperty.MP_SPECULAR, "Specular"),
    (unreal.MaterialProperty.MP_ROUGHNESS, "Roughness"),
    (unreal.MaterialProperty.MP_NORMAL, "Normal"),
    (unreal.MaterialProperty.MP_AMBIENT_OCCLUSION, "AO"),
    (unreal.MaterialProperty.MP_EMISSIVE_COLOR, "Emissive"),
]
for prop, label in props:
    try:
        node = mel.get_material_property_input_node(mat, prop)
        out = mel.get_material_property_input_node_output_name(mat, prop)
        if node:
            cls = node.get_class().get_name()
            pname = ""
            try:
                pname = node.get_editor_property("parameter_name") or ""
            except:
                pass
            f.write(f"  {label} <- [{cls}] param='{pname}' pin='{out}'\n")
        else:
            f.write(f"  {label} <- NONE\n")
    except Exception as ex:
        f.write(f"  {label} <- ERR: {ex}\n")

f.write("\n=== CHECK DE STATIC SWITCHES/USED TEXTURES ===\n")
try:
    texs = mat.get_used_textures()
    f.write(f"Textures used: {len(texs)}\n")
    for t in texs:
        f.write(f"  {t.get_name()}\n")
except Exception as ex:
    f.write(f"ERR textures: {ex}\n")

f.close()
