# CodeWar Platform - One-Click Server Start Script (PowerShell)
# This script starts the server and opens the browser automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CodeWar Competition Platform" -ForegroundColor Cyan
Write-Host "  Starting Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the directory where this script is located
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Function to find codewar directory
function Find-CodeWarDirectory {
    $currentPath = Get-Location
    $searchPaths = @(
        $currentPath,
        (Join-Path $currentPath "codewar"),
        (Join-Path $currentPath "..\codewar"),
        (Join-Path $ScriptDir "codewar"),
        (Join-Path $ScriptDir "..\codewar")
    )
    
    # Search up to 3 parent levels
    $parentPath = $currentPath
    for ($i = 0; $i -lt 3; $i++) {
        $searchPaths += Join-Path $parentPath "codewar"
        $parentPath = Split-Path -Parent $parentPath
    }
    
    foreach ($path in $searchPaths) {
        if (Test-Path (Join-Path $path "index.html")) {
            return $path
        }
    }
    
    return $null
}

# Check if we're in codewar directory, if not, try to find it
if (-not (Test-Path "index.html")) {
    Write-Host "Searching for codewar directory..." -ForegroundColor Yellow
    
    $codewarPath = Find-CodeWarDirectory
    if ($codewarPath) {
        Set-Location $codewarPath
        Write-Host "Found codewar directory: $codewarPath" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: Could not find codewar directory!" -ForegroundColor Red
        Write-Host "Please ensure the script is in or near the codewar directory." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    Write-Host "Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "ERROR: Python is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Python 3.x and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if port 8000 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "WARNING: Port 8000 is already in use!" -ForegroundColor Yellow
    Write-Host "Another server might be running." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Do you want to continue anyway? (Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        exit 1
    }
}

Write-Host "Starting HTTP server on port 8000..." -ForegroundColor Green
Write-Host "Server will be available at: http://localhost:8000/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server in background
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    python -m http.server 8000
}

# Wait a moment for server to start
Start-Sleep -Seconds 2

# Check if server started successfully
$serverRunning = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if (-not $serverRunning) {
    Write-Host "Waiting for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
}

# Open browser
Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:8000/"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Server started successfully!" -ForegroundColor Green
Write-Host "  Browser should open automatically." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server is running in the background." -ForegroundColor Yellow
Write-Host "To stop the server, close this window or run:" -ForegroundColor Yellow
Write-Host "  Stop-Job -Id $($serverJob.Id); Remove-Job -Id $($serverJob.Id)" -ForegroundColor Gray
Write-Host ""

# Keep the script running and show server output
Write-Host "Server Output (Press Ctrl+C to stop):" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Gray
try {
    Receive-Job -Job $serverJob -Wait
}
finally {
    Stop-Job -Job $serverJob -ErrorAction SilentlyContinue
    Remove-Job -Job $serverJob -ErrorAction SilentlyContinue
    Write-Host ""
    Write-Host "Server stopped." -ForegroundColor Yellow
}
