# LexiK3 - Vocabulary Learning App

[![Deploy to GitHub Pages](https://github.com/yourusername/lexik3-web/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/lexik3-web/actions/workflows/deploy.yml)

A beautiful React + TailwindCSS landing page for learning 6 new English words every day.

## Features

- **Daily Vocabulary**: Displays 6 carefully curated English words with definitions and synonyms
- **Interactive Quiz System**: 
  - 4 different quiz types (Definition Match, Synonym Match, Example Completion, Translation)
  - Select any combination of lessons for custom quizzes
  - Real-time scoring and progress tracking
  - Timer-based quizzes with automatic submission
- **Responsive Design**: 
  - Mobile: 1 column layout
  - Tablet: 2 column layout  
  - Desktop: 3 column layout
- **Interactive**: "Next Day" button to cycle through different word sets
- **Modern UI**: Clean design with hover effects, shadows, and smooth transitions
- **Bilingual Support**: English and Persian translations for better learning
- **Comprehensive Data**: Multiple lesson sets with 6 words each covering various themes

## Tech Stack

- React 18 with functional components and hooks
- TailwindCSS for styling
- Vite for development and building
- No backend required - all data is client-side

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and visit `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── WordCard.jsx           # Individual vocabulary card component
│   ├── LandingPage.jsx        # Main landing page with lesson selection
│   ├── LessonPage.jsx         # Individual lesson display page
│   ├── LessonPicker.jsx       # Modal for selecting lessons
│   ├── QuizPicker.jsx         # Modal for creating custom quizzes
│   ├── QuizPage.jsx           # Quiz interface with different question types
│   └── ...                    # Other UI components
├── data/
│   ├── wordsData.js           # Vocabulary data (multiple lesson sets)
│   └── quizData.js            # Quiz generation logic and question types
├── App.jsx                    # Main application component with routing
├── main.jsx                   # React entry point
└── index.css                  # Global styles and Tailwind imports
```

## Quiz Types

1. **Definition Match**: Match words with their correct definitions
2. **Synonym Match**: Find synonyms for given words
3. **Example Completion**: Complete sentences with missing words
4. **Translation**: Translate Persian words to English

## Word Sets

The app includes multiple lesson sets with 6 words each, covering various themes like:
- Advanced Vocabulary
- Business & Professional terms
- Nature & Science concepts
- And many more...

## Customization

- Add more word sets by extending the `wordsData` array in `src/data/wordsData.js`
- Modify colors in `tailwind.config.js` under the `colors` section
- Update the header tagline in `src/App.jsx`
- Adjust responsive breakpoints in the grid classes

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: The app automatically builds and deploys when you push to the `main` branch
2. **GitHub Actions**: Uses GitHub Actions workflow (`.github/workflows/deploy.yml`)
3. **Live URL**: Your app will be available at `https://yourusername.github.io/lexik3-web`

### Setup Instructions:

1. **Update Repository Name**: 
   - Change `yourusername` in `package.json` homepage field to your GitHub username
   - Update the `base` path in `vite.config.js` to match your repository name

2. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Navigate to Pages section
   - Select "GitHub Actions" as the source
   - The workflow will automatically deploy your app

3. **Push to Main**:
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin main
   ```

The deployment will start automatically and your app will be live within a few minutes!
