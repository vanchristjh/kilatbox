require('dotenv').config();
const { S3Client } = require("@aws-sdk/client-s3");

// Konfigurasi S3 Client untuk CloudKilat Storage
const s3Client = new S3Client({
  region: "us-east-1", // CloudKilat menggunakan default region
  endpoint: process.env.CLOUDKILAT_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDKILAT_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDKILAT_SECRET_KEY,
  },
  forcePathStyle: true // Penting untuk S3-compatible storage
});

module.exports = s3Client;
