# CodeWar Competition Platform - Manual Testing Guide

## Prerequisites

1. **Start the local server** (if not already running):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # OR using Node.js http-server
   npx http-server -p 8000
   ```

2. **Open your browser** and navigate to:
   ```
   http://localhost:8000/codewar/
   ```

---

## Testing Checklist

### 1. Landing Page & Authentication

#### Test Countdown Timer
- [ ] Navigate to `http://localhost:8000/codewar/`
- [ ] Verify countdown timer displays (if exam hasn't started)
- [ ] Check timer format: `Xd Xh Xm Xs`

#### Test Authentication
- [ ] Enter invalid code: `INVALID-CODE`
  - Should show error message
- [ ] Enter valid code: `CODE-0001` (or any from CODE-0001 to CODE-0010)
  - Should authenticate successfully
  - Should redirect to rounds selection page

#### Test Rounds Navigation
- [ ] Verify all 3 rounds are displayed:
  - Round 1: MCQ Quiz (30 questions, 30 minutes)
  - Round 2: Debug Code (45 minutes)
  - Round 3: Problem Statement (60 minutes)
- [ ] Verify only MCQ round button is enabled initially
- [ ] Verify Debug and PS rounds are disabled (sequential access)

---

### 2. MCQ Round Testing

#### Start MCQ Round
- [ ] Click "Start MCQ Round" button
- [ ] Verify page loads: `http://localhost:8000/codewar/mcq.html`
- [ ] Check timer shows: `30:00` and counts down
- [ ] Verify language selection screen appears

#### Test Language Selection
- [ ] Try clicking different languages: C, C++, Java, Python
- [ ] Select Python (or any language)
- [ ] Verify language changes remaining counter: "Language changes remaining: 2"
- [ ] Verify questions load after selection
- [ ] Try changing language again (should decrease counter)

#### Test Question Navigation
- [ ] Verify question counter: "Question 1 of X" (X depends on language)
- [ ] Click on question number buttons (1, 2, 3, etc.)
- [ ] Verify questions change correctly
- [ ] Click "Next" button - should go to next question
- [ ] Click "Previous" button - should go to previous question
- [ ] Verify "Previous" is disabled on first question
- [ ] Verify "Next" is disabled on last question

#### Test Answer Selection
- [ ] Select an answer option (A, B, C, or D)
- [ ] Verify option is highlighted/selected
- [ ] Navigate to another question
- [ ] Navigate back to the answered question
- [ ] Verify your answer is still selected (auto-save works)

#### Test Timer
- [ ] Watch timer countdown from 30:00
- [ ] Verify it decreases every second
- [ ] Wait for timer to reach 0:00 (or manually test auto-submit)
- [ ] Verify auto-submission when time expires

#### Test Submission
- [ ] Answer a few questions
- [ ] Click "Submit Quiz" button
- [ ] Verify confirmation dialog appears
- [ ] Confirm submission
- [ ] Verify redirect to index.html
- [ ] Verify Debug round button is now enabled

---

### 3. Debug Round Testing

#### Start Debug Round
- [ ] From index.html, click "Start Debug Round"
- [ ] Verify page loads: `http://localhost:8000/codewar/debug.html`
- [ ] Check timer shows: `45:00` and counts down
- [ ] Verify question counter: "Question 1 of 5"

#### Test Code Display
- [ ] Verify faulty code is displayed in code block
- [ ] Verify code is syntax-highlighted (if applicable)
- [ ] Verify code is read-only (cannot edit faulty code)

#### Test Solution Editor
- [ ] Type corrected code in solution textarea
- [ ] Verify code editor accepts input
- [ ] Test code formatting (indentation, etc.)

#### Test Solution Verification
- [ ] Enter incorrect solution
- [ ] Click "Verify Solution" button
- [ ] Verify feedback shows: "✗ Incorrect"
- [ ] Verify hint is displayed (if available)
- [ ] Enter correct solution (match the expected format)
- [ ] Click "Verify Solution" again
- [ ] Verify feedback shows: "✓ Correct" (if solution matches)

#### Test Navigation
- [ ] Click question number buttons (1-5)
- [ ] Verify questions change
- [ ] Click "Next" and "Previous" buttons
- [ ] Verify navigation works correctly

#### Test Save Progress
- [ ] Enter solution code
- [ ] Click "Save Progress" button
- [ ] Navigate to another question
- [ ] Navigate back
- [ ] Verify your code is still there (auto-save)

#### Test Submission
- [ ] Complete all 5 questions (or skip some)
- [ ] Click "Submit Round" button
- [ ] Verify confirmation dialog
- [ ] Confirm submission
- [ ] Verify redirect to index.html
- [ ] Verify PS round button is now enabled

---

### 4. Problem Statement Round Testing

#### Start PS Round
- [ ] From index.html, click "Start PS Round"
- [ ] Verify page loads: `http://localhost:8000/codewar/ps.html`
- [ ] Check timer shows: `60:00` and counts down
- [ ] Verify problem counter: "Problem 1 of 5"

#### Test Problem Display
- [ ] Verify problem title is displayed
- [ ] Verify problem description is displayed
- [ ] Verify constraints are shown
- [ ] Verify example input/output (if available)

#### Test Code Editor
- [ ] Type solution code in textarea
- [ ] Verify code editor accepts input
- [ ] Test multi-line code entry

#### Test Test Case Execution
- [ ] Enter a solution (e.g., for "Sum of Two Numbers"):
  ```python
  def solve(a, b):
      return a + b
  
  a, b = map(int, input().split())
  print(solve(a, b))
  ```
- [ ] Click "Run Test Cases" button
- [ ] Verify test results panel appears
- [ ] Verify each test case shows:
  - Test Case number
  - Status (PASSED/FAILED)
  - Input values
  - Expected output
  - Your output
- [ ] Verify summary shows:
  - Total test cases
  - Passed count
  - Failed count
  - Score percentage

#### Test Multiple Problems
- [ ] Click "Next" button to go to problem 2
- [ ] Verify new problem loads
- [ ] Verify previous problem's solution is saved
- [ ] Click "Previous" to go back
- [ ] Verify previous solution is still there

#### Test Submission
- [ ] Complete all problems (or skip some)
- [ ] Click "Submit Round" button
- [ ] Verify confirmation dialog
- [ ] Confirm submission
- [ ] Verify redirect to results.html

---

### 5. Results Page Testing

#### View Results
- [ ] Verify page loads: `http://localhost:8000/codewar/results.html`
- [ ] Verify all round scores are displayed:
  - MCQ Score (X/30, percentage)
  - Debug Score (X/5, percentage)
  - PS Score (X/5, percentage)
- [ ] Verify total score is calculated
- [ ] Verify time taken for each round
- [ ] Verify completion status

#### Test Statistics
- [ ] Check warning count (if any)
- [ ] Check tab switch count (if any)
- [ ] Verify all statistics are accurate

#### Test Download (if implemented)
- [ ] Click "Download Results" button (if available)
- [ ] Verify results are downloaded as JSON/text

---

### 6. Anti-Cheat System Testing

#### Test Focus Lock
- [ ] Start any round (MCQ, Debug, or PS)
- [ ] Click outside the browser window (lose focus)
- [ ] Verify warning appears
- [ ] Verify warning count increases
- [ ] Repeat until max warnings (should auto-exit)

#### Test Tab Switch Detection
- [ ] Start any round
- [ ] Switch to another tab
- [ ] Verify warning appears
- [ ] Verify tab switch count increases

#### Test DevTools Detection
- [ ] Start any round
- [ ] Press F12 (open DevTools)
- [ ] Verify warning appears
- [ ] Try Ctrl+Shift+I (DevTools shortcut)
- [ ] Verify warning appears

#### Test Right-Click Block
- [ ] Start any round
- [ ] Right-click on page
- [ ] Verify context menu is blocked (or limited)

#### Test Copy/Paste Block
- [ ] Start MCQ or Debug round
- [ ] Try to copy text from page
- [ ] Verify copy is blocked
- [ ] Try to paste
- [ ] Verify paste is blocked
- [ ] **Note**: Copy/paste should work in PS round code editor

#### Test Keyboard Shortcuts
- [ ] Try Ctrl+U (view source)
- [ ] Try Ctrl+S (save page)
- [ ] Try Ctrl+Shift+I (DevTools)
- [ ] Try F12
- [ ] Verify all are blocked

#### Test Full-Screen Mode
- [ ] Start any round
- [ ] Try to exit full-screen (if enforced)
- [ ] Verify warning appears

---

### 7. Data Persistence Testing

#### Test Auto-Save
- [ ] Start MCQ round
- [ ] Answer a few questions
- [ ] Refresh the page (F5)
- [ ] Verify answers are still selected
- [ ] Verify timer continues from where it left off

#### Test Round Progress
- [ ] Complete MCQ round
- [ ] Close browser
- [ ] Reopen and authenticate
- [ ] Verify Debug round is enabled
- [ ] Verify MCQ round shows as completed

---

### 8. Edge Cases & Error Handling

#### Test Invalid Inputs
- [ ] Try submitting empty MCQ answers
- [ ] Try submitting empty Debug solution
- [ ] Try submitting empty PS solution
- [ ] Verify appropriate error messages

#### Test Time Expiry
- [ ] Start a round
- [ ] Wait for timer to reach 0 (or manually adjust timer in code)
- [ ] Verify auto-submission occurs
- [ ] Verify redirect happens

#### Test Browser Refresh
- [ ] Start a round
- [ ] Answer some questions
- [ ] Refresh page (F5)
- [ ] Verify progress is saved
- [ ] Verify timer continues correctly

#### Test Multiple Tabs
- [ ] Open platform in one tab
- [ ] Open same URL in another tab
- [ ] Verify warning appears (multiple tab detection)

---

## Quick Test Scenarios

### Scenario 1: Complete Flow (Quick Test)
1. Authenticate with `CODE-0001`
2. Start MCQ round → Select Python → Answer 2-3 questions → Submit
3. Start Debug round → Fix 1 question → Submit
4. Start PS round → Solve 1 problem → Run test cases → Submit
5. View results page

### Scenario 2: Anti-Cheat Test
1. Start MCQ round
2. Switch tabs → Verify warning
3. Open DevTools (F12) → Verify warning
4. Lose focus → Verify warning
5. Continue until max warnings → Verify auto-exit

### Scenario 3: Data Persistence Test
1. Start MCQ round
2. Answer 5 questions
3. Refresh page (F5)
4. Verify answers are saved
5. Verify timer continues

---

## Valid Test Codes

Use any of these codes for authentication:
- `CODE-0001` through `CODE-0010`
- `CODE-TEST` (if available)

---

## Notes

- **Timer**: For testing, the exam start time is set to `2020-01-01` (past date) so authentication is always available. Change this in `js/timer.js` for actual event.

- **Language Selection**: Each language has different number of questions:
  - Basic: 20 questions
  - C: 20 questions
  - C++: 20 questions
  - Java: 20 questions
  - Python: 20 questions

- **Test Case Execution**: The code verifier uses pattern matching for offline execution. Some complex solutions may not execute perfectly, but the framework is functional.

---

## Troubleshooting

### Server Not Starting
- Check if port 8000 is already in use
- Try a different port: `python -m http.server 8001`

### Pages Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh (Ctrl+F5)
- Check browser console for errors (F12)

### Timer Not Working
- Check browser console for JavaScript errors
- Verify `js/timer.js` is loaded correctly
- Check if exam start time is set correctly

### Data Not Loading
- Verify `js/data.js` file exists and is loaded
- Check browser console for errors
- Verify file paths are correct

---

## Success Criteria

✅ All pages load without errors
✅ Authentication works correctly
✅ All three rounds are accessible sequentially
✅ Questions/problems load correctly
✅ Answers/solutions can be entered and saved
✅ Timers count down correctly
✅ Auto-submission works when time expires
✅ Results page displays correctly
✅ Anti-cheat warnings appear when triggered
✅ Data persists across page refreshes

---

Happy Testing! 🚀
