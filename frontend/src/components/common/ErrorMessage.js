import React from 'react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 18px',
        background: '#fee2e2',
        border: '1px solid #fca5a5',
        borderRadius: 'var(--radius)',
        color: 'var(--danger)',
        fontSize: 14,
        marginBottom: 16,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 20 }}>⚠️</span>
      <span style={{ flex: 1 }}>{message || 'Something went wrong. Please try again.'}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background: 'none',
            border: '1px solid currentColor',
            borderRadius: 'var(--radius)',
            color: 'inherit',
            padding: '4px 10px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
