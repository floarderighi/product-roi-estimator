import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function Card({ children, className = '', onClick, selected }: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-md p-6 transition-all duration-200 transform hover-lift';
  const interactiveStyles = onClick
    ? 'cursor-pointer hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]'
    : '';
  const selectedStyles = selected
    ? 'ring-4 ring-primary-500 border-2 border-primary-500 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50'
    : 'border-2 border-gray-200 hover:border-primary-300';

  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${selectedStyles} ${className} animate-fade-in`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
