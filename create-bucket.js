// Create CloudKilat bucket if not exists
require('dotenv').config();
const { S3Client, CreateBucketCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    endpoint: process.env.CLOUDKILAT_S3_ENDPOINT,
    region: 'id-jkt-1',
    credentials: {
        accessKeyId: process.env.CLOUDKILAT_ACCESS_KEY,
        secretAccessKey: process.env.CLOUDKILAT_SECRET_KEY
    },
    forcePathStyle: true
});

async function createBucket() {
    const bucketName = process.env.S3_BUCKET_NAME;
    
    console.log('\n🪣 Creating CloudKilat Bucket...\n');
    console.log(`Bucket Name: ${bucketName}`);
    console.log(`Endpoint: ${process.env.CLOUDKILAT_S3_ENDPOINT}\n`);
    
    try {
        // Check if bucket already exists
        console.log('🔍 Checking existing buckets...');
        const listBucketsCommand = new ListBucketsCommand({});
        const listResponse = await s3Client.send(listBucketsCommand);
        
        const bucketExists = listResponse.Buckets?.some(b => b.Name === bucketName);
        
        if (bucketExists) {
            console.log(`✅ Bucket "${bucketName}" already exists!`);
            console.log('\n✨ You can now start the server!\n');
            return;
        }
        
        // Create bucket
        console.log(`📦 Creating bucket "${bucketName}"...`);
        const createCommand = new CreateBucketCommand({
            Bucket: bucketName
        });
        
        await s3Client.send(createCommand);
        
        console.log(`\n✅ Bucket "${bucketName}" created successfully!`);
        console.log('\n✨ You can now start the server!\n');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('\n📋 Troubleshooting:');
        console.log('1. Check your CloudKilat credentials in .env file');
        console.log('2. Make sure your Access Key has permission to create buckets');
        console.log('3. Try creating bucket manually at: https://panel.cloudkilat.com');
        console.log(`   Bucket name: ${bucketName}`);
        console.log('   Region: id-jkt-1\n');
    }
}

createBucket();
