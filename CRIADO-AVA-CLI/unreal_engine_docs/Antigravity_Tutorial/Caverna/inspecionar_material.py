import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/material_debug.txt", "w")
mat = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/Cave/M_CaveMaster")

if not mat:
    f.write("Material nao encontrado!")
    f.close()
    exit()

f.write(f"=== M_CaveMaster ===\n\n")
f.write(f"ShadingModel: {mat.get_editor_property('shading_model')}\n")
f.write(f"BlendMode: {mat.get_editor_property('blend_mode')}\n\n")

# Expressoes por tipo
f.write("=== EXPRESSION NODES ===\n\n")
expr_count = unreal.MaterialEditingLibrary.get_num_material_expressions(mat)
f.write(f"Total nodes: {expr_count}\n")

expressions = []
for i in range(expr_count):
    expr = unreal.MaterialEditingLibrary.get_material_expression(mat, i)
    if expr:
        cls = expr.get_class().get_name()
        pos_x = unreal.MaterialEditingLibrary.get_material_expression_node_position_x(expr)
        pos_y = unreal.MaterialEditingLibrary.get_material_expression_node_position_y(expr)
        desc = expr.get_editor_property("desc") if hasattr(expr, "get_editor_property") else ""
        param_name = ""
        try:
            param_name = expr.get_editor_property("parameter_name")
        except:
            pass
        expressions.append((i, cls, pos_x, pos_y, param_name, desc, expr))

# Ordenar por posicao X
expressions.sort(key=lambda e: e[2])

for idx, cls, x, y, pname, desc, expr in expressions:
    desc_str = f" [{desc}]" if desc else ""
    param_str = f" param={pname}" if pname else ""
    f.write(f"[{idx}] {cls} @ ({x}, {y}){param_str}{desc_str}\n")

f.write("\n=== MAIN PROPERTY CONNECTIONS ===\n\n")
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
        node = unreal.MaterialEditingLibrary.get_material_property_input_node(mat, prop)
        output_name = unreal.MaterialEditingLibrary.get_material_property_input_node_output_name(mat, prop)
        if node:
            node_cls = node.get_class().get_name()
            node_name = ""
            try:
                node_name = node.get_editor_property("parameter_name") or ""
            except:
                pass
            f.write(f"  {label} <- [{node_cls}] {node_name} . {output_name}\n")
        else:
            f.write(f"  {label} <- NONE (no connection)\n")
    except Exception as e:
        f.write(f"  {label} <- ERROR: {e}\n")

f.write("\n=== EXPRESSION INPUT CONNECTIONS ===\n\n")
for idx, cls, x, y, pname, desc, expr in expressions:
    inputs = unreal.MaterialEditingLibrary.get_inputs_for_material_expression(expr)
    if inputs and len(inputs) > 0:
        f.write(f"[{idx}] {cls} '{pname}':\n")
        for inp in inputs:
            connected = inp.is_connected()
            inp_name = inp.get_name()
            if connected:
                # Get the connected expression
                try:
                    source_expr = unreal.MaterialEditingLibrary.get_material_expression_input_node(expr, inp_name)
                    if source_expr:
                        src_cls = source_expr.get_class().get_name()
                        src_pname = ""
                        try:
                            src_pname = source_expr.get_editor_property("parameter_name") or ""
                        except:
                            pass
                        f.write(f"    {inp_name} <- [{src_cls}] {src_pname}\n")
                    else:
                        f.write(f"    {inp_name} <- NONE\n")
                except:
                    f.write(f"    {inp_name} <- (connected but cant resolve)\n")
            else:
                f.write(f"    {inp_name} <- (not connected)\n")

f.close()
