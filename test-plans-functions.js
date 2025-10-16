#!/usr/bin/env node

/**
 * KilatBox Subscription Plans - Function Test
 * Test semua fungsi di plans.html berfungsi dengan baik
 */

const API_URL = 'http://localhost:3000';

// ANSI Colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[36m';
const RESET = '\x1b[0m';

let passCount = 0;
let failCount = 0;

function log(message, color = RESET) {
    console.log(`${color}${message}${RESET}`);
}

function success(message) {
    passCount++;
    log(`✅ PASS: ${message}`, GREEN);
}

function fail(message) {
    failCount++;
    log(`❌ FAIL: ${message}`, RED);
}

function info(message) {
    log(`ℹ️  ${message}`, BLUE);
}

async function testGetPlans() {
    try {
        info('Testing GET /api/subscriptions/plans...');
        const response = await fetch(`${API_URL}/api/subscriptions/plans`);
        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
            success(`GET /api/subscriptions/plans returns ${data.length} plans`);
            
            // Validate plan structure
            if (data.length > 0) {
                const plan = data[0];
                if (plan.id && plan.plan_name && plan.display_name && plan.storage_display) {
                    success('Plan structure is valid');
                } else {
                    fail('Plan structure is missing required fields');
                }
            }
        } else {
            fail('GET /api/subscriptions/plans failed or returned invalid data');
        }
    } catch (error) {
        fail(`GET /api/subscriptions/plans error: ${error.message}`);
    }
}

async function testGetMySubscription(token) {
    try {
        info('Testing GET /api/subscriptions/my-subscription...');
        const response = await fetch(`${API_URL}/api/subscriptions/my-subscription`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            success('GET /api/subscriptions/my-subscription returns current plan');
            
            // Validate subscription structure
            if (data.plan_id && data.storage_display && data.percentage_used !== undefined) {
                success('Subscription structure is valid');
            } else {
                fail('Subscription structure is missing required fields');
            }
        } else if (response.status === 401) {
            fail('Token is invalid or expired');
        } else {
            fail(`GET /api/subscriptions/my-subscription failed: ${data.error}`);
        }
    } catch (error) {
        fail(`GET /api/subscriptions/my-subscription error: ${error.message}`);
    }
}

async function testUpgradePlan(token, planId) {
    try {
        info(`Testing POST /api/subscriptions/upgrade (plan_id: ${planId})...`);
        const response = await fetch(`${API_URL}/api/subscriptions/upgrade`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plan_id: planId })
        });
        const data = await response.json();

        if (response.ok) {
            success(`Upgrade to plan ${planId} successful: ${data.message}`);
        } else if (response.status === 401) {
            fail('Token is invalid or expired');
        } else if (response.status === 400) {
            log(`⚠️  SKIP: ${data.error}`, YELLOW);
        } else {
            fail(`POST /api/subscriptions/upgrade failed: ${data.error}`);
        }
    } catch (error) {
        fail(`POST /api/subscriptions/upgrade error: ${error.message}`);
    }
}

async function testWithoutToken() {
    try {
        info('Testing without token (should return 401)...');
        const response = await fetch(`${API_URL}/api/subscriptions/my-subscription`);
        
        if (response.status === 401) {
            success('Correctly returns 401 for unauthorized request');
        } else {
            fail('Should return 401 for request without token');
        }
    } catch (error) {
        fail(`Test without token error: ${error.message}`);
    }
}

async function testInvalidPlanId(token) {
    try {
        info('Testing upgrade with invalid plan_id...');
        const response = await fetch(`${API_URL}/api/subscriptions/upgrade`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plan_id: 99999 })
        });
        const data = await response.json();

        if (response.status === 404) {
            success('Correctly returns 404 for invalid plan_id');
        } else {
            fail('Should return 404 for invalid plan_id');
        }
    } catch (error) {
        fail(`Test invalid plan_id error: ${error.message}`);
    }
}

async function registerTestUser() {
    try {
        const timestamp = Date.now();
        const testEmail = `test_plans_${timestamp}@example.com`;
        
        info(`Registering test user: ${testEmail}...`);
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullname: 'Test Plans User',
                email: testEmail,
                password: 'testpassword123'
            })
        });

        if (response.ok) {
            const data = await response.json();
            success('Test user registered successfully');
            return data.token;
        } else {
            const data = await response.json();
            fail(`Registration failed: ${data.error}`);
            return null;
        }
    } catch (error) {
        fail(`Registration error: ${error.message}`);
        return null;
    }
}

async function runTests() {
    log('\n' + '='.repeat(60), BLUE);
    log('🧪 KILATBOX SUBSCRIPTION PLANS - FUNCTION TESTS', BLUE);
    log('='.repeat(60) + '\n', BLUE);

    // Test 1: Public endpoint (no auth)
    log('--- Test Group 1: Public Endpoints ---', YELLOW);
    await testGetPlans();
    await testWithoutToken();

    // Get test token
    log('\n--- Test Group 2: User Registration ---', YELLOW);
    const token = await registerTestUser();

    if (!token) {
        log('\n⚠️  Cannot proceed with authenticated tests without token', YELLOW);
        log('\n📊 FINAL RESULTS:', BLUE);
        log(`✅ Passed: ${passCount}`, GREEN);
        log(`❌ Failed: ${failCount}`, RED);
        return;
    }

    // Test 3: Authenticated endpoints
    log('\n--- Test Group 3: Authenticated Endpoints ---', YELLOW);
    await testGetMySubscription(token);

    // Test 4: Upgrade functionality
    log('\n--- Test Group 4: Upgrade Plan ---', YELLOW);
    await testUpgradePlan(token, 2); // Upgrade to Pro (plan_id = 2)
    await testInvalidPlanId(token);

    // Final results
    log('\n' + '='.repeat(60), BLUE);
    log('📊 FINAL TEST RESULTS:', BLUE);
    log('='.repeat(60), BLUE);
    log(`✅ Passed: ${passCount}`, GREEN);
    log(`❌ Failed: ${failCount}`, RED);
    log(`📈 Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%\n`, 
        failCount === 0 ? GREEN : (passCount > failCount ? YELLOW : RED));

    if (failCount === 0) {
        log('🎉 ALL TESTS PASSED! Plans functionality is working perfectly!', GREEN);
    } else {
        log('⚠️  Some tests failed. Please check the errors above.', YELLOW);
    }

    log('');
}

// Run tests
runTests().catch(error => {
    fail(`Fatal error: ${error.message}`);
    process.exit(1);
});
