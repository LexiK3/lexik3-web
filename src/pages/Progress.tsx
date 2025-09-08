// pages/Progress.tsx
import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const Progress: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
            <Button variant="outline" size="sm">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="text-center py-8 text-gray-500">
              Progress charts and statistics will be displayed here
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
            <div className="text-center py-8 text-gray-500">
              Your achievements will be displayed here
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Progress;
