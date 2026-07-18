# -*- coding: utf-8 -*-
import socket, json, time, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

HOST = "127.0.0.1"
PORT = 55557
TIMEOUT = 10

def send_cmd(cmd_type, params=None):
    payload = json.dumps({"type": cmd_type, "params": params or {}})
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(TIMEOUT)
        sock.connect((HOST, PORT))
        sock.sendall(payload.encode("utf-8"))
        time.sleep(0.5)
        response = b""
        sock.settimeout(3)
        while True:
            try:
                chunk = sock.recv(8192)
                if not chunk:
                    break
                response += chunk
                # Try to parse - if success, we have full message
                try:
                    json.loads(response.decode("utf-8"))
                    break
                except:
                    pass
            except socket.timeout:
                break
        sock.close()
        if response:
            return json.loads(response.decode("utf-8"))
        return {"error": "EMPTY_RESPONSE", "message": "Sem resposta do plugin"}
    except ConnectionRefusedError:
        return {"error": "CONNECTION_REFUSED", "message": f"Porta {PORT} fechada"}
    except Exception as e:
        return {"error": "EXCEPTION", "message": str(e)}

def test(name, cmd, params=None):
    print(f"\n{'='*60}")
    print(f" TESTE: {name}")
    print(f" Command: {cmd}")
    print(f"{'='*60}")
    result = send_cmd(cmd, params)
    status = result.get("status", "?")
    error = result.get("error", result.get("message", ""))
    if status == "success":
        print(f"  [OK] PASSOU")
        r = result.get("result")
        if isinstance(r, list):
            print(f"  Result: array com {len(r)} items")
            if r:
                print(f"  Exemplo: {json.dumps(r[0], indent=2, default=str)[:300]}")
        elif isinstance(r, dict):
            print(f"  Result: {json.dumps(r, indent=2, default=str)[:400]}")
        elif r is not None:
            print(f"  Result: {str(r)[:200]}")
        else:
            print(f"  Full: {json.dumps(result, indent=2, default=str)[:300]}")
        return "PASS"
    elif error:
        print(f"  [FAIL] [{status}] {error}")
        return "FAIL"
    else:
        print(f"  [?] Raw: {json.dumps(result, indent=2, default=str)[:400]}")
        return "UNKNOWN"

results = []

# FASE 1: Conexao
results.append(test("1.1 Ping TCP", "get_actors_in_level"))

# FASE 2: Atores
results.append(test("2.1 Listar Atores", "get_actors_in_level"))
results.append(test("2.2 Buscar ALS", "find_actors_by_name", {"pattern": "ALS"}))

# FASE 3: Criar Blueprint
results.append(test("3.1 Criar BP_TestePy", "create_blueprint", {"name": "BP_TestePy", "parent_class": "Actor"}))

# FASE 4: Componentes
print(f"\n{'='*60}")
print(" FASE 4: Testando nomes de componente")
print(f"{'='*60}")
comp_names = [
    "StaticMeshComponent",
    "StaticMesh", 
    "UStaticMeshComponent",
    "PointLightComponent",
    "SkeletalMeshComponent",
]
correct_type = None
for cn in comp_names:
    r = send_cmd("add_component_to_blueprint", {
        "blueprint_name": "BP_TestePy",
        "component_type": cn,
        "component_name": f"Comp_{cn}",
        "location": [], "rotation": [], "scale": [],
    })
    s = r.get("status", "?")
    e = r.get("error", "")
    if s == "success":
        print(f"  [OK] {cn} FUNCIONA!")
        correct_type = cn
        break
    else:
        print(f"  [FAIL] {cn}: {e}")

# FASE 5: Compilar
results.append(test("5.1 Compilar BP_TestePy", "compile_blueprint", {"blueprint_name": "BP_TestePy"}))

# FASE 6: Spawnar
results.append(test("6.1 Spawnar BP_TestePy", "spawn_blueprint_actor", {
    "blueprint_name": "BP_TestePy",
    "actor_name": "TestePy_Ator",
    "location": [700, 700, 200],
    "rotation": [0, 0, 0],
}))

# FASE 7: Cor
if correct_type:
    results.append(test("7.1 Mudar cor (vermelho)", "set_mesh_material_color", {
        "blueprint_name": "BP_TestePy",
        "component_name": f"Comp_{correct_type}",
        "color": [1.0, 0.2, 0.2, 1.0],
    }))
else:
    print("\n  [!] Pulando teste de cor (sem componente)")

# FASE 8: Procedural
results.append(test("8.1 Parede procedural", "create_wall", {
    "length": 4, "height": 2, "block_size": 100,
    "location": [2000, 2000, 0],
    "orientation": "x",
    "name_prefix": "ParedePy",
}))

# RESUMO
print(f"\n{'='*60}")
print(" RESUMO FINAL")
print(f"{'='*60}")
p = results.count("PASS")
f = results.count("FAIL")
u = results.count("UNKNOWN")
print(f"  [OK] Passou:  {p}")
print(f"  [FAIL] Falhou:  {f}")
print(f"  [?] Incerto: {u}")
print(f"  Total:     {len(results)}")
print()
print("  Verifique no UE5:")
print("    1. Content Browser -> /Game/Blueprints/ -> BP_TestePy")
print("    2. World Outliner -> TestePy_Ator")
print("    3. Viewport -> parede de cubos em (2000, 2000)")
