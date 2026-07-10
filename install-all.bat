@echo off
echo ============================================
echo   BookBank - Installing Dependencies
echo ============================================
echo.

echo [1/3] Installing root dependencies (concurrently)...
npm install
if errorlevel 1 (
    echo ERROR: Root install failed
    pause
    exit /b 1
)

echo.
echo [2/3] Installing backend dependencies...
npm install --prefix backend
if errorlevel 1 (
    echo ERROR: Backend install failed
    pause
    exit /b 1
)

echo.
echo [3/3] Installing frontend dependencies...
npm install --prefix frontend
if errorlevel 1 (
    echo ERROR: Frontend install failed - check internet connection
    pause
    exit /b 1
)

echo.
echo ============================================
echo   All dependencies installed successfully!
echo ============================================
echo.
echo Next steps:
echo   1. Make sure MongoDB is running
echo   2. Run: npm run seed
echo   3. Open TWO terminals:
echo        Terminal 1: start-backend.bat
echo        Terminal 2: start-frontend.bat
echo   4. Open: http://localhost:3000
echo.
pause
