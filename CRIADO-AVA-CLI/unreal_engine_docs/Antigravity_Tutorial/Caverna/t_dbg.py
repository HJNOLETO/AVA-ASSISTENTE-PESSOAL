import unreal

f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/t_create3.txt", "w")
eal = unreal.EditorAssetLibrary
output = "/Game/Pirate/Materials/Cave"

f.write(f"dir_exists={eal.does_directory_exist(output)}\n")

if not eal.does_directory_exist(output):
    eal.make_directory(output)
    f.write("dir created\n")

if not eal.does_directory_exist("/Game/Pirate/Materials"):
    eal.make_directory("/Game/Pirate/Materials")
    f.write("Materials dir created\n")

at = unreal.AssetToolsHelpers.get_asset_tools()
mat = at.create_asset("M_CaveMaster", output, unreal.Material, unreal.MaterialFactoryNew())
f.write(f"mat_created={mat is not None}\n")

if mat:
    f.write(f"name={mat.get_name()}\n")
else:
    # Tentar em outra pasta
    mat2 = at.create_asset("M_CaveMaster", "/Game/Pirate/Materials", unreal.Material, unreal.MaterialFactoryNew())
    f.write(f"alt_mat={mat2 is not None}\n")

f.close()
