// Timer functionality for CodeWar platform

// Configurable exam start time (for test mode, set to past date or current time)
const EXAM_START_TIME = new Date('2020-01-01T00:00:00'); // Set to past for testing - change to actual event date
const EXAM_DURATION_MINUTES = 180; // 3 hours total

// Round durations
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

class RoundTimer {
  constructor(round, durationMinutes) {
    this.round = round;
    this.durationSeconds = durationMinutes * 60;
    this.startTime = null;
    this.remainingSeconds = null;
    this.intervalId = null;
    this.callback = null;
  }

  start(callback) {
    this.callback = callback;
    
    // Check if timer was previously started
    const savedTime = StorageManager.getTimer(this.round);
    if (savedTime && savedTime > 0) {
      this.remainingSeconds = savedTime;
      this.startTime = new Date(Date.now() - (this.durationSeconds - savedTime) * 1000);
    } else {
      this.remainingSeconds = this.durationSeconds;
      this.startTime = new Date();
      StorageManager.setTimer(this.round, this.remainingSeconds);
    }

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);
  }

  tick() {
    if (this.remainingSeconds <= 0) {
      this.remainingSeconds = 0; // Ensure it doesn't go negative
      this.stop();
      if (this.callback) {
        this.callback(true); // Time expired
      }
      return;
    }

    this.remainingSeconds--;
    // Ensure timer doesn't go negative
    if (this.remainingSeconds < 0) {
      this.remainingSeconds = 0;
    }
    StorageManager.setTimer(this.round, this.remainingSeconds);

    if (this.callback) {
      this.callback(false, this.remainingSeconds);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getRemaining() {
    return this.remainingSeconds;
  }

  getFormattedTime() {
    return formatTime(this.remainingSeconds);
  }

  reset() {
    this.stop();
    this.remainingSeconds = this.durationSeconds;
    StorageManager.setTimer(this.round, this.remainingSeconds);
  }
}

// Countdown timer for exam start
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
