// pages/Dashboard.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooks } from '../store/slices/booksSlice';
import { fetchUserProgress } from '../store/slices/progressSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { books, isLoading: booksLoading } = useAppSelector((state) => state.books);
  const { userProgress, isLoading: progressLoading } = useAppSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchBooks({}));
    dispatch(fetchUserProgress({}));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">LexiK3</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName}!
              </span>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
              {progressLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : userProgress ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {userProgress.overall.totalWordsLearned}
                    </div>
                    <div className="text-sm text-gray-600">Words Learned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {userProgress.overall.currentStreak}
                    </div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(userProgress.overall.accuracy * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {userProgress.overall.level}
                    </div>
                    <div className="text-sm text-gray-600">Level</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No progress data available
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button fullWidth>
                  Start Learning
                </Button>
                <Button variant="outline" fullWidth>
                  View Progress
                </Button>
                <Button variant="outline" fullWidth>
                  Browse Books
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Books Section */}
        <div className="mt-8">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Books</h2>
            {booksLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} loading>
                    <div></div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book: any) => (
                  <Card key={book.id} hoverable className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{book.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {book.totalWords} words
                      </span>
                      <Button size="sm">
                        {book.userProgress?.isEnrolled ? 'Continue' : 'Enroll'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
