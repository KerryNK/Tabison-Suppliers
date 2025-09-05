// src/components/FirebaseTest.tsx
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { signInAnonymously } from 'firebase/auth';

export const FirebaseTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing Firebase...');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Try to sign in anonymously to test Firebase Auth
        await signInAnonymously(auth);
        setStatus('✅ Firebase is working correctly!');
      } catch (error) {
        setStatus(`❌ Firebase error: ${error.message}`);
      }
    };

    testFirebase();
  }, []);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Firebase Connection Test</h1>
      <p>{status}</p>
    </div>
  );
};