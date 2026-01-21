@echo off
setlocal enabledelayedexpansion
REM CodeWar Platform - One-Click Server Start Script
REM This script starts the server and opens the browser automatically

echo ========================================
echo   CodeWar Competition Platform
echo   Starting Server...
echo ========================================
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

REM Check if we're in codewar directory, if not, try to find it
if not exist "index.html" (
    echo Searching for codewar directory...
    set FOUND=0
    
    REM Check parent directory
    if exist "..\codewar\index.html" (
        cd /d "..\codewar"
        set FOUND=1
    )
    
    REM Check current directory subfolder
    if !FOUND!==0 if exist "codewar\index.html" (
        cd /d "codewar"
        set FOUND=1
    )
    
    REM Check if script is in codewar subfolder
    if !FOUND!==0 if exist "%~dp0codewar\index.html" (
        cd /d "%~dp0codewar"
        set FOUND=1
    )
    
    REM Search in parent directories (up to 3 levels)
    if !FOUND!==0 (
        set "BASE_PATH=%~dp0"
        for /L %%i in (1,1,3) do (
            if !FOUND!==0 (
                set "SEARCH_PATH=!BASE_PATH!"
                for /L %%j in (1,1,%%i) do set "SEARCH_PATH=!SEARCH_PATH!..\"
                if exist "!SEARCH_PATH!codewar\index.html" (
                    cd /d "!SEARCH_PATH!codewar"
                    set FOUND=1
                )
            )
        )
    )
    
    if !FOUND!==0 (
        echo ERROR: Could not find codewar directory!
        echo Please ensure the script is in or near the codewar directory.
        pause
        exit /b 1
    )
)

echo Current directory: %CD%
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python 3.x and try again.
    pause
    exit /b 1
)

REM Check if port 8000 is already in use
netstat -an | findstr ":8000" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo WARNING: Port 8000 is already in use!
    echo Another server might be running.
    echo.
    choice /C YN /M "Do you want to continue anyway"
    if errorlevel 2 exit /b 1
)

echo Starting HTTP server on port 8000...
echo Server will be available at: http://localhost:8000/
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server in a new window
start "CodeWar Server" cmd /k "python -m http.server 8000"

REM Wait a moment for server to start
timeout /t 2 /nobreak >nul

REM Open browser
echo Opening browser...
start http://localhost:8000/

echo.
echo ========================================
echo   Server started successfully!
echo   Browser should open automatically.
echo ========================================
echo.
echo To stop the server, close the "CodeWar Server" window
echo or press Ctrl+C in that window.
echo.
pause
