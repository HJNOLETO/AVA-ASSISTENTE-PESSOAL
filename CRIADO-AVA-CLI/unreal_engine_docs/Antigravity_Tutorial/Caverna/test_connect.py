import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/ls_debug.txt", "w")
mat = unreal.EditorAssetLibrary.load_asset("/Game/Materials/Landscape/M_PirataPerdido_Landscape")
mel = unreal.MaterialEditingLibrary

# Teste: criar um node escalar basico e conectar ao Metallic
test_node = mel.create_material_expression(mat, unreal.MaterialExpressionScalarParameter, 9999, 9999)
test_node.set_editor_property("parameter_name", "DBG_Metal")

try:
    mel.connect_material_property(test_node, "", unreal.MaterialProperty.MP_METALLIC)
    # Verificar se conectou
    result = mel.get_material_property_input_node(mat, unreal.MaterialProperty.MP_METALLIC)
    if result:
        cn = result.get_class().get_name()
        pn = result.get_editor_property("parameter_name")
        f.write(f"TEST OK: Metallic <- [{cn}] param='{pn}'\n")
    else:
        f.write("TEST FAIL: Metallic still NONE after connect\n")
except Exception as e:
    f.write(f"TEST EXCEPTION: {e}\n")

f.close()
