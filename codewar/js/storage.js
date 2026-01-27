// localStorage and sessionStorage wrapper for CodeWar platform
// SECURITY FIX: Added timer timestamps and question order persistence

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
    
    // MCQ
    MCQ_ANSWERS: 'codewar_mcq_answers',
    MCQ_SCORE: 'codewar_mcq_score',
    MCQ_QUESTION_ORDER: 'codewar_mcq_question_order',  // FIX: Persist question order
    
    // Debug
    DEBUG_ANSWERS: 'codewar_debug_answers',
    DEBUG_SCORE: 'codewar_debug_score',
    
    // PS
    PS_SOLUTIONS: 'codewar_ps_solutions',  // Changed to solutions (plural)
    PS_SCORE: 'codewar_ps_score',
    
    // Timer - Using START timestamps for accurate restoration
    TIMER_START_MCQ: 'codewar_timer_start_mcq',      // FIX: Store start time
    TIMER_START_DEBUG: 'codewar_timer_start_debug',
    TIMER_START_PS: 'codewar_timer_start_ps',
    TIMER_MCQ: 'codewar_timer_mcq',       // Legacy - remaining seconds
    TIMER_DEBUG: 'codewar_timer_debug',
    TIMER_PS: 'codewar_timer_ps',
    
    FINGERPRINT: 'codewar_fingerprint',
    
    // Anti-cheat
    LAST_WARNING_TIME: 'codewar_last_warning_time',
    NETWORK_REQUESTS: 'codewar_network_requests',  // Track suspicious network activity
    
    // Scoring System
    MCQ_SCORE_DATA: 'codewar_mcq_score_data',      // Detailed MCQ score with breakdown
    DEBUG_SCORE_DATA: 'codewar_debug_score_data',  // Detailed Debug score with breakdown
    PS_SCORE_DATA: 'codewar_ps_score_data',        // Detailed PS score with breakdown
    ROUND_PENALTIES: 'codewar_round_penalties',    // Current round penalties
    MINOR_VIOLATIONS: 'codewar_minor_violations',  // Minor violation count (for forgiveness)
    ELIMINATED: 'codewar_eliminated',              // Elimination status
    ELIMINATED_ROUND: 'codewar_eliminated_round',  // Round where eliminated
    ADMIN_OVERRIDE: 'codewar_admin_override'       // Admin override for elimination
  },

  // ============================================
  // Session Storage Methods
  // ============================================
  
  setSession(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[STORAGE] SessionStorage error:', e);
      this._showStorageError('Could not save session data');
      return false;
    }
  },

  getSession(key) {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('[STORAGE] SessionStorage read error:', e);
      return null;
    }
  },

  removeSession(key) {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('[STORAGE] SessionStorage remove error:', e);
      return false;
    }
  },

  clearSession() {
    try {
      sessionStorage.clear();
      return true;
    } catch (e) {
      console.error('[STORAGE] SessionStorage clear error:', e);
      return false;
    }
  },

  // ============================================
  // Local Storage Methods (with error handling)
  // ============================================
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('[STORAGE] LocalStorage error:', e);
      if (e.name === 'QuotaExceededError') {
        this._showStorageError('Storage quota exceeded! Please clear some data.');
      } else {
        this._showStorageError('Could not save data');
      }
      return false;
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item);
    } catch (e) {
      console.error('[STORAGE] LocalStorage read error:', e);
      // Return null on parse error to prevent crashes
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('[STORAGE] LocalStorage remove error:', e);
      return false;
    }
  },

  // ============================================
  // Storage Error Display
  // ============================================
  
  _showStorageError(message) {
    // Create or update error banner
    let banner = document.getElementById('storage-error-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'storage-error-banner';
      banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#dc3545;color:white;padding:15px;text-align:center;z-index:99999;font-weight:bold;';
      document.body.prepend(banner);
    }
    banner.textContent = '⚠️ ' + message;
    banner.style.display = 'block';
  },

  // ============================================
  // Authentication Methods
  // ============================================
  
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

  // ============================================
  // Round State Methods
  // ============================================
  
  getCurrentRound() {
    return this.get(this.STORAGE_KEYS.CURRENT_ROUND) || 'not_started';
  },

  setCurrentRound(round) {
    return this.set(this.STORAGE_KEYS.CURRENT_ROUND, round);
  },

  // ============================================
  // Language Methods
  // ============================================
  
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

  // ============================================
  // Warning Methods
  // ============================================
  
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

  getLastWarningTime() {
    return this.get(this.STORAGE_KEYS.LAST_WARNING_TIME) || 0;
  },

  setLastWarningTime(timestamp) {
    return this.set(this.STORAGE_KEYS.LAST_WARNING_TIME, timestamp);
  },

  // Network activity tracking for anti-cheat
  getNetworkRequests() {
    return this.get(this.STORAGE_KEYS.NETWORK_REQUESTS) || 0;
  },

  incrementNetworkRequests() {
    const current = this.getNetworkRequests();
    return this.set(this.STORAGE_KEYS.NETWORK_REQUESTS, current + 1);
  },

  setNetworkRequests(count) {
    return this.set(this.STORAGE_KEYS.NETWORK_REQUESTS, count);
  },

  getTabSwitches() {
    return this.get(this.STORAGE_KEYS.TAB_SWITCHES) || 0;
  },

  incrementTabSwitches() {
    const current = this.getTabSwitches();
    return this.set(this.STORAGE_KEYS.TAB_SWITCHES, current + 1);
  },

  // ============================================
  // MCQ Methods
  // ============================================
  
  getMCQAnswers() {
    return this.get(this.STORAGE_KEYS.MCQ_ANSWERS) || {};
  },

  setMCQAnswer(questionId, answer) {
    const answers = this.getMCQAnswers();
    answers[questionId] = answer;
    const success = this.set(this.STORAGE_KEYS.MCQ_ANSWERS, answers);
    if (!success) {
      // Show toast notification on save failure
      if (typeof showToast === 'function') {
        showToast('Failed to save answer!', 'error');
      }
    }
    return success;
  },

  getMCQScore() {
    return this.get(this.STORAGE_KEYS.MCQ_SCORE);
  },

  setMCQScore(score, percentage, totalQuestions = 20) {
    return this.set(this.STORAGE_KEYS.MCQ_SCORE, { score, percentage, totalQuestions });
  },

  // FIX: Question order persistence to prevent reshuffling on refresh
  getMCQQuestionOrder() {
    return this.get(this.STORAGE_KEYS.MCQ_QUESTION_ORDER);
  },

  setMCQQuestionOrder(orderArray) {
    return this.set(this.STORAGE_KEYS.MCQ_QUESTION_ORDER, orderArray);
  },

  // ============================================
  // Debug Methods
  // ============================================
  
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

  // ============================================
  // PS Methods - Per-problem storage to prevent corruption
  // ============================================
  
  getPSSolutions() {
    return this.get(this.STORAGE_KEYS.PS_SOLUTIONS) || {};
  },

  setPSSolution(problemId, solution) {
    const solutions = this.getPSSolutions();
    solutions[problemId] = solution;
    return this.set(this.STORAGE_KEYS.PS_SOLUTIONS, solutions);
  },

  getPSSolution(problemId) {
    const solutions = this.getPSSolutions();
    return solutions[problemId] || '';
  },

  // Legacy support
  getPSSolution_Legacy() {
    return this.get('codewar_ps_solution') || '';
  },

  setPSSolution_Legacy(solution) {
    return this.set('codewar_ps_solution', solution);
  },

  getPSScore() {
    return this.get(this.STORAGE_KEYS.PS_SCORE);
  },

  setPSScore(score) {
    return this.set(this.STORAGE_KEYS.PS_SCORE, score);
  },

  // ============================================
  // Timer Methods - Using timestamps for accuracy
  // ============================================
  
  /**
   * Get the start timestamp for a round
   * @param {string} round - 'mcq', 'debug', or 'ps'
   * @returns {number|null} - Unix timestamp or null
   */
  getTimerStart(round) {
    const key = round === 'mcq' ? this.STORAGE_KEYS.TIMER_START_MCQ :
                round === 'debug' ? this.STORAGE_KEYS.TIMER_START_DEBUG :
                this.STORAGE_KEYS.TIMER_START_PS;
    return this.get(key);
  },

  /**
   * Set the start timestamp for a round
   * @param {string} round - 'mcq', 'debug', or 'ps'
   * @param {number} timestamp - Unix timestamp
   */
  setTimerStart(round, timestamp) {
    const key = round === 'mcq' ? this.STORAGE_KEYS.TIMER_START_MCQ :
                round === 'debug' ? this.STORAGE_KEYS.TIMER_START_DEBUG :
                this.STORAGE_KEYS.TIMER_START_PS;
    return this.set(key, timestamp);
  },

  /**
   * Get remaining time (legacy method - kept for backwards compatibility)
   */
  getTimer(round) {
    const key = round === 'mcq' ? this.STORAGE_KEYS.TIMER_MCQ :
                round === 'debug' ? this.STORAGE_KEYS.TIMER_DEBUG :
                this.STORAGE_KEYS.TIMER_PS;
    return this.get(key);
  },

  /**
   * Set remaining time (legacy method)
   */
  setTimer(round, seconds) {
    const key = round === 'mcq' ? this.STORAGE_KEYS.TIMER_MCQ :
                round === 'debug' ? this.STORAGE_KEYS.TIMER_DEBUG :
                this.STORAGE_KEYS.TIMER_PS;
    // Clamp to non-negative
    const clampedSeconds = Math.max(0, Math.floor(seconds));
    return this.set(key, clampedSeconds);
  },

  // ============================================
  // Scoring System Methods
  // ============================================
  
  // Detailed score data per round (includes breakdown)
  getMCQScoreData() {
    return this.get(this.STORAGE_KEYS.MCQ_SCORE_DATA);
  },

  setMCQScoreData(data) {
    return this.set(this.STORAGE_KEYS.MCQ_SCORE_DATA, data);
  },

  getDebugScoreData() {
    return this.get(this.STORAGE_KEYS.DEBUG_SCORE_DATA);
  },

  setDebugScoreData(data) {
    return this.set(this.STORAGE_KEYS.DEBUG_SCORE_DATA, data);
  },

  getPSScoreData() {
    return this.get(this.STORAGE_KEYS.PS_SCORE_DATA);
  },

  setPSScoreData(data) {
    return this.set(this.STORAGE_KEYS.PS_SCORE_DATA, data);
  },

  // Round penalties tracking
  getRoundPenalties() {
    return this.get(this.STORAGE_KEYS.ROUND_PENALTIES) || 0;
  },

  setRoundPenalties(penalties) {
    return this.set(this.STORAGE_KEYS.ROUND_PENALTIES, penalties);
  },

  addRoundPenalty(penalty) {
    const current = this.getRoundPenalties();
    return this.set(this.STORAGE_KEYS.ROUND_PENALTIES, current + penalty);
  },

  // Minor violation count (for forgiveness system)
  getMinorViolationCount() {
    return this.get(this.STORAGE_KEYS.MINOR_VIOLATIONS) || 0;
  },

  setMinorViolationCount(count) {
    return this.set(this.STORAGE_KEYS.MINOR_VIOLATIONS, count);
  },

  // Elimination status
  isEliminated() {
    return this.get(this.STORAGE_KEYS.ELIMINATED) === true;
  },

  getEliminatedRound() {
    return this.get(this.STORAGE_KEYS.ELIMINATED_ROUND);
  },

  setEliminated(eliminated, round = null) {
    this.set(this.STORAGE_KEYS.ELIMINATED, eliminated);
    if (round) {
      this.set(this.STORAGE_KEYS.ELIMINATED_ROUND, round);
    }
  },

  // Admin override (allows eliminated users to continue)
  hasAdminOverride() {
    return this.get(this.STORAGE_KEYS.ADMIN_OVERRIDE) === true;
  },

  setAdminOverride(override) {
    return this.set(this.STORAGE_KEYS.ADMIN_OVERRIDE, override);
  },

  // ============================================
  // Data Integrity
  // ============================================
  
  /**
   * Verify storage is available and working
   */
  verifyStorageIntegrity() {
    try {
      const testKey = '_storage_test_' + Date.now();
      localStorage.setItem(testKey, 'test');
      const result = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      return result === 'test';
    } catch (e) {
      console.error('[STORAGE] Storage integrity check failed:', e);
      return false;
    }
  },

  // ============================================
  // Clear All Data (for reset)
  // ============================================
  
  clearAll() {
    this.clearSession();
    
    // Clear all known keys
    Object.values(this.STORAGE_KEYS).forEach(key => {
      this.remove(key);
    });
    
    // Also clear legacy keys
    this.remove('codewar_ps_solution');
    
    return true;
  }
};
