// Test Register API
// Jalankan dengan: node test-register.js

const testRegister = async () => {
  try {
    console.log('Testing register API...\n');
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n✅ Registration successful!');
      console.log('Token:', data.data.token.substring(0, 20) + '...');
    } else {
      console.log('\n❌ Registration failed!');
      console.log('Error:', data.message);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
};

testRegister();
