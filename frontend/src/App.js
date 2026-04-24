import React, { useState, useContext } from 'react';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import Header from './components/layout/Header';
import PropertySearch from './components/property/PropertySearch';
import WatchlistPage from './components/watchlist/WatchlistPage';

export default function App() {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState('search');

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="app-main">
        {currentPage === 'search' && <PropertySearch />}
        {currentPage === 'watchlist' && <WatchlistPage />}
      </main>
    </div>
  );
}
