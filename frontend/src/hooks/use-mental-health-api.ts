import { useState, useCallback } from 'react';
import {
  MentalHealthTest,
  TestResultResponse,
  TestQuestion,
  TestResultHistoryResponse,
  DiaryFrequencyResponse,
  getActiveTests,
  getAllTests,
  getTestById,
  getTestQuestions,
  submitTestResult as submitTestResultAPI,
  getUserTestResults,
  getUserTestResultsByTest,
  getTestResult,
  deleteTestResult as deleteTestResultAPI,
  getTestResultHistory,
  getDiaryFrequency,
} from 'src/utils/mental-health-api';

export function useMentalHealthAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all active tests
  const fetchActiveTests = useCallback(async (): Promise<MentalHealthTest[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveTests();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch tests';
      setError(errorMsg);
      console.error('Error fetching active tests:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all tests
  const fetchAllTests = useCallback(async (): Promise<MentalHealthTest[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTests();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch tests';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a specific test by ID
  const fetchTestById = useCallback(async (testId: string): Promise<MentalHealthTest> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTestById(testId);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch test';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch questions for a specific test
  const fetchTestQuestions = useCallback(async (testId: string): Promise<TestQuestion[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTestQuestions(testId);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch test questions';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Submit test result
  const submitTestResult = useCallback(
    async (
      testId: string,
      answers: Record<string, string | number>
    ): Promise<TestResultResponse> => {
      try {
        setLoading(true);
        setError(null);
        const result = await submitTestResultAPI(testId, answers);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to submit test result';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch user's test results
  const fetchUserTestResults = useCallback(async (): Promise<TestResultResponse[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserTestResults();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch test results';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's test results for a specific test
  const fetchUserTestResultsByTest = useCallback(
    async (testId: string): Promise<TestResultResponse[]> => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserTestResultsByTest(testId);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch test results';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get a specific test result
  const fetchTestResult = useCallback(async (resultId: string): Promise<TestResultResponse> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTestResult(resultId);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch test result';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete test result
  const deleteTestResult = useCallback(async (resultId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteTestResultAPI(resultId);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete test result';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch test result history for analytics
  const fetchTestResultHistory = useCallback(async (): Promise<TestResultHistoryResponse> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTestResultHistory();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch test result history';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch diary frequency for analytics
  const fetchDiaryFrequency = useCallback(async (): Promise<DiaryFrequencyResponse> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDiaryFrequency();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch diary frequency';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchActiveTests,
    fetchAllTests,
    fetchTestById,
    fetchTestQuestions,
    submitTestResult,
    fetchUserTestResults,
    fetchUserTestResultsByTest,
    fetchTestResult,
    deleteTestResult,
    fetchTestResultHistory,
    fetchDiaryFrequency,
    loading,
    error,
    setError,
  };
}
