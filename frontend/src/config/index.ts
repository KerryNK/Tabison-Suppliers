// src/config/index.ts
export const config = {
  // Firebase
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  },

  // API
  api: {
    baseUrl: import.meta.env.VITE_API_URL
  },

  // Cloudinary
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  },

  // Stripe
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  },

  // M-Pesa
  mpesa: {
    paybillNumber: import.meta.env.VITE_MPESA_PAYBILL_NUMBER,
    consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY,
    consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET,
    passkey: import.meta.env.VITE_MPESA_PASSKEY,
    shortcode: import.meta.env.VITE_MPESA_SHORTCODE
  },

  // Environment
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV
};