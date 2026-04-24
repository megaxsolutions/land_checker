import React, { useContext, useCallback } from 'react';
import './PropertyCard.css';
import { WatchlistContext } from '../../contexts/WatchlistContext';
import { AuthContext } from '../../contexts/AuthContext';
import { formatPrice, formatAddress } from '../../utils/formatters';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"%3E%3Crect fill="%23e2e8f0" width="400" height="240"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="48" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🏠%3C/text%3E%3C/svg%3E';

function StatusBadge({ status }) {
  const labels = { active: 'Active', under_contract: 'Under Contract', sold: 'Sold' };
  const label = labels[status] || status;
  return <span className={`badge badge-${status || 'default'}`}>{label}</span>;
}

function PropertyCard({ property }) {
  const { user } = useContext(AuthContext);
  const { isWatched, toggleWatchlist } = useContext(WatchlistContext);

  const watched = isWatched(property.id);

  const handleWatchlist = useCallback(
    (e) => {
      e.stopPropagation();
      if (!user) {
        alert('Please sign in to save properties to your watchlist.');
        return;
      }
      toggleWatchlist(property);
    },
    [user, toggleWatchlist, property]
  );

  const imageSrc = property.image_url || PLACEHOLDER_IMAGE;

  return (
    <article className="property-card">
      <div className="card-image-wrapper">
        <img
          className="card-image"
          src={imageSrc}
          alt={property.title || 'Property'}
          loading="lazy"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
        />
        <div className="card-badges">
          <StatusBadge status={property.status} />
          {property.property_type && (
            <span className="badge badge-default card-type-badge">
              {property.property_type}
            </span>
          )}
        </div>
        <button
          className={`card-watchlist-btn ${watched ? 'card-watchlist-btn--active' : ''}`}
          onClick={handleWatchlist}
          aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
          title={watched ? 'Remove from watchlist' : 'Save to watchlist'}
        >
          {watched ? '❤' : '♡'}
        </button>
      </div>

      <div className="card-body">
        <p className="card-price">{formatPrice(property.price)}</p>
        <h3 className="card-title">{property.title || 'Untitled Property'}</h3>
        <p className="card-address">{formatAddress(property)}</p>

        <div className="card-features">
          {property.bedrooms != null && (
            <span className="card-feature" title="Bedrooms">
              🛏 {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="card-feature" title="Bathrooms">
              🚿 {property.bathrooms}
            </span>
          )}
          {property.car_spaces != null && property.car_spaces > 0 && (
            <span className="card-feature" title="Car spaces">
              🚗 {property.car_spaces}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default React.memo(PropertyCard);
