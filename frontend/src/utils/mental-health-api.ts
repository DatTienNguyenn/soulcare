import axiosInstance from 'src/utils/axios';

export interface QuestionOption {
  id?: string;
  optionText: string;
  optionValue: number;
  optionOrder: number;
}

export interface TestQuestion {
  id: string;
  questionText: string;
  questionType: string;
  questionOrder: number;
  scoreWeight: number;
  options: QuestionOption[];
}

export interface ScoringGuide {
  minScore: number;
  maxScore: number;
  levels: Array<{
    level: string;
    minScore: number;
    maxScore: number;
    color: string;
    description: string;
  }>;
}

export interface MentalHealthTest {
  id: string;
  name: string;
  description: string;
  questions?: TestQuestion[]; // Optional - not always included in list endpoints
  scoringGuide?: ScoringGuide; // Optional - returned as string in list, parsed in detail
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  // Fields from MentalHealthTestResponse
  shortName?: string;
  duration?: number;
  totalQuestions?: number;
  minScore?: number;
  maxScore?: number;
  status?: string;
}

export interface TestResultRequest {
  testId: string;
  answers: Record<string, number | string>;
}

export interface TestResultResponse {
  id: string;
  testId: string;
  patientId: string;
  testName: string;
  score: number;
  maxScore: number;
  level: string;
  description?: string;
  answers: Record<string, string | number>;
  createdAt: string;
  updatedAt: string;
}

// Use the shared axios instance which has Authorization header set automatically
const apiClient = axiosInstance;

// Transform API response to include UI properties
const transformTest = (test: MentalHealthTest): MentalHealthTest => {
  return {
    ...test,
    shortName: test.shortName || test.name.substring(0, 20),
    duration: test.duration || 10, // Default 10 minutes if not provided
    totalQuestions: test.totalQuestions || test.questions?.length || 0,
  };
};

// Fetch all active tests
export const getActiveTests = async (): Promise<MentalHealthTest[]> => {
  try {
    const response = await apiClient.get<MentalHealthTest[]>('/api/v1/tests/active');
    return response.data.map(transformTest);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch active tests');
  }
};

// Fetch all tests
export const getAllTests = async (): Promise<MentalHealthTest[]> => {
  try {
    const response = await apiClient.get<MentalHealthTest[]>('/api/v1/tests');
    return response.data.map(transformTest);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch tests');
  }
};

// Fetch a specific test by ID
export const getTestById = async (testId: string): Promise<MentalHealthTest> => {
  try {
    const response = await apiClient.get<MentalHealthTest>(`/api/v1/tests/${testId}`);
    return transformTest(response.data);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch test');
  }
};

// Fetch questions for a specific test
export const getTestQuestions = async (testId: string): Promise<TestQuestion[]> => {
  try {
    const response = await apiClient.get<TestQuestion[]>(`/api/v1/tests/${testId}/questions`);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch test questions');
  }
};

// Submit test result
export const submitTestResult = async (
  testId: string,
  answers: Record<string, number | string>
): Promise<TestResultResponse> => {
  try {
    const response = await apiClient.post<TestResultResponse>('/api/v1/test-results', {
      testId,
      answers,
    });
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to submit test result');
  }
};

// Fetch user's test results
export const getUserTestResults = async (): Promise<TestResultResponse[]> => {
  try {
    const response = await apiClient.get<TestResultResponse[]>('/api/v1/test-results');
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch test results');
  }
};

// Fetch user's test results for a specific test
export const getUserTestResultsByTest = async (testId: string): Promise<TestResultResponse[]> => {
  try {
    const response = await apiClient.get<TestResultResponse[]>(
      `/api/v1/test-results/test/${testId}`
    );
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch test results');
  }
};

// Get a specific test result
export const getTestResult = async (resultId: string): Promise<TestResultResponse> => {
  try {
    const response = await apiClient.get<TestResultResponse>(`/api/v1/test-results/${resultId}`);
    return response.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to fetch test result');
  }
};

// Delete test result
export const deleteTestResult = async (resultId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/v1/test-results/${resultId}`);
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to delete test result');
  }
};
