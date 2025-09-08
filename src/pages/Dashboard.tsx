// pages/Dashboard.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooks, clearError as clearBooksError } from '../store/slices/booksSlice';
import { fetchUserProgress, clearError as clearProgressError } from '../store/slices/progressSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LoadingCard from '../components/common/LoadingCard';
import ErrorMessage from '../components/common/ErrorMessage';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { 
    books, 
    isLoading: booksLoading, 
    error: booksError 
  } = useAppSelector((state) => state.books);
  const { 
    userProgress, 
    isLoading: progressLoading, 
    error: progressError 
  } = useAppSelector((state) => state.progress);

  useEffect(() => {
    dispatch(fetchBooks({}));
    dispatch(fetchUserProgress({}));
  }, [dispatch]);

  const handleRetryBooks = () => {
    dispatch(clearBooksError());
    dispatch(fetchBooks({}));
  };

  const handleRetryProgress = () => {
    dispatch(clearProgressError());
    dispatch(fetchUserProgress({}));
  };

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
              
              {progressError && (
                <ErrorMessage
                  error={progressError}
                  onRetry={handleRetryProgress}
                  onDismiss={() => dispatch(clearProgressError())}
                  className="mb-4"
                />
              )}
              
              {progressLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="text-center">
                      <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
                    </div>
                  ))}
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
            
            {booksError && (
              <ErrorMessage
                error={booksError}
                onRetry={handleRetryBooks}
                onDismiss={() => dispatch(clearBooksError())}
                className="mb-4"
              />
            )}
            
            {booksLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <LoadingCard
                    key={i}
                    lines={3}
                    showButton={true}
                    className="p-4"
                  />
                ))}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-12">
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No books available</h3>
                <p className="text-gray-500 mb-4">
                  There are no books available at the moment. Please check back later.
                </p>
                <Button onClick={handleRetryBooks}>
                  Refresh
                </Button>
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
