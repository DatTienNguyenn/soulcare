import axiosInstance, { endpoints } from './axios';

// Type definitions
export interface IDiaryEntry {
  id: string;
  date: Date;
  patientId?: string;
  title: string;
  content: string;
  mood: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm' | 'stress' | 'stressed';
  tags: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt?: Date;
  updatedAt?: Date;
}

// Request type for creating/updating diaries (id is not needed for new entries)
export interface IDiaryRequest {
  title: string;
  content: string;
  mood: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm' | 'stress' | 'stressed';
  tags: string[];
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  diaryDate: Date; // The date the diary entry is for
}

// Helper function to format date as YYYY-MM-DD using local timezone
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to convert API response to IDiaryEntry
const convertApiResponse = (data: any): IDiaryEntry => {
  return {
    id: data.id,
    date: data.diaryDate ? new Date(data.diaryDate) : new Date(),
    patientId: data.patientId,
    title: data.title,
    content: data.content,
    mood: data.mood?.toLowerCase() || 'calm',
    tags: data.hashtag ? data.hashtag.split(',').filter((t: string) => t.trim()) : [],
    status: data.status,
    createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
    updatedAt: data.lastUpdate ? new Date(data.lastUpdate) : undefined,
  };
};

// Create a new diary entry
export const createDiary = async (data: IDiaryRequest) => {
  const response = await axiosInstance.post(endpoints.diary.create, {
    title: data.title,
    content: data.content,
    mood: data.mood.toUpperCase(),
    tags: data.tags || [],
    status: data.status || 'PUBLISHED',
    diaryDate: formatLocalDate(data.diaryDate), // Use local date, not UTC
  });
  return convertApiResponse(response.data);
};

// Get all diary entries for the current user
export const getDiaries = async () => {
  const response = await axiosInstance.get(endpoints.diary.list);
  return Array.isArray(response.data)
    ? response.data.map(convertApiResponse)
    : [convertApiResponse(response.data)];
};

// Get a single diary entry by ID
export const getDiaryById = async (id: string) => {
  const response = await axiosInstance.get(endpoints.diary.details(id));
  return convertApiResponse(response.data);
};

// Update a diary entry
export const updateDiary = async (id: string, data: IDiaryRequest) => {
  const response = await axiosInstance.put(endpoints.diary.update(id), {
    title: data.title,
    content: data.content,
    mood: data.mood.toUpperCase(),
    tags: data.tags || [],
    status: data.status || 'PUBLISHED',
    diaryDate: formatLocalDate(data.diaryDate), // Use local date, not UTC
  });
  return convertApiResponse(response.data);
};

// Delete a diary entry
export const deleteDiary = async (id: string) => {
  const response = await axiosInstance.delete(endpoints.diary.delete(id));
  return response.data;
};

// Get diary entries by date range
export const getDiariesByRange = async (startDate: Date, endDate: Date) => {
  const response = await axiosInstance.get(endpoints.diary.range, {
    params: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });
  return Array.isArray(response.data)
    ? response.data.map(convertApiResponse)
    : [convertApiResponse(response.data)];
};
