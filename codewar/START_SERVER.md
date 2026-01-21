# CodeWar Platform - Server Start Scripts

One-click scripts to start the server and open the browser automatically for the actual event.

## Available Scripts

### Windows Batch File (Recommended for Windows)
**File**: `start_server.bat`
- Double-click to run
- Opens server in a new window
- Automatically opens browser
- Works from anywhere (finds codewar directory automatically)

### PowerShell Script (Alternative for Windows)
**File**: `start_server.ps1`
- Right-click → Run with PowerShell
- Or run: `powershell -ExecutionPolicy Bypass -File start_server.ps1`
- More features and better error handling

## How to Use

### Method 1: Double-Click (Easiest)
1. Navigate to the `codewar` directory
2. Double-click `start_server.bat`
3. Server starts and browser opens automatically

### Method 2: From Anywhere
1. Place `start_server.bat` anywhere on your system
2. Double-click it
3. Script will automatically find the codewar directory
4. Server starts and browser opens

### Method 3: Command Line
```bash
# From codewar directory
start_server.bat

# Or from anywhere
cd path\to\codewar
start_server.bat
```

## Features

✅ **Auto-Discovery**: Finds codewar directory automatically
✅ **Port Check**: Warns if port 8000 is already in use
✅ **Python Check**: Verifies Python is installed
✅ **Auto-Browser**: Opens browser automatically
✅ **Error Handling**: Clear error messages if something goes wrong

## Requirements

- Python 3.x installed
- Python in system PATH
- Port 8000 available (or script will warn you)

## Troubleshooting

### "Python is not installed"
- Install Python 3.x from python.org
- Make sure to check "Add Python to PATH" during installation

### "Port 8000 is already in use"
- Another server is running
- Close the other server or choose a different port
- To change port, edit the script and replace `8000` with your desired port

### "Could not find codewar directory"
- Make sure you're running the script from the correct location
- Or place the script in the codewar directory

### Browser doesn't open
- Manually navigate to: http://localhost:8000/
- Check if server started (look for the server window)

## Stopping the Server

### Batch File Method
- Close the "CodeWar Server" window
- Or press Ctrl+C in that window

### PowerShell Method
- Press Ctrl+C in the PowerShell window
- Or close the PowerShell window

## For Event Day

1. **Before Event**:
   - Test the script to ensure it works
   - Verify Python is installed
   - Check port 8000 is available

2. **During Event**:
   - Double-click `start_server.bat`
   - Wait for browser to open
   - Verify platform loads correctly

3. **After Event**:
   - Close the server window
   - Or press Ctrl+C

---

**Note**: These scripts are designed for Windows. For Linux/Mac, use:
```bash
cd codewar
python3 -m http.server 8000
# Then manually open http://localhost:8000/ in browser
```
