import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/dbg2.txt", "w")
mat = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/Cave/M_CaveMaster")
mel = unreal.MaterialEditingLibrary

n = mel.get_num_material_expressions(mat)
f.write(f"Total: {n}\n")

for i in range(n):
    e = mel.get_material_expression(mat, i)
    if e:
        cls = e.get_class().get_name()
        try:
            pname = e.get_editor_property("parameter_name")
        except:
            pname = ""
        f.write(f"[{i}] {cls} param={pname}\n")
    else:
        f.write(f"[{i}] NONE\n")

f.write("DONE\n")
f.close()
