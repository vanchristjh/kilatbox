// Test CloudKilat S3 Connection
// File: test-cloudkilat.js
// Jalankan dengan: node test-cloudkilat.js

require('dotenv').config();
const { S3Client, ListBucketsCommand, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// Konfigurasi S3 Client
const s3Client = new S3Client({
  region: "id-jkt-1",
  endpoint: process.env.CLOUDKILAT_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDKILAT_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDKILAT_SECRET_KEY,
  },
  forcePathStyle: true
});

console.log('═══════════════════════════════════════════════');
console.log('   CloudKilat S3 Connection Test');
console.log('═══════════════════════════════════════════════');
console.log('');
console.log('📋 Configuration:');
console.log('   Endpoint   :', process.env.CLOUDKILAT_S3_ENDPOINT);
console.log('   Access Key :', process.env.CLOUDKILAT_ACCESS_KEY);
console.log('   Secret Key :', process.env.CLOUDKILAT_SECRET_KEY ? '***' + process.env.CLOUDKILAT_SECRET_KEY.slice(-4) : 'NOT SET');
console.log('   Bucket     :', process.env.S3_BUCKET_NAME);
console.log('');

async function testConnection() {
  try {
    // Test 1: List Buckets
    console.log('🧪 Test 1: Listing buckets...');
    const listBucketsCommand = new ListBucketsCommand({});
    const bucketsResponse = await s3Client.send(listBucketsCommand);
    
    console.log('✅ Success! Found', bucketsResponse.Buckets.length, 'bucket(s):');
    bucketsResponse.Buckets.forEach(bucket => {
      console.log('   -', bucket.Name);
    });
    console.log('');

    // Test 2: List Objects in specified bucket
    console.log('🧪 Test 2: Listing objects in bucket:', process.env.S3_BUCKET_NAME);
    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: process.env.S3_BUCKET_NAME,
      MaxKeys: 10
    });
    
    try {
      const objectsResponse = await s3Client.send(listObjectsCommand);
      const objectCount = objectsResponse.KeyCount || 0;
      
      console.log('✅ Success! Found', objectCount, 'object(s) in bucket');
      
      if (objectCount > 0 && objectsResponse.Contents) {
        console.log('   Latest files:');
        objectsResponse.Contents.slice(0, 5).forEach(obj => {
          console.log('   -', obj.Key, '(' + formatBytes(obj.Size) + ')');
        });
      } else {
        console.log('   (Bucket is empty - this is normal for a new setup)');
      }
      console.log('');
    } catch (error) {
      if (error.name === 'NoSuchBucket') {
        console.log('⚠️  Bucket not found!');
        console.log('   Please create bucket:', process.env.S3_BUCKET_NAME);
        console.log('   at https://panel.cloudkilat.com');
      } else {
        throw error;
      }
      console.log('');
    }

    // Test 3: Upload a test file
    console.log('🧪 Test 3: Uploading test file...');
    const testContent = `Exora ID Test File
Created: ${new Date().toISOString()}
This is a test file to verify CloudKilat S3 upload functionality.`;

    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'test/connection-test.txt',
      Body: Buffer.from(testContent),
      ContentType: 'text/plain',
      Metadata: {
        'test': 'true',
        'created-by': 'Exora ID-test-script'
      }
    });

    await s3Client.send(uploadCommand);
    console.log('✅ Success! Test file uploaded to: test/connection-test.txt');
    console.log('');

    // Summary
    console.log('═══════════════════════════════════════════════');
    console.log('✅ All tests passed!');
    console.log('');
    console.log('Your CloudKilat configuration is working correctly.');
    console.log('You can now start the Exora ID server with: npm start');
    console.log('═══════════════════════════════════════════════');

  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════');
    console.error('❌ Error:', error.message);
    console.error('═══════════════════════════════════════════════');
    console.error('');
    
    if (error.name === 'CredentialsProviderError') {
      console.error('🔴 Credentials Error:');
      console.error('   Please check your .env file:');
      console.error('   - CLOUDKILAT_ACCESS_KEY');
      console.error('   - CLOUDKILAT_SECRET_KEY');
    } else if (error.Code === 'SignatureDoesNotMatch') {
      console.error('🔴 Invalid Secret Key:');
      console.error('   Your Secret Key is incorrect.');
      console.error('   Please verify it in CloudKilat Panel.');
    } else if (error.Code === 'InvalidAccessKeyId') {
      console.error('🔴 Invalid Access Key:');
      console.error('   Your Access Key is incorrect.');
      console.error('   Expected: 00f40347ce0451733558');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      console.error('🔴 Network Error:');
      console.error('   Cannot reach:', process.env.CLOUDKILAT_S3_ENDPOINT);
      console.error('   Please check your internet connection.');
    } else {
      console.error('Full error:', error);
    }
    
    console.error('');
    console.error('📚 For help, see: CLOUDKILAT_CONFIG.md');
    console.error('');
    process.exit(1);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Run the test
testConnection();
