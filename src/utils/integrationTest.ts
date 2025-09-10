// Integration Test Utility
// This utility helps test the complete frontend-backend integration

import { AuthService } from '../services/auth/authService';
import { LearningService } from '../services/learning/learningService';
import { BooksService } from '../services/books/booksService';
import { ProgressService } from '../services/progress/progressService';
import { SessionType } from '../types/enums';

export class IntegrationTest {
  private static testResults: Array<{ test: string; status: 'pass' | 'fail' | 'skip'; message: string }> = [];

  static async runAllTests(): Promise<void> {
    console.log('🧪 Starting LexiK3 Integration Tests...\n');
    
    this.testResults = [];
    
    // Test 1: Authentication
    await this.testAuthentication();
    
    // Test 2: Books
    await this.testBooks();
    
    // Test 3: Learning Sessions
    await this.testLearningSessions();
    
    // Test 4: Progress Tracking
    await this.testProgressTracking();
    
    // Display Results
    this.displayResults();
  }

  private static async testAuthentication(): Promise<void> {
    console.log('1. Testing Authentication...');
    
    try {
      // Test registration
      const registerResult = await AuthService.register({
        email: 'integration-test@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!',
        firstName: 'Integration',
        lastName: 'Test',
        acceptTerms: true
      });
      
      if (registerResult && registerResult.id) {
        this.addResult('Authentication - Registration', 'pass', 'User registration successful');
      } else {
        this.addResult('Authentication - Registration', 'fail', 'Registration failed - no user data returned');
      }
    } catch (error) {
      this.addResult('Authentication - Registration', 'fail', `Registration error: ${error}`);
    }

    try {
      // Test login
      const loginResult = await AuthService.login({
        email: 'integration-test@example.com',
        password: 'TestPassword123!'
      });
      
      if (loginResult && loginResult.token) {
        this.addResult('Authentication - Login', 'pass', 'User login successful');
      } else {
        this.addResult('Authentication - Login', 'fail', 'Login failed - no token returned');
      }
    } catch (error) {
      this.addResult('Authentication - Login', 'fail', `Login error: ${error}`);
    }

    try {
      // Test profile
      const profileResult = AuthService.getCurrentUser();
      
      if (profileResult && profileResult.id) {
        this.addResult('Authentication - Profile', 'pass', 'Profile retrieval successful');
      } else {
        this.addResult('Authentication - Profile', 'fail', 'Profile retrieval failed - no user data returned');
      }
    } catch (error) {
      this.addResult('Authentication - Profile', 'fail', `Profile error: ${error}`);
    }
  }

  private static async testBooks(): Promise<void> {
    console.log('2. Testing Books...');
    
    try {
      const booksResult = await BooksService.getBooks();
      
      if (booksResult.books && booksResult.books.length > 0) {
        this.addResult('Books - Get All', 'pass', `Retrieved ${booksResult.books.length} books`);
        
        // Test book details
        const bookId = booksResult.books[0].id;
        const bookDetailResult = await BooksService.getBookById(bookId);
        
        if (bookDetailResult && bookDetailResult.id) {
          this.addResult('Books - Get Details', 'pass', 'Book details retrieved successfully');
        } else {
          this.addResult('Books - Get Details', 'fail', 'Book details retrieval failed');
        }
      } else {
        this.addResult('Books - Get All', 'fail', 'No books found or API error');
      }
    } catch (error) {
      this.addResult('Books - Get All', 'fail', `Books error: ${error}`);
    }
  }

  private static async testLearningSessions(): Promise<void> {
    console.log('3. Testing Learning Sessions...');
    
    try {
      // First get a book to work with
      const booksResult = await BooksService.getBooks();
      if (!booksResult.books || booksResult.books.length === 0) {
        this.addResult('Learning - Start Session', 'fail', 'No books available for testing');
        return;
      }

      const bookId = booksResult.books[0].id;
      
      // Test starting a session
      const sessionResult = await LearningService.startSession({
        bookId: bookId,
        sessionType: SessionType.Daily,
        day: 1
      });
      
      if (sessionResult.id) {
        this.addResult('Learning - Start Session', 'pass', 'Learning session started successfully');
        
        // Test submitting an answer (if we have words)
        if (sessionResult.words && sessionResult.words.length > 0) {
          const wordId = sessionResult.words[0].id;
          const answerResult = await LearningService.submitAnswer(sessionResult.id, {
            wordId: wordId,
            answer: 'test answer',
            responseTime: 5.0,
            confidence: 3
          });
          
          if (answerResult.wordId) {
            this.addResult('Learning - Submit Answer', 'pass', 'Answer submitted successfully');
          } else {
            this.addResult('Learning - Submit Answer', 'fail', 'Answer submission failed');
          }
        } else {
          this.addResult('Learning - Submit Answer', 'skip', 'No words available for testing');
        }
        
        // Test completing the session
        const completeResult = await LearningService.completeSession(sessionResult.id);
        
        if (completeResult && completeResult.totalWords !== undefined) {
          this.addResult('Learning - Complete Session', 'pass', 'Session completed successfully');
        } else {
          this.addResult('Learning - Complete Session', 'fail', 'Session completion failed');
        }
      } else {
        this.addResult('Learning - Start Session', 'fail', 'Failed to start learning session');
      }
    } catch (error) {
      this.addResult('Learning - Start Session', 'fail', `Learning session error: ${error}`);
    }
  }

  private static async testProgressTracking(): Promise<void> {
    console.log('4. Testing Progress Tracking...');
    
    try {
      const progressResult = await ProgressService.getProgressOverview();
      
      if (progressResult && progressResult.overall && progressResult.overall.totalWordsLearned !== undefined) {
        this.addResult('Progress - Overall', 'pass', 'Overall progress retrieved successfully');
      } else {
        this.addResult('Progress - Overall', 'fail', 'Overall progress retrieval failed');
      }
    } catch (error) {
      this.addResult('Progress - Overall', 'fail', `Progress error: ${error}`);
    }

    try {
      const dailyProgressResult = await ProgressService.getDailyProgress();
      
      if (Array.isArray(dailyProgressResult)) {
        this.addResult('Progress - Daily', 'pass', 'Daily progress retrieved successfully');
      } else {
        this.addResult('Progress - Daily', 'fail', 'Daily progress retrieval failed');
      }
    } catch (error) {
      this.addResult('Progress - Daily', 'fail', `Daily progress error: ${error}`);
    }
  }

  private static addResult(test: string, status: 'pass' | 'fail' | 'skip', message: string): void {
    this.testResults.push({ test, status, message });
    const emoji = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⏭️';
    console.log(`   ${emoji} ${test}: ${message}`);
  }

  private static displayResults(): void {
    console.log('\n📊 Integration Test Results:');
    console.log('================================');
    
    const passed = this.testResults.filter(r => r.status === 'pass').length;
    const failed = this.testResults.filter(r => r.status === 'fail').length;
    const skipped = this.testResults.filter(r => r.status === 'skip').length;
    const total = this.testResults.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️ Skipped: ${skipped}`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => r.status === 'fail')
        .forEach(r => console.log(`   - ${r.test}: ${r.message}`));
    }
    
    const successRate = ((passed / (total - skipped)) * 100).toFixed(1);
    console.log(`\n🎯 Success Rate: ${successRate}%`);
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! The application is fully functional.');
    } else {
      console.log('\n⚠️ Some tests failed. Please check the issues above.');
    }
  }
}

// Export for use in development
export default IntegrationTest;
