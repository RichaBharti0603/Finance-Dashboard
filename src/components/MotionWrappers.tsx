import React from 'react';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="animate-fade-in-up">
    {children}
  </div>
);

export const StaggerContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="stagger-wrapper">
    {children}
  </div>
);

export const StaggerItem: React.FC<{ index: number; children: React.ReactNode }> = ({ index, children }) => (
  <div className={`animate-fade-in-up stagger-${(index % 5) + 1}`}>
    {children}
  </div>
);

export const ScaleIn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="animate-scale-in">
    {children}
  </div>
);
