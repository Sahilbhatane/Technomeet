// Enhanced anti-cheat system for CodeWar platform

class AntiCheatSystem {
  constructor(enabled = true) {
    this.enabled = enabled;
    this.warnings = StorageManager.getWarnings();
    this.maxWarnings = 2;
    this.tabSwitches = StorageManager.getTabSwitches();
    this.sessionId = generateSessionId();
    this.fingerprint = generateFingerprint();
    this.monitoringInterval = null;
    this.lastFocusTime = Date.now();
    this.devToolsOpen = false;
    this.broadcastChannel = null;
    this.warningCallbacks = [];
    
    // Store fingerprint
    const storedFingerprint = StorageManager.get(StorageManager.STORAGE_KEYS.FINGERPRINT);
    if (!storedFingerprint) {
      StorageManager.set(StorageManager.STORAGE_KEYS.FINGERPRINT, this.fingerprint);
    } else if (storedFingerprint !== this.fingerprint) {
      this.triggerWarning('Session fingerprint mismatch detected');
    }
  }

  // Initialize anti-cheat system
  init() {
    if (!this.enabled) return;

    this.disableRightClick();
    this.disableKeyboardShortcuts();
    this.disableTextSelection();
    this.setupFocusDetection();
    this.setupVisibilityDetection();
    this.setupDevToolsDetection();
    this.setupMultipleTabDetection();
    this.setupClipboardMonitoring();
    this.setupNetworkMonitoring();
    this.setupPageRefreshPrevention();
    this.startContinuousMonitoring();
  }

  // Disable right-click context menu
  disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    
    document.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        e.preventDefault();
        return false;
      }
    });
  }

  // Disable keyboard shortcuts
  disableKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          (e.ctrlKey && (e.key === 'U' || e.key === 'S'))) {
        e.preventDefault();
        e.stopPropagation();
        this.triggerWarning('Keyboard shortcut blocked');
        return false;
      }
    }, true);
  }

  // Disable text selection
  disableTextSelection() {
    document.addEventListener('selectstart', (e) => {
      // Allow selection in code editors
      const target = e.target;
      if (target && target.closest && !target.closest('textarea') && !target.closest('.code-editor')) {
        e.preventDefault();
        return false;
      }
    });

    document.addEventListener('copy', (e) => {
      // Allow copy in code editors for PS round
      const target = e.target;
      if (target && target.closest && !target.closest('textarea') && !target.closest('.code-editor')) {
        e.preventDefault();
        return false;
      }
    });

    document.addEventListener('cut', (e) => {
      const target = e.target;
      if (target && target.closest && !target.closest('textarea') && !target.closest('.code-editor')) {
        e.preventDefault();
        return false;
      }
    });

    document.addEventListener('paste', (e) => {
      // Allow paste in code editors for PS round
      const target = e.target;
      if (target && target.closest && !target.closest('textarea') && !target.closest('.code-editor')) {
        e.preventDefault();
        return false;
      }
    });
  }

  // Focus detection
  setupFocusDetection() {
    window.addEventListener('blur', () => {
      this.lastFocusTime = Date.now();
      this.triggerWarning('Window focus lost');
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.triggerWarning('Tab hidden');
      }
    });
  }

  // Visibility API monitoring
  setupVisibilityDetection() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.tabSwitches++;
        StorageManager.incrementTabSwitches();
        this.triggerWarning('Tab switch detected');
      }
    });
  }

  // DevTools detection
  setupDevToolsDetection() {
    // Width/Height detection
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if (widthThreshold || heightThreshold) {
        if (!this.devToolsOpen) {
          this.devToolsOpen = true;
          this.triggerWarning('DevTools detected');
        }
      } else {
        this.devToolsOpen = false;
      }
    };

    setInterval(checkDevTools, 500);

    // Console detection
    let devtools = false;
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function() {
        devtools = true;
      }
    });
    
    setInterval(() => {
      devtools = false;
      console.log(element);
      console.clear();
      if (devtools) {
        this.triggerWarning('Console access detected');
      }
    }, 1000);
  }

  // Multiple tab detection
  setupMultipleTabDetection() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('codewar_session');
      
      this.broadcastChannel.postMessage({ 
        type: 'ping', 
        sessionId: this.sessionId 
      });

      this.broadcastChannel.onmessage = (e) => {
        if (e.data.type === 'ping' && e.data.sessionId !== this.sessionId) {
          this.triggerWarning('Multiple tabs detected');
        }
      };

      // Send periodic pings
      setInterval(() => {
        this.broadcastChannel.postMessage({ 
          type: 'ping', 
          sessionId: this.sessionId 
        });
      }, 2000);
    }
  }

  // Clipboard monitoring
  setupClipboardMonitoring() {
    document.addEventListener('paste', (e) => {
      // Log paste events (except in allowed areas)
      const target = e.target;
      if (target && target.closest && !target.closest('textarea') && !target.closest('.code-editor')) {
        // Log suspicious activity
        console.warn('Paste attempt blocked');
      }
    });
  }

  // Network monitoring
  setupNetworkMonitoring() {
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      const url = args[0];
      if (typeof url === 'string' && !url.startsWith(window.location.origin) && !url.startsWith('/')) {
        this.triggerWarning('External network request detected');
      }
      return originalFetch.apply(this, args);
    };
  }

  // Page refresh prevention
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

  // Continuous monitoring
  startContinuousMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.checkFocus();
      this.checkVisibility();
      this.verifyFingerprint();
    }, 100);
  }

  checkFocus() {
    if (!document.hasFocus() && document.visibilityState === 'visible') {
      const timeSinceFocus = Date.now() - this.lastFocusTime;
      if (timeSinceFocus > 1000) {
        this.triggerWarning('Focus lost');
        this.lastFocusTime = Date.now();
      }
    }
  }

  checkVisibility() {
    if (document.hidden) {
      this.tabSwitches++;
      StorageManager.incrementTabSwitches();
    }
  }

  verifyFingerprint() {
    const stored = StorageManager.get(StorageManager.STORAGE_KEYS.FINGERPRINT);
    if (stored && stored !== this.fingerprint) {
      this.triggerWarning('Session fingerprint changed');
    }
  }

  // Warning system
  triggerWarning(reason) {
    if (!this.enabled) return;

    this.warnings++;
    StorageManager.setWarnings(this.warnings);
    
    // Notify callbacks
    this.warningCallbacks.forEach(callback => {
      callback(this.warnings, reason);
    });

    if (this.warnings > this.maxWarnings) {
      this.autoExit(`Maximum warnings exceeded (${this.warnings})`);
    } else {
      this.showWarningModal(reason);
    }
  }

  // Show warning modal
  showWarningModal(reason) {
    const modal = document.createElement('div');
    modal.className = 'warning-modal';
    modal.innerHTML = `
      <div class="warning-content">
        <h2>⚠️ Warning ${this.warnings}/${this.maxWarnings + 1}</h2>
        <p>${reason}</p>
        <p>You will be automatically exited on the next violation.</p>
        <button onclick="this.parentElement.parentElement.remove()">OK</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
    }, 5000);
  }

  // Auto exit
  autoExit(reason) {
    this.stop();
    StorageManager.setCurrentRound('completed');
    alert(`Exam terminated: ${reason}`);
    window.location.href = 'results.html';
  }

  // Stop monitoring
  stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
  }

  // Register warning callback
  onWarning(callback) {
    this.warningCallbacks.push(callback);
  }

  // Disable for PS round (allows external IDE)
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
