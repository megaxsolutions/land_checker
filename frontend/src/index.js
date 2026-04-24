import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { WatchlistProvider } from './contexts/WatchlistContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <WatchlistProvider>
        <App />
      </WatchlistProvider>
    </AuthProvider>
  </React.StrictMode>
);
