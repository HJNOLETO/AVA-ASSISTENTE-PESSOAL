import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/fix_result.txt", "w")
mat = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/Cave/M_CaveMaster")
mel = unreal.MaterialEditingLibrary
n = mel.get_num_material_expressions(mat)

# Encontrar o node Normal e o node Add (roughness)
r_add = None
nrm_node = None

# Get expressions via the material's expressions array
try:
    exprs = mat.get_editor_property("expressions")
    f.write(f"Got expressions array with {len(exprs)} elements\n")
    for e in exprs:
        cls = e.get_class().get_name()
        if cls == "MaterialExpressionTextureSampleParameter2D":
            try:
                pn = e.get_editor_property("parameter_name")
                if pn == "Normal":
                    nrm_node = e
                    f.write(f"Found Normal node\n")
            except:
                pass
        elif cls == "MaterialExpressionAdd":
            # Check if this is the roughness add (not connected to any param)
            try:
                inputs = mel.get_inputs_for_material_expression(e)
                if inputs:
                    for inp in inputs:
                        if inp.is_connected():
                            src = mel.get_material_expression_input_node(e, inp.get_name())
                            if src:
                                src_cls = src.get_class().get_name()
                                if "Clamp" in src_cls:
                                    r_add = e
                                    f.write(f"Found Roughness Add node\n")
                                    break
            except:
                pass
except Exception as ex:
    f.write(f"ERR getting expressions: {ex}\n")

# Fix 1: Reconnect Normal
if nrm_node:
    try:
        mel.connect_material_property(nrm_node, "", unreal.MaterialProperty.MP_NORMAL)
        f.write("FIX 1: Normal connected with '' pin\n")
    except Exception as ex:
        f.write(f"FIX 1 ERR: {ex}\n")
        try:
            mel.connect_material_property(nrm_node, "RGB", unreal.MaterialProperty.MP_NORMAL)
            f.write("FIX 1b: Normal connected with 'RGB' pin\n")
        except Exception as ex2:
            f.write(f"FIX 1b ERR: {ex2}\n")
else:
    f.write("FIX 1: Normal node NOT FOUND\n")

# Fix 2: Reconnect Roughness to Add
if r_add:
    try:
        mel.connect_material_property(r_add, "", unreal.MaterialProperty.MP_ROUGHNESS)
        f.write("FIX 2: Roughness connected to Add\n")
    except Exception as ex:
        f.write(f"FIX 2 ERR: {ex}\n")
else:
    f.write("FIX 2: Roughness Add node NOT FOUND\n")
    # Fallback: find any Add node
    try:
        exprs2 = mat.get_editor_property("expressions")
        for e in exprs2:
            if e.get_class().get_name() == "MaterialExpressionAdd":
                pname = ""
                try:
                    pname = e.get_editor_property("parameter_name") or ""
                except:
                    pass
                if not pname:
                    mel.connect_material_property(e, "", unreal.MaterialProperty.MP_ROUGHNESS)
                    f.write(f"FIX 2b: Connected first available Add to Roughness\n")
                    break
    except Exception as ex:
        f.write(f"FIX 2 ERR2: {ex}\n")

# Fix 3: Set Tiling default
try:
    tp_names = mel.get_texture_parameter_names(mat)
    for tp in tp_names:
        print(f"  tp: {tp}")
except:
    pass

# Recompile
mel.recompile_material(mat)
unreal.EditorAssetLibrary.save_loaded_asset(mat)
f.write("\nCompiled and saved\n")
f.close()
