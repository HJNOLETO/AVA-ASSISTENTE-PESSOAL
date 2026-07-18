# testar_plugin_direto.ps1 v2
# Testa o plugin UnrealMCP diretamente, sem AVA CLI.
# Requisito: UE5 aberto com plugin UnrealMCP compilado (porta 55557).
#
# Uso: powershell -ExecutionPolicy Bypass -File testar_plugin_direto.ps1

$UE_HOST = "127.0.0.1"
$UE_PORT = 55557
$TIMEOUT_SEC = 10

function Send-McpCommand {
    param([string]$CommandType, [hashtable]$Params = @{})
    $body = (@{ type = $CommandType; params = $Params } | ConvertTo-Json -Compress)
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $client.Connect($UE_HOST, $UE_PORT)
        $client.ReceiveTimeout = $TIMEOUT_SEC * 1000
        $stream = $client.GetStream()
        $writer = New-Object System.IO.StreamWriter($stream)
        $writer.AutoFlush = $true
        $writer.Write($body)
        Start-Sleep -Milliseconds 400
        $reader = New-Object System.IO.StreamReader($stream)
        $resp = ""
        $buf = New-Object char[] 4096
        while ($stream.DataAvailable) {
            $n = $reader.Read($buf, 0, $buf.Length)
            if ($n -gt 0) { $resp += [string]::new($buf, 0, $n) }
        }
        $client.Close()
        return $resp
    } catch {
        return "ERRO: $_"
    }
}

$pass = 0
$fail = 0

# ═══════════════════════════════════
#  FASE 1: Conexao
# ═══════════════════════════════════
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FASE 1: Conexao" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[1.1] Testando conexao TCP porta $UE_PORT..." -ForegroundColor Yellow
$r = Send-McpCommand -CommandType "get_actors_in_level"
if ($r -match "ERRO") {
    Write-Host "❌ FALHOU: $r" -ForegroundColor Red
    $fail++
    exit 1
} else {
    Write-Host "✅ PASSOU" -ForegroundColor Green
    Write-Host "   Resposta: $($r.Substring(0, [Math]::Min(200, $r.Length)))" -ForegroundColor Gray
    $pass++
}

# ═══════════════════════════════════
#  FASE 2: Listar Atores
# ═══════════════════════════════════
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FASE 2: Listar Atores" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[2.1] Listando atores..." -ForegroundColor Yellow
$r = Send-McpCommand -CommandType "get_actors_in_level"
try {
    $data = $r | ConvertFrom-Json
    if ($data -and ($data.PSObject.Properties.Name -contains 'result')) {
        $count = 0
        if ($data.result -is [array]) { $count = $data.result.Count }
        Write-Host "✅ PASSOU - $count atores" -ForegroundColor Green
        $i = 0
        if ($data.result -is [array]) {
            foreach ($a in $data.result) {
                if ($i++ -ge 10) { break }
                $n = if ($a.name) { $a.name } else { "?" }
                $c = if ($a.class) { $a.class } elseif ($a.actor_class) { $a.actor_class } else { "?" }
                Write-Host "   [$c] $n" -ForegroundColor Gray
            }
        }
        $pass++
    } else {
        Write-Host "❌ FALHOU - sem result. Raw: $($r.Substring(0,200))" -ForegroundColor Red
        $fail++
    }
} catch {
    Write-Host "❌ FALHOU ao parsear: $_" -ForegroundColor Red
    $fail++
}

# ═══════════════════════════════════
#  FASE 3: Buscar ALS
# ═══════════════════════════════════
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FASE 3: Buscar ALS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[3.1] find_actors_by_name 'ALS'..." -ForegroundColor Yellow
$r = Send-McpCommand -CommandType "find_actors_by_name" -Params @{ pattern = "ALS" }
try {
    $data = $r | ConvertFrom-Json
    if ($data.status -eq "success") {
        Write-Host "✅ PASSOU" -ForegroundColor Green
        if ($data.result -is [array]) {
            foreach ($a in $data.result) { Write-Host "   $($a | ConvertTo-Json -Compress)" -ForegroundColor Gray }
        }
        $pass++
    } else {
        Write-Host "❌ FALHOU: status=$($data.status) error=$($data.error)" -ForegroundColor Red
        $fail++
    }
} catch {
    Write-Host "❌ FALHOU parse: $_" -ForegroundColor Red
    $fail++
}

# ═══════════════════════════════════
#  FASE 4: Criar BP
# ═══════════════════════════════════
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FASE 4: Criar Blueprint" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[4.1] create_blueprint BP_TesteMCP..." -ForegroundColor Yellow
$r = Send-McpCommand -CommandType "create_blueprint" -Params @{ name = "BP_TesteMCP"; parent_class = "Actor" }
try {
    $data = $r | ConvertFrom-Json
    if ($data.status -eq "success") {
        Write-Host "✅ PASSOU - BP_TesteMCP criado!" -ForegroundColor Green
        $pass++
    } elseif ($r -match "already exists|ja existe|already") {
        Write-Host "⚠️ BP ja existe, pulando." -ForegroundColor Yellow
        $pass++
    } else {
        Write-Host "❌ FALHOU: $($r.Substring(0,300))" -ForegroundColor Red
        $fail++
    }
} catch {
    Write-Host "❌ FALHOU parse: $_ | Raw: $($r.Substring(0,200))" -ForegroundColor Red
    $fail++
}

# ═══════════════════════════════════
#  FASE 5: Adicionar Componente
# ═══════════════════════════════════
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FASE 5: Adicionar Componente" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[5.1] add_component StaticMeshComponent..." -ForegroundColor Yellow
$r = Send-McpCommand -CommandType "add_component_to_blueprint" -Params @{
    blueprint_name = "BP_TesteMCP"
    component_type = "StaticMeshComponent"
    component_name = "TestMesh"
    location = @()
    rotation = @()
    scale = @()
}
try {
    $data = $r | ConvertFrom-Json
    if ($data.status -eq "success") {
        Write-Host "✅ PASSOU - Componente adicionado!" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "❌ FALHOU: status=$($data.status) error=$($data.error)" -ForegroundColor Red
        $fail++
    }
} catch {
    Write-Host "❌ FALHOU: $_ | Raw: $($r.Substring(0,200))" -ForegroundColor Red
    $fail++
}

# ═══════════════════════════════════
#  FASE 6: Compilar
# ═══════════════════════════════════
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FASE 6: Compilar Blueprint" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[6.1] compile_blueprint..." -ForegroundColor Yellow
$r = Send-McpCommand -CommandType "compile_blueprint" -Params @{ blueprint_name = "BP_TesteMCP" }
try {
    $data = $r | ConvertFrom-Json
    if ($data.status -eq "success") {
        Write-Host "✅ PASSOU - Compilado!" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "❌ FALHOU: $($r.Substring(0,300))" -ForegroundColor Red
        $fail++
    }
} catch {
    Write-Host "❌ FALHOU: $_" -ForegroundColor Red
    $fail++
}

# ═══════════════════════════════════
#  FASE 7: Spawnar
# ═══════════════════════════════════
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FASE 7: Spawnar no Level" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[7.1] spawn_blueprint_actor..." -ForegroundColor Yellow
$r = Send-McpCommand -CommandType "spawn_blueprint_actor" -Params @{
    blueprint_name = "BP_TesteMCP"
    actor_name = "TesteMCP_Ator_1"
    location = @(500, 500, 200)
    rotation = @(0, 0, 0)
}
try {
    $data = $r | ConvertFrom-Json
    if ($data.status -eq "success") {
        Write-Host "✅ PASSOU - Ator spawnado em (500,500,200)!" -ForegroundColor Green
        Write-Host "   Olhe no viewport do UE5!" -ForegroundColor Green
        $pass++
    } else {
        Write-Host "❌ FALHOU: $($r.Substring(0,300))" -ForegroundColor Red
        $fail++
    }
} catch {
    Write-Host "❌ FALHOU: $_ | Raw: $($r.Substring(0,200))" -ForegroundColor Red
    $fail++
}

# ═══════════════════════════════════
#  FASE 8: Cor
# ═══════════════════════════════════
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FASE 8: Mudar Cor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n[8.1] set_mesh_material_color azul..." -ForegroundColor Yellow
$r = Send-McpCommand -CommandType "set_mesh_material_color" -Params @{
    blueprint_name = "BP_TesteMCP"
    component_name = "TestMesh"
    color = @(0.2, 0.6, 1.0, 1.0)
}
try {
    $data = $r | ConvertFrom-Json
    if ($data.status -eq "success") {
        Write-Host "✅ PASSOU - Cor alterada! Cubo azul no viewport." -ForegroundColor Green
        $pass++
    } else {
        Write-Host "❌ FALHOU: $($r.Substring(0,300))" -ForegroundColor Red
        $fail++
    }
} catch {
    Write-Host "❌ FALHOU: $_ | Raw: $($r.Substring(0,200))" -ForegroundColor Red
    $fail++
}

# ═══════════════════════════════════
#  RESUMO
# ═══════════════════════════════════
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " RESUMO FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Passou : $pass / 8" -ForegroundColor Green
Write-Host "Falhou : $fail / 8" -ForegroundColor $(if ($fail -gt 0) { "Red" } else { "Green" })
Write-Host ""
Write-Host "Verifique no UE5:" -ForegroundColor White
Write-Host "  1. Content Browser -> /Game/Blueprints/ -> BP_TesteMCP" -ForegroundColor White
Write-Host "  2. Viewport -> Cubo azul em (500, 500, 200)" -ForegroundColor White
Write-Host "  3. World Outliner -> TesteMCP_Ator_1" -ForegroundColor White
