// Utility functions for CodeWar platform

// Fisher-Yates shuffle algorithm for randomizing questions
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Base64 encoding (simple implementation)
function base64Encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

// Base64 decoding
function base64Decode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    return null;
  }
}

// Encode answer (A, B, C, D) to base64
function encodeAnswer(option) {
  return base64Encode(option);
}

// Decode answer from base64
function decodeAnswer(encoded) {
  return base64Decode(encoded);
}

// Validate code pattern (CODE-XXXX)
function validateCodePattern(code) {
  const pattern = /^CODE-[A-Z0-9]{4}$/i;
  return pattern.test(code);
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format countdown time
function formatCountdown(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return {
    days,
    hours,
    minutes,
    seconds,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`
  };
}

// Generate unique session ID
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Generate browser fingerprint
function generateFingerprint() {
  const data = [
    navigator.userAgent,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    navigator.language,
    navigator.platform
  ].join('|');
  return base64Encode(data);
}

// Deep clone object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Sanitize code for display (prevent XSS)
function sanitizeCode(code) {
  const div = document.createElement('div');
  div.textContent = code;
  return div.innerHTML;
}

// Compare two code strings (normalized)
function compareCode(code1, code2) {
  const normalize = (str) => str
    .replace(/\s+/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim()
    .toLowerCase();
  
  return normalize(code1) === normalize(code2);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    shuffleArray,
    base64Encode,
    base64Decode,
    encodeAnswer,
    decodeAnswer,
    validateCodePattern,
    formatTime,
    formatCountdown,
    generateSessionId,
    generateFingerprint,
    deepClone,
    debounce,
    throttle,
    sanitizeCode,
    compareCode
  };
}
