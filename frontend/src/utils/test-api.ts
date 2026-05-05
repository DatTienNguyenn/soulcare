import axiosInstance, { endpoints } from './axios';

// Type definitions for Mental Health Tests
export interface IMentalHealthTest {
  id: string;
  name: string;
  shortName: string;
  description: string;
  duration: string;
  totalQuestions: number;
  minScore: number;
  maxScore: number;
  scoringGuide: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

export interface IMentalHealthTestRequest {
  name: string;
  shortName: string;
  description: string;
  duration: string;
  totalQuestions: number;
  minScore: number;
  maxScore: number;
  scoringGuide: string;
  status?: string;
}

export interface ITestResult {
  id: string;
  patientId: string;
  testId: string;
  testName: string;
  score: number;
  maxScore: number;
  level: string;
  description: string;
  answers: Record<string, number>;
  createdAt?: Date;
}

export interface ITestResultRequest {
  testId: string;
  answers: Record<string, number>;
  notes?: string;
}

// Test Management API - Admin endpoints

/**
 * Get all mental health tests (admin)
 */
export const getAllTests = async (): Promise<IMentalHealthTest[]> => {
  const response = await axiosInstance.get('/api/v1/tests');
  return response.data || [];
};

/**
 * Get a specific test by ID (admin)
 */
export const getTestById = async (testId: string): Promise<IMentalHealthTest> => {
  const response = await axiosInstance.get(`/api/v1/tests/${testId}`);
  return response.data;
};

/**
 * Create a new test (admin only)
 */
export const createTest = async (data: IMentalHealthTestRequest): Promise<IMentalHealthTest> => {
  const response = await axiosInstance.post('/api/v1/tests', data);
  return response.data;
};

/**
 * Update a test (admin only)
 */
export const updateTest = async (
  testId: string,
  data: Partial<IMentalHealthTestRequest>
): Promise<IMentalHealthTest> => {
  const response = await axiosInstance.put(`/api/v1/tests/${testId}`, data);
  return response.data;
};

/**
 * Delete a test (admin only)
 */
export const deleteTest = async (testId: string): Promise<void> => {
  await axiosInstance.delete(`/api/v1/tests/${testId}`);
};

/**
 * Deactivate a test (admin only)
 */
export const deactivateTest = async (testId: string): Promise<void> => {
  await axiosInstance.put(`/api/v1/tests/${testId}/deactivate`);
};

// Test Results API - User endpoints

/**
 * Get all active tests (users can see these)
 */
export const getActiveTests = async (): Promise<IMentalHealthTest[]> => {
  const response = await axiosInstance.get('/api/v1/tests/active');
  return response.data || [];
};

/**
 * Submit test answers and save result
 */
export const submitTestResult = async (data: ITestResultRequest): Promise<ITestResult> => {
  const response = await axiosInstance.post('/api/v1/test-results', data);
  return response.data;
};

/**
 * Get all test results for current user
 */
export const getUserTestResults = async (): Promise<ITestResult[]> => {
  const response = await axiosInstance.get('/api/v1/test-results');
  return response.data || [];
};

/**
 * Get test results for a specific test
 */
export const getUserTestResultsByTest = async (testId: string): Promise<ITestResult[]> => {
  const response = await axiosInstance.get(`/api/v1/test-results/test/${testId}`);
  return response.data || [];
};

/**
 * Get a specific test result
 */
export const getTestResultById = async (resultId: string): Promise<ITestResult> => {
  const response = await axiosInstance.get(`/api/v1/test-results/${resultId}`);
  return response.data;
};

/**
 * Delete a test result
 */
export const deleteTestResult = async (resultId: string): Promise<void> => {
  await axiosInstance.delete(`/api/v1/test-results/${resultId}`);
};
