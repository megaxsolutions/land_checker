import React, { createContext, useState, useEffect, useCallback, useContext, useRef } from 'react';
import { createConsumer } from '@rails/actioncable';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/api';
import { AuthContext } from './AuthContext';

export const WatchlistContext = createContext(null);

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/cable';

export function WatchlistProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const consumerRef = useRef(null);
  const subscriptionRef = useRef(null);

  const watchlist = watchlistItems.map((item) => item.property.id);

  const fetchWatchlist = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getWatchlist();
      setWatchlistItems(data.watchlist_items || []);
    } catch (_err) {
      setWatchlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      setWatchlistItems([]);
    }
  }, [user, fetchWatchlist]);

  /* ── WebSocket subscription ── */
  useEffect(() => {
    if (!token || !user) return;

    const wsUrl = `${WS_URL}?token=${encodeURIComponent(token)}`;
    consumerRef.current = createConsumer(wsUrl);

    subscriptionRef.current = consumerRef.current.subscriptions.create(
      { channel: 'PropertyUpdatesChannel' },
      {
        received(data) {
          if (!data || !data.property) return;

          if (data.action === 'updated') {
            setWatchlistItems((prev) =>
              prev.map((item) =>
                item.property.id === data.property.id
                  ? { ...item, property: data.property }
                  : item
              )
            );
          }

          if (data.action === 'removed') {
            setWatchlistItems((prev) =>
              prev.filter((item) => item.property.id !== data.property.id)
            );
          }
        },
      }
    );

    return () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
      if (consumerRef.current) consumerRef.current.disconnect();
    };
  }, [token, user]);

  const isWatched = useCallback(
    (propertyId) => watchlist.includes(propertyId),
    [watchlist]
  );

  const toggleWatchlist = useCallback(
    async (property) => {
      const existingItem = watchlistItems.find(
        (item) => item.property.id === property.id
      );

      if (existingItem) {
        /* Optimistic remove */
        setWatchlistItems((prev) =>
          prev.filter((item) => item.property.id !== property.id)
        );
        try {
          await removeFromWatchlist(existingItem.id);
        } catch (_err) {
          setWatchlistItems((prev) => [...prev, existingItem]);
        }
      } else {
        /* Optimistic add */
        const tempItem = { id: `temp-${property.id}`, property };
        setWatchlistItems((prev) => [...prev, tempItem]);
        try {
          const data = await addToWatchlist(property.id);
          setWatchlistItems((prev) =>
            prev.map((item) =>
              item.id === tempItem.id ? data.watchlist_item : item
            )
          );
        } catch (_err) {
          setWatchlistItems((prev) =>
            prev.filter((item) => item.id !== tempItem.id)
          );
        }
      }
    },
    [watchlistItems]
  );

  return (
    <WatchlistContext.Provider
      value={{
        watchlistItems,
        watchlist,
        toggleWatchlist,
        isWatched,
        loading,
        refetch: fetchWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}
