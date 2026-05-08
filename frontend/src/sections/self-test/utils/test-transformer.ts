import {
  MentalHealthTest as APITest,
  TestQuestion,
  QuestionOption,
} from 'src/utils/mental-health-api';
import { MentalHealthTest, MentalHealthQuestion } from 'src/_mock/_self-test';

/**
 * Transform API test response to frontend format
 */
export const transformAPITestToFrontend = (apiTest: APITest): MentalHealthTest => {
  // Transform questions from API format to frontend format
  // Handle case where questions might not be included in list responses
  const transformedQuestions: MentalHealthQuestion[] = apiTest.questions
    ? apiTest.questions.map((q) => ({
        id: q.id,
        question: q.questionText,
        options: q.options.map((opt) => ({
          label: opt.optionText,
          value: opt.optionValue,
        })),
      }))
    : [];

  return {
    id: apiTest.id,
    name: apiTest.name,
    shortName: apiTest.shortName || apiTest.name.substring(0, 20),
    description: apiTest.description,
    duration:
      typeof apiTest.duration === 'number'
        ? `${apiTest.duration} minutes`
        : apiTest.duration || '5-10 minutes',
    totalQuestions: apiTest.totalQuestions || transformedQuestions.length || 0,
    questions: transformedQuestions,
    // Default scoring guide when backend doesn't provide one
    scoringGuide: {
      minScore: 0,
      maxScore: 100,
      categories: [
        {
          range: [0, 20] as [number, number],
          level: 'Normal',
          color: '#00B074',
          description: 'You are doing well.',
        },
        {
          range: [21, 40] as [number, number],
          level: 'Mild',
          color: '#FFC107',
          description: 'You may experience some mild symptoms.',
        },
        {
          range: [41, 60] as [number, number],
          level: 'Moderate',
          color: '#FF9800',
          description: 'Your symptoms are moderate. Consider seeking support.',
        },
        {
          range: [61, 80] as [number, number],
          level: 'Severe',
          color: '#FF6B6B',
          description: 'Your symptoms are severe. Please seek professional help.',
        },
        {
          range: [81, 100] as [number, number],
          level: 'Very Severe',
          color: '#D32F2F',
          description: 'Your symptoms are very severe. Urgent professional help is recommended.',
        },
      ],
    },
    dimensions: apiTest.name.includes('DASS') ? ['Depression', 'Anxiety', 'Stress'] : [],
  };
};

/**
 * Get color by level name
 */
export const getColorByLevel = (level: string): string => {
  const colorMap: Record<string, string> = {
    Normal: '#00B074',
    Mild: '#FFC107',
    Moderate: '#FF9800',
    Severe: '#FF6B6B',
    'Very Severe': '#D32F2F',
    MINIMAL: '#00B074',
    MILD: '#FFC107',
    MODERATE: '#FF9800',
    SEVERE: '#FF6B6B',
    VERY_SEVERE: '#D32F2F',
  };
  return colorMap[level] || '#666';
};

/**
 * Get description by level name
 */
export const getDescriptionByLevel = (level: string): string => {
  const descMap: Record<string, string> = {
    Normal: 'You are doing well.',
    Mild: 'You may experience some mild symptoms.',
    Moderate: 'Your symptoms are moderate. Consider seeking support.',
    Severe: 'Your symptoms are severe. Please seek professional help.',
    'Very Severe': 'Your symptoms are very severe. Urgent professional help is recommended.',
    MINIMAL: 'You are doing well.',
    MILD: 'You may experience some mild symptoms.',
    MODERATE: 'Your symptoms are moderate. Consider seeking support.',
    SEVERE: 'Your symptoms are severe. Please seek professional help.',
    VERY_SEVERE: 'Your symptoms are very severe. Urgent professional help is recommended.',
  };
  return descMap[level] || '';
};
