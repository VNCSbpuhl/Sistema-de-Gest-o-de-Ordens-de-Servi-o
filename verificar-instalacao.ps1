# Script de Verificação - Expo App
Write-Host "=== Verificação do Ambiente Expo ===" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "1. Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "   ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ✗ Node.js NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Instale em: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar npm
Write-Host "2. Verificando npm..." -ForegroundColor Yellow
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "   ✓ npm instalado: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "   ✗ npm NÃO encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar Expo CLI
Write-Host "3. Verificando Expo CLI..." -ForegroundColor Yellow
$expoVersion = npx expo --version 2>$null
if ($expoVersion) {
    Write-Host "   ✓ Expo CLI disponível: $expoVersion" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Expo CLI não encontrado globalmente (será usado via npx)" -ForegroundColor Yellow
}

# Verificar node_modules
Write-Host "4. Verificando dependências..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✓ node_modules existe" -ForegroundColor Green
} else {
    Write-Host "   ✗ node_modules NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Execute: npm install" -ForegroundColor Red
    exit 1
}

# Verificar arquivos principais
Write-Host "5. Verificando arquivos do projeto..." -ForegroundColor Yellow
$files = @("package.json", "app.json", "App.tsx")
$allOk = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file NÃO encontrado!" -ForegroundColor Red
        $allOk = $false
    }
}

if (-not $allOk) {
    Write-Host ""
    Write-Host "Alguns arquivos estão faltando!" -ForegroundColor Red
    exit 1
}

# Verificar porta 8081
Write-Host "6. Verificando porta 8081..." -ForegroundColor Yellow
$portInUse = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "   ⚠ Porta 8081 está em uso!" -ForegroundColor Yellow
    Write-Host "   Feche outros processos do Expo antes de iniciar" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ Porta 8081 está livre" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Verificação Concluída ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar o app, execute:" -ForegroundColor Green
Write-Host "  npm run start:tunnel" -ForegroundColor White
Write-Host ""

