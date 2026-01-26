// Utility functions for CodeWar platform

/**
 * Fisher-Yates shuffle algorithm for randomizing questions
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled copy of the array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Base64 encoding
 * @param {string} str - String to encode
 * @returns {string} - Base64 encoded string
 */
function base64Encode(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    console.error('Base64 encode error:', e);
    return '';
  }
}

/**
 * Base64 decoding
 * @param {string} str - Base64 string to decode
 * @returns {string|null} - Decoded string or null on error
 */
function base64Decode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    console.error('Base64 decode error:', e);
    return null;
  }
}

/**
 * DEPRECATED: Answer encoding/decoding
 * Answers should not be stored client-side.
 * These functions are kept for backwards compatibility only.
 */
function encodeAnswer(option) {
  console.warn('[UTILS] encodeAnswer is deprecated');
  return base64Encode(option);
}

function decodeAnswer(encoded) {
  console.warn('[UTILS] decodeAnswer is deprecated');
  return base64Decode(encoded);
}

/**
 * Validate code pattern (CODE-XXXX)
 * @param {string} code - Registration code to validate
 * @returns {boolean} - True if valid format
 */
function validateCodePattern(code) {
  if (!code || typeof code !== 'string') return false;
  const pattern = /^CODE-[A-Z0-9]{4}$/i;
  return pattern.test(code.trim());
}

/**
 * Format time (seconds to MM:SS)
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time string
 */
function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format countdown time
 * @param {number} ms - Milliseconds until target
 * @returns {Object} - Countdown object with days, hours, minutes, seconds
 */
function formatCountdown(ms) {
  const safeMs = Math.max(0, ms || 0);
  const totalSeconds = Math.floor(safeMs / 1000);
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

/**
 * Generate unique session ID
 * @returns {string} - Unique session ID
 */
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Generate browser fingerprint
 * @returns {string} - Browser fingerprint hash
 */
function generateFingerprint() {
  const data = [
    navigator.userAgent || '',
    screen.width || 0,
    screen.height || 0,
    new Date().getTimezoneOffset(),
    navigator.language || '',
    navigator.platform || ''
  ].join('|');
  return base64Encode(data);
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
function deepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.error('Deep clone error:', e);
    return obj;
  }
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
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

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
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

/**
 * Sanitize code for display (prevent XSS)
 * @param {string} code - Code string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeCode(code) {
  if (!code) return '';
  const div = document.createElement('div');
  div.textContent = String(code);
  return div.innerHTML;
}

/**
 * Sanitize HTML (alias for sanitizeCode)
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeHTML(html) {
  return sanitizeCode(html);
}

/**
 * Compare two code strings (normalized)
 * Removes extra whitespace and normalizes line endings
 * @param {string} code1 - First code string
 * @param {string} code2 - Second code string
 * @returns {boolean} - True if codes are equivalent
 */
function compareCode(code1, code2) {
  const normalize = (str) => {
    if (!str) return '';
    return str
      .replace(/\s+/g, ' ')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim()
      .toLowerCase();
  };
  
  return normalize(code1) === normalize(code2);
}

/**
 * Show toast notification
 * NON-BLOCKING: Required for anti-cheat compatibility
 * Using alert() would block JS, interfere with focus/blur detection, and desync timers
 * 
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 3000) {
  // Remove existing toast
  const existing = document.getElementById('toast-notification');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.id = 'toast-notification';
  toast.className = `toast toast-${type}`;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 100000;
    animation: slideIn 0.3s ease-out;
    max-width: 400px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  `;
  
  // Type-specific colors
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };
  toast.style.backgroundColor = colors[type] || colors.info;
  if (type === 'warning') toast.style.color = '#333';
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Auto-remove after duration
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * NON-BLOCKING MODAL SYSTEM
 * ============================================
 * These functions replace alert(), confirm(), and prompt()
 * which are INCOMPATIBLE with anti-cheat systems because they:
 * - Block the JavaScript event loop
 * - Steal browser focus (triggers blur events)
 * - Interfere with visibilitychange detection
 * - Desynchronize timers and intervals
 * - Can cause false anti-cheat violations
 * ============================================
 */

// Track if modal is showing to prevent re-triggering anti-cheat
let _modalShowing = false;

/**
 * Check if a modal is currently showing
 * Used by anti-cheat to ignore focus events during modal display
 */
function isModalShowing() {
  return _modalShowing;
}

/**
 * Inject modal CSS styles (called once)
 */
function _ensureModalStyles() {
  if (document.getElementById('modal-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'modal-styles';
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      animation: fadeIn 0.2s ease-out;
    }
    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 30px;
      max-width: 450px;
      width: 90%;
      text-align: center;
      animation: scaleIn 0.2s ease-out;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .modal-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }
    .modal-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }
    .modal-message {
      color: #666;
      line-height: 1.5;
      margin-bottom: 25px;
    }
    .modal-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .modal-btn {
      padding: 12px 30px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.1s;
    }
    .modal-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .modal-btn:active {
      transform: translateY(0);
    }
    .modal-btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .modal-btn-danger {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }
    .modal-btn-secondary {
      background: #e9ecef;
      color: #333;
    }
    .modal-countdown {
      font-size: 24px;
      font-weight: 700;
      color: #dc3545;
      margin: 15px 0;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Show non-blocking alert modal
 * REPLACES: alert()
 * WHY: alert() blocks JS and triggers focus loss, breaking anti-cheat
 * 
 * @param {string} message - Message to display
 * @param {string} title - Optional title
 * @param {string} type - 'info', 'success', 'error', 'warning'
 * @param {Function} onClose - Optional callback when closed
 */
function showAlert(message, title = 'Notice', type = 'info', onClose = null) {
  _ensureModalStyles();
  _modalShowing = true;
  
  // Remove any existing modal
  const existing = document.getElementById('app-modal');
  if (existing) existing.remove();
  
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  
  const modal = document.createElement('div');
  modal.id = 'app-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-icon">${icons[type] || icons.info}</div>
      <div class="modal-title">${sanitizeCode(title)}</div>
      <div class="modal-message">${sanitizeCode(message)}</div>
      <div class="modal-buttons">
        <button class="modal-btn modal-btn-primary" id="modal-ok-btn">OK</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Handle close - use event delegation, not focus()
  const closeModal = () => {
    _modalShowing = false;
    modal.remove();
    if (typeof onClose === 'function') onClose();
  };
  
  document.getElementById('modal-ok-btn').addEventListener('click', closeModal);
  
  // Allow Enter key to close
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      document.removeEventListener('keydown', handleKey);
      closeModal();
    }
  };
  document.addEventListener('keydown', handleKey);
}

/**
 * Show non-blocking confirmation modal
 * REPLACES: confirm()
 * WHY: confirm() blocks JS and steals focus, causing false anti-cheat triggers
 * 
 * @param {string} message - Message to display
 * @param {Function} onConfirm - Callback when confirmed
 * @param {Function} onCancel - Callback when cancelled
 * @param {Object} options - Additional options
 */
function showConfirm(message, onConfirm, onCancel = null, options = {}) {
  _ensureModalStyles();
  _modalShowing = true;
  
  const {
    title = 'Confirm',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning',
    dangerous = false
  } = options;
  
  // Remove any existing modal
  const existing = document.getElementById('app-modal');
  if (existing) existing.remove();
  
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  
  const modal = document.createElement('div');
  modal.id = 'app-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-icon">${icons[type] || icons.warning}</div>
      <div class="modal-title">${sanitizeCode(title)}</div>
      <div class="modal-message">${sanitizeCode(message)}</div>
      <div class="modal-buttons">
        <button class="modal-btn modal-btn-secondary" id="modal-cancel-btn">${sanitizeCode(cancelText)}</button>
        <button class="modal-btn ${dangerous ? 'modal-btn-danger' : 'modal-btn-primary'}" id="modal-confirm-btn">${sanitizeCode(confirmText)}</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const closeModal = (confirmed) => {
    _modalShowing = false;
    modal.remove();
    if (confirmed && typeof onConfirm === 'function') {
      onConfirm();
    } else if (!confirmed && typeof onCancel === 'function') {
      onCancel();
    }
  };
  
  document.getElementById('modal-confirm-btn').addEventListener('click', () => closeModal(true));
  document.getElementById('modal-cancel-btn').addEventListener('click', () => closeModal(false));
  
  // Handle Escape key
  const handleKey = (e) => {
    if (e.key === 'Escape') {
      document.removeEventListener('keydown', handleKey);
      closeModal(false);
    }
  };
  document.addEventListener('keydown', handleKey);
}

/**
 * Show auto-exit modal with countdown
 * REPLACES: alert() for time expiry / auto-exit scenarios
 * WHY: Must show clear feedback without blocking or stealing focus
 * 
 * @param {string} message - Explanation of why exam is ending
 * @param {string} redirectUrl - URL to redirect to
 * @param {number} countdownSeconds - Seconds before redirect (default 5)
 */
function showAutoExit(message, redirectUrl = 'index.html', countdownSeconds = 5) {
  _ensureModalStyles();
  _modalShowing = true;
  
  // Remove any existing modal
  const existing = document.getElementById('app-modal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.id = 'app-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-icon">⏰</div>
      <div class="modal-title">Round Complete</div>
      <div class="modal-message">${sanitizeCode(message)}</div>
      <div class="modal-countdown" id="exit-countdown">${countdownSeconds}</div>
      <div style="color: #999; font-size: 12px;">Redirecting automatically...</div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Countdown timer - NON-BLOCKING
  let remaining = countdownSeconds;
  const countdownEl = document.getElementById('exit-countdown');
  
  const countdownInterval = setInterval(() => {
    remaining--;
    if (countdownEl) countdownEl.textContent = remaining;
    
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      _modalShowing = false;
      window.location.href = redirectUrl;
    }
  }, 1000);
}

/**
 * Show submission confirmation modal with details
 * Specifically designed for quiz/round submissions
 * 
 * @param {Object} details - Submission details
 * @param {Function} onConfirm - Callback when confirmed
 * @param {Function} onCancel - Callback when cancelled
 */
function showSubmitConfirm(details, onConfirm, onCancel = null) {
  const {
    totalQuestions = 0,
    answeredCount = 0,
    roundName = 'Round'
  } = details;
  
  const unanswered = totalQuestions - answeredCount;
  let message = `You have answered ${answeredCount} of ${totalQuestions} questions.`;
  
  if (unanswered > 0) {
    message += `\n\n⚠️ ${unanswered} question(s) are unanswered!`;
  }
  
  message += '\n\nYou cannot change answers after submission.';
  
  showConfirm(message, onConfirm, onCancel, {
    title: `Submit ${roundName}?`,
    confirmText: 'Submit',
    cancelText: 'Continue Working',
    type: unanswered > 0 ? 'warning' : 'info',
    dangerous: unanswered > 0
  });
}

/**
 * Show loading overlay
 * @param {string} message - Loading message
 */
function showLoading(message = 'Loading...') {
  let overlay = document.getElementById('loading-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
      <div class="spinner"></div>
      <p id="loading-message" style="color: white; margin-top: 20px;">${sanitizeCode(message)}</p>
    `;
    document.body.appendChild(overlay);
  } else {
    const msgEl = overlay.querySelector('#loading-message');
    if (msgEl) msgEl.textContent = message;
    overlay.style.display = 'flex';
  }
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

/**
 * Check if user is online
 * @returns {boolean} - True if online
 */
function isOnline() {
  return navigator.onLine !== false;
}

/**
 * Format date for display
 * @param {Date|number|string} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  try {
    const d = new Date(date);
    return d.toLocaleString();
  } catch (e) {
    return 'Invalid date';
  }
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
    sanitizeHTML,
    compareCode,
    showToast,
    showLoading,
    hideLoading,
    isOnline,
    formatDate,
    // Non-blocking modal system (anti-cheat compatible)
    isModalShowing,
    showAlert,
    showConfirm,
    showAutoExit,
    showSubmitConfirm
  };
}
