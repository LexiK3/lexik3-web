// pages/Learning.tsx
import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Learning: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Learning</h1>
            <Button variant="outline" size="sm">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Learning Session
            </h2>
            <p className="text-gray-600 mb-8">
              Choose a book to start your learning session
            </p>
            <Button size="lg">
              Start Learning
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Learning;
