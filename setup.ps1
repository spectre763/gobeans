# GoBeans Setup Script
# Run this from d:\GoBeans in PowerShell

Write-Host "🫘 GoBeans Setup" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

# 1. Create the public/sequence directory
Write-Host "`n📁 Creating public/sequence directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path ".\public\sequence" | Out-Null

# 2. Copy all frames from photos/ to public/sequence/
Write-Host "🖼️  Copying image frames..." -ForegroundColor Cyan
$frames = Get-ChildItem -Path ".\photos\ezgif-frame-*.jpg" | Sort-Object Name
$count = $frames.Count
Write-Host "   Found $count frames." -ForegroundColor Gray

foreach ($frame in $frames) {
    Copy-Item $frame.FullName -Destination ".\public\sequence\" -Force
}
Write-Host "   ✅ Frames copied to public/sequence/" -ForegroundColor Green

# 3. Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Cyan
npm install

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "👉 Run: npm run dev" -ForegroundColor Yellow
Write-Host "   Then open: http://localhost:3000" -ForegroundColor Gray
