export interface MentalHealthQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: number;
  }[];
}

export interface MentalHealthTest {
  id: string;
  name: string;
  shortName: string;
  description: string;
  duration: string;
  totalQuestions: number;
  questions: MentalHealthQuestion[];
  scoringGuide: {
    minScore: number;
    maxScore: number;
    categories: Array<{
      range: [number, number];
      level: 'Normal' | 'Mild' | 'Moderate' | 'Severe' | 'Very Severe';
      color: string;
      description: string;
    }>;
  };
  dimensions?: string[];
}

export interface TestResult {
  testId: string;
  testName: string;
  score: number;
  maxScore: number;
  level: string;
  color: string;
  description: string;
  timestamp: Date;
  answers: Record<string, string | number>;
}

// DASS-21 Test
const DASS21: MentalHealthTest = {
  id: 'dass-21',
  name: 'Depression Anxiety Stress Scale-21',
  shortName: 'DASS-21',
  description:
    'A 21-item self-report questionnaire designed to measure the negative emotional states of depression, anxiety, and stress.',
  duration: '3-5 minutes',
  totalQuestions: 21,
  dimensions: ['Depression', 'Anxiety', 'Stress'],
  questions: [
    {
      id: 'dass1',
      question: 'I found it hard to wind down',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass2',
      question: 'I was aware of dryness of my mouth',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass3',
      question: 'I could not experience good feelings at all',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass4',
      question:
        'I experienced breathing difficulty (eg, excessively rapid breathing, breathlessness in the absence of physical exertion)',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass5',
      question: 'I found it difficult to work up the initiative to do things',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass6',
      question: 'I tended to over-react to situations',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass7',
      question: 'I experienced trembling (eg, in the hands)',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass8',
      question: 'I was concerned about situations in which I might panic and appear foolish',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass9',
      question: 'I felt that I had nothing to look forward to',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass10',
      question: 'I found myself getting scared rather easily',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass11',
      question: 'I felt that life was meaningless',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass12',
      question: 'I found it hard to settle down',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass13',
      question: 'I had difficulty in swallowing',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass14',
      question: 'I could not seem to get going',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass15',
      question: 'I felt depressed and sad',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass16',
      question: 'I was intolerant of anything that kept me from getting on with what I was doing',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass17',
      question: 'I felt terrified or panicky',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass18',
      question: 'I could not experience any positive feeling at all',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass19',
      question: 'I found it difficult to tolerate interruptions to what I was doing',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass20',
      question: 'I felt scared or anxious without any good reason',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
    {
      id: 'dass21',
      question: 'I felt I was close to panic or going crazy',
      options: [
        { label: 'Did not apply to me at all', value: 0 },
        { label: 'Applied to me to some degree', value: 1 },
        { label: 'Applied to me a considerable degree', value: 2 },
        { label: 'Applied to me very much, or most of the time', value: 3 },
      ],
    },
  ],
  scoringGuide: {
    minScore: 0,
    maxScore: 63,
    categories: [
      {
        range: [0, 9],
        level: 'Normal',
        color: '#27AE60',
        description:
          'Your score indicates normal emotional well-being. Continue maintaining healthy habits.',
      },
      {
        range: [10, 13],
        level: 'Mild',
        color: '#F39C12',
        description:
          'You may be experiencing mild symptoms. Consider stress management techniques.',
      },
      {
        range: [14, 20],
        level: 'Moderate',
        color: '#E67E22',
        description:
          'You show moderate symptoms. It may be helpful to talk to a mental health professional.',
      },
      {
        range: [21, 27],
        level: 'Severe',
        color: '#E74C3C',
        description:
          'You are experiencing severe symptoms. Please consider seeking professional help.',
      },
      {
        range: [28, 63],
        level: 'Very Severe',
        color: '#C0392B',
        description:
          'Your score indicates very severe symptoms. It is strongly recommended to seek professional support immediately.',
      },
    ],
  },
};

// PHQ-9 Test
const PHQ9: MentalHealthTest = {
  id: 'phq-9',
  name: 'Patient Health Questionnaire-9',
  shortName: 'PHQ-9',
  description: 'A brief screening tool and severity measure for depression.',
  duration: '2-3 minutes',
  totalQuestions: 9,
  questions: [
    {
      id: 'phq1',
      question: 'Little interest or pleasure in doing things',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'phq2',
      question: 'Feeling down, depressed, or hopeless',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'phq3',
      question: 'Trouble falling or staying asleep, or sleeping too much',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'phq4',
      question: 'Feeling tired or having little energy',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'phq5',
      question: 'Poor appetite or overeating',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'phq6',
      question: 'Feeling bad about yourself, or that you are a failure',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'phq7',
      question: 'Trouble concentrating on things, such as reading or watching television',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'phq8',
      question: 'Moving or speaking so slowly, or the opposite, being fidgety',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'phq9',
      question: 'Thoughts that you would be better off dead',
      options: [
        { label: 'Not at all', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'More than half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
  ],
  scoringGuide: {
    minScore: 0,
    maxScore: 27,
    categories: [
      {
        range: [0, 4],
        level: 'Normal',
        color: '#27AE60',
        description: 'Minimal depression symptoms.',
      },
      {
        range: [5, 9],
        level: 'Mild',
        color: '#F39C12',
        description: 'Mild depression symptoms.',
      },
      {
        range: [10, 14],
        level: 'Moderate',
        color: '#E67E22',
        description: 'Moderate depression symptoms.',
      },
      {
        range: [15, 19],
        level: 'Severe',
        color: '#E74C3C',
        description: 'Severe depression symptoms.',
      },
      {
        range: [20, 27],
        level: 'Severe',
        color: '#C0392B',
        description: 'Severe depression symptoms.',
      },
    ],
  },
};

// GAD-7 Test
const GAD7: MentalHealthTest = {
  id: 'gad-7',
  name: 'Generalized Anxiety Disorder-7',
  shortName: 'GAD-7',
  description: 'A brief screening tool and severity measure for generalized anxiety disorder.',
  duration: '2-3 minutes',
  totalQuestions: 7,
  questions: [
    {
      id: 'gad1',
      question: 'Feeling nervous, anxious or on edge',
      options: [
        { label: 'Not at all sure', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'Over half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'gad2',
      question: 'Not being able to stop or control worrying',
      options: [
        { label: 'Not at all sure', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'Over half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'gad3',
      question: 'Worrying too much about different things',
      options: [
        { label: 'Not at all sure', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'Over half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'gad4',
      question: 'Trouble relaxing',
      options: [
        { label: 'Not at all sure', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'Over half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'gad5',
      question: 'Being so restless that it is hard to sit still',
      options: [
        { label: 'Not at all sure', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'Over half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'gad6',
      question: 'Becoming easily annoyed or irritable',
      options: [
        { label: 'Not at all sure', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'Over half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
    {
      id: 'gad7',
      question: 'Feeling afraid as if something awful might happen',
      options: [
        { label: 'Not at all sure', value: 0 },
        { label: 'Several days', value: 1 },
        { label: 'Over half the days', value: 2 },
        { label: 'Nearly every day', value: 3 },
      ],
    },
  ],
  scoringGuide: {
    minScore: 0,
    maxScore: 21,
    categories: [
      {
        range: [0, 4],
        level: 'Normal',
        color: '#27AE60',
        description: 'Minimal anxiety symptoms.',
      },
      {
        range: [5, 9],
        level: 'Mild',
        color: '#F39C12',
        description: 'Mild anxiety symptoms.',
      },
      {
        range: [10, 14],
        level: 'Moderate',
        color: '#E67E22',
        description: 'Moderate anxiety symptoms.',
      },
      {
        range: [15, 21],
        level: 'Severe',
        color: '#E74C3C',
        description: 'Severe anxiety symptoms.',
      },
    ],
  },
};

export const mentalHealthTests: MentalHealthTest[] = [DASS21, PHQ9, GAD7];

export const getMentalHealthTestById = (id: string): MentalHealthTest | undefined => {
  return mentalHealthTests.find((test) => test.id === id);
};

export const calculateTestScore = (
  test: MentalHealthTest,
  answers: Record<string, number>,
  t?: any
): { score: number; level: string; color: string; description: string } => {
  let totalScore = 0;
  const translate = (key: string, fallback: string) => {
    if (!t) return fallback;
    const result = t(key);
    return result === key ? fallback : result;
  };

  test.questions.forEach((question) => {
    if (answers[question.id] !== undefined) {
      totalScore += answers[question.id];
    }
  });

  const category = test.scoringGuide.categories.find(
    (cat) => totalScore >= cat.range[0] && totalScore <= cat.range[1]
  );

  // Map the level name dynamically if translated versions exist
  const levelKeyMap: Record<string, string> = {
    Normal: 'selfTest.levelNormal',
    Mild: 'selfTest.levelMild',
    Moderate: 'selfTest.levelModerate',
    Severe: 'selfTest.levelSevere',
    'Very Severe': 'selfTest.levelVerySevere',
  };

  const descKeyMap: Record<string, string> = {
    Normal: 'selfTest.descNormal',
    Mild: 'selfTest.descMild',
    Moderate: 'selfTest.descModerate',
    Severe: 'selfTest.descSevere',
    'Very Severe': 'selfTest.descVerySevere',
  };

  const levelName = category?.level || 'Unknown';
  const translatedLevel = levelKeyMap[levelName]
    ? translate(levelKeyMap[levelName], levelName)
    : levelName;
  const translatedDesc = descKeyMap[levelName]
    ? translate(descKeyMap[levelName], category?.description || '')
    : category?.description || '';

  return {
    score: totalScore,
    level: translatedLevel,
    color: category?.color || '#95989A',
    description: translatedDesc,
  };
};
