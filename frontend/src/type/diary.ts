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
  { value: 'stress', label: 'Stressed', color: '#E74C3C', icon: '😰' },
  { value: 'excited', label: 'Excited', color: '#F39C12', icon: '🤩' },
  { value: 'calm', label: 'Calm', color: '#27AE60', icon: '😌' },
];
