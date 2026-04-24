import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { AuthContext } from './contexts/AuthContext';
import { WatchlistContext } from './contexts/WatchlistContext';

const mockWatchlistValue = {
  watchlistItems: [],
  watchlist: [],
  toggleWatchlist: jest.fn(),
  isWatched: jest.fn(() => false),
  loading: false,
  refetch: jest.fn(),
};

describe('App', () => {
  it('renders the auth page when user is not logged in', () => {
    const authValue = {
      user: null,
      token: null,
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    };

    render(
      <AuthContext.Provider value={authValue}>
        <WatchlistContext.Provider value={mockWatchlistValue}>
          <App />
        </WatchlistContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText(/Property Search/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Sign In/i }).length).toBeGreaterThan(0);
  });

  it('renders the header when user is logged in', () => {
    const authValue = {
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      token: 'mock-token',
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    };

    render(
      <AuthContext.Provider value={authValue}>
        <WatchlistContext.Provider value={mockWatchlistValue}>
          <App />
        </WatchlistContext.Provider>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();
  });
});
