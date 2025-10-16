// Test API menggunakan Node.js
require('dotenv').config();
const https = require('https');
const http = require('http');

const API_URL = 'http://localhost:3000/api';

// Helper function untuk HTTP request
function makeRequest(url, options, data = null) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.request(url, options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(body)
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: body
                    });
                }
            });
        });
        
        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Test functions
async function testHealthCheck() {
    console.log('\n🧪 TEST 1: Health Check');
    try {
        const result = await makeRequest(`${API_URL}/health`, { method: 'GET' });
        if (result.status === 200) {
            console.log('✅ PASS: Server is running');
            console.log('  ', result.data.message);
            return true;
        } else {
            console.log('❌ FAIL: Unexpected status', result.status);
            return false;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return false;
    }
}

async function testRegister() {
    console.log('\n🧪 TEST 2: Register User');
    
    const userData = {
        name: 'Test User',
        email: 'test@kilatbox.com',
        password: 'Test123!@#'
    };
    
    try {
        const result = await makeRequest(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, userData);
        
        if (result.status === 201 || result.status === 200) {
            console.log('✅ PASS: Registration successful');
            console.log('   Response:', JSON.stringify(result.data, null, 2));
            return true;
        } else if (result.status === 400 && result.data.message?.includes('already exists')) {
            console.log('⚠️  User already exists (OK for re-testing)');
            return true;
        } else {
            console.log('❌ FAIL:', result.data.message || 'Registration failed');
            return false;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return false;
    }
}

async function testLogin() {
    console.log('\n🧪 TEST 3: Login User');
    
    const credentials = {
        email: 'test@kilatbox.com',
        password: 'Test123!@#'
    };
    
    try {
        const result = await makeRequest(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, credentials);
        
        const token = result.data.data?.token || result.data.token;
        if (result.status === 200 && token) {
            console.log('✅ PASS: Login successful');
            console.log('   Token:', token.substring(0, 40) + '...');
            console.log('   User:', result.data.data?.user?.name || result.data.user?.name);
            return token;
        } else if (result.status === 200) {
            console.log('⚠️  Login response missing token');
            console.log('   Response:', JSON.stringify(result.data, null, 2));
            return null;
        } else {
            console.log('❌ FAIL:', result.data.message || 'Login failed');
            return null;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return null;
    }
}

async function testGetProfile(token) {
    console.log('\n🧪 TEST 4: Get User Profile');
    
    try {
        const result = await makeRequest(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (result.status === 200) {
            console.log('✅ PASS: Profile retrieved');
            console.log('   Name:', result.data.user?.name);
            console.log('   Email:', result.data.user?.email);
            console.log('   Storage Used:', result.data.user?.storage_used || 0, 'bytes');
            return true;
        } else {
            console.log('❌ FAIL:', result.data.message || 'Failed to get profile');
            return false;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return false;
    }
}

async function testGetFiles(token) {
    console.log('\n🧪 TEST 5: Get Files List');
    
    try {
        const result = await makeRequest(`${API_URL}/files`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (result.status === 200) {
            const fileCount = result.data.files?.length || 0;
            console.log('✅ PASS: Files retrieved');
            console.log('   Total files:', fileCount);
            
            if (fileCount > 0) {
                console.log('   Files:');
                result.data.files.forEach(file => {
                    console.log(`     - ${file.filename} (${file.filesize} bytes)`);
                });
            } else {
                console.log('   (No files uploaded yet)');
            }
            return true;
        } else {
            console.log('❌ FAIL:', result.data.message || 'Failed to get files');
            return false;
        }
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    console.log('\n═══════════════════════════════════════════');
    console.log('     KilatBox API Testing');
    console.log('═══════════════════════════════════════════');
    
    // Test 1: Health Check
    const healthOk = await testHealthCheck();
    if (!healthOk) {
        console.log('\n❌ Server not responding. Make sure server is running!');
        console.log('   Run: npm start');
        return;
    }
    
    await sleep(500);
    
    // Test 2: Register
    await testRegister();
    await sleep(500);
    
    // Test 3: Login
    const token = await testLogin();
    if (!token) {
        console.log('\n❌ Cannot proceed without token');
        return;
    }
    
    await sleep(500);
    
    // Test 4: Get Profile
    await testGetProfile(token);
    await sleep(500);
    
    // Test 5: Get Files
    await testGetFiles(token);
    
    console.log('\n═══════════════════════════════════════════');
    console.log('     Testing Complete! ✅');
    console.log('═══════════════════════════════════════════\n');
    
    console.log('Next steps:');
    console.log('1. Open browser: http://localhost:3000');
    console.log('2. Login with: test@kilatbox.com / Test123!@#');
    console.log('3. Test file upload via UI');
    console.log('4. Test file download and delete\n');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run tests
runAllTests().catch(console.error);
