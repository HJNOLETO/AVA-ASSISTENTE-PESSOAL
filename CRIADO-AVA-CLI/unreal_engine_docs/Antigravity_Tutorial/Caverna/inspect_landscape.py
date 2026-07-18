import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/landscape_review.txt", "w")
mat = unreal.EditorAssetLibrary.load_asset("/Game/Materials/Landscape/M_PirataPerdido_Landscape")
mel = unreal.MaterialEditingLibrary

n = mel.get_num_material_expressions(mat)
f.write(f"Nodes: {n}\n\n")

f.write("=== MAIN OUTPUTS ===\n")
props = [
    (unreal.MaterialProperty.MP_BASE_COLOR, "BaseColor"),
    (unreal.MaterialProperty.MP_NORMAL, "Normal"),
    (unreal.MaterialProperty.MP_ROUGHNESS, "Roughness"),
    (unreal.MaterialProperty.MP_AMBIENT_OCCLUSION, "AO"),
    (unreal.MaterialProperty.MP_METALLIC, "Metallic"),
    (unreal.MaterialProperty.MP_SPECULAR, "Specular"),
]
issue = False
for prop, label in props:
    try:
        node = mel.get_material_property_input_node(mat, prop)
        out = mel.get_material_property_input_node_output_name(mat, prop)
        if node:
            cn = node.get_class().get_name()
            pn = ""
            try: pn = node.get_editor_property("parameter_name") or ""
            except: pass
            f.write(f"  {label} <- [{cn}] param='{pn}' pin='{out}'\n")
        else:
            f.write(f"  {label} <- NONE\n")
            if label in ["BaseColor","Normal","Roughness","AO"]:
                issue = True
    except Exception as ex:
        f.write(f"  {label} <- ERR: {ex}\n")
        issue = True

f.write("\n=== SCALAR PARAMS ===\n")
for n in mel.get_scalar_parameter_names(mat):
    v = mel.get_material_default_scalar_parameter_value(mat, n)
    f.write(f"  {n} = {v}\n")

f.write(f"\n=== STATUS: {'ISSUES' if issue else 'OK'} ===\n")
f.close()
