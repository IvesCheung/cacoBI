# CacoBI 快速启动脚本

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   CacoBI 项目启动检查" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 未找到 Node.js, 请先安装 Node.js" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 检查依赖
Write-Host "检查项目依赖..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✓ 依赖已安装" -ForegroundColor Green
} else {
    Write-Host "⚠ 依赖未安装, 正在安装..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ 依赖安装成功" -ForegroundColor Green
    } else {
        Write-Host "✗ 依赖安装失败" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""

# 检查 Element Plus Icons
Write-Host "检查 Element Plus Icons..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if ($packageJson.dependencies.'@element-plus/icons-vue') {
    Write-Host "✓ Element Plus Icons 已安装" -ForegroundColor Green
} else {
    Write-Host "⚠ Element Plus Icons 未安装, 正在安装..." -ForegroundColor Yellow
    npm install @element-plus/icons-vue
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Element Plus Icons 安装成功" -ForegroundColor Green
    } else {
        Write-Host "✗ Element Plus Icons 安装失败" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   所有检查完成!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "启动开发服务器..." -ForegroundColor Yellow
Write-Host ""

npm run dev
