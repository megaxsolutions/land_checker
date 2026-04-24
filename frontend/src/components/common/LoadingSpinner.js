import React from 'react';

export default function LoadingSpinner({ size = 'md', label = 'Loading…' }) {
  const sizes = { sm: 20, md: 36, lg: 56 };
  const px = sizes[size] || sizes.md;

  return (
    <div
      role="status"
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ animation: 'spin 0.75s linear infinite' }}
        aria-hidden="true"
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
        <path d="M12 3a9 9 0 0 1 9 9" />
      </svg>
      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}
