import React, { useContext } from 'react';
import './Header.css';
import { AuthContext } from '../../contexts/AuthContext';
import { WatchlistContext } from '../../contexts/WatchlistContext';

export default function Header({ currentPage, onNavigate }) {
  const { user, logout } = useContext(AuthContext);
  const { watchlist } = useContext(WatchlistContext);

  return (
    <header className="header">
      <div className="header-inner">
        <button
          className="header-logo"
          onClick={() => onNavigate('search')}
          aria-label="Go to search"
        >
          <span className="header-logo-icon">🏠</span>
          <span className="header-logo-text">Property Search</span>
        </button>

        <nav className="header-nav">
          <button
            className={`header-nav-item ${currentPage === 'search' ? 'header-nav-item--active' : ''}`}
            onClick={() => onNavigate('search')}
          >
            Search
          </button>

          <button
            className={`header-nav-item header-nav-item--watchlist ${
              currentPage === 'watchlist' ? 'header-nav-item--active' : ''
            }`}
            onClick={() => onNavigate('watchlist')}
          >
            Watchlist
            {watchlist.length > 0 && (
              <span className="header-badge">{watchlist.length}</span>
            )}
          </button>
        </nav>

        <div className="header-user">
          <span className="header-user-name">{user?.name || user?.email}</span>
          <button className="header-logout btn btn-outline" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
