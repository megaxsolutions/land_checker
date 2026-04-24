import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertyCard from './PropertyCard';
import { AuthContext } from '../../contexts/AuthContext';
import { WatchlistContext } from '../../contexts/WatchlistContext';

const mockProperty = {
  id: 1,
  title: 'Beautiful Family Home',
  price: 850000,
  street_address: '12 Oak Street',
  suburb: 'Riverside',
  state: 'NSW',
  postcode: '2000',
  bedrooms: 4,
  bathrooms: 2,
  car_spaces: 2,
  property_type: 'house',
  status: 'active',
  image_url: null,
};

function renderCard({ user = null, isWatched = false, toggleWatchlist = jest.fn() } = {}) {
  const authValue = { user, token: user ? 'token' : null, login: jest.fn(), logout: jest.fn() };
  const watchlistValue = {
    watchlist: isWatched ? [mockProperty.id] : [],
    watchlistItems: [],
    isWatched: jest.fn(() => isWatched),
    toggleWatchlist,
    loading: false,
    refetch: jest.fn(),
  };

  return render(
    <AuthContext.Provider value={authValue}>
      <WatchlistContext.Provider value={watchlistValue}>
        <PropertyCard property={mockProperty} />
      </WatchlistContext.Provider>
    </AuthContext.Provider>
  );
}

describe('PropertyCard', () => {
  it('renders title, price and address', () => {
    renderCard();
    expect(screen.getByText('Beautiful Family Home')).toBeInTheDocument();
    expect(screen.getByText(/850,000/)).toBeInTheDocument();
    expect(screen.getByText(/12 Oak Street/)).toBeInTheDocument();
  });

  it('shows active status badge', () => {
    renderCard();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows bedroom and bathroom counts', () => {
    renderCard();
    expect(screen.getByText(/🛏/)).toBeInTheDocument();
    expect(screen.getByText(/🚿/)).toBeInTheDocument();
  });

  it('shows empty heart when property is not watched', () => {
    renderCard({ user: { id: 1 }, isWatched: false });
    const btn = screen.getByRole('button', { name: /Add to watchlist/i });
    expect(btn).toBeInTheDocument();
    expect(btn.textContent).toBe('♡');
  });

  it('shows filled heart when property is watched', () => {
    renderCard({ user: { id: 1 }, isWatched: true });
    const btn = screen.getByRole('button', { name: /Remove from watchlist/i });
    expect(btn.textContent).toBe('❤');
  });

  it('calls toggleWatchlist when heart button is clicked by logged-in user', () => {
    const toggleWatchlist = jest.fn();
    renderCard({ user: { id: 1 }, toggleWatchlist });
    fireEvent.click(screen.getByRole('button', { name: /Add to watchlist/i }));
    expect(toggleWatchlist).toHaveBeenCalledWith(mockProperty);
  });

  it('shows alert when unauthenticated user clicks watchlist button', () => {
    window.alert = jest.fn();
    renderCard({ user: null });
    fireEvent.click(screen.getByRole('button', { name: /Add to watchlist/i }));
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('sign in')
    );
  });

  it('renders property type badge', () => {
    renderCard();
    expect(screen.getByText('house')).toBeInTheDocument();
  });
});
