import React from 'react';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, word }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] w-full h-full">
      <div className="bg-white rounded-lg p-8 max-w-lg mx-4 shadow-2xl w-full">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-lexik-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="ml-4 text-xl font-semibold text-gray-900">
            Open Google Translate?
          </h3>
        </div>
        
        <div className="mb-8">
          <p className="text-base text-gray-700 mb-4">
            Do you want to translate the word <span className="font-bold text-lexik-blue text-lg">"{word}"</span> in Google Translate?
          </p>
          <p className="text-sm text-gray-500">
            This will open a new tab with Google Translate.
          </p>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 text-base font-medium text-white bg-lexik-blue hover:bg-blue-600 rounded-lg transition-colors duration-200"
          >
            Open Translate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
