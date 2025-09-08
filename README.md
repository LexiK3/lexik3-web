# LexiK3 Web Application

A modern vocabulary learning application built with React, TypeScript, and Redux Toolkit, following Clean Architecture principles and Test-Driven Development (TDD) practices.

## 🚀 Features

- **Authentication System**: JWT-based authentication with token refresh
- **Learning Sessions**: Interactive word learning with spaced repetition
- **Progress Tracking**: Comprehensive statistics and achievement system
- **Responsive Design**: Modern UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **State Management**: Redux Toolkit with persistence
- **Testing**: Jest and React Testing Library setup
- **Mock API**: Development-ready mock service

## 🏗️ Architecture

The application follows Clean Architecture principles with clear separation of concerns:

```
src/
├── components/          # UI Components
│   ├── common/         # Reusable components
│   ├── auth/           # Authentication components
│   ├── learning/       # Learning session components
│   └── progress/       # Progress tracking components
├── pages/              # Page components
├── services/           # Business logic and API
│   ├── api/           # API client and endpoints
│   ├── auth/          # Authentication service
│   └── mock/          # Mock API for development
├── store/              # Redux store and slices
│   ├── slices/        # Redux slices
│   ├── middleware/    # Custom middleware
│   └── hooks.ts       # Typed Redux hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **State Management**: Redux Toolkit, Redux Persist
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Forms**: React Hook Form, Yup validation
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lexik3-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🏃‍♂️ Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://api.lexik3.com/v1
REACT_APP_ENVIRONMENT=development
```

### Mock API

The application includes a comprehensive mock API service for development and testing. To use the mock API:

1. The mock service is automatically used in development mode
2. Mock data includes users, books, learning sessions, and progress data
3. All API calls are simulated with realistic delays

## 📱 Features Overview

### Authentication
- User registration and login
- JWT token management with automatic refresh
- Protected routes and role-based access
- Password reset functionality

### Learning System
- Interactive word cards with definitions and examples
- Spaced repetition algorithm
- Hint system and confidence tracking
- Session pause/resume functionality
- Progress tracking per word and book

### Progress Tracking
- Daily activity monitoring
- Comprehensive statistics and analytics
- Achievement system with different rarities
- Visual progress charts and graphs
- Streak tracking and consistency metrics

### User Interface
- Responsive design for all screen sizes
- Dark/light theme support
- Accessible components with proper ARIA labels
- Loading states and error handling
- Toast notifications and modals

## 🧩 Component Structure

### Common Components
- `Button` - Reusable button with variants and states
- `Input` - Form input with validation and error handling
- `Card` - Container component with different styles

### Authentication Components
- `LoginForm` - User login form with validation
- `ProtectedRoute` - Route protection wrapper
- `AuthService` - Authentication business logic

### Learning Components
- `WordCard` - Interactive word learning card
- `LearningSession` - Complete learning session wrapper
- `SessionProgress` - Progress tracking during sessions

### Progress Components
- `ProgressChart` - Data visualization components
- `AchievementCard` - Achievement display and progress
- `StatisticsPanel` - Comprehensive stats display

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh
- Secure password handling
- Input validation and sanitization
- XSS protection
- CSRF protection

## 📊 State Management

The application uses Redux Toolkit for state management with the following slices:

- **Auth Slice**: User authentication and session management
- **Books Slice**: Book catalog and enrollment management
- **Learning Slice**: Learning sessions and word progress
- **Progress Slice**: User progress and statistics
- **UI Slice**: Application UI state and preferences

## 🎨 Design System

The application follows a consistent design system with:

- **Colors**: Blue primary, gray neutrals, semantic colors
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent spacing scale (4px base unit)
- **Components**: Reusable, accessible components
- **Icons**: Consistent icon usage throughout

## 🚀 Performance Optimizations

- Code splitting with React.lazy
- Memoization with React.memo and useMemo
- Optimized re-renders with proper dependency arrays
- Lazy loading of non-critical components
- Efficient state updates with Redux Toolkit

## 🧪 Testing Strategy

The application follows a comprehensive testing strategy:

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Full user flow testing (planned)
- **Mock Services**: Isolated testing with mock data
- **Coverage**: Aim for 80%+ code coverage

## 📈 Future Enhancements

- [ ] Real-time collaboration features
- [ ] Social learning features
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Offline support with PWA
- [ ] AI-powered learning recommendations
- [ ] Multi-language support
- [ ] Advanced spaced repetition algorithms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ using React, TypeScript, and modern web technologies.