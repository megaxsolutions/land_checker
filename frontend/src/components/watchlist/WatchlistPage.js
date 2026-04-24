import React, { useContext } from 'react';
import './WatchlistPage.css';
import { WatchlistContext } from '../../contexts/WatchlistContext';
import PropertyCard from '../property/PropertyCard';
import LoadingSpinner from '../common/LoadingSpinner';

export default function WatchlistPage() {
  const { watchlistItems, loading } = useContext(WatchlistContext);

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h2 className="watchlist-title">My Watchlist</h2>
        <span className="watchlist-count">
          {watchlistItems.length} {watchlistItems.length === 1 ? 'property' : 'properties'}
        </span>
      </div>

      {loading && (
        <div className="watchlist-loading">
          <LoadingSpinner />
        </div>
      )}

      {!loading && watchlistItems.length === 0 && (
        <div className="watchlist-empty">
          <span className="watchlist-empty-icon">♡</span>
          <h3>No saved properties</h3>
          <p>Browse properties and click the heart icon to save them here.</p>
        </div>
      )}

      {!loading && watchlistItems.length > 0 && (
        <div className="watchlist-grid">
          {watchlistItems.map((item) => (
            <PropertyCard key={item.id} property={item.property} />
          ))}
        </div>
      )}
    </div>
  );
}
