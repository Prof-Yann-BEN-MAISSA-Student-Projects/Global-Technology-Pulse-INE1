import React from 'react';

export default function PredictionBadge({ trendClass, momentumScore }) {
  const getBadgeStyle = () => {
    switch (trendClass) {
      case 'RISING_STAR':
        return {
          backgroundColor: 'rgba(249, 115, 22, 0.12)',
          color: '#f97316',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          label: '🔥 Rising Star'
        };
      case 'STABLE':
        return {
          backgroundColor: 'rgba(156, 163, 175, 0.12)',
          color: '#9ca3af',
          border: '1px solid rgba(156, 163, 175, 0.3)',
          label: '→ Stable'
        };
      case 'DECLINING':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          label: '↓ Declining'
        };
      default:
        return {
          backgroundColor: 'rgba(100, 116, 139, 0.12)',
          color: '#64748b',
          border: '1px solid rgba(100, 116, 139, 0.3)',
          label: 'Insufficient Data'
        };
    }
  };

  const badge = getBadgeStyle();
  const momentumPercent = Math.round((momentumScore || 0) * 100);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
      <span style={{
        padding: '0.35rem 0.75rem',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        backgroundColor: badge.backgroundColor,
        color: badge.color,
        border: badge.border,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem'
      }}>
        {badge.label}
      </span>
      {trendClass !== 'INSUFFICIENT_DATA' && (
        <span style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          fontWeight: 500
        }}>
          {momentumPercent}% momentum
        </span>
      )}
    </div>
  );
}
