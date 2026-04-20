import { sub, format } from 'date-fns';

export interface IDiaryEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood: 'happy' | 'sad' | 'neutral' | 'stressed' | 'excited' | 'calm';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock mood options
export const MOOD_OPTIONS = [
  { value: 'happy', label: 'Happy', color: '#FFD700', icon: '😊' },
  { value: 'sad', label: 'Sad', color: '#4A90E2', icon: '😢' },
  { value: 'neutral', label: 'Neutral', color: '#95989A', icon: '😐' },
  { value: 'stressed', label: 'Stressed', color: '#E74C3C', icon: '😰' },
  { value: 'excited', label: 'Excited', color: '#F39C12', icon: '🤩' },
  { value: 'calm', label: 'Calm', color: '#27AE60', icon: '😌' },
];

// Generate mock diary entries for the past 30 days
const generateMockDiaries = (): IDiaryEntry[] => {
  const entries: IDiaryEntry[] = [];

  const diaryTitles = [
    'A Beautiful Day',
    'Reflection on Life',
    'New Beginnings',
    'Work and Challenges',
    'Family Time',
    'Personal Growth',
    'Random Thoughts',
    'Day with Friends',
    'Weather and Mood',
    'Goals for Tomorrow',
    'Learning Something New',
    'Quiet Evening',
    'Productive Day',
    'Self-Care Sunday',
    'Week Review',
    'Dreams and Aspirations',
    'Gratitude List',
    'Challenges Overcome',
    'Moments of Joy',
    'Evening Reflection',
  ];

  const diaryContents = [
    'Today was a wonderful day. I spent time with people I care about and felt truly present in the moment. The weather was perfect, and I took a long walk in nature. I realized how important it is to appreciate the simple things in life.',
    "I have been thinking a lot about my goals and what I want to achieve this year. It's time to take action and start working towards them. I am excited about the possibilities that lie ahead.",
    'Work was challenging today, but I managed to overcome the obstacles. I learned something new and improved my skills. I am grateful for the opportunity to grow and develop.',
    'Spent a beautiful afternoon with my family. We laughed together, shared stories, and created new memories. These moments remind me of what truly matters in life.',
    'Today was one of those days where everything went smoothly. I felt productive and accomplished my goals. I am proud of myself for staying focused and committed.',
    'Took time for self-care today. I read a good book, had a relaxing bath, and meditated. I feel refreshed and rejuvenated. Taking care of my mental health is so important.',
    'Went for a morning jog and felt energized. The fresh air and movement cleared my mind. I started the day on a positive note.',
    "Had a deep conversation with a close friend. We discussed our dreams and challenges. It's comforting to have people who understand and support us.",
    'Today I tried something new and it turned out great! I am not afraid of step outside my comfort zone anymore. Growth happens when we challenge ourselves.',
    'Feeling gratitude for all the good things in my life. I made a list of things I am thankful for, and it reminded me of how blessed I am.',
    'Faced a difficult situation but came out stronger. I learned that challenges are just opportunities in disguise. I am proud of how I handled it.',
    'Had a relaxing evening at home. Watched my favorite movie and enjoyed some quiet time. Sometimes the best moments are the simple ones.',
    'Started working on a new project that excites me. I can feel the passion and energy flowing through me. This is something I truly believe in.',
    "Reflected on my past year and how much I've grown. I am excited about the future and the person I am becoming.",
    'Spent time in nature today. The beauty around me inspired me to live more mindfully and appreciate each moment.',
  ];

  const tags = [
    ['work', 'challenges'],
    ['personal', 'growth'],
    ['family', 'love'],
    ['friends', 'happiness'],
    ['health', 'wellness'],
    ['nature', 'peace'],
    ['learning', 'development'],
    ['goals', 'motivation'],
    ['gratitude', 'reflection'],
    ['creativity', 'inspiration'],
  ];

  const moods: Array<'happy' | 'sad' | 'neutral' | 'stressed' | 'excited' | 'calm'> = [
    'happy',
    'sad',
    'neutral',
    'stressed',
    'excited',
    'calm',
  ];

  for (let i = 0; i < 25; i++) {
    const date = sub(new Date(), { days: i });
    const entryDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    entries.push({
      id: `diary-${i}`,
      date: entryDate,
      title: diaryTitles[i % diaryTitles.length],
      content: diaryContents[i % diaryContents.length],
      mood: moods[i % moods.length],
      tags: tags[i % tags.length],
      createdAt: date,
      updatedAt: date,
    });
  }

  return entries;
};

export const _diaryData = generateMockDiaries();
