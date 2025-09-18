import React, { useState } from 'react';
import ConfirmationDialog from './components/ConfirmationDialog';
import LessonPicker from './components/LessonPicker';
import LandingPage from './components/LandingPage';
import LessonPage from './components/LessonPage';
import QuizPicker from './components/QuizPicker';
import QuizPage from './components/QuizPage';
import { wordsData } from './data/wordsData';
import { generateQuizQuestions } from './data/quizData';

function App() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentPart, setCurrentPart] = useState(1);
  const [dialogState, setDialogState] = useState({ isOpen: false, word: '' });
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isQuizPickerOpen, setIsQuizPickerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'lesson', or 'quiz'
  const [quizData, setQuizData] = useState(null);
  
  // Calculate the current day index based on lesson and part
  const getCurrentDayIndex = () => {
    return currentLesson * 2 + (currentPart - 1);
  };
  
  const currentWords = wordsData[getCurrentDayIndex()];

  const handleLessonChange = (lessonIndex, part) => {
    setCurrentLesson(lessonIndex);
    setCurrentPart(part);
  };

  const handleBrowseAll = () => {
    setIsLessonModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLessonModalOpen(false);
  };

  const handleLessonSelect = (lessonIndex) => {
    setCurrentLesson(lessonIndex);
    setCurrentPart(1); // Start with Part 1
    setCurrentPage('lesson');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
    setQuizData(null);
  };

  const handleStartQuiz = () => {
    setIsQuizPickerOpen(true);
  };

  const handleQuizStart = (selectedLessons, quizType) => {
    const questions = generateQuizQuestions(wordsData, selectedLessons, quizType);
    setQuizData({
      questions,
      quizType,
      selectedLessons
    });
    setCurrentPage('quiz');
    setIsQuizPickerOpen(false);
  };

  const handleRetakeQuiz = () => {
    if (quizData) {
      const newQuestions = generateQuizQuestions(wordsData, quizData.selectedLessons, quizData.quizType);
      setQuizData(prev => ({
        ...prev,
        questions: newQuestions
      }));
    }
  };

  const handleOpenDialog = (word) => {
    setDialogState({ isOpen: true, word });
  };

  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, word: '' });
  };

  const handleConfirmTranslate = () => {
    const googleTranslateUrl = `https://translate.google.com/?sl=auto&tl=en&text=${encodeURIComponent(dialogState.word)}`;
    window.open(googleTranslateUrl, '_blank');
    handleCloseDialog();
  };

  return (
    <div>
      {/* Render current page */}
      {currentPage === 'landing' ? (
        <LandingPage
          totalLessons={Math.ceil(wordsData.length / 2)}
          onLessonSelect={handleLessonSelect}
          onStartQuiz={handleStartQuiz}
        />
      ) : currentPage === 'quiz' ? (
        <QuizPage
          questions={quizData?.questions || []}
          quizType={quizData?.quizType}
          selectedLessons={quizData?.selectedLessons || []}
          onBackToLanding={handleBackToLanding}
          onRetakeQuiz={handleRetakeQuiz}
        />
      ) : (
        <LessonPage
          currentLesson={currentLesson}
          currentPart={currentPart}
          currentWords={currentWords}
          totalLessons={Math.ceil(wordsData.length / 2)}
          onLessonChange={handleLessonChange}
          onBrowseAll={handleBrowseAll}
          onWordClick={handleOpenDialog}
          onBackToLanding={handleBackToLanding}
        />
      )}

      {/* Global Dialog */}
      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmTranslate}
        word={dialogState.word}
      />

      {/* Lesson Picker Modal */}
      <LessonPicker
        selectedLesson={currentLesson}
        selectedPart={currentPart}
        onLessonChange={handleLessonChange}
        totalLessons={Math.ceil(wordsData.length / 2)}
        isOpen={isLessonModalOpen}
        onClose={handleCloseModal}
      />

      {/* Quiz Picker Modal */}
      <QuizPicker
        totalLessons={Math.ceil(wordsData.length / 2)}
        isOpen={isQuizPickerOpen}
        onClose={() => setIsQuizPickerOpen(false)}
        onStartQuiz={handleQuizStart}
      />
    </div>
  );
}

export default App;
