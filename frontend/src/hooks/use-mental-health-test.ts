import { useState, useCallback } from 'react';
import {
  IMentalHealthTest,
  IMentalHealthTestRequest,
  ITestResult,
  ITestResultRequest,
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  deactivateTest,
  getActiveTests,
  submitTestResult,
  getUserTestResults,
  getUserTestResultsByTest,
  getTestResultById,
  deleteTestResult,
} from 'src/utils/test-api';

export const useMentalHealthTest = () => {
  const [tests, setTests] = useState<IMentalHealthTest[]>([]);
  const [testResults, setTestResults] = useState<ITestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin: Fetch all tests
  const fetchAllTests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTests();
      setTests(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tests';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Admin: Fetch a specific test
  const fetchTest = useCallback(async (testId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTestById(testId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch test';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Admin: Create a new test
  const addTest = useCallback(
    async (testData: IMentalHealthTestRequest) => {
      try {
        setLoading(true);
        setError(null);
        const newTest = await createTest(testData);
        setTests([...tests, newTest]);
        return newTest;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create test';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tests]
  );

  // Admin: Update a test
  const editTest = useCallback(
    async (testId: string, testData: Partial<IMentalHealthTestRequest>) => {
      try {
        setLoading(true);
        setError(null);
        const updatedTest = await updateTest(testId, testData);
        setTests(tests.map((t) => (t.id === testId ? updatedTest : t)));
        return updatedTest;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update test';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tests]
  );

  // Admin: Delete a test
  const removeTest = useCallback(
    async (testId: string) => {
      try {
        setLoading(true);
        setError(null);
        await deleteTest(testId);
        setTests(tests.filter((t) => t.id !== testId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete test';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [tests]
  );

  // Admin: Deactivate a test
  const disableTest = useCallback(
    async (testId: string) => {
      try {
        setLoading(true);
        setError(null);
        await deactivateTest(testId);
        setTests(tests.map((t) => (t.id === testId ? { ...t, status: 'INACTIVE' as const } : t)));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to deactivate test';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [tests]
  );

  // User: Fetch active tests
  const fetchActiveTests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveTests();
      setTests(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch active tests';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // User: Submit test result
  const submitResult = useCallback(
    async (resultData: ITestResultRequest) => {
      try {
        setLoading(true);
        setError(null);
        const result = await submitTestResult(resultData);
        setTestResults([result, ...testResults]);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to submit test result';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [testResults]
  );

  // User: Fetch all test results
  const fetchTestResults = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserTestResults();
      setTestResults(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch test results';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // User: Fetch test results for a specific test
  const fetchTestResultsByTest = useCallback(async (testId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserTestResultsByTest(testId);
      setTestResults(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch test results';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // User: Delete test result
  const removeTestResult = useCallback(
    async (resultId: string) => {
      try {
        setLoading(true);
        setError(null);
        await deleteTestResult(resultId);
        setTestResults(testResults.filter((r) => r.id !== resultId));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete test result';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [testResults]
  );

  return {
    // State
    tests,
    testResults,
    loading,
    error,

    // Admin functions
    fetchAllTests,
    fetchTest,
    addTest,
    editTest,
    removeTest,
    disableTest,

    // User functions
    fetchActiveTests,
    submitResult,
    fetchTestResults,
    fetchTestResultsByTest,
    removeTestResult,
  };
};
