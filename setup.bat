@echo off
echo.
echo   ===================================
echo    GoBeans Setup
echo   ===================================
echo.

echo [1/3] Creating public\sequence directory...
if not exist "d:\GoBeans\public\sequence" mkdir "d:\GoBeans\public\sequence"

echo [2/3] Copying image frames from photos\ to public\sequence\...
xcopy /Y "d:\GoBeans\photos\*.jpg" "d:\GoBeans\public\sequence\"

echo [3/3] Installing npm dependencies...
cd /d "d:\GoBeans"
npm install

echo.
echo   ===================================
echo    Setup Complete!
echo   ===================================
echo.
echo   Run: npm run dev
echo   Then open: http://localhost:3000
echo.
pause
