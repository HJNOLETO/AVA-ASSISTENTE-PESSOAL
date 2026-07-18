import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/dbg3.txt", "w")
mat = unreal.EditorAssetLibrary.load_asset("/Game/Pirate/Materials/Cave/M_CaveMaster")
mel = unreal.MaterialEditingLibrary

n = mel.get_num_material_expressions(mat)
f.write(f"Total: {n}\n")

for i in range(n):
    try:
        e = mel.get_material_expression(mat, i)
        cls = e.get_class().get_name() if e else "NONE"
        f.write(f"[{i}] {cls}\n")
    except Exception as ex:
        f.write(f"[{i}] EXCEPTION: {ex}\n")

f.write("DONE\n")
f.close()
