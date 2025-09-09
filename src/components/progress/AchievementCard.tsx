// components/progress/AchievementCard.tsx
import React from 'react';
import { Achievement } from '../../types/progress';
import Card from '../common/Card';

interface AchievementCardProps {
  achievement: Achievement;
  onClick?: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onClick }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'uncommon': return 'border-green-300 bg-green-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card 
      className={`border-2 ${getRarityColor(achievement.rarity)} ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="text-4xl">
          {achievement.icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {achievement.name}
            </h3>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRarityTextColor(achievement.rarity)}`}>
              {achievement.rarity.toUpperCase()}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">
            {achievement.description}
          </p>
          
          {/* Progress Bar */}
          {!achievement.isUnlocked && achievement.progress < 1 && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{Math.round(achievement.progress * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${achievement.progress * 100}%` }}
                  role="progressbar"
                  aria-valuenow={achievement.progress * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}
          
          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>{achievement.points} points</span>
              {achievement.isUnlocked && achievement.unlockedAt && (
                <span>
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            
            {achievement.isUnlocked && (
              <div className="text-green-600 text-sm font-medium">
                ✓ Unlocked
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AchievementCard;
