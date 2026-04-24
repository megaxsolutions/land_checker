import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { getProperties } from '../services/api';

const DEFAULT_FILTERS = {
  keyword: '',
  property_type: '',
  bedrooms: '',
  price_min: '',
  price_max: '',
};

export function useProperties() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  const activeFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '' && v !== null)
      ),
    [filters]
  );

  const fetchPage = useCallback(
    async (pageNum, reset = false) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProperties({
          page: pageNum,
          per_page: 12,
          ...activeFilters,
        });
        const incoming = data.properties || [];
        const meta = data.meta || {};

        setProperties((prev) => (reset ? incoming : [...prev, ...incoming]));
        setHasMore(pageNum < (meta.total_pages || 1));
      } catch (err) {
        setError(err.message || 'Failed to load properties.');
      } finally {
        setLoading(false);
      }
    },
    [activeFilters]
  );

  /* Reset and fetch when filters change */
  useEffect(() => {
    setPage(1);
    setProperties([]);
    setHasMore(true);
    fetchPage(1, true);
  }, [fetchPage]);

  /* Load next page */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPage(nextPage);
    }
  }, [loading, hasMore, page, fetchPage]);

  /* IntersectionObserver on sentinel element */
  const setSentinelRef = useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMore();
          }
        },
        { rootMargin: '200px' }
      );
      observerRef.current.observe(node);
      sentinelRef.current = node;
    },
    [hasMore, loading, loadMore]
  );

  /* Update observer when hasMore / loading change by refreshing the ref callback */
  useEffect(() => {
    if (!sentinelRef.current) return;
    // Re-invoke the callback to update the observer closure
    setSentinelRef(sentinelRef.current);
  }, [hasMore, loading, setSentinelRef]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    properties,
    loading,
    error,
    hasMore,
    loadMore,
    filters,
    setFilters: updateFilters,
    resetFilters,
    setSentinelRef,
  };
}
