// Quiz data structure and sample questions
export const quizTypes = {
  DEFINITION_MATCH: 'definition_match',
  SYNONYM_MATCH: 'synonym_match',
  EXAMPLE_COMPLETION: 'example_completion',
  TRANSLATION: 'translation'
};

export const generateQuizQuestions = (wordsData, selectedLessons, quizType) => {
  const questions = [];
  
  // Get words from selected lessons
  const selectedWords = [];
  selectedLessons.forEach(lessonIndex => {
    const dayIndex1 = lessonIndex * 2; // Part 1
    const dayIndex2 = lessonIndex * 2 + 1; // Part 2
    
    if (wordsData[dayIndex1]) {
      selectedWords.push(...wordsData[dayIndex1]);
    }
    if (wordsData[dayIndex2]) {
      selectedWords.push(...wordsData[dayIndex2]);
    }
  });

  // Shuffle words and take up to 10 for quiz
  const shuffledWords = [...selectedWords].sort(() => Math.random() - 0.5);
  const quizWords = shuffledWords.slice(0, 10);

  switch (quizType) {
    case quizTypes.DEFINITION_MATCH:
      return generateDefinitionMatchQuestions(quizWords);
    case quizTypes.SYNONYM_MATCH:
      return generateSynonymMatchQuestions(quizWords);
    case quizTypes.EXAMPLE_COMPLETION:
      return generateExampleCompletionQuestions(quizWords);
    case quizTypes.TRANSLATION:
      return generateTranslationQuestions(quizWords);
    default:
      return generateDefinitionMatchQuestions(quizWords);
  }
};


const generateDefinitionMatchQuestions = (quizWords) => {
  return quizWords.map((word, index) => {
    // Get 3 random wrong words for options
    const wrongWords = quizWords
      .filter(w => w.word !== word.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word);
    
    const options = [word.word, ...wrongWords].sort(() => Math.random() - 0.5);
    
    return {
      id: `def_${index}`,
      type: 'definition_match',
      question: `Match the word with its definition:`,
      word: word.word,
      definition: word.definition,
      options: options,
      correctAnswer: word.word,
      points: 10
    };
  });
};

const generateSynonymMatchQuestions = (quizWords) => {
  return quizWords.map((word, index) => {
    const synonyms = word.synonyms.split(', ').slice(0, 3); // Take first 3 synonyms
    const correctSynonym = synonyms[0];
    
    // Get wrong synonyms from other words
    const wrongSynonyms = quizWords
      .filter(w => w.word !== word.word)
      .flatMap(w => w.synonyms.split(', '))
      .filter(syn => !synonyms.includes(syn))
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const options = [correctSynonym, ...wrongSynonyms].sort(() => Math.random() - 0.5);
    
    return {
      id: `syn_${index}`,
      type: 'synonym_match',
      question: `What is a synonym for "${word.word}"?`,
      word: word.word,
      synonyms: synonyms,
      options: options,
      correctAnswer: correctSynonym,
      points: 10
    };
  });
};

const generateExampleCompletionQuestions = (quizWords) => {
  return quizWords.map((word, index) => {
    const example = word.examples[0]; // Use first example
    const blankedExample = example.replace(new RegExp(word.word, 'gi'), '_____');
    
    // Get 3 random wrong words for options
    const wrongWords = quizWords
      .filter(w => w.word !== word.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word);
    
    const options = [word.word, ...wrongWords].sort(() => Math.random() - 0.5);
    
    return {
      id: `ex_${index}`,
      type: 'example_completion',
      question: `Complete the sentence:`,
      example: blankedExample,
      options: options,
      correctAnswer: word.word,
      word: word,
      points: 10
    };
  });
};

const generateTranslationQuestions = (quizWords) => {
  return quizWords.map((word, index) => {
    // Get 3 random wrong words for options
    const wrongWords = quizWords
      .filter(w => w.word !== word.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.word);
    
    const options = [word.word, ...wrongWords].sort(() => Math.random() - 0.5);
    
    return {
      id: `trans_${index}`,
      type: 'translation',
      question: `What is the English translation of "${word.persian.word}"?`,
      persianWord: word.persian.word,
      options: options,
      correctAnswer: word.word,
      word: word,
      points: 10
    };
  });
};

export const quizTypeInfo = {
  [quizTypes.DEFINITION_MATCH]: {
    name: 'Definition Match',
    description: 'Match words with their definitions',
    icon: '📖',
    color: 'green'
  },
  [quizTypes.SYNONYM_MATCH]: {
    name: 'Synonym Match',
    description: 'Find synonyms for given words',
    icon: '🔗',
    color: 'purple'
  },
  [quizTypes.EXAMPLE_COMPLETION]: {
    name: 'Example Completion',
    description: 'Complete sentences with missing words',
    icon: '✏️',
    color: 'orange'
  },
  [quizTypes.TRANSLATION]: {
    name: 'Translation',
    description: 'Translate Persian words to English',
    icon: '🌐',
    color: 'red'
  }
};
