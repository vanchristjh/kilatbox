// Test Payment Features
// Jalankan: node test-payment.js

const API_URL = 'http://localhost:3000/api';

// Warna untuk output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function separator() {
  log('\n' + '='.repeat(60), 'cyan');
}

let authToken = '';
let testUserId = null;
let testPaymentId = null;

// Test 1: Register & Login
async function testAuth() {
  separator();
  log('TEST 1: Authentication', 'bright');
  
  try {
    // Register
    log('\n1.1 Testing Register...', 'yellow');
    const randomEmail = `test_payment_${Date.now()}@example.com`;
    const registerData = {
      name: 'Test Payment User',
      email: randomEmail,
      password: 'testpass123'
    };

    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    });

    const registerResult = await registerResponse.json();
    
    if (registerResult.success) {
      log('✓ Register berhasil!', 'green');
      authToken = registerResult.token;
      testUserId = registerResult.user.id;
    } else {
      throw new Error(registerResult.error);
    }

    log(`  Email: ${randomEmail}`, 'blue');
    log(`  User ID: ${testUserId}`, 'blue');
    
    return true;
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 2: Get Available Plans
async function testGetPlans() {
  separator();
  log('TEST 2: Get Subscription Plans', 'bright');
  
  try {
    log('\n2.1 Fetching plans...', 'yellow');
    const response = await fetch(`${API_URL}/subscriptions/plans`);
    const plans = await response.json();

    log(`✓ Berhasil mengambil ${plans.length} plans`, 'green');
    
    plans.forEach((plan, index) => {
      log(`\n  Plan ${index + 1}:`, 'blue');
      log(`    ID: ${plan.id}`, 'blue');
      log(`    Name: ${plan.display_name}`, 'blue');
      log(`    Price: Rp ${plan.price.toLocaleString()}`, 'blue');
      log(`    Storage: ${plan.storage_display}`, 'blue');
    });
    
    return true;
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 3: Create Payment
async function testCreatePayment() {
  separator();
  log('TEST 3: Create Payment', 'bright');
  
  try {
    log('\n3.1 Creating payment for Pro Plan (ID: 2)...', 'yellow');
    
    const paymentData = {
      plan_id: 2, // Pro Plan
      payment_method: 'manual_transfer',
      notes: 'Test payment - automated test'
    };

    const response = await fetch(`${API_URL}/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    if (result.success) {
      log('✓ Payment berhasil dibuat!', 'green');
      testPaymentId = result.payment.id;
      log(`\n  Payment ID: ${result.payment.id}`, 'blue');
      log(`  Transaction ID: ${result.payment_info.transaction_id}`, 'blue');
      log(`  Amount: Rp ${result.payment_info.amount.toLocaleString()}`, 'blue');
      log(`  Plan: ${result.payment_info.plan_name}`, 'blue');
      log(`  Status: ${result.payment.status}`, 'blue');
      return true;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 4: Get Pending Payments
async function testGetPendingPayments() {
  separator();
  log('TEST 4: Get Pending Payments', 'bright');
  
  try {
    log('\n4.1 Fetching pending payments...', 'yellow');
    
    const response = await fetch(`${API_URL}/payments/pending`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const result = await response.json();

    if (result.success) {
      log(`✓ Berhasil mengambil ${result.pending_payments.length} pending payments`, 'green');
      
      result.pending_payments.forEach((payment, index) => {
        log(`\n  Payment ${index + 1}:`, 'blue');
        log(`    ID: ${payment.id}`, 'blue');
        log(`    Transaction ID: ${payment.transaction_id}`, 'blue');
        log(`    Plan: ${payment.plan_name}`, 'blue');
        log(`    Amount: Rp ${parseFloat(payment.amount).toLocaleString()}`, 'blue');
        log(`    Status: ${payment.status}`, 'blue');
      });
      
      return true;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 5: Get Payment History
async function testGetPaymentHistory() {
  separator();
  log('TEST 5: Get Payment History', 'bright');
  
  try {
    log('\n5.1 Fetching payment history...', 'yellow');
    
    const response = await fetch(`${API_URL}/payments/history`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const result = await response.json();

    if (result.success) {
      log(`✓ Berhasil mengambil ${result.payments.length} payment records`, 'green');
      
      result.payments.forEach((payment, index) => {
        log(`\n  Payment ${index + 1}:`, 'blue');
        log(`    ID: ${payment.id}`, 'blue');
        log(`    Transaction ID: ${payment.transaction_id}`, 'blue');
        log(`    Plan: ${payment.plan_name}`, 'blue');
        log(`    Amount: Rp ${parseFloat(payment.amount).toLocaleString()}`, 'blue');
        log(`    Status: ${payment.status}`, 'blue');
        log(`    Created: ${new Date(payment.created_at).toLocaleString()}`, 'blue');
      });
      
      return true;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 6: Upload Payment Proof (Optional)
async function testUploadProof() {
  separator();
  log('TEST 6: Upload Payment Proof', 'bright');
  
  try {
    log('\n6.1 Uploading payment proof...', 'yellow');
    
    const proofData = {
      proof_url: 'https://example.com/payment-proof-test.jpg'
    };

    const response = await fetch(`${API_URL}/payments/upload-proof/${testPaymentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(proofData)
    });

    const result = await response.json();

    if (result.success) {
      log('✓ Payment proof berhasil diupload!', 'green');
      log(`  Proof URL: ${result.payment.payment_proof_url}`, 'blue');
      return true;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 7: Confirm Payment
async function testConfirmPayment() {
  separator();
  log('TEST 7: Confirm Payment', 'bright');
  
  try {
    log('\n7.1 Confirming payment...', 'yellow');
    
    const response = await fetch(`${API_URL}/payments/confirm/${testPaymentId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const result = await response.json();

    if (result.success) {
      log('✓ Payment berhasil dikonfirmasi!', 'green');
      log(`  Message: ${result.message}`, 'blue');
      return true;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 8: Verify Subscription Updated
async function testVerifySubscription() {
  separator();
  log('TEST 8: Verify Subscription Updated', 'bright');
  
  try {
    log('\n8.1 Checking user subscription...', 'yellow');
    
    const response = await fetch(`${API_URL}/subscriptions/my-subscription`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const result = await response.json();

    log('✓ Subscription details retrieved!', 'green');
    log(`\n  Plan: ${result.display_name}`, 'blue');
    log(`  Storage Limit: ${result.storage_limit} bytes`, 'blue');
    log(`  Status: ${result.is_active ? 'Active' : 'Inactive'}`, 'blue');
    
    if (result.plan_id === 2) {
      log('\n✓ Subscription berhasil diupdate ke Pro Plan!', 'green');
      return true;
    } else {
      log('\n⚠ Subscription belum terupdate', 'yellow');
      return false;
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// Test 9: Create Another Payment and Cancel
async function testCancelPayment() {
  separator();
  log('TEST 9: Cancel Payment', 'bright');
  
  try {
    log('\n9.1 Creating another payment...', 'yellow');
    
    const paymentData = {
      plan_id: 3, // Business Plan
      payment_method: 'ewallet',
      notes: 'Test payment for cancellation'
    };

    const createResponse = await fetch(`${API_URL}/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(paymentData)
    });

    const createResult = await createResponse.json();
    const cancelPaymentId = createResult.payment.id;
    
    log(`✓ Payment created (ID: ${cancelPaymentId})`, 'green');

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));

    log('\n9.2 Canceling payment...', 'yellow');
    
    const cancelResponse = await fetch(`${API_URL}/payments/cancel/${cancelPaymentId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const cancelResult = await cancelResponse.json();

    if (cancelResult.success) {
      log('✓ Payment berhasil dibatalkan!', 'green');
      log(`  Status: ${cancelResult.payment.status}`, 'blue');
      return true;
    } else {
      throw new Error(cancelResult.error);
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return false;
  }
}

// Run All Tests
async function runAllTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         Exora ID PAYMENT FEATURE TEST SUITE                ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
  
  const startTime = Date.now();
  let passedTests = 0;
  let totalTests = 9;

  // Run tests sequentially
  if (await testAuth()) passedTests++;
  if (await testGetPlans()) passedTests++;
  if (await testCreatePayment()) passedTests++;
  if (await testGetPendingPayments()) passedTests++;
  if (await testGetPaymentHistory()) passedTests++;
  if (await testUploadProof()) passedTests++;
  if (await testConfirmPayment()) passedTests++;
  if (await testVerifySubscription()) passedTests++;
  if (await testCancelPayment()) passedTests++;

  // Summary
  separator();
  log('\nTEST SUMMARY', 'bright');
  separator();
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  log(`\nTotal Tests: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, passedTests === totalTests ? 'green' : 'yellow');
  log(`Failed: ${totalTests - passedTests}`, totalTests - passedTests === 0 ? 'green' : 'red');
  log(`Pass Rate: ${passRate}%`, passRate === '100.0' ? 'green' : 'yellow');
  log(`Duration: ${duration}s`, 'blue');
  
  separator();
  
  if (passedTests === totalTests) {
    log('\n🎉 ALL TESTS PASSED! Payment feature is working correctly!', 'green');
  } else {
    log(`\n⚠️  ${totalTests - passedTests} test(s) failed. Please check the errors above.`, 'red');
  }
  
  separator();
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/api/health`);
    const data = await response.json();
    
    if (data.success) {
      log('\n✓ Server is running!', 'green');
      log(`  URL: ${API_URL}`, 'blue');
      return true;
    }
  } catch (error) {
    log('\n✗ Server is not running!', 'red');
    log('  Please start the server first: node server.js', 'yellow');
    return false;
  }
}

// Main
(async () => {
  if (await checkServer()) {
    await runAllTests();
  }
})();
