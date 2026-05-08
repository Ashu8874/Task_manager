@echo off
REM TeamFlow Setup Script for Windows
REM This script helps you set up the TeamFlow project quickly

echo.
echo ================================
echo   TeamFlow Setup Script
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [OK] npm is installed
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully!
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env >nul
    echo [OK] .env file created!
    echo [WARNING] Remember to add your Anthropic API key to .env for AI features
) else (
    echo [INFO] .env file already exists
)

echo.
echo ================================
echo   Setup Complete!
echo ================================
echo.
echo Next steps:
echo   1. (Optional) Add your Anthropic API key to .env
echo   2. Run 'npm run dev' to start the development server
echo   3. Open http://localhost:3000 in your browser
echo.
echo Demo accounts:
echo   Admin: alice@team.com / admin123
echo   Member: bob@team.com / member123
echo.
echo Happy coding!
echo.
pause
