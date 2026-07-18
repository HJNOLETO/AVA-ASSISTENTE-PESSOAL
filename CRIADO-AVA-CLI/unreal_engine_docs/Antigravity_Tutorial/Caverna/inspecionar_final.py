import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/conexoes_finais.txt", "w")
mat = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/Cave/M_CaveMaster")
mel = unreal.MaterialEditingLibrary

n = mel.get_num_material_expressions(mat)
f.write(f"Nodes: {n}\n\n")

f.write("=== MAIN PROPERTY CONNECTIONS ===\n")
props = [
    (unreal.MaterialProperty.MP_BASE_COLOR, "BaseColor"),
    (unreal.MaterialProperty.MP_METALLIC, "Metallic"),
    (unreal.MaterialProperty.MP_SPECULAR, "Specular"),
    (unreal.MaterialProperty.MP_ROUGHNESS, "Roughness"),
    (unreal.MaterialProperty.MP_NORMAL, "Normal"),
    (unreal.MaterialProperty.MP_AMBIENT_OCCLUSION, "AO"),
    (unreal.MaterialProperty.MP_EMISSIVE_COLOR, "Emissive"),
    (unreal.MaterialProperty.MP_OPACITY, "Opacity"),
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

# Verificar texturas usadas
f.write("\n=== USED TEXTURES ===\n")
try:
    texs = mat.get_used_textures()
    f.write(f"Count: {len(texs)}\n")
    for t in texs:
        try:
            f.write(f"  {t.get_name()} ({t.get_path_name()})\n")
        except:
            pass
except Exception as ex:
    f.write(f"ERR: {ex}\n")

# Verificar scalar parameters
f.write("\n=== SCALAR PARAMETERS ===\n")
try:
    sp_names = mel.get_scalar_parameter_names(mat)
    f.write(f"Count: {len(sp_names)}\n")
    for s in sp_names:
        val = mel.get_material_default_scalar_parameter_value(mat, s)
        f.write(f"  {s} = {val}\n")
except Exception as ex:
    f.write(f"ERR: {ex}\n")

# Verificar texture parameters  
f.write("\n=== TEXTURE PARAMETERS ===\n")
try:
    tp_names = mel.get_texture_parameter_names(mat)
    f.write(f"Count: {len(tp_names)}\n")
    for t in tp_names:
        val = mel.get_material_default_texture_parameter_value(mat, t)
        if val:
            f.write(f"  {t} = {val.get_name()}\n")
        else:
            f.write(f"  {t} = NONE\n")
except Exception as ex:
    f.write(f"ERR: {ex}\n")

f.close()
