import React from 'react';

export const MoneyEffect: React.FC = () => {
  // Generate 15 coins with randomized CSS styles
  const coins = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`
  }));

  return (
    <div style={{ position: 'fixed', top: 0, left: 300, right: 0, height: 0, overflow: 'visible', zIndex: 1000, pointerEvents: 'none' }}>
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="coin-drop"
          style={{ 
            left: coin.left,
            animationDelay: coin.delay
          }}
        >
          ₹
        </div>
      ))}
    </div>
  );
};
