// localStorage and sessionStorage wrapper for CodeWar platform

const StorageManager = {
  // Session Storage Keys
  SESSION_KEYS: {
    AUTHENTICATED: 'codewar_authenticated',
    REGISTRATION_CODE: 'codewar_registration_code',
    SESSION_ID: 'codewar_session_id'
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    LANGUAGE_CHOICE: 'codewar_language_choice',
    LANGUAGE_CHANGES: 'codewar_language_changes',
    CURRENT_ROUND: 'codewar_current_round',
    WARNINGS: 'codewar_warnings',
    TAB_SWITCHES: 'codewar_tab_switches',
    MCQ_ANSWERS: 'codewar_mcq_answers',
    MCQ_SCORE: 'codewar_mcq_score',
    MCQ_STARTED_AT: 'codewar_mcq_started_at',
    DEBUG_ANSWERS: 'codewar_debug_answers',
    DEBUG_SCORE: 'codewar_debug_score',
    DEBUG_STARTED_AT: 'codewar_debug_started_at',
    PS_SOLUTION: 'codewar_ps_solution',
    PS_SCORE: 'codewar_ps_score',
    PS_STARTED_AT: 'codewar_ps_started_at',
    EXAM_START_TIME: 'codewar_exam_start_time',
    TIMER_MCQ: 'codewar_timer_mcq',
    TIMER_DEBUG: 'codewar_timer_debug',
    TIMER_PS: 'codewar_timer_ps',
    FINGERPRINT: 'codewar_fingerprint'
  },

  // Session Storage Methods
  setSession(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('SessionStorage error:', e);
      return false;
    }
  },

  getSession(key) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('SessionStorage read error:', e);
      return null;
    }
  },

  removeSession(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('SessionStorage remove error:', e);
      return false;
    }
  },

  clearSession() {
    try {
      sessionStorage.clear();
      return true;
    } catch (e) {
      console.error('SessionStorage clear error:', e);
      return false;
    }
  },

  // Local Storage Methods
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('LocalStorage error:', e);
      return false;
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('LocalStorage read error:', e);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('LocalStorage remove error:', e);
      return false;
    }
  },

  // Convenience methods for common operations
  isAuthenticated() {
    return this.getSession(this.SESSION_KEYS.AUTHENTICATED) === true;
  },

  setAuthenticated(value) {
    return this.setSession(this.SESSION_KEYS.AUTHENTICATED, value);
  },

  getRegistrationCode() {
    return this.getSession(this.SESSION_KEYS.REGISTRATION_CODE);
  },

  setRegistrationCode(code) {
    return this.setSession(this.SESSION_KEYS.REGISTRATION_CODE, code);
  },

  getCurrentRound() {
    return this.get(this.STORAGE_KEYS.CURRENT_ROUND) || 'not_started';
  },

  setCurrentRound(round) {
    return this.set(this.STORAGE_KEYS.CURRENT_ROUND, round);
  },

  getLanguageChoice() {
    return this.get(this.STORAGE_KEYS.LANGUAGE_CHOICE);
  },

  setLanguageChoice(lang) {
    return this.set(this.STORAGE_KEYS.LANGUAGE_CHOICE, lang);
  },

  getLanguageChanges() {
    return this.get(this.STORAGE_KEYS.LANGUAGE_CHANGES) || 0;
  },

  incrementLanguageChanges() {
    const current = this.getLanguageChanges();
    return this.set(this.STORAGE_KEYS.LANGUAGE_CHANGES, current + 1);
  },

  getWarnings() {
    return this.get(this.STORAGE_KEYS.WARNINGS) || 0;
  },

  setWarnings(count) {
    return this.set(this.STORAGE_KEYS.WARNINGS, count);
  },

  incrementWarnings() {
    const current = this.getWarnings();
    return this.set(this.STORAGE_KEYS.WARNINGS, current + 1);
  },

  getTabSwitches() {
    return this.get(this.STORAGE_KEYS.TAB_SWITCHES) || 0;
  },

  incrementTabSwitches() {
    const current = this.getTabSwitches();
    return this.set(this.STORAGE_KEYS.TAB_SWITCHES, current + 1);
  },

  // MCQ Methods
  getMCQAnswers() {
    return this.get(this.STORAGE_KEYS.MCQ_ANSWERS) || {};
  },

  setMCQAnswer(questionId, answer) {
    const answers = this.getMCQAnswers();
    answers[questionId] = answer;
    return this.set(this.STORAGE_KEYS.MCQ_ANSWERS, answers);
  },

  getMCQScore() {
    return this.get(this.STORAGE_KEYS.MCQ_SCORE);
  },

  setMCQScore(score, percentage, totalQuestions = 30) {
    return this.set(this.STORAGE_KEYS.MCQ_SCORE, { score, percentage, totalQuestions });
  },

  // Debug Methods
  getDebugAnswers() {
    return this.get(this.STORAGE_KEYS.DEBUG_ANSWERS) || {};
  },

  setDebugAnswer(questionId, solution) {
    const answers = this.getDebugAnswers();
    answers[questionId] = solution;
    return this.set(this.STORAGE_KEYS.DEBUG_ANSWERS, answers);
  },

  getDebugScore() {
    return this.get(this.STORAGE_KEYS.DEBUG_SCORE);
  },

  setDebugScore(score, percentage) {
    return this.set(this.STORAGE_KEYS.DEBUG_SCORE, { score, percentage });
  },

  // PS Methods
  getPSSolution() {
    return this.get(this.STORAGE_KEYS.PS_SOLUTION) || '';
  },

  setPSSolution(solution) {
    return this.set(this.STORAGE_KEYS.PS_SOLUTION, solution);
  },

  getPSScore() {
    return this.get(this.STORAGE_KEYS.PS_SCORE);
  },

  setPSScore(score) {
    return this.set(this.STORAGE_KEYS.PS_SCORE, score);
  },

  // Timer Methods
  getTimer(round) {
    const key = round === 'mcq' ? this.STORAGE_KEYS.TIMER_MCQ :
                round === 'debug' ? this.STORAGE_KEYS.TIMER_DEBUG :
                this.STORAGE_KEYS.TIMER_PS;
    return this.get(key);
  },

  setTimer(round, seconds) {
    const key = round === 'mcq' ? this.STORAGE_KEYS.TIMER_MCQ :
                round === 'debug' ? this.STORAGE_KEYS.TIMER_DEBUG :
                this.STORAGE_KEYS.TIMER_PS;
    return this.set(key, seconds);
  },

  // Clear all data (for reset)
  clearAll() {
    this.clearSession();
    Object.values(this.STORAGE_KEYS).forEach(key => {
      this.remove(key);
    });
    return true;
  }
};
