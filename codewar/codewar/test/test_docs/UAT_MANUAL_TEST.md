# CodeWar Platform - Manual User Acceptance Testing Guide

## Pre-Testing Setup

1. **Start Server**:
   ```bash
   cd codewar
   python -m http.server 8000
   ```

2. **Clear Browser Storage** (Before each test):
   - Open DevTools (F12)
   - Application tab → Clear Storage
   - Or use: `localStorage.clear(); sessionStorage.clear();` in console

3. **Open Browser**: `http://localhost:8000/codewar/`

---

## Test Scenario 1: Complete Flow with Correct Answers

### Step 1: Authentication
- [ ] Navigate to landing page
- [ ] Enter invalid code: `INVALID-CODE`
  - Expected: Error message shown
- [ ] Enter valid code: `CODE-0001`
  - Expected: Redirected to rounds page
  - Expected: All 3 rounds visible
  - Expected: Only MCQ button enabled

### Step 2: MCQ Round
- [ ] Click "Start MCQ Round"
- [ ] Select language: **Python**
- [ ] Verify questions load (should show question count)
- [ ] Answer Question 1: Select option **B**
- [ ] Click "Next"
- [ ] Answer Question 2: Select any option
- [ ] Click question number **1** (go back)
- [ ] Verify answer to Q1 is still selected (auto-save works)
- [ ] Navigate through 3-4 questions, selecting answers
- [ ] Verify question navigation buttons show answered status
- [ ] Verify timer is counting down
- [ ] Click "Submit Quiz"
- [ ] Confirm submission
- [ ] Expected: Redirected to index.html
- [ ] Expected: Debug round button now enabled

### Step 3: Debug Round
- [ ] Click "Start Debug Round"
- [ ] Verify faulty code is displayed
- [ ] Enter a solution code
- [ ] Click "Verify Solution"
- [ ] Verify feedback is shown (Correct/Incorrect)
- [ ] Navigate to next question
- [ ] Enter solution for question 2
- [ ] Click "Save Progress"
- [ ] Navigate back to question 1
- [ ] Verify solution is saved
- [ ] Click "Submit Round"
- [ ] Confirm submission
- [ ] Expected: Redirected to index.html
- [ ] Expected: PS round button now enabled

### Step 4: PS Round
- [ ] Click "Start PS Round"
- [ ] Verify problem description is displayed
- [ ] Enter solution code
- [ ] Click "Run Test Cases"
- [ ] Verify test results are displayed
- [ ] Verify summary shows passed/failed counts
- [ ] Navigate to next problem
- [ ] Enter solution for problem 2
- [ ] Run test cases
- [ ] Click "Submit Round"
- [ ] Confirm submission
- [ ] Expected: Redirected to results.html

### Step 5: Results Page
- [ ] Verify all scores are displayed
- [ ] Verify MCQ score shows correct format (X/Y)
- [ ] Verify Debug score shows correct format (X/5)
- [ ] Verify PS score shows percentage
- [ ] Verify time taken for each round
- [ ] Verify statistics (warnings, tab switches)
- [ ] Click "Download Results"
- [ ] Verify JSON file downloads

---

## Test Scenario 2: Wrong Answers & Edge Cases

### MCQ Round - Wrong Answers
- [ ] Clear storage and start fresh
- [ ] Authenticate with `CODE-0001`
- [ ] Start MCQ round, select Python
- [ ] Answer questions with wrong options
- [ ] Submit quiz
- [ ] Verify score reflects wrong answers
- [ ] Check results page shows correct score

### Debug Round - Incorrect Solutions
- [ ] Start Debug round
- [ ] Enter incorrect solution
- [ ] Verify shows "Incorrect" feedback
- [ ] Verify hint is displayed
- [ ] Enter correct solution (if known)
- [ ] Verify shows "Correct" feedback
- [ ] Submit round
- [ ] Verify score reflects correct/incorrect solutions

### PS Round - Failed Test Cases
- [ ] Start PS round
- [ ] Enter solution that fails test cases
- [ ] Run test cases
- [ ] Verify failed test cases are shown
- [ ] Verify error messages are displayed
- [ ] Fix solution
- [ ] Run test cases again
- [ ] Verify passed test cases are shown
- [ ] Submit round
- [ ] Verify score reflects test case results

---

## Test Scenario 3: Anti-Cheat Testing

### Focus Detection
- [ ] Start MCQ round
- [ ] Click outside browser window (lose focus)
- [ ] Expected: Warning appears
- [ ] Expected: Warning count increases
- [ ] Repeat 2 more times
- [ ] Expected: Auto-exit after max warnings

### Tab Switch Detection
- [ ] Start any round
- [ ] Switch to another tab
- [ ] Expected: Warning appears
- [ ] Expected: Tab switch count increases

### DevTools Detection
- [ ] Start any round
- [ ] Press F12
- [ ] Expected: Warning appears
- [ ] Try Ctrl+Shift+I
- [ ] Expected: Warning appears

### Keyboard Shortcuts
- [ ] Start any round
- [ ] Try Ctrl+U (view source)
- [ ] Expected: Blocked
- [ ] Try Ctrl+S (save)
- [ ] Expected: Blocked
- [ ] Try Ctrl+Shift+I (DevTools)
- [ ] Expected: Blocked

### Right-Click Block
- [ ] Start any round
- [ ] Right-click on page
- [ ] Expected: Context menu blocked

### Copy/Paste Block (MCQ/Debug)
- [ ] Start MCQ round
- [ ] Try to copy text
- [ ] Expected: Copy blocked
- [ ] Try to paste
- [ ] Expected: Paste blocked

### Copy/Paste Allow (PS Round)
- [ ] Start PS round
- [ ] Try to copy from code editor
- [ ] Expected: Copy works
- [ ] Try to paste in code editor
- [ ] Expected: Paste works

---

## Test Scenario 4: Timer & Auto-Submission

### Timer Countdown
- [ ] Start MCQ round
- [ ] Verify timer starts at 30:00
- [ ] Wait 10 seconds
- [ ] Verify timer decreases
- [ ] Verify timer format (MM:SS)

### Timer Warning
- [ ] Start any round
- [ ] Wait until timer < 5 minutes
- [ ] Expected: Timer turns red/warning color

### Auto-Submission (Simulated)
- [ ] Note: For testing, manually set timer to 0 in console
- [ ] Expected: Auto-submission occurs
- [ ] Expected: Alert shown
- [ ] Expected: Redirect to next page

---

## Test Scenario 5: Data Persistence

### Refresh During Round
- [ ] Start MCQ round
- [ ] Answer 3 questions
- [ ] Refresh page (F5)
- [ ] Expected: Answers are still selected
- [ ] Expected: Timer continues from saved time
- [ ] Expected: Current question is restored

### Browser Close/Reopen
- [ ] Start MCQ round
- [ ] Answer some questions
- [ ] Close browser
- [ ] Reopen and authenticate
- [ ] Expected: Progress is saved
- [ ] Expected: Can continue from where left off

### Multiple Rounds Progress
- [ ] Complete MCQ round
- [ ] Start Debug round
- [ ] Answer 2 questions
- [ ] Go back to index
- [ ] Expected: MCQ shows as completed
- [ ] Expected: Debug shows as in progress
- [ ] Expected: Can resume Debug round

---

## Test Scenario 6: Error Handling

### Missing Data
- [ ] Clear storage
- [ ] Try to access results page directly
- [ ] Expected: Redirected to index.html

### Invalid Navigation
- [ ] Try to access debug.html without completing MCQ
- [ ] Expected: Alert shown, redirected

### Empty Answers
- [ ] Start MCQ round
- [ ] Don't answer any questions
- [ ] Submit quiz
- [ ] Expected: Score is 0
- [ ] Expected: No errors

### Network Issues (Simulated)
- [ ] Disable network (if applicable)
- [ ] Try to load page
- [ ] Expected: Error message (if server required)

---

## Test Scenario 7: Language Selection

### Language Change Limit
- [ ] Start MCQ round
- [ ] Select Python
- [ ] Go back to language selection
- [ ] Select Java
- [ ] Expected: Language changes remaining: 1
- [ ] Select C++
- [ ] Expected: Language changes remaining: 0
- [ ] Try to change again
- [ ] Expected: Alert shown, change blocked

### Different Languages
- [ ] Test with C language
- [ ] Test with C++ language
- [ ] Test with Java language
- [ ] Test with Python language
- [ ] Expected: All languages work correctly
- [ ] Expected: Questions load for each language

---

## Test Scenario 8: Edge Cases

### Empty Questions
- [ ] If language has no questions
- [ ] Expected: Error message shown
- [ ] Expected: Can select different language

### Timer Edge Cases
- [ ] Timer reaches 0:00
- [ ] Expected: Auto-submission
- [ ] Timer goes negative (if possible)
- [ ] Expected: Handled gracefully

### Score Edge Cases
- [ ] All answers correct
- [ ] Expected: 100% score
- [ ] All answers wrong
- [ ] Expected: 0% score
- [ ] No answers submitted
- [ ] Expected: 0% score

### Navigation Edge Cases
- [ ] Click Previous on first question
- [ ] Expected: Button disabled
- [ ] Click Next on last question
- [ ] Expected: Button disabled
- [ ] Click question number out of range
- [ ] Expected: Handled gracefully

---

## Test Results Checklist

After completing all tests, verify:

- [ ] All authentication flows work
- [ ] All rounds are accessible in sequence
- [ ] Answers are saved correctly
- [ ] Scores are calculated correctly
- [ ] Timers work correctly
- [ ] Anti-cheat warnings appear
- [ ] Data persists across refreshes
- [ ] Results page displays correctly
- [ ] No console errors
- [ ] No unexpected alerts
- [ ] All navigation works
- [ ] All buttons work
- [ ] Error handling works

---

## Issues Found

Document any issues found during testing:

1. **Issue**: 
   - **Steps to reproduce**: 
   - **Expected**: 
   - **Actual**: 
   - **Severity**: 

---

## Test Completion

- [ ] All test scenarios completed
- [ ] All issues documented
- [ ] All critical issues fixed
- [ ] Ready for production

---

**Test Date**: _______________
**Tester**: _______________
**Status**: ☐ Pass  ☐ Fail  ☐ Needs Fix
