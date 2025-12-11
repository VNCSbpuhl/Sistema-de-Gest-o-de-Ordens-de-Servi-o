# Script para corrigir erro PlatformConstants
Write-Host "=== Corrigindo Erro PlatformConstants ===" -ForegroundColor Cyan
Write-Host ""

# 1. Parar processos do Expo
Write-Host "1. Parando processos do Expo..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*expo*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Limpar caches
Write-Host "2. Limpando caches..." -ForegroundColor Yellow
npm cache clean --force
if (Test-Path ".expo") {
    Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
    Write-Host "   ✓ Cache .expo removido" -ForegroundColor Green
}
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
    Write-Host "   ✓ Cache node_modules removido" -ForegroundColor Green
}

# 3. Limpar node_modules e reinstalar
Write-Host "3. Reinstalando dependências..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
    Write-Host "   ✓ node_modules removido" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
    Write-Host "   ✓ package-lock.json removido" -ForegroundColor Green
}

npm install
Write-Host "   ✓ Dependências reinstaladas" -ForegroundColor Green

# 4. Instruções
Write-Host ""
Write-Host "=== Próximos Passos ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANTE: Verifique se o Expo Go no seu celular está ATUALIZADO!" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abra a App Store (iOS) ou Play Store (Android)" -ForegroundColor White
Write-Host "2. Procure por 'Expo Go'" -ForegroundColor White
Write-Host "3. Atualize para a versão MAIS RECENTE" -ForegroundColor White
Write-Host "4. Feche completamente o Expo Go no celular" -ForegroundColor White
Write-Host "5. Execute: npm run start:clear" -ForegroundColor White
Write-Host "6. Escaneie o QR code novamente" -ForegroundColor White
Write-Host ""
Write-Host "O Expo Go precisa suportar SDK 54 para funcionar!" -ForegroundColor Yellow
Write-Host ""

