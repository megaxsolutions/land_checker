import React, { useState, useCallback } from 'react';
import './PropertySearch.css';

const PROPERTY_TYPES = [
  { value: '', label: 'Any type' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'unit', label: 'Unit' },
  { value: 'villa', label: 'Villa' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
];

const BEDROOMS = [
  { value: '', label: 'Any' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5+' },
];

export default function SearchFilters({ filters, onChange, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleApply = useCallback(
    (e) => {
      e.preventDefault();
      onChange(localFilters);
    },
    [localFilters, onChange]
  );

  const handleReset = useCallback(() => {
    const empty = {
      keyword: '',
      property_type: '',
      bedrooms: '',
      price_min: '',
      price_max: '',
    };
    setLocalFilters(empty);
    onReset();
  }, [onReset]);

  return (
    <form className="search-filters" onSubmit={handleApply}>
      <h3 className="filters-title">Filters</h3>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-keyword">Keyword</label>
        <input
          id="filter-keyword"
          className="filter-input"
          type="text"
          name="keyword"
          placeholder="e.g. pool, garage…"
          value={localFilters.keyword}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-type">Property type</label>
        <select
          id="filter-type"
          className="filter-input"
          name="property_type"
          value={localFilters.property_type}
          onChange={handleChange}
        >
          {PROPERTY_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="filter-bedrooms">Bedrooms</label>
        <select
          id="filter-bedrooms"
          className="filter-input"
          name="bedrooms"
          value={localFilters.bedrooms}
          onChange={handleChange}
        >
          {BEDROOMS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Price range</label>
        <div className="filter-price-row">
          <input
            className="filter-input"
            type="number"
            name="price_min"
            placeholder="Min $"
            min="0"
            value={localFilters.price_min}
            onChange={handleChange}
          />
          <span className="filter-price-sep">–</span>
          <input
            className="filter-input"
            type="number"
            name="price_max"
            placeholder="Max $"
            min="0"
            value={localFilters.price_max}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="filter-actions">
        <button type="submit" className="btn btn-primary filter-btn">
          Apply filters
        </button>
        <button type="button" className="btn btn-secondary filter-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
}
