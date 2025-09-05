// src/pages/AuthPage.tsx
import React from 'react';

interface AuthPageProps {
  mode: 'login' | 'register' | 'forgot-password';
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  return (
    <div>
      <h2>Authentication Page - {mode}</h2>
      <p>This is a placeholder for the {mode} page.</p>
    </div>
  );
};

export default AuthPage;