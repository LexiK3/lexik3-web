// pages/Learning.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchEnrolledBooks, clearError as clearBooksError } from '../store/slices/booksSlice';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import LoadingCard from '../components/common/LoadingCard';
import ErrorMessage from '../components/common/ErrorMessage';

const Learning: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    enrolledBooks, 
    isLoading: booksLoading, 
    error: booksError 
  } = useAppSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchEnrolledBooks());
  }, [dispatch]);

  const handleRetryBooks = () => {
    dispatch(clearBooksError());
    dispatch(fetchEnrolledBooks());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Learning</h1>
            <Button variant="outline" size="sm" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Your Learning Books
          </h2>
          
          {booksError && (
            <ErrorMessage
              error={booksError}
              onRetry={handleRetryBooks}
              onDismiss={() => dispatch(clearBooksError())}
              className="mb-6"
            />
          )}
          
          {booksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => (
                <LoadingCard
                  key={i}
                  lines={4}
                  showButton={true}
                  className="p-6"
                />
              ))}
            </div>
          ) : enrolledBooks.length === 0 ? (
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No enrolled books</h3>
              <p className="text-gray-500 mb-6">
                You haven't enrolled in any books yet. Go to the dashboard to explore available books.
              </p>
              <Button onClick={() => window.location.href = '/dashboard'}>
                Browse Books
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledBooks.map((enrollment: any) => (
                <Card key={enrollment.id} hoverable className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {enrollment.book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {enrollment.book.description}
                  </p>
                  
                  {/* Progress indicator */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(enrollment.progress.progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {enrollment.progress.wordsLearned} / {enrollment.book.totalWords} words
                    </div>
                    <Button size="sm">
                      Continue Learning
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Learning;
