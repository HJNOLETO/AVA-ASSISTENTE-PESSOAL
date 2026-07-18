$files = Get-ChildItem -Path 'C:\Users\hijon\Downloads\ava-assistant-30-03-26\ava-assistant-v3-main\CRIADO-AVA-CLI' -Recurse -File | Sort-Object Length -Descending
foreach ($file in $files[0..29]) {
    Write-Host "$($file.FullName) - $([math]::Round($file.Length/1KB,2)) KB"
}
