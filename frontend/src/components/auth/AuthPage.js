import React, { useState } from 'react';
import './AuthPage.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🏠</span>
          <h1 className="auth-logo-title">Property Search</h1>
          <p className="auth-logo-subtitle">Find your perfect home</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Create Account
          </button>
        </div>

        <div className="auth-form-wrapper">
          {activeTab === 'login' ? (
            <LoginForm onSwitch={() => setActiveTab('register')} />
          ) : (
            <RegisterForm onSwitch={() => setActiveTab('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
