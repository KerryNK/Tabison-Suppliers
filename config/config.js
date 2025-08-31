import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the appropriate .env file based on NODE_ENV
const environment = process.env.NODE_ENV || 'development';
const envFile = environment === 'production' ? '.env.production' : '.env.development';
const envPath = path.resolve(__dirname, '..', envFile);

// Load environment variables from the appropriate file
dotenv.config({ path: envPath });

// Configuration object
const config = {
    env: environment,
    port: process.env.PORT || 5000,
    mongodb: {
        uri: process.env.MONGODB_URI
    },
    jwt: {
        secret: process.env.JWT_SECRET
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    frontend: {
        url: process.env.FRONTEND_URL,
        apiUrl: process.env.EXTERNAL_API_URL
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    mpesa: {
        consumerKey: process.env.MPESA_CONSUMER_KEY,
        consumerSecret: process.env.MPESA_CONSUMER_SECRET,
        passkey: process.env.MPESA_PASSKEY,
        shortcode: process.env.MPESA_SHORTCODE
    },
    oauth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }
    }
};

// Validate required configuration
const validateConfig = () => {
    const required = [
        'mongodb.uri',
        'jwt.secret',
        'email.user',
        'email.pass',
        'frontend.url',
        'cloudinary.cloudName',
        'cloudinary.apiKey',
        'cloudinary.apiSecret'
    ];

    for (const key of required) {
        const value = key.split('.').reduce((obj, k) => obj && obj[k], config);
        if (!value) {
            throw new Error(`Missing required configuration: ${key}`);
        }
    }
};

// Validate configuration in production
if (environment === 'production') {
    validateConfig();
}

export default config;
