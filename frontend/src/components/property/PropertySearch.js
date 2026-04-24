import React from 'react';
import './PropertySearch.css';
import { useProperties } from '../../hooks/useProperties';
import SearchFilters from './SearchFilters';
import PropertyCard from './PropertyCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

export default function PropertySearch() {
  const {
    properties,
    loading,
    error,
    hasMore,
    filters,
    setFilters,
    resetFilters,
    setSentinelRef,
  } = useProperties();

  return (
    <div className="property-search">
      <aside className="search-sidebar">
        <SearchFilters
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
        />
      </aside>

      <section className="search-results">
        <div className="search-results-header">
          <h2 className="search-results-title">Properties</h2>
        </div>

        {error && !loading && (
          <ErrorMessage message={error} />
        )}

        {properties.length === 0 && !loading && !error && (
          <div className="search-empty">
            <span className="search-empty-icon">🔍</span>
            <p>No properties found matching your criteria.</p>
            <button className="btn btn-secondary" onClick={resetFilters}>
              Clear filters
            </button>
          </div>
        )}

        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Infinite scroll sentinel */}
        <div
          ref={setSentinelRef}
          className="scroll-sentinel"
          aria-hidden="true"
        />

        {loading && (
          <div className="search-loading">
            <LoadingSpinner />
          </div>
        )}

        {!hasMore && properties.length > 0 && !loading && (
          <p className="search-end-message">All properties loaded</p>
        )}
      </section>
    </div>
  );
}
