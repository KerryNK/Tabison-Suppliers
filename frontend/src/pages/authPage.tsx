// src/pages/AuthPage.tsx
import React from 'react';

interface AuthPageProps {
  mode: 'login' | 'register' | 'forgot-password' |'reset-password';
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Authentication - {mode}</h2>
      <p>This is a placeholder for the {mode} functionality.</p>
    </div>
  );
};

export default AuthPage;