# Quick Testing Guide - CodeWar Platform

## 🚀 Quick Start

1. **Start Server** (if not running):
   ```bash
   python -m http.server 8000
   ```

2. **Open Browser**: `http://localhost:8000/codewar/`

---

## ⚡ 5-Minute Quick Test

### Step 1: Authentication (30 seconds)
- Go to: `http://localhost:8000/codewar/`
- Enter code: `CODE-0001`
- Click "Enter Competition"
- ✅ Should see 3 rounds

### Step 2: MCQ Round (2 minutes)
- Click "Start MCQ Round"
- Select language: **Python**
- Answer question 1: Click option **B**
- Click "Next" button
- Answer question 2: Click any option
- Click question number **1** (go back)
- ✅ Verify your answer to Q1 is still selected
- Click "Submit Quiz" → Confirm

### Step 3: Debug Round (1 minute)
- Click "Start Debug Round"
- See faulty code displayed
- Type any code in solution box
- Click "Verify Solution"
- ✅ Should see feedback (Correct/Incorrect)
- Click "Submit Round" → Confirm

### Step 4: PS Round (1 minute)
- Click "Start PS Round"
- See problem description
- Type solution:
  ```python
  def solve(a, b):
      return a + b
  
  a, b = map(int, input().split())
  print(solve(a, b))
  ```
- Click "Run Test Cases"
- ✅ Should see test results
- Click "Submit Round" → Confirm

### Step 5: Results (30 seconds)
- ✅ Should see results page with scores
- ✅ Should see all 3 rounds completed

---

## 🧪 Anti-Cheat Quick Test

1. Start MCQ round
2. Press **F12** (DevTools)
   - ✅ Warning should appear
3. Switch to another tab
   - ✅ Warning should appear
4. Click outside browser window
   - ✅ Warning should appear
5. Repeat 3 times
   - ✅ Should auto-exit after max warnings

---

## 📋 Test Codes

Use any of these:
- `CODE-0001` to `CODE-0010`
- `CODE-TEST` (if available)

---

## 🔍 What to Check

### ✅ Working Correctly If:
- Pages load without errors
- Timer counts down
- Questions/problems display
- Answers can be selected/entered
- Navigation works (Next/Previous)
- Submission works
- Results show scores

### ❌ Issues If:
- Blank pages → Check browser console (F12)
- Timer not working → Check `js/timer.js` loaded
- No questions → Check `js/data.js` loaded
- Can't authenticate → Check code format (CODE-XXXX)

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Page blank | Hard refresh: Ctrl+F5 |
| Timer stuck | Check exam start time in `js/timer.js` |
| No questions | Verify `js/data.js` exists |
| Can't submit | Check if all required fields filled |

---

## 📊 Expected Results

After completing all rounds:
- **MCQ**: Score out of 30 (or language-specific max)
- **Debug**: Score out of 5
- **PS**: Score out of 5 (based on test cases passed)
- **Total**: Combined score

---

**Time to complete full test: ~5 minutes** ⏱️
