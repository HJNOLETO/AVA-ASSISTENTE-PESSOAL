import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/review_final.txt", "w")
mat = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/M_CaveMaster")
mel = unreal.MaterialEditingLibrary

n = mel.get_num_material_expressions(mat)
f.write(f"Nodes: {n}\n\n")

f.write("=== MAIN OUTPUTS ===\n")
props = [
    (unreal.MaterialProperty.MP_BASE_COLOR, "BaseColor"),
    (unreal.MaterialProperty.MP_METALLIC, "Metallic"),
    (unreal.MaterialProperty.MP_SPECULAR, "Specular"),
    (unreal.MaterialProperty.MP_ROUGHNESS, "Roughness"),
    (unreal.MaterialProperty.MP_EMISSIVE_COLOR, "Emissive"),
    (unreal.MaterialProperty.MP_OPACITY, "Opacity"),
    (unreal.MaterialProperty.MP_NORMAL, "Normal"),
    (unreal.MaterialProperty.MP_AMBIENT_OCCLUSION, "AO"),
]
all_ok = True
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
            if label in ["BaseColor", "Normal", "Roughness"]:
                all_ok = False
    except Exception as ex:
        f.write(f"  {label} <- ERR: {ex}\n")
        all_ok = False

f.write("\n=== SCALAR PARAMS ===\n")
for n in mel.get_scalar_parameter_names(mat):
    v = mel.get_material_default_scalar_parameter_value(mat, n)
    f.write(f"  {n} = {v}\n")

f.write("\n=== TEXTURE PARAMS ===\n")
for n in mel.get_texture_parameter_names(mat):
    v = mel.get_material_default_texture_parameter_value(mat, n)
    f.write(f"  {n} = {v.get_name() if v else 'None'}\n")

f.write(f"\n=== STATUS: {'OK' if all_ok else 'ISSUES FOUND'} ===\n")
f.close()
