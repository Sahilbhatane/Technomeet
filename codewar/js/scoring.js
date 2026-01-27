/**
 * CodeWar Scoring System
 * 
 * SCORING RULES:
 * - MCQ: +1 point per correct answer (max 20)
 * - Debug: +5 points per correct solution (max 25)
 * - PS: +10 points per correct solution (max 50)
 * - Time Bonus: Up to 20% of base points for speed
 * - Penalties: -1 to -5 for cheating violations
 * 
 * ELIMINATION THRESHOLDS:
 * - MCQ → Debug: ≥25% of MCQ points
 * - Debug → PS: ≥40% of cumulative (MCQ + Debug) points
 * 
 * TIEBREAKER: Faster completion time wins
 */

const ScoringSystem = {
  // Point values per round
  POINTS: {
    mcq: 1,      // Per correct MCQ
    debug: 5,    // Per correct debug solution
    ps: 10       // Per correct PS solution
  },

  // Maximum questions per round
  MAX_QUESTIONS: {
    mcq: 20,
    debug: 5,
    ps: 5
  },

  // Maximum base points per round
  MAX_BASE_POINTS: {
    mcq: 20,     // 20 × 1
    debug: 25,   // 5 × 5
    ps: 50       // 5 × 10
  },

  // Elimination thresholds (percentage of max possible)
  ELIMINATION_THRESHOLDS: {
    mcq: 0.25,      // 25% to advance from MCQ
    debug: 0.40     // 40% of cumulative to advance from Debug
  },

  // Penalty values by violation type
  PENALTIES: {
    minor: {
      tab_switch: -1,
      blur: -1
    },
    moderate: {
      repeated_tab_switch: -3,   // 3+ in 60s
      external_network: -2
    },
    severe: {
      devtools: -5,
      multiple_tabs: -5
    }
  },

  // Forgiveness threshold (first N minor violations don't deduct)
  MINOR_FORGIVENESS: 2,

  // Maximum penalty per round (percentage of round's max base points)
  MAX_PENALTY_PERCENT: 0.50,

  /**
   * Calculate time bonus multiplier
   * Uses diminishing returns formula to prevent rush-and-guess
   * 
   * @param {number} timeRemainingSeconds - Seconds remaining when submitted
   * @param {number} totalTimeSeconds - Total time allowed for round
   * @returns {number} - Multiplier between 0 and 0.20
   */
  calculateTimeMultiplier(timeRemainingSeconds, totalTimeSeconds) {
    if (totalTimeSeconds <= 0) return 0;
    
    const percentRemaining = timeRemainingSeconds / totalTimeSeconds;
    // Max 20% bonus, scales linearly with time remaining
    const multiplier = Math.max(0, percentRemaining * 0.20);
    
    return multiplier;
  },

  /**
   * Calculate score for a round
   * 
   * @param {string} round - 'mcq', 'debug', or 'ps'
   * @param {number} correctAnswers - Number of correct answers
   * @param {number} timeRemainingSeconds - Time remaining when submitted
   * @param {number} totalTimeSeconds - Total time for round
   * @param {number} penalties - Total penalty points (negative value)
   * @returns {Object} - { basePoints, timeBonus, penalties, totalScore, details }
   */
  calculateRoundScore(round, correctAnswers, timeRemainingSeconds, totalTimeSeconds, penalties = 0) {
    const pointsPerQuestion = this.POINTS[round] || 1;
    const basePoints = correctAnswers * pointsPerQuestion;
    
    // Time bonus is multiplied by base points (accuracy matters)
    const timeMultiplier = this.calculateTimeMultiplier(timeRemainingSeconds, totalTimeSeconds);
    const timeBonus = Math.round(basePoints * timeMultiplier * 100) / 100;  // Round to 2 decimals
    
    // Apply penalty cap (max 50% of round's max points)
    const maxPenalty = this.MAX_BASE_POINTS[round] * this.MAX_PENALTY_PERCENT;
    const cappedPenalties = Math.max(penalties, -maxPenalty);
    
    // Total score (can be negative)
    const totalScore = basePoints + timeBonus + cappedPenalties;
    
    return {
      basePoints,
      timeBonus,
      penalties: cappedPenalties,
      totalScore,
      details: {
        correctAnswers,
        pointsPerQuestion,
        timeMultiplier: Math.round(timeMultiplier * 10000) / 100,  // As percentage
        timeRemainingSeconds,
        maxPenalty
      }
    };
  },

  /**
   * Check if user passes elimination threshold
   * 
   * @param {string} round - 'mcq' or 'debug'
   * @param {number} roundScore - Score for current round
   * @param {number} cumulativeScore - Cumulative score from previous rounds (for debug)
   * @returns {Object} - { passed, threshold, actual, message }
   */
  checkEliminationThreshold(round, roundScore, cumulativeScore = 0) {
    if (round === 'mcq') {
      const threshold = this.MAX_BASE_POINTS.mcq * this.ELIMINATION_THRESHOLDS.mcq;
      const passed = roundScore >= threshold;
      
      return {
        passed,
        threshold,
        actual: roundScore,
        percentage: Math.round((roundScore / this.MAX_BASE_POINTS.mcq) * 100),
        requiredPercentage: this.ELIMINATION_THRESHOLDS.mcq * 100,
        message: passed 
          ? `Congratulations! You scored ${roundScore.toFixed(1)} points (${Math.round((roundScore / this.MAX_BASE_POINTS.mcq) * 100)}%), advancing to Debug round.`
          : `You scored ${roundScore.toFixed(1)} points (${Math.round((roundScore / this.MAX_BASE_POINTS.mcq) * 100)}%). Minimum required: ${threshold} points (${this.ELIMINATION_THRESHOLDS.mcq * 100}%) to advance.`
      };
    }
    
    if (round === 'debug') {
      const maxCumulative = this.MAX_BASE_POINTS.mcq + this.MAX_BASE_POINTS.debug;
      const threshold = maxCumulative * this.ELIMINATION_THRESHOLDS.debug;
      const totalScore = cumulativeScore + roundScore;
      const passed = totalScore >= threshold;
      
      return {
        passed,
        threshold,
        actual: totalScore,
        percentage: Math.round((totalScore / maxCumulative) * 100),
        requiredPercentage: this.ELIMINATION_THRESHOLDS.debug * 100,
        message: passed
          ? `Congratulations! Your cumulative score is ${totalScore.toFixed(1)} points (${Math.round((totalScore / maxCumulative) * 100)}%), advancing to Problem Solving round.`
          : `Your cumulative score is ${totalScore.toFixed(1)} points (${Math.round((totalScore / maxCumulative) * 100)}%). Minimum required: ${threshold} points (${this.ELIMINATION_THRESHOLDS.debug * 100}%) to advance.`
      };
    }
    
    // PS round - no elimination (final round)
    return { passed: true, message: 'Final round completed!' };
  },

  /**
   * Calculate penalty for a violation
   * 
   * @param {string} violationType - Type of violation
   * @param {number} currentMinorCount - Number of minor violations so far
   * @returns {Object} - { penalty, forgiven, message }
   */
  calculatePenalty(violationType, currentMinorCount = 0) {
    // Check if it's a minor violation
    const isMinor = ['tab_switch', 'blur'].includes(violationType);
    
    if (isMinor && currentMinorCount < this.MINOR_FORGIVENESS) {
      // Forgiven - tracked but no deduction
      return {
        penalty: 0,
        forgiven: true,
        message: `Warning: ${violationType.replace('_', ' ')} detected. (${currentMinorCount + 1}/${this.MINOR_FORGIVENESS} forgiven)`
      };
    }
    
    // Find the penalty value
    let penalty = 0;
    let category = 'unknown';
    
    if (this.PENALTIES.minor[violationType] !== undefined) {
      penalty = this.PENALTIES.minor[violationType];
      category = 'minor';
    } else if (this.PENALTIES.moderate[violationType] !== undefined) {
      penalty = this.PENALTIES.moderate[violationType];
      category = 'moderate';
    } else if (this.PENALTIES.severe[violationType] !== undefined) {
      penalty = this.PENALTIES.severe[violationType];
      category = 'severe';
    }
    
    return {
      penalty,
      forgiven: false,
      category,
      message: `Penalty applied: ${penalty} points (${violationType.replace('_', ' ')})`
    };
  },

  /**
   * Get total penalties for current round
   * 
   * @returns {number} - Total penalties (negative value)
   */
  getCurrentRoundPenalties() {
    return StorageManager.getRoundPenalties() || 0;
  },

  /**
   * Apply a penalty and save
   * 
   * @param {string} violationType - Type of violation
   * @returns {Object} - Penalty result
   */
  applyPenalty(violationType) {
    const minorCount = StorageManager.getMinorViolationCount() || 0;
    const result = this.calculatePenalty(violationType, minorCount);
    
    // Track minor violations
    if (['tab_switch', 'blur'].includes(violationType)) {
      StorageManager.setMinorViolationCount(minorCount + 1);
    }
    
    // Apply penalty if not forgiven
    if (!result.forgiven) {
      const currentPenalties = this.getCurrentRoundPenalties();
      StorageManager.setRoundPenalties(currentPenalties + result.penalty);
    }
    
    return result;
  },

  /**
   * Get comprehensive score summary
   * 
   * @returns {Object} - Full scoring breakdown
   */
  getScoreSummary() {
    const mcqData = StorageManager.getMCQScoreData();
    const debugData = StorageManager.getDebugScoreData();
    const psData = StorageManager.getPSScoreData();
    
    let cumulativeScore = 0;
    let totalTimeUsed = 0;
    const rounds = [];
    
    if (mcqData) {
      cumulativeScore += mcqData.totalScore || 0;
      totalTimeUsed += mcqData.timeUsed || 0;
      rounds.push({ round: 'MCQ', ...mcqData });
    }
    
    if (debugData) {
      cumulativeScore += debugData.totalScore || 0;
      totalTimeUsed += debugData.timeUsed || 0;
      rounds.push({ round: 'Debug', ...debugData });
    }
    
    if (psData) {
      cumulativeScore += psData.totalScore || 0;
      totalTimeUsed += psData.timeUsed || 0;
      rounds.push({ round: 'PS', ...psData });
    }
    
    return {
      rounds,
      cumulativeScore,
      totalTimeUsed,
      eliminated: StorageManager.isEliminated(),
      eliminatedAt: StorageManager.getEliminatedRound()
    };
  },

  /**
   * Save round score data
   * 
   * @param {string} round - 'mcq', 'debug', or 'ps'
   * @param {Object} scoreData - Score calculation result
   * @param {number} timeUsedSeconds - Time used for the round
   */
  saveRoundScore(round, scoreData, timeUsedSeconds) {
    const data = {
      ...scoreData,
      timeUsed: timeUsedSeconds,
      timestamp: Date.now()
    };
    
    if (round === 'mcq') {
      StorageManager.setMCQScoreData(data);
    } else if (round === 'debug') {
      StorageManager.setDebugScoreData(data);
    } else if (round === 'ps') {
      StorageManager.setPSScoreData(data);
    }
    
    // Reset round penalties for next round
    StorageManager.setRoundPenalties(0);
    StorageManager.setMinorViolationCount(0);
  },

  /**
   * Mark user as eliminated
   * 
   * @param {string} round - Round where elimination occurred
   */
  markEliminated(round) {
    StorageManager.setEliminated(true, round);
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScoringSystem;
}
