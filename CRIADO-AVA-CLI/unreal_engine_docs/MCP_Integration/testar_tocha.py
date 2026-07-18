import socket, json, time

def cmd(t, p=None):
    s=socket.socket(); s.settimeout(5)
    s.connect(('127.0.0.1',55557))
    s.sendall(json.dumps({'type':t,'params':p or {}}).encode())
    time.sleep(0.5); s.settimeout(3)
    r=b''
    try:
        while True:
            c=s.recv(8192)
            if not c: break; r+=c
            try: json.loads(r.decode('utf-8')); break
            except: pass
    except: pass
    s.close()
    return json.loads(r.decode('utf-8')) if r else {"error":"EMPTY"}

print("="*50)
print("TESTE: Fluxo Completo da Tocha")
print("="*50)

# 1. Criar BP
print("\n1. Criando BP_TochaAvA...")
r = cmd("create_blueprint", {"name":"BP_TochaAvA", "parent_class":"Actor"})
s = r.get("status","?")
print(f"   {'OK' if s=='success' else 'FAIL'}: {r.get('error','criado')}")
bp_ok = s == "success"

# 2. Adicionar StaticMeshComponent
print("\n2. Adicionando TorchMesh...")
r = cmd("add_component_to_blueprint", {
    "blueprint_name":"BP_TochaAvA",
    "component_type":"StaticMeshComponent",
    "component_name":"TorchMesh",
    "location":[],"rotation":[],"scale":[]
})
print(f"   {'OK' if r.get('status')=='success' else 'FAIL'}: {r.get('error','-')}")

# 3. Adicionar PointLightComponent
print("\n3. Adicionando TorchLight...")
r = cmd("add_component_to_blueprint", {
    "blueprint_name":"BP_TochaAvA",
    "component_type":"PointLightComponent",
    "component_name":"TorchLight",
    "location":[],"rotation":[],"scale":[]
})
print(f"   {'OK' if r.get('status')=='success' else 'FAIL'}: {r.get('error','-')}")

# 4. Configurar mesh da tocha (NOVO comando)
print("\n4. set_component_static_mesh (NOVO!)...")
r = cmd("set_component_static_mesh", {
    "blueprint_name":"BP_TochaAvA",
    "component_name":"TorchMesh",
    "static_mesh":"/Game/AdvancedLocomotionV4/Props/Meshes/Torch"
})
print(f"   {'OK' if r.get('status')=='success' else 'FAIL'}: {r.get('error','-')}")
mesh_ok = r.get("status") == "success"

# 5. Configurar luz (NOVO comando)
print("\n5. set_point_light_properties (NOVO!)...")
r = cmd("set_point_light_properties", {
    "blueprint_name":"BP_TochaAvA",
    "component_name":"TorchLight",
    "intensity": 5000,
    "light_color": [1.0, 0.6, 0.2],
    "attenuation_radius": 800,
    "cast_shadows": True,
    "source_radius": 15
})
print(f"   {'OK' if r.get('status')=='success' else 'FAIL'}: {r.get('error','-')}")
light_ok = r.get("status") == "success"

# 6. Compilar
print("\n6. Compilando BP_TochaAvA...")
r = cmd("compile_blueprint", {"blueprint_name":"BP_TochaAvA"})
s = r.get("status","?")
print(f"   {'OK' if s=='success' else 'FAIL'}: {r.get('error','-')}")

# 7. Spawnar
print("\n7. Spawnando TochaAvA_1...")
r = cmd("spawn_blueprint_actor", {
    "blueprint_name":"BP_TochaAvA",
    "actor_name":"TochaAvA_1",
    "location":[500, 500, 200],
    "rotation":[0,0,0]
})
s = r.get("status","?")
print(f"   {'OK' if s=='success' else 'FAIL'}: {r.get('error','-')}")
spawn_ok = s == "success"

# 8. Anexar ao player (NOVO comando)
print("\n8. attach_actor_to_socket (NOVO!)...")
r = cmd("attach_actor_to_socket", {
    "child":"TochaAvA_1",
    "parent":"ALS_NPC_C_0",
    "socket":"WeaponHand"
})
s = r.get("status","?")
print(f"   {'OK' if s=='success' else 'FAIL'}: {r.get('error','-')}")
attach_ok = s == "success"

print("\n" + "="*50)
print("RESUMO")
print("="*50)
print(f"  BP criado:          {'OK' if bp_ok else 'FAIL'}")
print(f"  Mesh da tocha:      {'OK' if mesh_ok else 'FAIL'}")
print(f"  Luz configurada:    {'OK' if light_ok else 'FAIL'}")
print(f"  Spawnado:           {'OK' if spawn_ok else 'FAIL'}")
print(f"  Anexado ao NPC:     {'OK' if attach_ok else 'FAIL'}")
print("\nVerifique no UE5: ALS_NPC_C_0 segurando a tocha na mao direita!")
