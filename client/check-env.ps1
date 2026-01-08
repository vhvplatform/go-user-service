# VHV Platform - Environment Check Script (PowerShell)
# Kiểm tra và fix configuration issues

Write-Host "🔍 VHV Platform - Environment Configuration Checker" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check 1: .env file exists
Write-Host "📋 Check 1: Checking if .env file exists..." -ForegroundColor Yellow

if (Test-Path .env) {
    Write-Host "✓ .env file exists" -ForegroundColor Green
} else {
    Write-Host "✗ .env file NOT found" -ForegroundColor Red
    Write-Host ""
    Write-Host "FIX: Creating .env from .env.example..." -ForegroundColor Yellow
    
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Host "✓ Created .env from .env.example" -ForegroundColor Green
    } else {
        Write-Host "✗ .env.example also not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Creating basic .env file..." -ForegroundColor Yellow
        
        $envContent = @"
# Environment Configuration
VITE_ENVIRONMENT=local
VITE_API_URL_LOCAL=http://localhost:8080/api/v1
VITE_USE_MOCK_API=true
VITE_ENABLE_DEBUG=true
"@
        $envContent | Out-File -FilePath .env -Encoding utf8
        Write-Host "✓ Created basic .env file" -ForegroundColor Green
    }
}

Write-Host ""

# Check 2: VITE_USE_MOCK_API is set
Write-Host "📋 Check 2: Checking VITE_USE_MOCK_API configuration..." -ForegroundColor Yellow

$envContent = Get-Content .env -Raw
if ($envContent -match 'VITE_USE_MOCK_API') {
    if ($envContent -match 'VITE_USE_MOCK_API=(.+)') {
        $value = $matches[1].Trim()
        if ([string]::IsNullOrWhiteSpace($value)) {
            Write-Host "✗ VITE_USE_MOCK_API is set but empty" -ForegroundColor Red
            Write-Host ""
            Write-Host "FIX: Setting VITE_USE_MOCK_API=true..." -ForegroundColor Yellow
            $envContent = $envContent -replace 'VITE_USE_MOCK_API=.*', 'VITE_USE_MOCK_API=true'
            $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
            Write-Host "✓ Fixed VITE_USE_MOCK_API=true" -ForegroundColor Green
        } else {
            Write-Host "✓ VITE_USE_MOCK_API is set to: $value" -ForegroundColor Green
        }
    }
} else {
    Write-Host "✗ VITE_USE_MOCK_API not found in .env" -ForegroundColor Red
    Write-Host ""
    Write-Host "FIX: Adding VITE_USE_MOCK_API=true..." -ForegroundColor Yellow
    $envContent += "`n`n# Use Mock API (true = mock data, false = real API)`nVITE_USE_MOCK_API=true"
    $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
    Write-Host "✓ Added VITE_USE_MOCK_API=true" -ForegroundColor Green
}

Write-Host ""

# Check 3: VITE_ENVIRONMENT is set
Write-Host "📋 Check 3: Checking VITE_ENVIRONMENT configuration..." -ForegroundColor Yellow

$envContent = Get-Content .env -Raw
if ($envContent -match 'VITE_ENVIRONMENT') {
    if ($envContent -match 'VITE_ENVIRONMENT=(.+)') {
        $value = $matches[1].Trim()
        if ([string]::IsNullOrWhiteSpace($value)) {
            Write-Host "⚠ VITE_ENVIRONMENT is set but empty" -ForegroundColor Yellow
            Write-Host "FIX: Setting VITE_ENVIRONMENT=local..." -ForegroundColor Yellow
            $envContent = $envContent -replace 'VITE_ENVIRONMENT=.*', 'VITE_ENVIRONMENT=local'
            $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
            Write-Host "✓ Fixed VITE_ENVIRONMENT=local" -ForegroundColor Green
        } else {
            Write-Host "✓ VITE_ENVIRONMENT is set to: $value" -ForegroundColor Green
        }
    }
} else {
    Write-Host "⚠ VITE_ENVIRONMENT not found in .env" -ForegroundColor Yellow
    Write-Host "FIX: Adding VITE_ENVIRONMENT=local..." -ForegroundColor Yellow
    $envContent += "`n`n# Environment: local | dev | staging | production`nVITE_ENVIRONMENT=local"
    $envContent | Out-File -FilePath .env -Encoding utf8 -NoNewline
    Write-Host "✓ Added VITE_ENVIRONMENT=local" -ForegroundColor Green
}

Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "✓ Environment check complete!" -ForegroundColor Green
Write-Host ""

# Show current configuration
Write-Host "📝 Current .env configuration:" -ForegroundColor Cyan
Write-Host "---------------------------------------------------" -ForegroundColor Gray
Get-Content .env
Write-Host "---------------------------------------------------" -ForegroundColor Gray
Write-Host ""

# Instructions
Write-Host "📚 Next Steps:" -ForegroundColor Blue
Write-Host ""
Write-Host "1. ✅ Your .env file is now configured"
Write-Host "2. 🔄 RESTART your dev server:"
Write-Host "   - Stop: Ctrl+C"
Write-Host "   - Start: npm run dev"
Write-Host ""
Write-Host "3. 🌐 Open browser and check:"
Write-Host "   - No warnings in console"
Write-Host "   - Environment indicator shows 'LOCAL • MOCK'"
Write-Host ""
Write-Host "⚠️  IMPORTANT: Vite only loads .env on startup!" -ForegroundColor Yellow
Write-Host "   You MUST restart the dev server for changes to take effect."
Write-Host ""
Write-Host "==================================================" -ForegroundColor Cyan
