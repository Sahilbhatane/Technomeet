// Timer functionality for CodeWar platform
// SECURITY FIX: Uses start timestamps for accurate restoration on refresh

// Configurable exam start time (for test mode, set to past date)
const EXAM_START_TIME = new Date('2020-01-01T00:00:00'); // Set to past for testing
const EXAM_DURATION_MINUTES = 180; // 3 hours total

// Round durations in MINUTES
const ROUND_DURATIONS = {
  mcq: 30,    // 30 minutes
  debug: 45,  // 45 minutes
  ps: 60      // 60 minutes
};

function getTimeUntilStart() {
  const now = new Date();
  return EXAM_START_TIME.getTime() - now.getTime();
}

function canStartExam() {
  return getTimeUntilStart() <= 0;
}

function getCountdown() {
  const ms = getTimeUntilStart();
  return formatCountdown(ms);
}

/**
 * RoundTimer - Manages timer for a competition round
 * FIX: Uses absolute timestamps to prevent timer reset on refresh
 */
class RoundTimer {
  constructor(round, durationMinutes) {
    this.round = round;
    this.durationSeconds = durationMinutes * 60;
    this.startTimestamp = null;  // When the round started (absolute time)
    this.remainingSeconds = null;
    this.intervalId = null;
    this.callback = null;
    this._isRunning = false;
    this._submitting = false;  // Flag to prevent race conditions during submission
  }

  /**
   * Start the timer
   * @param {Function} callback - Called every tick with (expired, remaining)
   */
  start(callback) {
    this.callback = callback;
    
    // FIX: Check if timer was previously started using absolute timestamp
    const savedStartTimestamp = StorageManager.getTimerStart(this.round);
    
    if (savedStartTimestamp && savedStartTimestamp > 0) {
      // Timer was already started - calculate remaining time from start
      this.startTimestamp = savedStartTimestamp;
      const elapsedSeconds = Math.floor((Date.now() - this.startTimestamp) / 1000);
      this.remainingSeconds = this.durationSeconds - elapsedSeconds;
      
      // FIX: Clamp to valid range - never negative
      if (this.remainingSeconds < 0) {
        this.remainingSeconds = 0;
      }
      
      console.log(`[TIMER] Restored ${this.round} timer: ${this.remainingSeconds}s remaining`);
    } else {
      // First time starting - record start timestamp
      this.startTimestamp = Date.now();
      this.remainingSeconds = this.durationSeconds;
      
      // Save start timestamp (not remaining time - this prevents refresh cheating)
      StorageManager.setTimerStart(this.round, this.startTimestamp);
      
      console.log(`[TIMER] Started ${this.round} timer: ${this.remainingSeconds}s`);
    }

    // Also save remaining for backwards compatibility
    StorageManager.setTimer(this.round, this.remainingSeconds);
    
    this._isRunning = true;
    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  /**
   * Timer tick - called every second
   */
  tick() {
    // Don't tick if we're submitting to prevent race conditions
    if (this._submitting) {
      return;
    }
    
    // Calculate remaining from start timestamp for accuracy
    if (this.startTimestamp) {
      const elapsedSeconds = Math.floor((Date.now() - this.startTimestamp) / 1000);
      this.remainingSeconds = this.durationSeconds - elapsedSeconds;
    } else {
      // Fallback: decrement manually
      this.remainingSeconds--;
    }
    
    // FIX: Clamp to non-negative
    if (this.remainingSeconds < 0) {
      this.remainingSeconds = 0;
    }

    // Save remaining time
    StorageManager.setTimer(this.round, this.remainingSeconds);

    // Check for expiry
    if (this.remainingSeconds <= 0) {
      this.remainingSeconds = 0;
      this.stop();
      if (this.callback) {
        this.callback(true, 0);  // expired = true
      }
      return;
    }

    // Normal tick callback
    if (this.callback) {
      this.callback(false, this.remainingSeconds);
    }
  }

  /**
   * Stop the timer
   */
  stop() {
    this._isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Pause timer (for navigation)
   */
  pause() {
    this._isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Resume timer after pause
   */
  resume() {
    if (!this._isRunning && this.callback) {
      this._isRunning = true;
      this.intervalId = setInterval(() => {
        this.tick();
      }, 1000);
    }
  }

  /**
   * Prepare for submission - stops timer and sets submitting flag
   */
  prepareForSubmission() {
    this._submitting = true;
    this.stop();
  }

  /**
   * Get remaining time in seconds
   */
  getRemaining() {
    // Recalculate from start timestamp for accuracy
    if (this.startTimestamp) {
      const elapsedSeconds = Math.floor((Date.now() - this.startTimestamp) / 1000);
      const remaining = this.durationSeconds - elapsedSeconds;
      return Math.max(0, remaining);
    }
    return Math.max(0, this.remainingSeconds || 0);
  }

  /**
   * Get formatted time string (MM:SS)
   */
  getFormattedTime() {
    const remaining = this.getRemaining();
    return formatTime(remaining);
  }

  /**
   * Check if timer has started for this round
   */
  hasStarted() {
    return this.startTimestamp !== null || StorageManager.getTimerStart(this.round) !== null;
  }

  /**
   * Reset timer (for admin use only)
   */
  reset() {
    this.stop();
    this.startTimestamp = null;
    this.remainingSeconds = this.durationSeconds;
    StorageManager.setTimerStart(this.round, null);
    StorageManager.setTimer(this.round, this.remainingSeconds);
  }
}

/**
 * CountdownTimer - For exam start countdown
 */
class CountdownTimer {
  constructor(callback) {
    this.callback = callback;
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => {
      const countdown = getCountdown();
      if (this.callback) {
        this.callback(countdown);
      }
      
      // Check if exam can start
      if (canStartExam()) {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

/**
 * Utility: Get elapsed time for a round
 * @param {string} round - 'mcq', 'debug', or 'ps'
 * @returns {number} - Elapsed seconds
 */
function getElapsedTime(round) {
  const startTimestamp = StorageManager.getTimerStart(round);
  if (!startTimestamp) return 0;
  return Math.floor((Date.now() - startTimestamp) / 1000);
}

/**
 * Utility: Check if a timer has been started
 * @param {string} round - 'mcq', 'debug', or 'ps'
 * @returns {boolean}
 */
function hasTimerStarted(round) {
  return StorageManager.getTimerStart(round) !== null;
}
