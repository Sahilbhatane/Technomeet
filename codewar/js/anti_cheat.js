// Enhanced anti-cheat system for CodeWar platform
// SECURITY FIXES:
// - Removed console.log spam detection (unreliable, causes spam)
// - Added debouncing to prevent false positives
// - Uses multi-signal heuristics
// - Shows visible warnings to users

class AntiCheatSystem {
  constructor(enabled = true) {
    this.enabled = enabled;
    this.warnings = StorageManager.getWarnings();
    this.maxWarnings = 3;  // Allow 3 warnings before exit
    this.tabSwitches = StorageManager.getTabSwitches();
    this.sessionId = generateSessionId();
    this.fingerprint = generateFingerprint();
    this.monitoringInterval = null;
    this.broadcastChannel = null;
    this.warningCallbacks = [];
    
    // FIX: Debouncing and cooldown
    this._lastWarningTime = StorageManager.getLastWarningTime() || 0;
    this._warningCooldownMs = 5000;  // 5 second cooldown between warnings
    this._pendingWarning = false;
    
    // FIX: Violation tracking with time window
    this._violationBuffer = [];
    this._violationWindowMs = 10000;  // 10 second window
    this._violationsToTrigger = 3;    // Need 3 violations in window to trigger
    
    // Focus tracking
    this._lastVisibilityState = document.visibilityState;
    this._focusLossCount = 0;
    this._lastFocusLossTime = 0;
    
    // DevTools detection state
    this._devToolsOpen = false;
    this._devToolsCheckCount = 0;
    
    // Store fingerprint
    const storedFingerprint = StorageManager.get(StorageManager.STORAGE_KEYS.FINGERPRINT);
    if (!storedFingerprint) {
      StorageManager.set(StorageManager.STORAGE_KEYS.FINGERPRINT, this.fingerprint);
    }
  }

  /**
   * Initialize anti-cheat system
   */
  init() {
    if (!this.enabled) return;

    this.disableRightClick();
    this.disableKeyboardShortcuts();
    this.disableTextSelection();
    this.setupVisibilityDetection();
    this.setupDevToolsDetection();
    this.setupMultipleTabDetection();
    this.setupPageRefreshPrevention();
    
    // FIX: Removed startContinuousMonitoring() - it was causing false positives
    console.log('[ANTI-CHEAT] Initialized with', this.warnings, 'existing warnings');
  }

  /**
   * Disable right-click context menu
   */
  disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }

  /**
   * Disable keyboard shortcuts (but don't trigger warnings for every key)
   */
  disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // F12, Ctrl+Shift+I/J/C (DevTools), Ctrl+U (View Source), Ctrl+S (Save)
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
          (e.ctrlKey && ['U', 'S'].includes(e.key.toUpperCase()))) {
        e.preventDefault();
        e.stopPropagation();
        // FIX: Record violation but don't immediately warn for single keystroke
        this._recordViolation('keyboard_shortcut');
        return false;
      }
    }, true);
  }

  /**
   * Disable text selection (except in code editors)
   */
  disableTextSelection() {
    document.addEventListener('selectstart', (e) => {
      const target = e.target;
      if (target && target.closest && !target.closest('textarea') && !target.closest('.code-editor') && !target.closest('input')) {
        e.preventDefault();
        return false;
      }
    });

    // Allow copy/paste in code editors
    ['copy', 'cut', 'paste'].forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        const target = e.target;
        if (target && target.closest && !target.closest('textarea') && !target.closest('.code-editor') && !target.closest('input')) {
          e.preventDefault();
          return false;
        }
      });
    });
  }

  /**
   * FIX: Improved visibility detection with debouncing
   * Uses time-window based thresholds to prevent false positives
   */
  setupVisibilityDetection() {
    // Single handler for both focus and visibility
    const handleVisibilityChange = () => {
      const isHidden = document.hidden || document.visibilityState === 'hidden';
      
      if (isHidden && this._lastVisibilityState !== 'hidden') {
        // Tab became hidden
        this._lastVisibilityState = 'hidden';
        this.tabSwitches++;
        StorageManager.incrementTabSwitches();
        
        // Record violation but with debouncing
        const now = Date.now();
        if (now - this._lastFocusLossTime > 2000) {  // 2 second debounce
          this._lastFocusLossTime = now;
          this._focusLossCount++;
          this._recordViolation('tab_switch');
        }
      } else if (!isHidden) {
        this._lastVisibilityState = 'visible';
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // FIX: Don't trigger on simple blur - too many false positives
    // Only track visibility changes which are more reliable
  }

  /**
   * FIX: Improved DevTools detection using multi-signal heuristics
   * Removed console.log trick (causes spam and is unreliable)
   */
  setupDevToolsDetection() {
    // Method 1: Size-based detection with higher threshold
    const checkDevToolsSize = () => {
      // FIX: Use higher threshold (200px) to avoid false positives
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      const threshold = 200;  // Increased from 160
      const isOpen = widthDiff > threshold || heightDiff > threshold;
      
      if (isOpen && !this._devToolsOpen) {
        this._devToolsCheckCount++;
        
        // FIX: Require multiple consecutive detections
        if (this._devToolsCheckCount >= 3) {
          this._devToolsOpen = true;
          this._recordViolation('devtools_detected');
        }
      } else if (!isOpen) {
        this._devToolsCheckCount = 0;
        this._devToolsOpen = false;
      }
    };

    // Check every 2 seconds (less aggressive)
    setInterval(checkDevToolsSize, 2000);

    // FIX: Removed console.log getter trick - it was causing console spam
    // and is easily bypassed anyway
  }

  /**
   * Multiple tab detection
   */
  setupMultipleTabDetection() {
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.broadcastChannel = new BroadcastChannel('codewar_session');
        
        this.broadcastChannel.postMessage({ 
          type: 'ping', 
          sessionId: this.sessionId 
        });

        this.broadcastChannel.onmessage = (e) => {
          if (e.data.type === 'ping' && e.data.sessionId !== this.sessionId) {
            this._recordViolation('multiple_tabs');
          }
        };

        // Ping every 5 seconds
        setInterval(() => {
          if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({ 
              type: 'ping', 
              sessionId: this.sessionId 
            });
          }
        }, 5000);
      }
    } catch (e) {
      console.warn('[ANTI-CHEAT] BroadcastChannel not supported');
    }
  }

  /**
   * Page refresh prevention
   */
  setupPageRefreshPrevention() {
    window.addEventListener('beforeunload', (e) => {
      const message = 'Are you sure you want to leave? Your progress will be saved.';
      e.returnValue = message;
      return message;
    });

    // Prevent back button
    history.pushState(null, null, location.href);
    window.addEventListener('popstate', () => {
      history.pushState(null, null, location.href);
    });
  }

  /**
   * FIX: Record violation with time-window based thresholds
   * Multiple violations in a short time = warning
   * 
   * ANTI-CHEAT SAFETY: Ignores violations when app modals are showing
   * to prevent false positives from our own non-blocking UI
   */
  _recordViolation(reason) {
    if (!this.enabled) return;
    
    // FIX: Don't record violations while our modal is showing
    // This prevents our own UI from triggering anti-cheat
    if (typeof isModalShowing === 'function' && isModalShowing()) {
      console.log('[ANTI-CHEAT] Violation ignored (modal showing)');
      return;
    }
    
    const now = Date.now();
    
    // Add to buffer
    this._violationBuffer.push({ time: now, reason });
    
    // Clean old violations outside window
    this._violationBuffer = this._violationBuffer.filter(
      v => (now - v.time) < this._violationWindowMs
    );
    
    console.log(`[ANTI-CHEAT] Violation recorded: ${reason} (${this._violationBuffer.length}/${this._violationsToTrigger} in window)`);
    
    // Check if we have enough violations to trigger a warning
    if (this._violationBuffer.length >= this._violationsToTrigger) {
      // Clear the buffer after triggering
      this._violationBuffer = [];
      this.triggerWarning(reason);
    }
  }

  /**
   * FIX: Improved warning system with cooldown and visible modals
   * 
   * ANTI-CHEAT SAFETY: Also checks isModalShowing() to ensure
   * we don't trigger warnings while showing our own UI
   */
  triggerWarning(reason) {
    if (!this.enabled) return;
    
    // FIX: Don't trigger warnings while our modal is showing
    if (typeof isModalShowing === 'function' && isModalShowing()) {
      console.log('[ANTI-CHEAT] Warning skipped (app modal showing)');
      return;
    }
    
    const now = Date.now();
    
    // FIX: Enforce cooldown to prevent rapid-fire warnings
    if (now - this._lastWarningTime < this._warningCooldownMs) {
      console.log('[ANTI-CHEAT] Warning skipped (cooldown)');
      return;
    }
    
    // FIX: Prevent multiple simultaneous warnings
    if (this._pendingWarning) {
      console.log('[ANTI-CHEAT] Warning skipped (pending)');
      return;
    }
    
    this._pendingWarning = true;
    this._lastWarningTime = now;
    StorageManager.setLastWarningTime(now);
    
    // Increment warning count
    this.warnings++;
    StorageManager.setWarnings(this.warnings);
    
    // Notify callbacks
    this.warningCallbacks.forEach(callback => {
      try {
        callback(this.warnings, reason);
      } catch (e) {
        console.error('[ANTI-CHEAT] Callback error:', e);
      }
    });

    console.log(`[ANTI-CHEAT] Warning ${this.warnings}/${this.maxWarnings}: ${reason}`);

    // FIX: Check if max warnings reached (exit AFTER showing warning)
    if (this.warnings >= this.maxWarnings) {
      this.showWarningModal(reason, true);  // isLast = true
      setTimeout(() => {
        this._pendingWarning = false;
        this.autoExit(`Maximum warnings exceeded (${this.warnings})`);
      }, 3000);
    } else {
      this.showWarningModal(reason, false);
      setTimeout(() => {
        this._pendingWarning = false;
      }, this._warningCooldownMs);
    }
  }

  /**
   * FIX: Improved warning modal with clear messaging
   */
  showWarningModal(reason, isLast = false) {
    // Remove any existing modal
    const existing = document.getElementById('anticheat-warning-modal');
    if (existing) existing.remove();
    
    const modal = document.createElement('div');
    modal.id = 'anticheat-warning-modal';
    modal.className = 'warning-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100000;
    `;
    
    const sanitizedReason = this._sanitizeText(reason);
    const remaining = this.maxWarnings - this.warnings;
    
    modal.innerHTML = `
      <div style="background: #0a1528; padding: 40px; border-radius: 10px; border: 3px solid ${isLast ? '#ff0000' : '#ff4444'}; max-width: 500px; text-align: center; animation: scaleIn 0.2s ease-out;">
        <h2 style="color: ${isLast ? '#ff0000' : '#ff4444'}; margin-bottom: 20px; font-size: 1.8em;">
          ⚠️ Warning ${this.warnings}/${this.maxWarnings}
        </h2>
        <p style="color: #ffffff; margin: 15px 0; font-size: 1.1em;">
          <strong>Reason:</strong> ${sanitizedReason}
        </p>
        <p style="color: #b0b0b0; margin: 15px 0;">
          ${isLast 
            ? '<span style="color: #ff0000; font-weight: bold;">⛔ This is your final warning! The exam will be terminated.</span>' 
            : `You have <strong style="color: #ffaa00;">${remaining}</strong> warning(s) remaining before automatic exit.`
          }
        </p>
        <p style="color: #888; font-size: 0.9em; margin-top: 20px;">
          Please focus on your exam and avoid switching tabs or using developer tools.
        </p>
        <button onclick="this.parentElement.parentElement.remove()" 
          style="margin-top: 25px; padding: 12px 40px; background: #00bfff; border: none; color: white; font-weight: bold; cursor: pointer; border-radius: 5px; font-size: 1em;">
          ${isLast ? 'I Understand' : 'OK'}
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto-dismiss after 8 seconds (unless it's the last warning)
    if (!isLast) {
      setTimeout(() => {
        if (modal.parentElement) {
          modal.remove();
        }
      }, 8000);
    }
  }

  /**
   * Sanitize text to prevent XSS
   */
  _sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * FIX: Auto exit with clear messaging
   */
  autoExit(reason) {
    this.stop();
    
    // Create exit modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 100001;
    `;
    
    modal.innerHTML = `
      <div style="background: #1a0000; padding: 50px; border-radius: 10px; border: 3px solid #ff0000; max-width: 600px; text-align: center;">
        <h2 style="color: #ff0000; margin-bottom: 20px; font-size: 2em;">
          ⛔ Exam Terminated
        </h2>
        <p style="color: #ffffff; margin: 20px 0; font-size: 1.2em;">
          Your exam has been terminated due to multiple rule violations.
        </p>
        <p style="color: #ff6666; margin: 15px 0;">
          <strong>Reason:</strong> ${this._sanitizeText(reason)}
        </p>
        <p style="color: #888; margin: 20px 0;">
          Your submitted answers have been saved. You will be redirected to the results page.
        </p>
        <div style="margin-top: 30px; color: #666;">
          Redirecting in <span id="exit-countdown">5</span> seconds...
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Countdown and redirect
    let countdown = 5;
    const countdownEl = modal.querySelector('#exit-countdown');
    const countdownInterval = setInterval(() => {
      countdown--;
      if (countdownEl) countdownEl.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        StorageManager.setCurrentRound('completed');
        window.location.href = 'results.html';
      }
    }, 1000);
  }

  /**
   * Stop monitoring
   */
  stop() {
    this.enabled = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close();
      } catch (e) {
        // Ignore
      }
      this.broadcastChannel = null;
    }
  }

  /**
   * Register warning callback
   */
  onWarning(callback) {
    this.warningCallbacks.push(callback);
  }

  /**
   * Disable for PS round (allows external IDE)
   */
  disableForPS() {
    this.enabled = false;
    this.stop();
  }
}

// Global instance
let antiCheatInstance = null;

function initAntiCheat(enabled = true) {
  antiCheatInstance = new AntiCheatSystem(enabled);
  antiCheatInstance.init();
  return antiCheatInstance;
}

function getAntiCheat() {
  return antiCheatInstance;
}

function cleanupAntiCheat() {
  if (antiCheatInstance) {
    antiCheatInstance.stop();
    antiCheatInstance = null;
  }
}
