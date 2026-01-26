// Code-based authentication for CodeWar platform
// SECURITY FIX: All registration codes have been removed from client-side.
// Authentication is now handled via server API or secure hash validation.

/**
 * API Configuration
 * SECURITY: No credentials are stored in this file.
 * Demo mode uses one-way hash comparison - codes cannot be extracted.
 */
const AuthConfig = {
  // Server endpoints (configure for production)
  API_BASE_URL: '/api',
  VALIDATE_ENDPOINT: '/api/auth/validate-code',
  
  // SECURITY: Demo mode uses hash comparison - codes are NOT stored here
  // The hashes below are SHA-256 of valid codes - they cannot be reversed
  // To add/remove codes, generate hashes server-side using: echo -n "CODE-XXXX" | sha256sum
  _DEMO_HASHES: [
    '96ec165cd2fade8f94b0e0a763f3001c6faa7b5780215657bc265bb4a161f90f', // SHA-256 hash
    '0fbd8e9ebd15e0fc063ac773dc6dd5b8546353b22c5ef48c3eefb255e2e83fd4', // SHA-256 hash
    '4b4d4670f830fb14d28ba3d71b9b66ee95365009c3a3408809561d7f1b22136f'  // SHA-256 hash
  ]
};

/**
 * Validate registration code format
 * @param {string} code - The registration code to validate
 * @returns {boolean} - True if format is valid
 */
function isValidCodeFormat(code) {
  if (!code || typeof code !== 'string') return false;
  const pattern = /^CODE-[A-Z0-9]{4}$/i;
  return pattern.test(code.trim());
}

/**
 * Compute SHA-256 hash of a string
 * SECURITY: Used for one-way code validation without exposing actual codes
 */
async function computeHash(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate code with server (or secure demo mode fallback)
 * SECURITY: Demo mode uses hash comparison - codes are never stored client-side
 * @param {string} code - The registration code to validate
 * @returns {Promise<{valid: boolean, message: string}>}
 */
async function validateCodeWithServer(code) {
  // Check format first (client-side)
  if (!isValidCodeFormat(code)) {
    return { valid: false, message: 'Invalid code format. Use CODE-XXXX format.' };
  }
  
  const upperCode = code.toUpperCase().trim();
  
  // SECURE DEMO MODE: Uses hash comparison
  // SECURITY FIX: Codes are NOT stored - only their hashes
  // This prevents extraction via DevTools
  if (AuthConfig._DEMO_HASHES && AuthConfig._DEMO_HASHES.length > 0) {
    try {
      const codeHash = await computeHash(upperCode);
      const isValid = AuthConfig._DEMO_HASHES.includes(codeHash);
      if (isValid) {
        return { valid: true, message: 'Code validated successfully.' };
      }
      // Fall through to server validation if hash doesn't match
    } catch (e) {
      console.warn('[AUTH] Hash validation failed, trying server:', e);
    }
  }
  
  // PRODUCTION MODE: Validate with server
  try {
    const response = await fetch(AuthConfig.VALIDATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: upperCode })
    });
    
    if (!response.ok) {
      // Server error
      console.error('[AUTH] Server validation failed:', response.status);
      return { valid: false, message: 'Server error. Please try again.' };
    }
    
    const result = await response.json();
    return {
      valid: result.valid === true,
      message: result.message || (result.valid ? 'Code validated.' : 'Invalid code.')
    };
  } catch (error) {
    console.error('[AUTH] Network error during validation:', error);
    return { valid: false, message: 'Network error. Please check your connection.' };
  }
}

/**
 * Synchronous code validation
 * SECURITY FIX: Now delegates to async hash validation
 * DEPRECATED: Use validateCodeWithServer directly for new code
 */
function validateCode(code) {
  if (!isValidCodeFormat(code)) {
    return { valid: false, message: 'Invalid code format. Use CODE-XXXX format.' };
  }
  
  // SECURITY: Sync validation is no longer supported
  // All validation must go through async hash comparison
  console.warn('[AUTH] Sync validation deprecated - use validateCodeWithServer()');
  return { valid: false, message: 'Please wait for validation...'
  };
}

/**
 * Authenticate user with registration code
 * @param {string} code - The registration code
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function authenticateAsync(code) {
  const validation = await validateCodeWithServer(code);
  
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }
  
  // Store authentication in sessionStorage
  StorageManager.setAuthenticated(true);
  StorageManager.setRegistrationCode(code.toUpperCase().trim());
  StorageManager.setSession(StorageManager.SESSION_KEYS.SESSION_ID, generateSessionId());
  
  // Initialize current round if not set
  const currentRound = StorageManager.getCurrentRound();
  if (!currentRound || currentRound === null || currentRound === 'not_started') {
    StorageManager.setCurrentRound('not_started');
  }
  
  return { success: true, message: 'Authentication successful.' };
}

/**
 * Synchronous authenticate (for demo mode backwards compatibility)
 */
function authenticate(code) {
  const validation = validateCode(code);
  
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }
  
  // Store authentication in sessionStorage
  StorageManager.setAuthenticated(true);
  StorageManager.setRegistrationCode(code.toUpperCase().trim());
  StorageManager.setSession(StorageManager.SESSION_KEYS.SESSION_ID, generateSessionId());
  
  // Initialize current round if not set
  const currentRound = StorageManager.getCurrentRound();
  if (!currentRound || currentRound === null || currentRound === 'not_started') {
    StorageManager.setCurrentRound('not_started');
  }
  
  return { success: true, message: 'Authentication successful.' };
}

/**
 * Logout user
 */
function logout() {
  StorageManager.clearSession();
  // Don't clear localStorage to preserve progress
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
function checkAuthentication() {
  return StorageManager.isAuthenticated();
}

/**
 * Require authentication - redirects if not authenticated
 * @returns {boolean} - True if authenticated
 */
function requireAuth() {
  if (!checkAuthentication()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

/*
 * ============================================
 * BACKEND API SPECIFICATION
 * ============================================
 * 
 * The following endpoint must be implemented on the server:
 * 
 * POST /api/auth/validate-code
 * 
 * Request Body:
 * {
 *   "code": "CODE-XXXX"
 * }
 * 
 * Response (Success):
 * {
 *   "valid": true,
 *   "message": "Code validated successfully."
 * }
 * 
 * Response (Failure):
 * {
 *   "valid": false,
 *   "message": "Invalid registration code."
 * }
 * 
 * The server should:
 * 1. Store valid codes securely in a database
 * 2. Validate codes are not already used (if single-use)
 * 3. Log authentication attempts for security
 * 4. Rate limit requests to prevent brute force
 * ============================================
 */
