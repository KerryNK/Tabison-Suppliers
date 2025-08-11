
const fs = require('fs');
const path = require('path');

// Required environment variables
const requiredVars = {
  // Database
  MONGO_URI: 'MongoDB connection string',
  
  // JWT
  JWT_SECRET: 'JWT secret key for authentication',
  
  // Email Service
  EMAIL_USER: 'Gmail address for sending emails',
  EMAIL_PASS: 'Gmail app password',
  
  // Payment - M-Pesa
  MPESA_CONSUMER_KEY: 'M-Pesa consumer key',
  MPESA_CONSUMER_SECRET: 'M-Pesa consumer secret',
  MPESA_PASSKEY: 'M-Pesa passkey',
  MPESA_SHORTCODE: 'M-Pesa business shortcode',
  
  // Payment - Stripe
  STRIPE_SECRET_KEY: 'Stripe secret key',
  STRIPE_PUBLISHABLE_KEY: 'Stripe publishable key',
  
  // Optional
  NODE_ENV: 'Environment (development/production)',
  PORT: 'Server port (default: 5000)',
  FRONTEND_URL: 'Frontend URL for CORS'
};

console.log('🔍 Environment Variables Check\n');

const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📋 Creating .env from .env.example...\n');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from template');
  } else {
    console.log('❌ .env.example not found either!');
    process.exit(1);
  }
}

// Load environment variables
require('dotenv').config({ path: envPath });

let missingVars = [];
let setVars = [];

Object.entries(requiredVars).forEach(([key, description]) => {
  const value = process.env[key];
  if (!value || value === 'your-value-here' || value === '') {
    missingVars.push({ key, description });
  } else {
    setVars.push({ key, description });
  }
});

// Display results
console.log('✅ Configured Variables:');
setVars.forEach(({ key, description }) => {
  console.log(`   ${key}: ${description}`);
});

if (missingVars.length > 0) {
  console.log('\n❌ Missing/Unconfigured Variables:');
  missingVars.forEach(({ key, description }) => {
    console.log(`   ${key}: ${description}`);
  });
  
  console.log('\n📝 Next Steps:');
  console.log('1. Edit backend/.env file');
  console.log('2. Add your actual values for the missing variables');
  console.log('3. Run this check again: npm run check-env\n');
  
  // Provide specific setup instructions
  console.log('🛠️  Setup Instructions:');
  console.log('\n📧 Email Service (Gmail):');
  console.log('   1. Enable 2FA on your Gmail account');
  console.log('   2. Generate app password: myaccount.google.com/security');
  console.log('   3. Use app password (not your regular password)');
  
  console.log('\n💳 M-Pesa Setup:');
  console.log('   1. Register at developer.safaricom.co.ke');
  console.log('   2. Create a sandbox app');
  console.log('   3. Get Consumer Key, Consumer Secret, and Passkey');
  
  console.log('\n🏦 Stripe Setup:');
  console.log('   1. Register at stripe.com');
  console.log('   2. Get API keys from dashboard');
  console.log('   3. Use test keys for development');
  
  console.log('\n🗄️  MongoDB Setup:');
  console.log('   1. Create account at mongodb.com/atlas');
  console.log('   2. Create cluster and database');
  console.log('   3. Get connection string from Connect button');
  
} else {
  console.log('\n🎉 All environment variables are configured!');
  console.log('✅ Ready for deployment');
}
