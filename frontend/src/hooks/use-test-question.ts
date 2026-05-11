import { useState, useCallback } from 'react';
import {
  createTestQuestion,
  getTestQuestions,
  updateTestQuestion,
  deleteTestQuestion,
  ITestQuestion,
  ITestQuestionRequest,
} from 'src/utils/test-api';

export const useTestQuestion = () => {
  const [questions, setQuestions] = useState<ITestQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTestQuestions = useCallback(async (testId: string) => {
    try {
      setLoading(true);
      const data = await getTestQuestions(testId);
      setQuestions(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addQuestion = useCallback(async (testId: string, questionData: ITestQuestionRequest) => {
    try {
      const newQuestion = await createTestQuestion(testId, questionData);
      setQuestions((prev) => [...prev, newQuestion]);
      setError(null);
      return newQuestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create question';
      setError(errorMessage);
      console.error('Failed to create question:', err);
      throw err;
    }
  }, []);

  const editQuestion = useCallback(
    async (testId: string, questionId: string, questionData: ITestQuestionRequest) => {
      try {
        const updated = await updateTestQuestion(testId, questionId, questionData);
        setQuestions((prev) => prev.map((q) => (q.id === questionId ? updated : q)));
        setError(null);
        return updated;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update question';
        setError(errorMessage);
        console.error('Failed to update question:', err);
        throw err;
      }
    },
    []
  );

  const removeQuestion = useCallback(async (testId: string, questionId: string) => {
    try {
      await deleteTestQuestion(testId, questionId);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete question';
      setError(errorMessage);
      console.error('Failed to delete question:', err);
      throw err;
    }
  }, []);

  return {
    questions,
    loading,
    error,
    fetchTestQuestions,
    addQuestion,
    editQuestion,
    removeQuestion,
  };
};
