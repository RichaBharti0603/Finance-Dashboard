import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = '1em', className = '', style = {} }) => {
  return (
    <div 
      className={`skeleton-shimmer ${className}`}
      style={{ 
        width, 
        height, 
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        ...style 
      }}
    />
  );
};

export const SkeletonCardSnippet: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="glass-card" style={{ height: '140px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Skeleton width="40%" height="1rem" />
        <Skeleton width="80%" height="2rem" />
      </div>
    ))}
  </div>
);
