# LexiK3 - Vocabulary Learning App

A beautiful React + TailwindCSS landing page for learning 6 new English words every day.

## Features

- **Daily Vocabulary**: Displays 6 carefully curated English words with definitions and synonyms
- **Responsive Design**: 
  - Mobile: 1 column layout
  - Tablet: 2 column layout  
  - Desktop: 3 column layout
- **Interactive**: "Next Day" button to cycle through different word sets
- **Modern UI**: Clean design with hover effects, shadows, and smooth transitions
- **Mock Data**: 3 sets of 6 words each (18 total words) covering different themes

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
│   └── WordCard.jsx      # Individual vocabulary card component
├── data/
│   └── wordsData.js      # Mock vocabulary data (3 sets of 6 words)
├── App.jsx               # Main application component
├── main.jsx              # React entry point
└── index.css             # Global styles and Tailwind imports
```

## Word Sets

1. **Day 1**: Advanced Vocabulary (serendipity, ephemeral, ubiquitous, etc.)
2. **Day 2**: Business & Professional (paradigm, synergy, leverage, etc.)
3. **Day 3**: Nature & Science (photosynthesis, biodiversity, ecosystem, etc.)

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
