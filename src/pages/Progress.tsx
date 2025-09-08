// pages/Progress.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  fetchStatistics, 
  fetchAchievements, 
  fetchDailyProgress,
  clearError as clearProgressError 
} from '../store/slices/progressSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LoadingCard from '../components/common/LoadingCard';
import ErrorMessage from '../components/common/ErrorMessage';

const Progress: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    statistics, 
    achievements, 
    dailyProgress,
    isLoading: progressLoading, 
    error: progressError 
  } = useAppSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchStatistics({}));
    dispatch(fetchAchievements());
    dispatch(fetchDailyProgress({ days: 7 }));
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(clearProgressError());
    dispatch(fetchStatistics({}));
    dispatch(fetchAchievements());
    dispatch(fetchDailyProgress({ days: 7 }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {progressError && (
          <ErrorMessage
            error={progressError}
            onRetry={handleRetry}
            onDismiss={() => dispatch(clearProgressError())}
            className="mb-6"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Statistics Card */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            
            {progressLoading ? (
              <div className="space-y-4">
                <LoadingCard lines={4} className="p-0" />
              </div>
            ) : statistics ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {statistics.studyTime.total}
                    </div>
                    <div className="text-sm text-blue-600">Total Study Time (min)</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(statistics.accuracy.overall * 100)}%
                    </div>
                    <div className="text-sm text-green-600">Overall Accuracy</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {statistics.words.totalLearned}
                    </div>
                    <div className="text-sm text-purple-600">Words Learned</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {statistics.streaks.current}
                    </div>
                    <div className="text-sm text-orange-600">Current Streak</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No statistics available</h3>
                <p className="text-gray-500 mb-4">
                  Start learning to see your progress statistics here.
                </p>
                <Button onClick={() => window.location.href = '/learning'}>
                  Start Learning
                </Button>
              </div>
            )}
          </Card>

          {/* Achievements Card */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
            
            {progressLoading ? (
              <div className="space-y-4">
                <LoadingCard lines={3} className="p-0" />
              </div>
            ) : achievements && achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.slice(0, 5).map((achievement: any) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      achievement.isUnlocked
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-2xl mr-3">
                      {achievement.isUnlocked ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        achievement.isUnlocked ? 'text-green-900' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${
                        achievement.isUnlocked ? 'text-green-700' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.isUnlocked && (
                      <div className="text-green-600 font-bold">
                        +{achievement.points}
                      </div>
                    )}
                  </div>
                ))}
                {achievements.length > 5 && (
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      View All Achievements
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
                <p className="text-gray-500 mb-4">
                  Complete learning sessions to unlock achievements.
                </p>
                <Button onClick={() => window.location.href = '/learning'}>
                  Start Learning
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Progress;
