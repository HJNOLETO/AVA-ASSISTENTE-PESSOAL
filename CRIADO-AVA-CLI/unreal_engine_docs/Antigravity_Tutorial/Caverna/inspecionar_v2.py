import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/material_debug.txt", "w")
mat = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/Cave/M_CaveMaster")
mel = unreal.MaterialEditingLibrary

if not mat:
    f.write("Material nao encontrado!")
    f.close()
    exit()

f.write("=== M_CaveMaster ===\n\n")
n = mel.get_num_material_expressions(mat)
f.write(f"Total nodes: {n}\n\n")

# Listar expressoes
expressions = {}
for i in range(n):
    expr = mel.get_material_expression(mat, i)
    if expr:
        cls = expr.get_class().get_name()
        try:
            pname = expr.get_editor_property("parameter_name")
        except:
            pname = ""
        desc = str(expr.get_editor_property("desc")) if hasattr(expr, "get_editor_property") else ""
        expressions[i] = (cls, pname, desc, expr)
        f.write(f"[{i}] {cls}  param='{pname}'\n")

f.write("\n=== MAIN OUTPUTS ===\n")
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
for prop, label in props:
    try:
        node = mel.get_material_property_input_node(mat, prop)
        out = mel.get_material_property_input_node_output_name(mat, prop)
        if node:
            nc = node.get_class().get_name()
            np = ""
            try:
                np = node.get_editor_property("parameter_name") or ""
            except:
                pass
            f.write(f"  {label} <- [{nc}] {np} . {out}\n")
        else:
            f.write(f"  {label} <- NONE\n")
    except Exception as e:
        f.write(f"  {label} <- ERROR\n")

f.write("\n=== CONNECTIONS ===\n")
for idx, (cls, pname, desc, expr) in expressions.items():
    inputs = mel.get_inputs_for_material_expression(expr)
    if inputs:
        f.write(f"\n[{idx}] {cls} '{pname}':\n")
        for inp in inputs:
            inp_name = inp.get_name()
            if inp.is_connected():
                try:
                    src = mel.get_material_expression_input_node(expr, inp_name)
                    if src:
                        sc = src.get_class().get_name()
                        sp = ""
                        try:
                            sp = src.get_editor_property("parameter_name") or ""
                        except:
                            pass
                        f.write(f"  {inp_name} <- [{sc}] '{sp}'\n")
                    else:
                        f.write(f"  {inp_name} <- NONE\n")
                except Exception as e:
                    f.write(f"  {inp_name} <- ERROR: {e}\n")
            else:
                f.write(f"  {inp_name} <- NC\n")

f.close()
