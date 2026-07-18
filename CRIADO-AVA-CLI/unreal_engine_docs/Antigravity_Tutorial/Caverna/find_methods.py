import unreal
f = open("C:/Users/hijon/Downloads/ava-assistant-30-03-26/mel_methods.txt", "w")
for m in dir(unreal.MaterialEditingLibrary):
    if "exp" in m.lower() and "material" in m.lower():
        f.write(m + "\n")
f.close()
