#!/usr/bin/env python3
"""
CodeWar Platform Reset Script
Admin-only script to reset all progress and cached data
"""

import os
import sys
import hashlib
import getpass
from pathlib import Path

# Password hash (SHA256 of the password)
# Default password: "CodeWar2026Admin!" (change this for production)
# To generate new hash: python -c "import hashlib; print(hashlib.sha256('YOUR_PASSWORD'.encode()).hexdigest())"
PASSWORD_HASH = "4e87b5d105292fd5e8d108858245658bb8cd759572c39f991b08cca92e2bef8c"

def verify_password(password):
    """Verify the entered password"""
    # Hash the entered password
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    # Compare with stored hash (first 32 chars for simplicity)
    return password_hash[:32] == PASSWORD_HASH[:32]

def clear_browser_storage_instructions():
    """Print instructions for clearing browser storage"""
    print("\n" + "="*60)
    print("BROWSER STORAGE CLEAR INSTRUCTIONS")
    print("="*60)
    print("\nSince this is a client-side application, data is stored in the browser.")
    print("To completely reset, users need to clear browser storage:")
    print("\nMethod 1: Use the Reset Page")
    print("  1. Navigate to: http://localhost:8000/codewar/reset.html")
    print("  2. Enter the admin password")
    print("  3. Click 'Reset All Data'")
    print("\nMethod 2: Manual Browser Clear")
    print("  Chrome/Edge:")
    print("    - Press F12 (DevTools)")
    print("    - Go to Application tab")
    print("    - Click 'Local Storage' → 'http://localhost:8000'")
    print("    - Right-click → 'Clear'")
    print("    - Click 'Session Storage' → 'http://localhost:8000'")
    print("    - Right-click → 'Clear'")
    print("\n  Firefox:")
    print("    - Press F12 (DevTools)")
    print("    - Go to Storage tab")
    print("    - Expand 'Local Storage' → 'http://localhost:8000'")
    print("    - Right-click → 'Delete All'")
    print("    - Expand 'Session Storage' → 'http://localhost:8000'")
    print("    - Right-click → 'Delete All'")
    print("\n  Safari:")
    print("    - Enable Develop menu (Preferences → Advanced)")
    print("    - Develop → Show Web Inspector")
    print("    - Storage tab → Clear all")
    print("="*60 + "\n")

def create_reset_page():
    """Create/update the reset.html page"""
    reset_html = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeWar Platform Reset - Admin Only</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .reset-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        h1 {
            color: #333;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .warning {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        
        .warning strong {
            color: #d9534f;
        }
        
        .form-group {
            margin: 20px 0;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 600;
        }
        
        input[type="password"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }
        
        input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
        }
        
        .btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-top: 10px;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .btn:active {
            transform: translateY(0);
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .btn-danger:hover {
            box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
        }
        
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            display: none;
        }
        
        .result.success {
            background: #d4edda;
            border: 2px solid #28a745;
            color: #155724;
        }
        
        .result.error {
            background: #f8d7da;
            border: 2px solid #dc3545;
            color: #721c24;
        }
        
        .info {
            background: #e7f3ff;
            border: 2px solid #2196F3;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
            color: #0d47a1;
        }
        
        .info ul {
            margin-left: 20px;
            margin-top: 10px;
        }
        
        .info li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="reset-container">
        <h1>🔒 Admin Reset Panel</h1>
        <p style="text-align: center; color: #666; margin-bottom: 20px;">CodeWar Competition Platform</p>
        
        <div class="warning">
            <strong>⚠️ WARNING:</strong> This will permanently delete all competition data including:
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>All user progress</li>
                <li>All answers and solutions</li>
                <li>All timer states</li>
                <li>All authentication sessions</li>
                <li>All scores and results</li>
            </ul>
            <strong>This action cannot be undone!</strong>
        </div>
        
        <div class="info">
            <strong>ℹ️ What will be cleared:</strong>
            <ul>
                <li>localStorage (all saved progress)</li>
                <li>sessionStorage (all session data)</li>
                <li>All round completion status</li>
                <li>All user answers</li>
            </ul>
        </div>
        
        <form id="resetForm">
            <div class="form-group">
                <label for="password">Admin Password:</label>
                <input type="password" id="password" name="password" placeholder="Enter admin password" required autocomplete="off">
            </div>
            
            <button type="submit" class="btn btn-danger">🗑️ Reset All Data</button>
        </form>
        
        <div id="result" class="result"></div>
    </div>
    
    <script>
        // Password hash (SHA256) - must match reset.py
        // Default password: "CodeWar2026Admin!"
        const PASSWORD_HASH = "4e87b5d105292fd5e8d108858245658bb8cd759572c39f991b08cca92e2bef8c";
        
        async function sha256(message) {
            const msgBuffer = new TextEncoder().encode(message);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        }
        
        async function verifyPassword(password) {
            const hash = await sha256(password);
            return hash.substring(0, 32) === PASSWORD_HASH.substring(0, 32);
        }
        
        function showResult(message, isSuccess) {
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = message;
            resultDiv.className = 'result ' + (isSuccess ? 'success' : 'error');
            resultDiv.style.display = 'block';
        }
        
        function clearAllData() {
            try {
                // Clear localStorage
                localStorage.clear();
                console.log('localStorage cleared');
                
                // Clear sessionStorage
                sessionStorage.clear();
                console.log('sessionStorage cleared');
                
                // Clear any cookies
                document.cookie.split(";").forEach(function(c) {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });
                
                return true;
            } catch (error) {
                console.error('Error clearing data:', error);
                return false;
            }
        }
        
        document.getElementById('resetForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const resultDiv = document.getElementById('result');
            
            // Verify password
            const isValid = await verifyPassword(password);
            
            if (!isValid) {
                showResult('❌ Invalid password! Access denied.', false);
                document.getElementById('password').value = '';
                document.getElementById('password').focus();
                return;
            }
            
            // Clear all data
            const cleared = clearAllData();
            
            if (cleared) {
                showResult('✅ All data has been successfully cleared! The platform is now reset. You can close this page and restart the competition.', true);
                document.getElementById('resetForm').style.display = 'none';
                
                // Optional: Redirect after 3 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } else {
                showResult('❌ Error clearing data. Please try again or clear manually using browser DevTools.', false);
            }
        });
        
        // Focus password field on load
        window.addEventListener('load', () => {
            document.getElementById('password').focus();
        });
    </script>
</body>
</html>'''
    
    reset_path = Path(__file__).parent / 'reset.html'
    with open(reset_path, 'w', encoding='utf-8') as f:
        f.write(reset_html)
    print(f"[OK] Reset page created/updated: {reset_path}")

def main():
    """Main function"""
    print("\n" + "="*60)
    print("CodeWar Platform - Admin Reset Script")
    print("="*60)
    print("\n[WARNING] This will reset all competition data!")
    print("   This action cannot be undone.\n")
    
    # Get password (hidden input)
    try:
        password = getpass.getpass("Enter admin password: ")
    except KeyboardInterrupt:
        print("\n\n❌ Operation cancelled.")
        sys.exit(0)
    
    # Verify password
    if not verify_password(password):
        print("\n[X] Invalid password! Access denied.")
        print("   This script is for administrators only.")
        sys.exit(1)
    
    print("\n[OK] Password verified. Proceeding with reset...\n")
    
    # Create/update reset page
    create_reset_page()
    
    # Print instructions
    clear_browser_storage_instructions()
    
    print("[OK] Reset script completed successfully!")
    print("\nNext steps:")
    print("1. Navigate to: http://localhost:8000/codewar/reset.html")
    print("2. Enter the admin password")
    print("3. Click 'Reset All Data'")
    print("4. All browser storage will be cleared")
    print("\nAlternatively, users can clear browser storage manually using DevTools.")
    print("\n" + "="*60 + "\n")

if __name__ == "__main__":
    main()
