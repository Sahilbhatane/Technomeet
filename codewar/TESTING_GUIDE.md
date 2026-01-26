# CodeWar Competition Platform - Complete Testing Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Starting the Server](#starting-the-server)
3. [User Testing Guide](#user-testing-guide)
4. [Admin Reset Guide](#admin-reset-guide)
5. [Valid Test Credentials](#valid-test-credentials)
6. [Round-by-Round Testing](#round-by-round-testing)
7. [Anti-Cheat Testing](#anti-cheat-testing)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Python 3.x installed
- Modern web browser (Chrome, Firefox, Edge)
- Text editor for viewing code (optional)

### Start Testing in 3 Steps
1. Open PowerShell/Terminal in the `codewar` folder
2. Run: `python -m http.server 8080`
3. Open browser: `http://localhost:8080`

---

## Starting the Server

### Option 1: PowerShell (Recommended)
```powershell
cd "c:\Users\sahil\OneDrive\Desktop\CODE\Technomeet2k26\codewar"
python -m http.server 8080
```

### Option 2: Use the Batch File
Double-click `start_server.bat` in the codewar folder.

### Option 3: Use the PowerShell Script
```powershell
.\start_server.ps1
```

### Verify Server is Running
- Open browser to: `http://localhost:8080` or `http://127.0.0.1:8080`
- You should see the CodeWar Competition homepage

---

## Valid Test Credentials

### Registration Codes (for participants)
Use any of these codes to enter the competition:

| Code | Description |
|------|-------------|
| `CODE-TEST` | Primary test code |
| `CODE-DEMO` | Demo/demonstration code |
| `CODE-0001` | Additional test code |

### Admin Password (for reset panel)
| Password | Description |
|----------|-------------|
| `admin123` | Admin reset password |

> **Security Note:** These credentials are validated using SHA-256 hashes. The actual codes/passwords are NOT stored in the client-side code - only their hashes are stored, which cannot be reversed.

---

## User Testing Guide

### Phase 1: Registration & Authentication

1. **Open the platform**
   - Navigate to `http://localhost:8080`
   - You should see "Enter Registration Code" form

2. **Test invalid inputs**
   - Try submitting empty → Should show "Please enter a registration code"
   - Try "INVALID" → Should show "Invalid code format. Use CODE-XXXX format"
   - Try "CODE-WRONG" → Should show "Server error" (no matching hash)

3. **Test valid login**
   - Enter `CODE-TEST` and click "Enter Competition"
   - Should see Competition Rounds page with 3 rounds

### Phase 2: MCQ Round Testing

1. **Start MCQ Round**
   - Click "Start MCQ Round"
   - Select a language (Python, Java, C, or C++)
   - Timer starts at 30:00

2. **Test question navigation**
   - Answer questions by clicking options
   - Use Next/Previous buttons
   - Click question numbers in the sidebar
   - Notice "✓ Saved" indicator when you answer

3. **Test persistence**
   - Answer a few questions
   - Press F5 to refresh
   - Timer should CONTINUE (not reset)
   - Answers should be PRESERVED
   - Question order should be SAME

4. **Test submission**
   - Click "Submit Quiz"
   - Confirmation modal appears showing:
     - Number of answered questions
     - Number of unanswered questions
   - Click "Continue Working" to go back
   - Click "Submit" to submit

5. **After submission**
   - Redirected to Competition Rounds page
   - MCQ shows score (e.g., "Score: 15/20 (75%)")
   - Debug round is now enabled

### Phase 3: Debug Round Testing

1. **Start Debug Round**
   - Click "Continue Debug Round"
   - Timer starts at 45:00
   - 5 debugging problems shown

2. **Solve a problem**
   - Read the faulty code
   - Write corrected code in the textarea
   - Click "Verify Solution" to check
   - Should show "✓ Correct!" if valid

3. **Test submission**
   - Click "Submit Round"
   - Confirmation modal appears
   - Submit to proceed

4. **After submission**
   - Debug shows score
   - PS round is now enabled

### Phase 4: Problem Statement (PS) Round Testing

1. **Start PS Round**
   - Click "Continue PS Round"
   - Timer starts at 60:00
   - 5 coding problems shown

2. **Solve a problem**
   - Read the problem statement
   - Write your solution code
   - Click "Run Test Cases" to verify
   - Shows test case results with pass/fail

3. **Example solution for Problem 1 (Sum of Two Numbers)**
   ```python
   def sum_numbers(a, b):
       return a + b
   ```

4. **Test submission**
   - Click "Submit Round"
   - Confirmation modal appears
   - Submit to complete competition

### Phase 5: Results Page

After completing all rounds:
- See total score percentage
- Individual round scores
- Time spent per round
- Anti-cheat statistics (warnings, tab switches)
- Download results option

---

## Admin Reset Guide

### How to Access Reset Panel

**Method 1: Through Application (Recommended)**
1. Complete a competition (or be on results page)
2. The reset page can be accessed if you navigate from within the app

**Method 2: Set Session Flag**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `sessionStorage.setItem('codewar_admin_access', 'true')`
4. Navigate to `http://localhost:8080/reset.html`

### Performing a Reset

1. **Access the reset page** (using methods above)
2. **Enter admin password:** `admin123`
3. **Click "Reset All Data"**
4. **Confirm the reset** in the confirmation modal
5. **Wait for redirect** to homepage

### What Gets Reset
- All localStorage data (progress, answers, scores)
- All sessionStorage data (authentication, session)
- All cookies
- All round states return to initial

### Manual Reset Alternative
If reset page doesn't work:
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear site data" or manually clear:
   - localStorage
   - sessionStorage
   - Cookies

---

## Round-by-Round Testing

### MCQ Round Details
| Setting | Value |
|---------|-------|
| Duration | 30 minutes |
| Questions | 20 |
| Languages | Python, Java, C, C++ |
| Language changes | 2 maximum |

### Debug Round Details
| Setting | Value |
|---------|-------|
| Duration | 45 minutes |
| Problems | 5 |
| Verification | Pattern-based |

### PS Round Details
| Setting | Value |
|---------|-------|
| Duration | 60 minutes |
| Problems | 5 |
| Testing | Test case based |

---

## Anti-Cheat Testing

### What Triggers Warnings
- Switching tabs multiple times rapidly
- Opening DevTools repeatedly
- Having multiple tabs open

### Warning System
- 3 warnings before auto-exit
- 5 second cooldown between warnings
- Requires 3 violations in 10 second window

### Testing Anti-Cheat
1. Start MCQ round
2. Switch tabs (Alt+Tab) several times quickly
3. After multiple violations, warning modal appears
4. Continue switching to see warning count increase
5. At 3 warnings, exam terminates

### What Doesn't Trigger Warnings
- App modals (confirmation dialogs)
- Single tab switch
- Normal browsing within the app
- Resizing window

---

## Troubleshooting

### "Server error. Please try again."
- The registration code doesn't match any valid hash
- Use: `CODE-TEST`, `CODE-DEMO`, or `CODE-0001`

### Timer Resets on Refresh
- This should NOT happen after fixes
- If it does, check browser console for errors
- Verify localStorage has `codewar_timer_start_mcq` key

### Can't Access Certain Rounds
- Rounds unlock sequentially: MCQ → Debug → PS
- Complete previous round to unlock next
- Check `codewar_current_round` in localStorage

### Reset Page Shows "Access Denied"
- Direct navigation is blocked for security
- Use Method 2 from Admin Reset Guide above
- Or navigate from within the application

### Answers Not Saving
- Check localStorage in DevTools
- Look for `codewar_mcq_answers` key
- Ensure no JavaScript errors in console

### Submission Confirmation Not Appearing
- The modal should appear on "Submit" click
- Check if `showSubmitConfirm` function exists
- Check browser console for errors

---

## Testing Checklist

### Before Competition
- [ ] Server is running on port 8080
- [ ] Browser is open to localhost:8080
- [ ] localStorage is cleared (fresh start)

### During MCQ
- [ ] Valid code accepted
- [ ] Timer starts and runs
- [ ] Answers save with "✓ Saved"
- [ ] Refresh preserves timer and answers
- [ ] Submit shows confirmation modal

### During Debug
- [ ] Problems display correctly
- [ ] Verify Solution works
- [ ] Correct solutions accepted
- [ ] Submit shows confirmation

### During PS
- [ ] Problems display correctly
- [ ] Run Test Cases works
- [ ] Test results show pass/fail
- [ ] Submit shows confirmation

### After Completion
- [ ] Results page shows all scores
- [ ] Cannot go back to rounds
- [ ] Reset panel works with admin password

---

## Quick Reference

### URLs
| Page | URL |
|------|-----|
| Home | `http://localhost:8080` |
| MCQ | `http://localhost:8080/mcq.html` |
| Debug | `http://localhost:8080/debug.html` |
| PS | `http://localhost:8080/ps.html` |
| Results | `http://localhost:8080/results.html` |
| Reset | `http://localhost:8080/reset.html` |

### Test Codes
| Purpose | Value |
|---------|-------|
| Registration | `CODE-TEST` |
| Registration | `CODE-DEMO` |
| Registration | `CODE-0001` |
| Admin Password | `admin123` |

### localStorage Keys
| Key | Purpose |
|-----|---------|
| `codewar_current_round` | Current round state |
| `codewar_mcq_answers` | Saved MCQ answers |
| `codewar_mcq_score` | MCQ score |
| `codewar_debug_score` | Debug score |
| `codewar_ps_score` | PS score |
| `codewar_timer_start_mcq` | MCQ timer start timestamp |
| `codewar_mcq_question_order` | Shuffled question order |

---

## Security Notes

1. **Registration codes** are validated using SHA-256 hashes - codes cannot be extracted from client code
2. **Admin password** is also hash-validated - password cannot be read from DevTools
3. **Direct URL access** to rounds is blocked - must follow proper flow
4. **Reset page** requires referrer check or session flag
5. **Anti-cheat** monitors for suspicious behavior but won't trigger during app modals

---

## Error Logging System

The platform includes a comprehensive error logging system for automated testing and debugging.

### Using the Logger

The logger is automatically initialized on every page. Access it via browser console:

```javascript
// View all logs
Logger.getLogs()

// View only errors
Logger.getErrors()

// Print summary
Logger.printSummary()

// Export logs to file
Logger.downloadLogs()

// Clear all logs
Logger.clearLogs()
```

### What Gets Logged

| Event Type | Description |
|------------|-------------|
| **Uncaught Exceptions** | JavaScript errors that crash |
| **Promise Rejections** | Unhandled async errors |
| **Console Errors** | Any console.error() calls |
| **Console Warnings** | Any console.warn() calls |
| **Network Errors** | Failed fetch/XHR requests |
| **HTTP Errors** | Non-200 responses |
| **Slow Page Loads** | Pages taking >3 seconds |
| **Resource Load Failures** | Missing scripts/images |

### Log Levels

| Level | Value | Use Case |
|-------|-------|----------|
| DEBUG | 0 | Detailed debug info |
| INFO | 1 | General information |
| WARN | 2 | Warnings |
| ERROR | 3 | Errors |
| FATAL | 4 | Critical failures |

### Manual Logging

```javascript
// Log custom messages
Logger.info('Something happened', { detail: 'value' })
Logger.warn('Warning message')
Logger.error('Error message', { code: 500 })

// Log user actions
Logger.logAction('clicked button', { buttonId: 'submit' })
```

---

## Automated Testing

### Running Tests

Open any page and run in console:

```javascript
// Include test utilities (once)
const script = document.createElement('script');
script.src = 'js/test-utils.js';
document.head.appendChild(script);

// Run all tests
runTests()
// or
TestUtils.runAllTests()
```

### Test Categories

| Category | Tests |
|----------|-------|
| **Logger** | Logging functions work |
| **localStorage** | Can read/write |
| **sessionStorage** | Can read/write |
| **StorageManager** | All methods exist |
| **Utils** | Helper functions work |
| **Auth** | Authentication system |
| **Timer** | Timer functions exist |
| **Anti-Cheat** | System initialized |
| **Page Elements** | Required DOM exists |

### Individual Tests

```javascript
TestUtils.testLogger()
TestUtils.testLocalStorage()
TestUtils.testAuth()
TestUtils.testTimer()
```

### Simulating User Actions

```javascript
// Simulate click
TestUtils.simulateClick('#submit-btn')

// Simulate input
TestUtils.simulateInput('#code', 'CODE-TEST')
```

---

## Debugging Workflow

### 1. Reproduce the Issue
- Clear storage: `localStorage.clear(); sessionStorage.clear();`
- Refresh the page
- Perform the actions that cause the issue

### 2. Check Logs
```javascript
// Get all errors
Logger.getErrors()

// Get recent logs
Logger.getLogs().slice(-20)

// Print summary
Logger.printSummary()
```

### 3. Export for Analysis
```javascript
// Download as JSON file
Logger.downloadLogs()

// Or copy to clipboard
copy(Logger.exportLogs())
```

### 4. Check localStorage State
```javascript
// View all storage
console.table({
  currentRound: localStorage.getItem('codewar_current_round'),
  mcqScore: localStorage.getItem('codewar_mcq_score'),
  authenticated: sessionStorage.getItem('codewar_authenticated')
})
```

---

## Console Quick Commands

| Command | Description |
|---------|-------------|
| `Logger.printSummary()` | Show log statistics |
| `Logger.getErrors()` | Get all error logs |
| `Logger.downloadLogs()` | Download logs as JSON |
| `Logger.clearLogs()` | Clear all logs |
| `runTests()` | Run automated tests |
| `TestUtils.getResults()` | Get test results |

---

*Last Updated: January 2026*
*Platform Version: CodeWar TechnoMeet 2K26*
