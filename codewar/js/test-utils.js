/**
 * CodeWar Platform - Test Utilities
 * Helper functions for automated testing
 * 
 * Usage:
 *   1. Include this script in the page
 *   2. Open browser console
 *   3. Run: TestUtils.runAllTests()
 */

const TestUtils = (function() {
  'use strict';

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  /**
   * Assert a condition is true
   */
  function assert(condition, message) {
    const passed = !!condition;
    results.tests.push({ name: message, passed });
    
    if (passed) {
      results.passed++;
      Logger.logAssertion(message, true);
      console.log(`✅ PASS: ${message}`);
    } else {
      results.failed++;
      Logger.logAssertion(message, false);
      console.error(`❌ FAIL: ${message}`);
    }
    
    return passed;
  }

  /**
   * Assert two values are equal
   */
  function assertEqual(actual, expected, message) {
    const passed = actual === expected;
    results.tests.push({ name: message, passed, actual, expected });
    
    if (passed) {
      results.passed++;
      Logger.logAssertion(message, true, expected, actual);
      console.log(`✅ PASS: ${message}`);
    } else {
      results.failed++;
      Logger.logAssertion(message, false, expected, actual);
      console.error(`❌ FAIL: ${message} - Expected: ${expected}, Got: ${actual}`);
    }
    
    return passed;
  }

  /**
   * Assert a value is defined and not null
   */
  function assertDefined(value, message) {
    return assert(value !== undefined && value !== null, message);
  }

  /**
   * Assert a function exists
   */
  function assertFunction(fn, message) {
    return assert(typeof fn === 'function', message);
  }

  /**
   * Test localStorage functionality
   */
  function testLocalStorage() {
    console.log('\n--- Testing localStorage ---');
    
    const testKey = '__test__';
    const testValue = 'test_' + Date.now();
    
    try {
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      assertEqual(retrieved, testValue, 'localStorage read/write works');
    } catch (e) {
      assert(false, 'localStorage is accessible: ' + e.message);
    }
  }

  /**
   * Test sessionStorage functionality
   */
  function testSessionStorage() {
    console.log('\n--- Testing sessionStorage ---');
    
    const testKey = '__test__';
    const testValue = 'test_' + Date.now();
    
    try {
      sessionStorage.setItem(testKey, testValue);
      const retrieved = sessionStorage.getItem(testKey);
      sessionStorage.removeItem(testKey);
      
      assertEqual(retrieved, testValue, 'sessionStorage read/write works');
    } catch (e) {
      assert(false, 'sessionStorage is accessible: ' + e.message);
    }
  }

  /**
   * Test StorageManager exists and works
   */
  function testStorageManager() {
    console.log('\n--- Testing StorageManager ---');
    
    assertDefined(window.StorageManager, 'StorageManager is defined');
    
    if (window.StorageManager) {
      assertFunction(StorageManager.get, 'StorageManager.get exists');
      assertFunction(StorageManager.set, 'StorageManager.set exists');
      assertFunction(StorageManager.getCurrentRound, 'StorageManager.getCurrentRound exists');
      assertFunction(StorageManager.setCurrentRound, 'StorageManager.setCurrentRound exists');
    }
  }

  /**
   * Test utility functions
   */
  function testUtils() {
    console.log('\n--- Testing Utils ---');
    
    // Test functions exist
    assertFunction(window.generateSessionId, 'generateSessionId exists');
    assertFunction(window.generateFingerprint, 'generateFingerprint exists');
    assertFunction(window.showToast, 'showToast exists');
    assertFunction(window.showAlert, 'showAlert exists');
    assertFunction(window.showConfirm, 'showConfirm exists');
    assertFunction(window.isModalShowing, 'isModalShowing exists');
    
    // Test generateSessionId
    if (typeof generateSessionId === 'function') {
      const sessionId = generateSessionId();
      assert(sessionId && sessionId.length > 0, 'generateSessionId returns a value');
    }
  }

  /**
   * Test authentication functions
   */
  function testAuth() {
    console.log('\n--- Testing Auth ---');
    
    assertDefined(window.AuthConfig, 'AuthConfig is defined');
    assertFunction(window.isValidCodeFormat, 'isValidCodeFormat exists');
    assertFunction(window.validateCodeWithServer, 'validateCodeWithServer exists');
    assertFunction(window.authenticateAsync, 'authenticateAsync exists');
    assertFunction(window.checkAuthentication, 'checkAuthentication exists');
    
    // Test code format validation
    if (typeof isValidCodeFormat === 'function') {
      assert(isValidCodeFormat('CODE-TEST'), 'CODE-TEST is valid format');
      assert(isValidCodeFormat('CODE-1234'), 'CODE-1234 is valid format');
      assert(!isValidCodeFormat('INVALID'), 'INVALID is invalid format');
      assert(!isValidCodeFormat('CODE-TOOLONG'), 'CODE-TOOLONG is invalid format');
      assert(!isValidCodeFormat(''), 'Empty string is invalid');
    }
    
    // Verify no plaintext codes exposed
    if (window.AuthConfig) {
      assert(!AuthConfig._DEMO_CODES, 'No _DEMO_CODES exposed (security)');
      assertDefined(AuthConfig._DEMO_HASHES, '_DEMO_HASHES exists for validation');
    }
  }

  /**
   * Test timer functions
   */
  function testTimer() {
    console.log('\n--- Testing Timer ---');
    
    assertDefined(window.RoundTimer, 'RoundTimer class exists');
    assertDefined(window.ROUND_DURATIONS, 'ROUND_DURATIONS exists');
    
    if (window.ROUND_DURATIONS) {
      assertDefined(ROUND_DURATIONS.mcq, 'MCQ duration defined');
      assertDefined(ROUND_DURATIONS.debug, 'Debug duration defined');
      assertDefined(ROUND_DURATIONS.ps, 'PS duration defined');
    }
  }

  /**
   * Test anti-cheat system
   */
  function testAntiCheat() {
    console.log('\n--- Testing Anti-Cheat ---');
    
    assertDefined(window.AntiCheatSystem, 'AntiCheatSystem class exists');
    assertFunction(window.initAntiCheat, 'initAntiCheat function exists');
    assertFunction(window.getAntiCheat, 'getAntiCheat function exists');
  }

  /**
   * Test Logger
   */
  function testLogger() {
    console.log('\n--- Testing Logger ---');
    
    assertDefined(window.Logger, 'Logger is defined');
    
    if (window.Logger) {
      assertFunction(Logger.info, 'Logger.info exists');
      assertFunction(Logger.warn, 'Logger.warn exists');
      assertFunction(Logger.error, 'Logger.error exists');
      assertFunction(Logger.getLogs, 'Logger.getLogs exists');
      assertFunction(Logger.getErrors, 'Logger.getErrors exists');
      assertFunction(Logger.exportLogs, 'Logger.exportLogs exists');
      assertFunction(Logger.printSummary, 'Logger.printSummary exists');
      
      // Test logging works
      const initialCount = Logger.getLogs().length;
      Logger.info('Test log entry');
      const newCount = Logger.getLogs().length;
      assert(newCount > initialCount, 'Logger.info creates log entry');
    }
  }

  /**
   * Test DOM elements for current page
   */
  function testPageElements() {
    console.log('\n--- Testing Page Elements ---');
    
    const page = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (page) {
      case 'index.html':
        assertDefined(document.getElementById('code'), 'Registration code input exists');
        assertDefined(document.getElementById('auth-error'), 'Auth error element exists');
        break;
        
      case 'mcq.html':
        assertDefined(document.getElementById('timer'), 'Timer element exists');
        assertDefined(document.getElementById('question-container'), 'Question container exists');
        break;
        
      case 'debug.html':
        assertDefined(document.getElementById('timer'), 'Timer element exists');
        break;
        
      case 'ps.html':
        assertDefined(document.getElementById('timer'), 'Timer element exists');
        break;
        
      case 'results.html':
        // Results page tests
        break;
    }
  }

  /**
   * Run all tests
   */
  function runAllTests() {
    console.log('====================================');
    console.log('  CodeWar Platform Test Suite');
    console.log('====================================');
    
    // Reset results
    results.passed = 0;
    results.failed = 0;
    results.tests = [];
    
    // Run all test groups
    testLogger();
    testLocalStorage();
    testSessionStorage();
    testStorageManager();
    testUtils();
    testAuth();
    testTimer();
    testAntiCheat();
    testPageElements();
    
    // Print summary
    console.log('\n====================================');
    console.log(`  Results: ${results.passed} passed, ${results.failed} failed`);
    console.log('====================================');
    
    if (results.failed > 0) {
      console.log('\nFailed tests:');
      results.tests.filter(t => !t.passed).forEach(t => {
        console.error(`  - ${t.name}`);
      });
    }
    
    // Log to Logger
    Logger.info('Test suite completed', {
      passed: results.passed,
      failed: results.failed,
      total: results.tests.length
    });
    
    return results;
  }

  /**
   * Get test results
   */
  function getResults() {
    return { ...results };
  }

  /**
   * Simulate user action for testing
   */
  function simulateClick(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.click();
      Logger.logAction('Simulated click', { selector });
      return true;
    }
    Logger.warn('Element not found for click', { selector });
    return false;
  }

  /**
   * Simulate form input
   */
  function simulateInput(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      Logger.logAction('Simulated input', { selector, value });
      return true;
    }
    Logger.warn('Element not found for input', { selector });
    return false;
  }

  // Public API
  return {
    assert,
    assertEqual,
    assertDefined,
    assertFunction,
    runAllTests,
    getResults,
    simulateClick,
    simulateInput,
    testLogger,
    testLocalStorage,
    testSessionStorage,
    testStorageManager,
    testUtils,
    testAuth,
    testTimer,
    testAntiCheat,
    testPageElements
  };

})();

// Make globally available
window.TestUtils = TestUtils;

// Quick access
window.runTests = TestUtils.runAllTests;
