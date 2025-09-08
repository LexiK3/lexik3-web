// components/common/LoadingCard.tsx
import React from 'react';
import Card from './Card';

interface LoadingCardProps {
  lines?: number;
  className?: string;
  showImage?: boolean;
  showButton?: boolean;
}

const LoadingCard: React.FC<LoadingCardProps> = ({
  lines = 3,
  className = '',
  showImage = false,
  showButton = false,
}) => {
  return (
    <Card className={`animate-pulse ${className}`}>
      {showImage && (
        <div className="h-48 bg-gray-200 rounded mb-4"></div>
      )}
      
      <div className="space-y-3">
        {/* Title line */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        
        {/* Description lines */}
        {Array.from({ length: lines - 1 }).map((_, index) => (
          <div
            key={index}
            className={`h-3 bg-gray-200 rounded ${
              index === lines - 2 ? 'w-1/2' : 'w-full'
            }`}
          ></div>
        ))}
        
        {/* Button skeleton */}
        {showButton && (
          <div className="pt-4">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LoadingCard;
