' Atalho VBScript para abrir o menu do AVA Assistant
' Clique duplo para executar de forma mais elegante

Set objShell = CreateObject("WScript.Shell")
strPath = objShell.CurrentDirectory

' Verificar se o arquivo menu.ps1 existe
Set objFSO = CreateObject("Scripting.FileSystemObject")
if not objFSO.FileExists(strPath & "\scripts\menu.ps1") then
    MsgBox "Erro: arquivo menu.ps1 nao encontrado" & vbCrLf & _
           "Execute este arquivo do diretorio raiz do projeto", _
           vbCritical, "AVA Assistant Menu"
    WScript.Quit 1
end if

' Executar PowerShell 5.1 com o menu
strCommand = "powershell -NoExit -ExecutionPolicy Bypass -File """ & strPath & "\scripts\menu.ps1"""
objShell.Run strCommand, 1, False
