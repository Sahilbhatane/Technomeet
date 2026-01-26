// Code verifier for Problem Statement round
// SECURITY FIX: This is now a compatibility stub.
// Actual validation is handled by validatePSSolution() in data.js
// which uses server-side validation in production.

/**
 * CodeVerifier class - DEPRECATED
 * This class is kept for backwards compatibility only.
 * Use validatePSSolution() from data.js instead.
 */
class CodeVerifier {
  constructor(language) {
    this.language = language;
    console.warn('[CODE_VERIFIER] This class is deprecated. Use validatePSSolution() from data.js');
  }

  /**
   * Verify code against test cases
   * DEPRECATED: Use validatePSSolution() instead
   */
  async verifyCode(code, problemId) {
    // Delegate to data.js validation function
    if (typeof validatePSSolution === 'function') {
      try {
        const result = await validatePSSolution(problemId, code, this.language);
        return result.results || [];
      } catch (e) {
        console.error('[CODE_VERIFIER] Validation error:', e);
        return [];
      }
    }
    
    console.error('[CODE_VERIFIER] validatePSSolution not available');
    return [];
  }

  /**
   * Get test case results summary
   */
  getSummary(results) {
    if (!results || !Array.isArray(results)) {
      return { total: 0, passed: 0, failed: 0, percentage: 0 };
    }
    
    const total = results.length;
    const passed = results.filter(r => r && r.passed === true).length;
    const failed = total - passed;
    const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    return { total, passed, failed, percentage };
  }

  /**
   * Compare output (normalized)
   */
  compareOutput(actual, expected) {
    if (actual === null || actual === undefined) return false;
    if (expected === null || expected === undefined) return false;
    
    const normalize = (str) => String(str).trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    return normalize(actual) === normalize(expected);
  }
}

/*
 * ============================================
 * MIGRATION NOTICE
 * ============================================
 * 
 * This file is DEPRECATED.
 * 
 * Code validation has been moved to data.js with the following functions:
 * 
 * - validateMCQAnswer(questionId, answer, language)
 *   Validates MCQ answers via server API
 * 
 * - validateDebugSolution(questionId, code, language)
 *   Validates Debug round solutions via server API
 * 
 * - validatePSSolution(problemId, code, language)
 *   Validates PS round solutions via server API
 * 
 * In DEMO_MODE, these functions use pattern matching.
 * In production, they call server endpoints:
 * - POST /api/validate/mcq
 * - POST /api/validate/debug
 * - POST /api/validate/ps
 * 
 * The server should execute code in a sandboxed environment
 * and return results without exposing expected outputs.
 * ============================================
 */

// Export for compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeVerifier;
}
