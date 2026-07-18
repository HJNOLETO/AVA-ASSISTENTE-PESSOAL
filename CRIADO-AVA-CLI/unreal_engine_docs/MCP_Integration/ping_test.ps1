$tcp = New-Object System.Net.Sockets.TcpClient
try {
    $tcp.Connect("127.0.0.1", 55557)
    Write-Host "PORTA_55557: ABERTA"
    $tcp.Close()
} catch {
    Write-Host "PORTA_55557: FECHADA - $_"
}
