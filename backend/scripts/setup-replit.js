
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Tabison Suppliers for Replit Deployment\n');

// Create production environment file
const prodEnvPath = path.join(__dirname, '../.env.production');
const envPath = path.join(__dirname, '../.env');

// Copy .env to .env.production if it doesn't exist
if (!fs.existsSync(prodEnvPath) && fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update for production
  envContent = envContent
    .replace('NODE_ENV=development', 'NODE_ENV=production')
    .replace('FRONTEND_URL=http://localhost:5173', 'FRONTEND_URL=https://your-repl-name.username.repl.co')
    .replace('MPESA_ENVIRONMENT=sandbox', 'MPESA_ENVIRONMENT=production');
  
  fs.writeFileSync(prodEnvPath, envContent);
  console.log('✅ Created .env.production');
}

// Create deployment checklist
const checklist = `
🔧 Replit Deployment Checklist

✅ Environment Setup:
   □ All environment variables configured in Secrets
   □ MongoDB Atlas connection string added
   □ Email credentials (Gmail app password) configured
   □ Payment provider keys added (M-Pesa, Stripe)

✅ Pre-Deployment:
   □ Run: npm run check-env
   □ Test app locally: npm run dev
   □ Verify all features work

✅ Deployment:
   □ Click "Deploy" in Replit
   □ Configure custom domain (optional)
   □ Test production deployment

✅ Post-Deployment:
   □ Update FRONTEND_URL in environment
   □ Test payments in production
   □ Monitor logs for errors

🔗 Your app will be available at:
   https://your-repl-name.username.repl.co
`;

console.log(checklist);

// Check if .replit exists and is properly configured
const replitPath = path.join(__dirname, '../../.replit');
if (fs.existsSync(replitPath)) {
  console.log('✅ .replit configuration found');
} else {
  console.log('⚠️  .replit configuration missing');
}

console.log('\n🎯 Ready for Replit deployment!');
console.log('💡 Use "Deploy" button in Replit interface to publish your app');
