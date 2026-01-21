// Code-based authentication for CodeWar platform

const VALID_CODES = [
  'CODE-0001', 'CODE-0002', 'CODE-0003', 'CODE-0004', 'CODE-0005',
  'CODE-0006', 'CODE-0007', 'CODE-0008', 'CODE-0009', 'CODE-0010',
  'CODE-ABCD', 'CODE-TEST', 'CODE-DEMO'
];

function validateCode(code) {
  // Check pattern first
  const pattern = /^CODE-[A-Z0-9]{4}$/i;
  if (!pattern.test(code)) {
    return { valid: false, message: 'Invalid code format. Use CODE-XXXX format.' };
  }
  
  const upperCode = code.toUpperCase();
  if (!VALID_CODES.includes(upperCode)) {
    return { valid: false, message: 'Invalid registration code.' };
  }
  
  return { valid: true, message: 'Code validated successfully.' };
}

function authenticate(code) {
  const validation = validateCode(code);
  
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }
  
  // Store authentication in sessionStorage
  StorageManager.setAuthenticated(true);
  StorageManager.setRegistrationCode(code.toUpperCase());
  StorageManager.setSession(StorageManager.SESSION_KEYS.SESSION_ID, generateSessionId());
  
  // Initialize current round if not set
  const currentRound = StorageManager.getCurrentRound();
  if (!currentRound || currentRound === null || currentRound === undefined) {
    StorageManager.setCurrentRound('not_started');
  }
  
  return { success: true, message: 'Authentication successful.' };
}

function logout() {
  StorageManager.clearSession();
  // Don't clear localStorage to preserve progress
}

function checkAuthentication() {
  return StorageManager.isAuthenticated();
}

function requireAuth() {
  if (!checkAuthentication()) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}
