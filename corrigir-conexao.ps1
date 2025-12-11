# Script para corrigir erro de conexão
Write-Host "=== Corrigindo Erro de Conexão ===" -ForegroundColor Cyan
Write-Host ""

# 1. Parar todos os processos do Node/Expo
Write-Host "1. Parando processos do Node/Expo..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*expo*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
Write-Host "   ✓ Processos parados" -ForegroundColor Green

# 2. Limpar cache
Write-Host "2. Limpando cache..." -ForegroundColor Yellow
npm cache clean --force
if (Test-Path ".expo") {
    Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
}
Write-Host "   ✓ Cache limpo" -ForegroundColor Green

Write-Host ""
Write-Host "=== Próximos Passos ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Inicie o servidor com TUNNEL (funciona mesmo em redes diferentes):" -ForegroundColor Yellow
Write-Host ""
Write-Host "  npm run start:tunnel" -ForegroundColor White
Write-Host ""
Write-Host "OU se estiver na mesma rede Wi-Fi:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  npm run start:lan" -ForegroundColor White
Write-Host ""
Write-Host "Aguarde o QR code aparecer e escaneie novamente!" -ForegroundColor Green
Write-Host ""

