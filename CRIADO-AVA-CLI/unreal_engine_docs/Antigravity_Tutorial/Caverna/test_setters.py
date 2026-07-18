import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/setter_test.txt", "w")

mi = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/Cave/MI_Test1")
tex = unreal.EditorAssetLibrary.load_asset("/Game/Megascans/Surfaces/Rock_Cliff_vl1lbbylw/T_Rock_Cliff_vl1lbbylw_1K_D")

mel = unreal.MaterialEditingLibrary

# Test 1: set_material_instance_texture_parameter_value via MaterialEditingLibrary
try:
    mel.set_material_instance_texture_parameter_value(mi, "BaseColor", tex)
    f.write("TEST1: set_material_instance_texture_parameter_value OK\n")
except Exception as e:
    f.write(f"TEST1: FAIL - {e}\n")

# Test 2: set_material_instance_scalar_parameter_value via MaterialEditingLibrary
try:
    mel.set_material_instance_scalar_parameter_value(mi, "Tiling", 3.0)
    f.write("TEST2: set_material_instance_scalar_parameter_value OK\n")
except Exception as e:
    f.write(f"TEST2: FAIL - {e}\n")

# Test 3: set_vector_parameter_value_editor_only on MI directly
try:
    mi.set_vector_parameter_value_editor_only("Tint", unreal.LinearColor(1, 0, 0, 1))
    f.write("TEST3: set_vector_parameter_value_editor_only OK\n")
except Exception as e:
    f.write(f"TEST3: FAIL - {e}\n")

# Test 4: set_scalar_parameter_value_editor_only on MI directly
try:
    mi.set_scalar_parameter_value_editor_only("RoughnessMin", 0.5)
    f.write("TEST4: set_scalar_parameter_value_editor_only OK\n")
except Exception as e:
    f.write(f"TEST4: FAIL - {e}\n")

# Test 5: set_texture_parameter_value_editor_only on MI directly
try:
    mi.set_texture_parameter_value_editor_only("BaseColor", tex)
    f.write("TEST5: set_texture_parameter_value_editor_only OK\n")
except Exception as e:
    f.write(f"TEST5: FAIL - {e}\n")

# Test 6: Check if there's a set_material_instance_texture on MEL
for attr in dir(mel):
    if "set_material_instance" in attr.lower():
        f.write(f"MEL_METHOD: {attr}\n")

f.close()
