// Quick Test Script - Register & Login
// Run this in browser console (F12 → Console) or use Postman

const API_URL = 'http://localhost:3000/api';

// Test 1: Register User
async function testRegister() {
    console.log('\n🧪 TEST 1: Register User\n');
    
    const userData = {
        username: 'testuser',
        email: 'test@kilatbox.com',
        password: 'Test123!@#'
    };
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ PASS: Registration successful!');
            console.log('Response:', data);
            return data;
        } else {
            console.log('❌ FAIL: Registration failed');
            console.log('Error:', data);
            return null;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return null;
    }
}

// Test 2: Login User
async function testLogin() {
    console.log('\n🧪 TEST 2: Login User\n');
    
    const credentials = {
        email: 'test@kilatbox.com',
        password: 'Test123!@#'
    };
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ PASS: Login successful!');
            console.log('Token:', data.token);
            console.log('User:', data.user);
            
            // Save token to localStorage
            localStorage.setItem('token', data.token);
            console.log('💾 Token saved to localStorage');
            
            return data;
        } else {
            console.log('❌ FAIL: Login failed');
            console.log('Error:', data);
            return null;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return null;
    }
}

// Test 3: Get User Profile
async function testGetProfile() {
    console.log('\n🧪 TEST 3: Get User Profile\n');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('❌ No token found. Please login first.');
        return null;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ PASS: Profile retrieved!');
            console.log('User:', data.user);
            return data;
        } else {
            console.log('❌ FAIL: Could not get profile');
            console.log('Error:', data);
            return null;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return null;
    }
}

// Test 4: Get Files List
async function testGetFiles() {
    console.log('\n🧪 TEST 4: Get Files List\n');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        console.log('❌ No token found. Please login first.');
        return null;
    }
    
    try {
        const response = await fetch(`${API_URL}/files`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ PASS: Files retrieved!');
            console.log(`Found ${data.files?.length || 0} file(s)`);
            console.log('Files:', data.files);
            return data;
        } else {
            console.log('❌ FAIL: Could not get files');
            console.log('Error:', data);
            return null;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return null;
    }
}

// Run All Tests Sequentially
async function runAllTests() {
    console.log('═══════════════════════════════════════════');
    console.log('     KilatBox Testing Suite');
    console.log('═══════════════════════════════════════════\n');
    
    // Test 1: Register
    const registerResult = await testRegister();
    await new Promise(r => setTimeout(r, 1000)); // Wait 1s
    
    // Test 2: Login
    const loginResult = await testLogin();
    await new Promise(r => setTimeout(r, 1000));
    
    // Test 3: Get Profile
    if (loginResult) {
        await testGetProfile();
        await new Promise(r => setTimeout(r, 1000));
        
        // Test 4: Get Files
        await testGetFiles();
    }
    
    console.log('\n═══════════════════════════════════════════');
    console.log('     Testing Complete!');
    console.log('═══════════════════════════════════════════\n');
}

// Quick Functions
function register() { return testRegister(); }
function login() { return testLogin(); }
function profile() { return testGetProfile(); }
function files() { return testGetFiles(); }
function all() { return runAllTests(); }

// Instructions
console.log(`
╔═══════════════════════════════════════════════════╗
║  KilatBox Testing Helper Loaded! 🚀              ║
╠═══════════════════════════════════════════════════╣
║  Available Commands:                              ║
║                                                   ║
║  register()  - Test user registration             ║
║  login()     - Test user login                    ║
║  profile()   - Get user profile                   ║
║  files()     - Get files list                     ║
║  all()       - Run all tests                      ║
║                                                   ║
║  Example:                                         ║
║  > await register()                               ║
║  > await login()                                  ║
║  > await all()                                    ║
╚═══════════════════════════════════════════════════╝
`);
