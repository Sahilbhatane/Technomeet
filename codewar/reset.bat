@echo off
setlocal enabledelayedexpansion
REM CodeWar Platform - Admin Reset Script
REM This script clears all stored data (requires admin password)

echo ========================================
echo   CodeWar Competition Platform
echo   ADMIN DATA RESET TOOL
echo ========================================
echo.
echo WARNING: This will clear ALL competition data!
echo - All participant scores
echo - All answers and submissions
echo - All timer data
echo - All anti-cheat records
echo.
echo ========================================
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

REM Check if we're in codewar directory
if not exist "index.html" (
    echo Searching for codewar directory...
    set FOUND=0
    
    if exist "..\codewar\index.html" (
        cd /d "..\codewar"
        set FOUND=1
    )
    
    if !FOUND!==0 if exist "codewar\index.html" (
        cd /d "codewar"
        set FOUND=1
    )
    
    if !FOUND!==0 (
        echo ERROR: Could not find codewar directory!
        pause
        exit /b 1
    )
)

echo Current directory: %CD%
echo.

REM ========================================
REM Admin Password Verification
REM ========================================
REM Default password: admin2k26
REM You can change this by editing the line below
set "ADMIN_PASSWORD=admin2k26"

echo ----------------------------------------
echo   ADMIN AUTHENTICATION REQUIRED
echo ----------------------------------------
echo.

REM Password attempt counter
set /a ATTEMPTS=0
set /a MAX_ATTEMPTS=3

:password_prompt
set /a ATTEMPTS+=1

if %ATTEMPTS% gtr %MAX_ATTEMPTS% (
    echo.
    echo ========================================
    echo   ACCESS DENIED
    echo   Too many failed attempts!
    echo ========================================
    echo.
    timeout /t 3 /nobreak >nul
    exit /b 1
)

echo Attempt %ATTEMPTS% of %MAX_ATTEMPTS%

REM Hidden password input using PowerShell
echo Enter Admin Password: 
for /f "usebackq delims=" %%p in (`powershell -Command "$pwd = Read-Host -AsSecureString; $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($pwd); [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)"`) do set "INPUT_PASSWORD=%%p"

REM Verify password
if "!INPUT_PASSWORD!"=="!ADMIN_PASSWORD!" (
    goto :password_success
) else (
    echo.
    echo [X] Incorrect password!
    echo.
    goto :password_prompt
)

:password_success
echo.
echo ========================================
echo   ACCESS GRANTED
echo ========================================
echo.

REM Confirm reset action
echo Are you ABSOLUTELY SURE you want to reset all data?
echo This action CANNOT be undone!
echo.
choice /C YN /M "Type Y to confirm reset, N to cancel"
if errorlevel 2 (
    echo.
    echo Reset cancelled by user.
    pause
    exit /b 0
)

echo.
echo ----------------------------------------
echo   Initiating Reset Process...
echo ----------------------------------------
echo.

REM Check if reset.html exists
if not exist "reset.html" (
    echo ERROR: reset.html not found!
    echo Please ensure reset.html is in the codewar directory.
    pause
    exit /b 1
)

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python 3.x and try again.
    pause
    exit /b 1
)

REM Check if server is already running on port 8000
set SERVER_RUNNING=0
netstat -an | findstr ":8000" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    set SERVER_RUNNING=1
    echo [OK] Server is already running on port 8000
)

REM If server is not running, start it
if %SERVER_RUNNING%==0 (
    echo [..] Server not running. Starting server...
    echo.
    
    REM Start the server in a new window
    start "CodeWar Server" cmd /k "python -m http.server 8000"
    
    REM Wait for server to start
    echo Waiting for server to start...
    timeout /t 3 /nobreak >nul
    
    REM Verify server started
    netstat -an | findstr ":8000" | findstr "LISTENING" >nul 2>&1
    if errorlevel 1 (
        echo [!] Warning: Server may not have started properly.
        echo     Continuing anyway...
    ) else (
        echo [OK] Server started successfully!
    )
    echo.
)

REM Generate a one-time reset token (based on timestamp)
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
set RESET_TOKEN=%datetime:~0,14%

echo Reset Token Generated: %RESET_TOKEN%
echo.

REM Open the reset page with the token
echo Opening reset page in browser...
start "" "http://localhost:8000/reset.html?token=%RESET_TOKEN%&confirm=true"

timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo   Reset page opened in browser.
echo   
echo   Complete the reset in the browser
echo   window that just opened.
echo ========================================
echo.
pause
