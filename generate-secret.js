// Generate strong JWT secret
const crypto = require('crypto');

console.log('\n=== JWT Secret Generator ===\n');
console.log('Generated JWT Secret:');
console.log(crypto.randomBytes(64).toString('hex'));
console.log('\nCopy this and use it for JWT_SECRET environment variable');
console.log('Keep it secret and never commit to Git!\n');
