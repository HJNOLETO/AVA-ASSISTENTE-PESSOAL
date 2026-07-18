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
            try:
                json.loads(r.decode('utf-8')); break
            except: pass
    except: pass
    s.close()
    return json.loads(r.decode('utf-8')) if r else {"error":"EMPTY"}

# Teste 1: Componente - era o bug critico
print("=== TESTE 1: add_component_to_blueprint ===")
r = cmd("add_component_to_blueprint", {
    "blueprint_name": "BP_TesteMCP",
    "component_type": "StaticMeshComponent",
    "component_name": "TestMesh",
    "location":[], "rotation":[], "scale":[]
})
print(f"Status: {r.get('status')}  Error: {r.get('error','-')}")
if r.get("status") == "success":
    print(">>> CORRECAO FUNCIONOU! Componente adicionado!")

# Teste 2: PointLight
print("\n=== TESTE 2: PointLightComponent ===")
r = cmd("add_component_to_blueprint", {
    "blueprint_name": "BP_TesteMCP",
    "component_type": "PointLightComponent",
    "component_name": "LightComp",
    "location":[], "rotation":[], "scale":[]
})
print(f"Status: {r.get('status')}  Error: {r.get('error','-')}")
if r.get("status") == "success":
    print(">>> PointLight funciona!")

# Teste 3: Compilar
print("\n=== TESTE 3: compile_blueprint ===")
r = cmd("compile_blueprint", {"blueprint_name": "BP_TesteMCP"})
print(f"Status: {r.get('status')}  Compiled: {r.get('result',{}).get('compiled','?')}")

# Teste 4: Parede procedural (NOVO comando)
print("\n=== TESTE 4: create_wall (NOVO!) ===")
r = cmd("create_wall", {
    "length": 5, "height": 3, "block_size": 100,
    "location": [2000, 2000, 0], "orientation": "x",
    "name_prefix": "TestWall"
})
print(f"Status: {r.get('status')}  Error: {r.get('error','-')}")
if r.get("result"):
    print(f"Blocos: {r['result'].get('count','?')}")
elif r.get("status") != "error":
    print(f"Result: {json.dumps(r, indent=2, default=str)[:200]}")

# Teste 5: Torre
print("\n=== TESTE 5: create_tower (NOVO!) ===")
r = cmd("create_tower", {
    "height": 4, "base_size": 3, "block_size": 100,
    "location": [3000, 2000, 0], "style": "square",
    "name_prefix": "TestTower"
})
print(f"Status: {r.get('status')}  Error: {r.get('error','-')}")
if r.get("result"):
    print(f"Blocos: {r['result'].get('count','?')}  Style: {r['result'].get('style','?')}")

print("\n=== RESUMO ===")
print("Verifique no UE5 Viewport:")
print("  1. TestWall_[0..14] em (2000, 2000) - parede 5x3")
print("  2. TestTower_[0..N] em (3000, 2000) - torre 4x3")
print("  3. Content Browser -> BP_TesteMCP deve ter TestMesh + LightComp")
