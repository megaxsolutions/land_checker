import { useEffect, useRef, useCallback, useContext } from 'react';
import { createConsumer } from '@rails/actioncable';
import { AuthContext } from '../contexts/AuthContext';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001/cable';

export function useWebSocket() {
  const { token } = useContext(AuthContext);
  const consumerRef = useRef(null);
  const subscriptionsRef = useRef({});

  useEffect(() => {
    if (!token) return;

    const wsUrl = `${WS_URL}?token=${encodeURIComponent(token)}`;
    consumerRef.current = createConsumer(wsUrl);

    return () => {
      Object.values(subscriptionsRef.current).forEach((sub) => {
        try { sub.unsubscribe(); } catch (_e) { /* ignore */ }
      });
      subscriptionsRef.current = {};
      if (consumerRef.current) {
        consumerRef.current.disconnect();
        consumerRef.current = null;
      }
    };
  }, [token]);

  const subscribe = useCallback((channelName, callbacks = {}) => {
    if (!consumerRef.current) return null;

    if (subscriptionsRef.current[channelName]) {
      subscriptionsRef.current[channelName].unsubscribe();
    }

    const subscription = consumerRef.current.subscriptions.create(
      { channel: channelName },
      {
        connected() { callbacks.connected?.(); },
        disconnected() { callbacks.disconnected?.(); },
        received(data) { callbacks.received?.(data); },
      }
    );

    subscriptionsRef.current[channelName] = subscription;
    return subscription;
  }, []);

  const unsubscribe = useCallback((channelName) => {
    if (subscriptionsRef.current[channelName]) {
      subscriptionsRef.current[channelName].unsubscribe();
      delete subscriptionsRef.current[channelName];
    }
  }, []);

  return { subscribe, unsubscribe };
}
