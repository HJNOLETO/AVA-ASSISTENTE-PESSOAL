$HOST = "127.0.0.1"
$PORT = 55557

function Send-Cmd {
    param([string]$t, [hashtable]$p = @{})
    $b = (@{ type = $t; params = $p } | ConvertTo-Json -Compress)
    $c = New-Object System.Net.Sockets.TcpClient
    $c.Connect($HOST, $PORT)
    $c.ReceiveTimeout = 10000
    $s = $c.GetStream()
    $w = New-Object System.IO.StreamWriter($s)
    $w.AutoFlush = $true
    $w.Write($b)
    Start-Sleep -Milliseconds 600
    $rd = New-Object System.IO.StreamReader($s)
    $resp = $rd.ReadToEnd()
    $c.Close()
    return $resp
}

# ──── Teste A: Listar atores com timing melhor ────
Write-Host "=== TESTE A: get_actors_in_level ===" -ForegroundColor Cyan
$r = Send-Cmd -t "get_actors_in_level"
Write-Host "RAW (primeiros 500 chars): $($r.Substring(0, [Math]::Min(500, $r.Length)))"
try {
    $d = $r | ConvertFrom-Json
    if ($d.result) {
        $ct = if ($d.result -is [array]) { $d.result.Count } else { 1 }
        Write-Host "✅ $ct atores" -ForegroundColor Green
        if ($d.result -is [array] -and $d.result.Count -gt 0) {
            $first = $d.result[0]
            Write-Host "   Exemplo: $($first | ConvertTo-Json -Compress)"
        }
    } elseif ($d.status -eq "error") {
        Write-Host "❌ Erro: $($d.error) $($d.message)" -ForegroundColor Red
    } else {
        Write-Host "⚠️ $($d | ConvertTo-Json -Compress)"
    }
} catch { Write-Host "❌ Parse error: $_" -ForegroundColor Red }

# ──── Teste B: Tentar diferentes nomes de componente ────
Write-Host "`n=== TESTE B: Testando nomes de componente ===" -ForegroundColor Cyan
$nomes = @("StaticMesh", "UStaticMeshComponent", "PointLight", "SpotLight", "BoxComponent", "SceneComponent")
foreach ($nome in $nomes) {
    $r = Send-Cmd -t "add_component_to_blueprint" -p @{
        blueprint_name = "BP_TesteMCP"
        component_type = $nome
        component_name = "Comp_$nome"
        location = @()
        rotation = @()
        scale = @()
    }
    try {
        $d = $r | ConvertFrom-Json
        if ($d.status -eq "success") {
            Write-Host "✅ ${nome} FUNCIONOU!" -ForegroundColor Green
        } else {
            Write-Host "❌ ${nome} - $($d.error)" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ ${nome} - parse error - $($r.Substring(0, [Math]::Min(100, $r.Length)))"
    }
}

# ──── Teste C: Spawnar (vai falhar se componente nao foi add, mas testa o comando) ────
Write-Host "`n=== TESTE C: spawn_blueprint_actor ===" -ForegroundColor Cyan
$r = Send-Cmd -t "spawn_blueprint_actor" -p @{
    blueprint_name = "BP_TesteMCP"
    actor_name = "TesteSpawn_1"
    location = @(800, 800, 200)
    rotation = @(0, 0, 0)
}
Write-Host "RAW: $($r.Substring(0, [Math]::Min(500, $r.Length)))"
try {
    $d = $r | ConvertFrom-Json
    if ($d.status -eq "success") { Write-Host "✅ Spawn OK" -ForegroundColor Green }
    else { Write-Host "Resultado: status=$($d.status) error=$($d.error)" -ForegroundColor Yellow }
} catch { Write-Host "❌ Parse error: $_" -ForegroundColor Red }

# ──── Teste D: set_mesh_material_color ────
Write-Host "`n=== TESTE D: set_mesh_material_color ===" -ForegroundColor Cyan
$r = Send-Cmd -t "set_mesh_material_color" -p @{
    blueprint_name = "BP_TesteMCP"
    component_name = "TestMesh"
    color = @(0.2, 0.6, 1.0, 1.0)
}
Write-Host "RAW: $($r.Substring(0, [Math]::Min(500, $r.Length)))"
try {
    $d = $r | ConvertFrom-Json
    if ($d.status -eq "success") { Write-Host "✅ Cor OK" -ForegroundColor Green }
    else { Write-Host "❌ status=$($d.status) error=$($d.error)" -ForegroundColor Red }
} catch { Write-Host "❌ Parse: $_" -ForegroundColor Red }
