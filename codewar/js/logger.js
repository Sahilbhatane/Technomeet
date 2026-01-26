/**
 * CodeWar Platform - Error Logger
 * Comprehensive logging system for automated testing and debugging
 * 
 * Features:
 * - Global error catching (uncaught exceptions, promise rejections)
 * - Console method interception
 * - Network error logging
 * - Performance monitoring
 * - Log export for analysis
 */

const Logger = (function() {
  'use strict';

  // Configuration
  const CONFIG = {
    MAX_LOGS: 1000,              // Maximum logs to keep in memory
    LOG_TO_CONSOLE: true,        // Also output to browser console
    LOG_TO_STORAGE: true,        // Save logs to localStorage
    STORAGE_KEY: 'codewar_error_logs',
    LOG_LEVELS: {
      DEBUG: 0,
      INFO: 1,
      WARN: 2,
      ERROR: 3,
      FATAL: 4
    },
    MIN_LEVEL: 0,                // Minimum level to log (0 = all)
    INCLUDE_STACK: true,         // Include stack traces
    TIMESTAMP_FORMAT: 'ISO'      // ISO or UNIX
  };

  // In-memory log storage
  let logs = [];
  let originalConsole = {};
  let initialized = false;

  /**
   * Initialize the logger
   */
  function init(options = {}) {
    if (initialized) {
      warn('Logger already initialized');
      return;
    }

    // Merge options
    Object.assign(CONFIG, options);

    // Load existing logs from storage
    loadLogsFromStorage();

    // Setup global error handlers
    setupGlobalErrorHandlers();

    // Intercept console methods
    interceptConsole();

    // Setup network error logging
    setupNetworkLogging();

    // Setup performance monitoring
    setupPerformanceMonitoring();

    initialized = true;
    info('Logger initialized', { config: CONFIG });

    // Log page load
    logPageLoad();
  }

  /**
   * Create a log entry
   */
  function createLogEntry(level, message, data = null) {
    const entry = {
      id: generateLogId(),
      timestamp: CONFIG.TIMESTAMP_FORMAT === 'ISO' 
        ? new Date().toISOString() 
        : Date.now(),
      level: level,
      levelName: Object.keys(CONFIG.LOG_LEVELS).find(k => CONFIG.LOG_LEVELS[k] === level) || 'UNKNOWN',
      message: message,
      data: data,
      url: window.location.href,
      userAgent: navigator.userAgent,
      page: getCurrentPage()
    };

    // Add stack trace for errors
    if (level >= CONFIG.LOG_LEVELS.ERROR && CONFIG.INCLUDE_STACK) {
      entry.stack = new Error().stack;
    }

    return entry;
  }

  /**
   * Add a log entry
   */
  function addLog(entry) {
    // Check minimum level
    if (entry.level < CONFIG.MIN_LEVEL) return;

    // Add to memory
    logs.push(entry);

    // Trim if over limit
    if (logs.length > CONFIG.MAX_LOGS) {
      logs = logs.slice(-CONFIG.MAX_LOGS);
    }

    // Save to storage
    if (CONFIG.LOG_TO_STORAGE) {
      saveLogsToStorage();
    }

    // Output to console
    if (CONFIG.LOG_TO_CONSOLE && originalConsole.log) {
      const consoleMethod = getConsoleMethod(entry.level);
      const prefix = `[${entry.levelName}] [${entry.timestamp}]`;
      
      if (entry.data) {
        originalConsole[consoleMethod](prefix, entry.message, entry.data);
      } else {
        originalConsole[consoleMethod](prefix, entry.message);
      }
    }

    return entry;
  }

  /**
   * Get appropriate console method for log level
   */
  function getConsoleMethod(level) {
    if (level >= CONFIG.LOG_LEVELS.ERROR) return 'error';
    if (level >= CONFIG.LOG_LEVELS.WARN) return 'warn';
    if (level >= CONFIG.LOG_LEVELS.INFO) return 'info';
    return 'log';
  }

  /**
   * Generate unique log ID
   */
  function generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current page name
   */
  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page.replace('.html', '');
  }

  // ============== Log Level Methods ==============

  function debug(message, data = null) {
    return addLog(createLogEntry(CONFIG.LOG_LEVELS.DEBUG, message, data));
  }

  function info(message, data = null) {
    return addLog(createLogEntry(CONFIG.LOG_LEVELS.INFO, message, data));
  }

  function warn(message, data = null) {
    return addLog(createLogEntry(CONFIG.LOG_LEVELS.WARN, message, data));
  }

  function error(message, data = null) {
    return addLog(createLogEntry(CONFIG.LOG_LEVELS.ERROR, message, data));
  }

  function fatal(message, data = null) {
    return addLog(createLogEntry(CONFIG.LOG_LEVELS.FATAL, message, data));
  }

  // ============== Global Error Handlers ==============

  function setupGlobalErrorHandlers() {
    // Uncaught exceptions
    window.addEventListener('error', function(event) {
      error('Uncaught Exception', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error ? {
          name: event.error.name,
          message: event.error.message,
          stack: event.error.stack
        } : null
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
      error('Unhandled Promise Rejection', {
        reason: event.reason ? {
          message: event.reason.message || String(event.reason),
          stack: event.reason.stack || null
        } : 'Unknown reason'
      });
    });

    // Resource loading errors
    window.addEventListener('error', function(event) {
      if (event.target && (event.target.tagName === 'SCRIPT' || 
          event.target.tagName === 'LINK' || 
          event.target.tagName === 'IMG')) {
        warn('Resource Load Error', {
          tagName: event.target.tagName,
          src: event.target.src || event.target.href,
          type: event.target.type || null
        });
      }
    }, true);
  }

  // ============== Console Interception ==============

  function interceptConsole() {
    // Store original methods
    originalConsole = {
      log: console.log.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      debug: console.debug.bind(console)
    };

    // Intercept console.error
    console.error = function(...args) {
      error('Console Error', { args: serializeArgs(args) });
      originalConsole.error.apply(console, args);
    };

    // Intercept console.warn
    console.warn = function(...args) {
      warn('Console Warning', { args: serializeArgs(args) });
      originalConsole.warn.apply(console, args);
    };
  }

  /**
   * Serialize console arguments for logging
   */
  function serializeArgs(args) {
    return args.map(arg => {
      if (arg instanceof Error) {
        return { type: 'Error', message: arg.message, stack: arg.stack };
      }
      if (typeof arg === 'object') {
        try {
          return JSON.parse(JSON.stringify(arg));
        } catch (e) {
          return String(arg);
        }
      }
      return arg;
    });
  }

  // ============== Network Error Logging ==============

  function setupNetworkLogging() {
    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const url = args[0];
      const startTime = performance.now();
      
      try {
        const response = await originalFetch.apply(this, args);
        const duration = performance.now() - startTime;
        
        if (!response.ok) {
          warn('HTTP Error Response', {
            url: url,
            status: response.status,
            statusText: response.statusText,
            duration: Math.round(duration)
          });
        } else {
          debug('Fetch Success', {
            url: url,
            status: response.status,
            duration: Math.round(duration)
          });
        }
        
        return response;
      } catch (err) {
        error('Fetch Network Error', {
          url: url,
          error: err.message,
          duration: Math.round(performance.now() - startTime)
        });
        throw err;
      }
    };

    // Intercept XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
      this._loggerUrl = url;
      this._loggerMethod = method;
      return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
      const xhr = this;
      const startTime = performance.now();

      xhr.addEventListener('load', function() {
        const duration = performance.now() - startTime;
        if (xhr.status >= 400) {
          warn('XHR Error Response', {
            url: xhr._loggerUrl,
            method: xhr._loggerMethod,
            status: xhr.status,
            duration: Math.round(duration)
          });
        }
      });

      xhr.addEventListener('error', function() {
        error('XHR Network Error', {
          url: xhr._loggerUrl,
          method: xhr._loggerMethod,
          duration: Math.round(performance.now() - startTime)
        });
      });

      return originalXHRSend.apply(this, arguments);
    };
  }

  // ============== Performance Monitoring ==============

  function setupPerformanceMonitoring() {
    // Log slow operations
    window.addEventListener('load', function() {
      setTimeout(function() {
        if (window.performance && window.performance.timing) {
          const timing = window.performance.timing;
          const metrics = {
            pageLoad: timing.loadEventEnd - timing.navigationStart,
            domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
            domParse: timing.domComplete - timing.domLoading,
            networkLatency: timing.responseEnd - timing.fetchStart
          };

          if (metrics.pageLoad > 3000) {
            warn('Slow Page Load', metrics);
          } else {
            debug('Page Performance', metrics);
          }
        }
      }, 0);
    });

    // Monitor long tasks (if supported)
    if (window.PerformanceObserver) {
      try {
        const observer = new PerformanceObserver(function(list) {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              warn('Long Task Detected', {
                duration: Math.round(entry.duration),
                name: entry.name,
                startTime: Math.round(entry.startTime)
              });
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task monitoring not supported
      }
    }
  }

  /**
   * Log page load event
   */
  function logPageLoad() {
    info('Page Loaded', {
      page: getCurrentPage(),
      referrer: document.referrer || 'direct',
      localStorage: {
        currentRound: localStorage.getItem('codewar_current_round'),
        authenticated: sessionStorage.getItem('codewar_authenticated')
      }
    });
  }

  // ============== Storage ==============

  function saveLogsToStorage() {
    try {
      // Only save last 100 logs to storage to avoid quota issues
      const logsToSave = logs.slice(-100);
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(logsToSave));
    } catch (e) {
      // Storage quota exceeded or unavailable
      originalConsole.warn('[Logger] Failed to save logs to storage:', e);
    }
  }

  function loadLogsFromStorage() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        logs = JSON.parse(stored);
      }
    } catch (e) {
      logs = [];
    }
  }

  // ============== Export & Query ==============

  /**
   * Get all logs
   */
  function getLogs(filter = {}) {
    let result = [...logs];

    if (filter.level !== undefined) {
      result = result.filter(l => l.level >= filter.level);
    }

    if (filter.page) {
      result = result.filter(l => l.page === filter.page);
    }

    if (filter.since) {
      const sinceTime = new Date(filter.since).getTime();
      result = result.filter(l => new Date(l.timestamp).getTime() >= sinceTime);
    }

    return result;
  }

  /**
   * Get only error logs
   */
  function getErrors() {
    return getLogs({ level: CONFIG.LOG_LEVELS.ERROR });
  }

  /**
   * Export logs as JSON string
   */
  function exportLogs() {
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Export logs as downloadable file
   */
  function downloadLogs() {
    const data = exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codewar_logs_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Clear all logs
   */
  function clearLogs() {
    logs = [];
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    info('Logs cleared');
  }

  /**
   * Print summary to console
   */
  function printSummary() {
    const summary = {
      total: logs.length,
      debug: logs.filter(l => l.level === CONFIG.LOG_LEVELS.DEBUG).length,
      info: logs.filter(l => l.level === CONFIG.LOG_LEVELS.INFO).length,
      warn: logs.filter(l => l.level === CONFIG.LOG_LEVELS.WARN).length,
      error: logs.filter(l => l.level === CONFIG.LOG_LEVELS.ERROR).length,
      fatal: logs.filter(l => l.level === CONFIG.LOG_LEVELS.FATAL).length
    };

    originalConsole.log('=== Logger Summary ===');
    originalConsole.table(summary);

    if (summary.error > 0 || summary.fatal > 0) {
      originalConsole.log('=== Error Details ===');
      getErrors().forEach(e => {
        originalConsole.error(`[${e.timestamp}] ${e.message}`, e.data);
      });
    }
  }

  /**
   * Log a user action (for tracking user behavior)
   */
  function logAction(action, details = {}) {
    return info(`User Action: ${action}`, {
      action: action,
      ...details,
      timestamp: Date.now()
    });
  }

  /**
   * Log a test assertion (for automated testing)
   */
  function logAssertion(name, passed, expected, actual) {
    const level = passed ? CONFIG.LOG_LEVELS.DEBUG : CONFIG.LOG_LEVELS.ERROR;
    return addLog(createLogEntry(level, `Assertion: ${name}`, {
      passed: passed,
      expected: expected,
      actual: actual
    }));
  }

  // ============== Public API ==============

  return {
    init,
    debug,
    info,
    warn,
    error,
    fatal,
    logAction,
    logAssertion,
    getLogs,
    getErrors,
    exportLogs,
    downloadLogs,
    clearLogs,
    printSummary,
    CONFIG
  };

})();

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Logger.init());
} else {
  Logger.init();
}

// Make globally available
window.Logger = Logger;

// Convenience functions for quick access
window.logError = Logger.error;
window.logWarn = Logger.warn;
window.logInfo = Logger.info;
window.logDebug = Logger.debug;
