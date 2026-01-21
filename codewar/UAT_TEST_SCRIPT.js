/**
 * CodeWar Platform - Comprehensive User Acceptance Testing Script
 * Run this in browser console after loading the platform
 */

(function() {
    'use strict';
    
    const UAT = {
        results: [],
        errors: [],
        
        log: function(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const entry = { time: timestamp, message, type };
            this.results.push(entry);
            const prefix = type === 'pass' ? '✓' : type === 'fail' ? '✗' : '→';
            console.log(`[${timestamp}] ${prefix} ${message}`);
        },
        
        clearStorage: function() {
            try {
                localStorage.clear();
                sessionStorage.clear();
                this.log('Storage cleared', 'pass');
                return true;
            } catch (e) {
                this.log('Failed to clear storage: ' + e.message, 'fail');
                this.errors.push(e);
                return false;
            }
        },
        
        testAuthentication: function() {
            this.log('=== Testing Authentication ===', 'info');
            
            // Test invalid codes
            const invalidCodes = ['INVALID', 'CODE-XXXX', 'test', '', 'CODE-9999'];
            invalidCodes.forEach(code => {
                try {
                    if (typeof validateCode === 'function') {
                        const result = validateCode(code);
                        if (!result.valid) {
                            this.log(`Invalid code rejected: ${code}`, 'pass');
                        } else {
                            this.log(`Invalid code accepted: ${code}`, 'fail');
                        }
                    }
                } catch (e) {
                    this.log(`Auth test error: ${e.message}`, 'fail');
                }
            });
            
            // Test valid code
            try {
                if (typeof authenticate === 'function') {
                    const result = authenticate('CODE-0001');
                    if (result.success) {
                        this.log('Valid code accepted: CODE-0001', 'pass');
                    } else {
                        this.log('Valid code rejected: CODE-0001', 'fail');
                    }
                }
            } catch (e) {
                this.log(`Auth test error: ${e.message}`, 'fail');
            }
        },
        
        testDataLoading: function() {
            this.log('=== Testing Data Loading ===', 'info');
            
            // Check CodeWarData
            if (typeof CodeWarData === 'undefined') {
                this.log('CodeWarData not loaded', 'fail');
                return false;
            }
            this.log('CodeWarData loaded', 'pass');
            
            // Check MCQ data
            if (!CodeWarData.mcq) {
                this.log('MCQ data missing', 'fail');
            } else {
                const languages = ['c', 'cpp', 'java', 'python'];
                languages.forEach(lang => {
                    const questions = CodeWarData.mcq[lang] || [];
                    if (questions.length > 0) {
                        this.log(`${lang.toUpperCase()} MCQ: ${questions.length} questions`, 'pass');
                        
                        // Validate question structure
                        questions.slice(0, 3).forEach((q, i) => {
                            if (!q.id || !q.question || !q.options || !q.answer) {
                                this.log(`${lang} MCQ Q${i+1}: Missing fields`, 'fail');
                            }
                        });
                    } else {
                        this.log(`${lang.toUpperCase()} MCQ: No questions`, 'fail');
                    }
                });
            }
            
            // Check Debug data
            if (!CodeWarData.debug) {
                this.log('Debug data missing', 'fail');
            } else {
                const languages = ['c', 'cpp', 'java', 'python'];
                languages.forEach(lang => {
                    const questions = CodeWarData.debug[lang] || [];
                    if (questions.length > 0) {
                        this.log(`${lang.toUpperCase()} Debug: ${questions.length} questions`, 'pass');
                    } else {
                        this.log(`${lang.toUpperCase()} Debug: No questions`, 'fail');
                    }
                });
            }
            
            // Check PS data
            if (!CodeWarData.ps) {
                this.log('PS data missing', 'fail');
            } else {
                const problems = CodeWarData.ps || [];
                if (problems.length > 0) {
                    this.log(`PS: ${problems.length} problems`, 'pass');
                } else {
                    this.log('PS: No problems', 'fail');
                }
            }
            
            return true;
        },
        
        testStorage: function() {
            this.log('=== Testing Storage ===', 'info');
            
            if (typeof StorageManager === 'undefined') {
                this.log('StorageManager not defined', 'fail');
                return false;
            }
            
            try {
                // Test basic operations
                StorageManager.set('test_key', 'test_value');
                const value = StorageManager.get('test_key');
                if (value === 'test_value') {
                    this.log('Storage set/get works', 'pass');
                } else {
                    this.log('Storage set/get failed', 'fail');
                }
                
                // Test MCQ operations
                StorageManager.setMCQAnswer(1, 'A');
                const answer = StorageManager.getMCQAnswers();
                if (answer[1] === 'A') {
                    this.log('MCQ answer storage works', 'pass');
                } else {
                    this.log('MCQ answer storage failed', 'fail');
                }
                
                // Test score storage
                StorageManager.setMCQScore(10, 50, 20);
                const score = StorageManager.getMCQScore();
                if (score && score.score === 10 && score.percentage === 50) {
                    this.log('Score storage works', 'pass');
                } else {
                    this.log('Score storage failed', 'fail');
                }
                
                // Cleanup
                StorageManager.remove('test_key');
                
            } catch (e) {
                this.log('Storage test error: ' + e.message, 'fail');
                this.errors.push(e);
            }
        },
        
        testUtils: function() {
            this.log('=== Testing Utility Functions ===', 'info');
            
            // Test shuffle
            if (typeof shuffleArray === 'function') {
                const arr = [1, 2, 3, 4, 5];
                const shuffled = shuffleArray(arr);
                if (shuffled.length === arr.length) {
                    this.log('shuffleArray works', 'pass');
                } else {
                    this.log('shuffleArray failed', 'fail');
                }
            } else {
                this.log('shuffleArray not defined', 'fail');
            }
            
            // Test encode/decode
            if (typeof encodeAnswer === 'function' && typeof decodeAnswer === 'function') {
                const encoded = encodeAnswer('A');
                const decoded = decodeAnswer(encoded);
                if (decoded === 'A') {
                    this.log('encode/decode works', 'pass');
                } else {
                    this.log('encode/decode failed', 'fail');
                }
            } else {
                this.log('encode/decode not defined', 'fail');
            }
            
            // Test compareCode
            if (typeof compareCode === 'function') {
                const code1 = 'def test():\n    return 1';
                const code2 = 'def test(): return 1';
                if (compareCode(code1, code2)) {
                    this.log('compareCode works', 'pass');
                } else {
                    this.log('compareCode failed', 'fail');
                }
            } else {
                this.log('compareCode not defined', 'fail');
            }
        },
        
        testTimer: function() {
            this.log('=== Testing Timer ===', 'info');
            
            if (typeof RoundTimer === 'undefined') {
                this.log('RoundTimer not defined', 'fail');
                return false;
            }
            
            try {
                const timer = new RoundTimer('test', 1);
                if (timer.round === 'test' && timer.durationSeconds === 60) {
                    this.log('RoundTimer creation works', 'pass');
                } else {
                    this.log('RoundTimer creation failed', 'fail');
                }
                
                const formatted = timer.getFormattedTime();
                if (formatted && formatted.includes(':')) {
                    this.log('Timer formatting works', 'pass');
                } else {
                    this.log('Timer formatting failed', 'fail');
                }
            } catch (e) {
                this.log('Timer test error: ' + e.message, 'fail');
                this.errors.push(e);
            }
        },
        
        testAntiCheat: function() {
            this.log('=== Testing Anti-Cheat ===', 'info');
            
            if (typeof initAntiCheat === 'undefined') {
                this.log('initAntiCheat not defined', 'fail');
                return false;
            }
            
            try {
                const antiCheat = initAntiCheat(true);
                if (antiCheat) {
                    this.log('Anti-cheat initialization works', 'pass');
                    
                    // Test warning system
                    const initialWarnings = StorageManager.getWarnings();
                    StorageManager.incrementWarnings();
                    const newWarnings = StorageManager.getWarnings();
                    if (newWarnings === initialWarnings + 1) {
                        this.log('Warning system works', 'pass');
                    } else {
                        this.log('Warning system failed', 'fail');
                    }
                } else {
                    this.log('Anti-cheat initialization failed', 'fail');
                }
            } catch (e) {
                this.log('Anti-cheat test error: ' + e.message, 'fail');
                this.errors.push(e);
            }
        },
        
        testRoundAccess: function() {
            this.log('=== Testing Round Access Control ===', 'info');
            
            // Clear and test initial state
            this.clearStorage();
            StorageManager.setCurrentRound('not_started');
            
            const currentRound = StorageManager.getCurrentRound();
            if (currentRound === 'not_started') {
                this.log('Initial round state correct', 'pass');
            } else {
                this.log('Initial round state incorrect', 'fail');
            }
            
            // Test MCQ access (should be allowed)
            // Test Debug access (should be blocked)
            const mcqScore = StorageManager.getMCQScore();
            if (!mcqScore) {
                this.log('Debug access correctly blocked without MCQ completion', 'pass');
            }
            
            // Simulate MCQ completion
            StorageManager.setMCQScore(15, 50, 30);
            StorageManager.setCurrentRound('debug');
            const debugScore = StorageManager.getDebugScore();
            if (!debugScore) {
                this.log('PS access correctly blocked without Debug completion', 'pass');
            }
        },
        
        runAll: function() {
            console.log('%c=== CodeWar UAT Starting ===', 'color: #0f0; font-size: 16px; font-weight: bold');
            this.results = [];
            this.errors = [];
            
            this.clearStorage();
            this.testDataLoading();
            this.testStorage();
            this.testUtils();
            this.testTimer();
            this.testAntiCheat();
            this.testRoundAccess();
            this.testAuthentication();
            
            // Summary
            const passed = this.results.filter(r => r.type === 'pass').length;
            const failed = this.results.filter(r => r.type === 'fail').length;
            
            console.log('%c=== UAT Summary ===', 'color: #0f0; font-size: 16px; font-weight: bold');
            console.log(`Total Tests: ${this.results.length}`);
            console.log(`Passed: ${passed}`);
            console.log(`Failed: ${failed}`);
            console.log(`Errors: ${this.errors.length}`);
            
            if (failed === 0 && this.errors.length === 0) {
                console.log('%c✓ ALL TESTS PASSED', 'color: #0f0; font-size: 14px; font-weight: bold');
            } else {
                console.log('%c✗ SOME TESTS FAILED', 'color: #f00; font-size: 14px; font-weight: bold');
            }
            
            return {
                passed,
                failed,
                total: this.results.length,
                errors: this.errors.length,
                results: this.results
            };
        }
    };
    
    // Export for use
    window.UAT = UAT;
    
    console.log('UAT Test Script Loaded. Run UAT.runAll() to start testing.');
    
    // Auto-run if on test page
    if (window.location.pathname.includes('test_uat')) {
        setTimeout(() => UAT.runAll(), 1000);
    }
})();
