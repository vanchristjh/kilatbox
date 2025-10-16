const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        console.log('🔍 Testing Upload Functionality\n');
        
        // 1. Test Login
        console.log('1️⃣ Testing Login...');
        const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'volodyaa@gmail.com',
            password: '123456'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Login successful! Token:', token.substring(0, 20) + '...\n');
        
        // 2. Test Storage Stats
        console.log('2️⃣ Testing Storage Stats...');
        const statsResponse = await axios.get('http://localhost:3000/api/files/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Storage Stats:', JSON.stringify(statsResponse.data, null, 2), '\n');
        
        // 3. Create test file
        console.log('3️⃣ Creating test file...');
        const testFilePath = path.join(__dirname, 'test-upload-file.txt');
        fs.writeFileSync(testFilePath, 'This is a test file for upload functionality testing.');
        console.log('✅ Test file created:', testFilePath, '\n');
        
        // 4. Test Upload
        console.log('4️⃣ Testing File Upload...');
        const formData = new FormData();
        formData.append('file', fs.createReadStream(testFilePath));
        
        const uploadResponse = await axios.post('http://localhost:3000/api/files/upload', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });
        
        console.log('✅ Upload successful!');
        console.log('Response:', JSON.stringify(uploadResponse.data, null, 2), '\n');
        
        // 5. List Files
        console.log('5️⃣ Testing List Files...');
        const filesResponse = await axios.get('http://localhost:3000/api/files', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Files listed!');
        console.log('Total files:', filesResponse.data.data.totalFiles);
        console.log('Files:', JSON.stringify(filesResponse.data.data.files.slice(0, 2), null, 2), '\n');
        
        // Clean up
        fs.unlinkSync(testFilePath);
        console.log('✅ Test file cleaned up\n');
        
        console.log('🎉 All tests passed! Upload functionality is working correctly!');
        
    } catch (error) {
        console.error('\n❌ Error occurred:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
        
        console.error('\n📝 Troubleshooting:');
        console.error('1. Make sure server is running: node server.js');
        console.error('2. Check database connection');
        console.error('3. Verify CloudKilat credentials in .env');
        console.error('4. Check if user has active subscription');
        console.error('5. Check browser console for JavaScript errors');
    }
}

// Check if server is running first
console.log('🚀 KilatBox Upload Test\n');
console.log('Checking if server is running on port 3000...\n');

axios.get('http://localhost:3000/')
    .then(() => {
        console.log('✅ Server is running!\n');
        testUpload();
    })
    .catch(() => {
        console.error('❌ Server is not running!');
        console.error('\nPlease start the server first:');
        console.error('  node server.js\n');
        process.exit(1);
    });
