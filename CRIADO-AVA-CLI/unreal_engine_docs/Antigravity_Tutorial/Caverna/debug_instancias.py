import unreal
import traceback

out_file = "C:/Users/hijon/Downloads/ava-assistant-30-03-26/instance_debug.txt"
log = []

def log_msg(msg):
    log.append(msg)
    print(msg)

at = unreal.AssetToolsHelpers.get_asset_tools()
eal = unreal.EditorAssetLibrary
output = "/Game/Pirate/Materials/Cave"

try:
    mat = eal.load_asset(f"{output}/M_CaveMaster")
    log_msg(f"Material loaded: {mat is not None}, name: {mat.get_name() if mat else 'NONE'}")
except Exception as e:
    log_msg(f"ERROR loading material: {e}")
    mat = None

if mat:
    # Test 1: Create without parent, then set parent
    log_msg("--- Test 1: No parent ---")
    factory = unreal.MaterialInstanceConstantFactoryNew()
    # Do NOT set initial_parent
    mi = at.create_asset("MI_Test1", output, unreal.MaterialInstanceConstant, factory)
    log_msg(f"mi: {mi is not None}")
    
    if mi:
        pkg = mi.get_package()
        log_msg(f"pkg: {pkg.get_name()}")
        
        # Try setting parent after creation
        try:
            mi.set_editor_property("parent", mat)
            log_msg("Parent set via set_editor_property")
        except Exception as e:
            log_msg(f"ERROR set parent: {e}")
        
        # Test different save methods
        try:
            eal.save_loaded_asset(mi)
            log_msg("Save 1: save_loaded_asset OK")
        except Exception as e:
            log_msg(f"Save 1 error: {e}")
    
    # Test 2: Create with initial_parent
    log_msg("--- Test 2: With initial_parent ---")
    try:
        factory2 = unreal.MaterialInstanceConstantFactoryNew()
        factory2.initial_parent = mat
        mi2 = at.create_asset("MI_Test2", output, unreal.MaterialInstanceConstant, factory2)
        log_msg(f"mi2: {mi2 is not None}")
        if mi2:
            eal.save_loaded_asset(mi2)
            log_msg("Save 2: OK")
    except Exception as e:
        log_msg(f"Test 2 error: {e}")

# Verificar disco
log_msg("--- After save, checking ---")
for name in ["MI_Test1", "MI_Test2", "M_CaveMaster"]:
    exists = eal.does_asset_exist(f"{output}/{name}")
    log_msg(f"  {name}: exists={exists}")

with open(out_file, "w") as f:
    f.write("\n".join(log))
