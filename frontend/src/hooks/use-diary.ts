import { useState, useCallback } from 'react';
import {
  IDiaryEntry,
  IDiaryRequest,
  createDiary,
  getDiaries,
  getDiaryById,
  updateDiary,
  deleteDiary,
} from 'src/utils/diary-api';

export const useDiary = () => {
  const [diaries, setDiaries] = useState<IDiaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all diaries
  const fetchDiaries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDiaries();
      setDiaries(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch diaries';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single diary
  const fetchDiary = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDiaryById(id);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch diary';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new diary entry
  const addDiary = useCallback(async (entry: IDiaryRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newDiary = await createDiary(entry);
      setDiaries((prev) => [newDiary, ...prev]);
      return newDiary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create diary';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a diary entry
  const editDiary = useCallback(async (id: string, entry: IDiaryRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDiary = await updateDiary(id, entry);
      setDiaries((prev) => prev.map((d) => (d.id === id ? updatedDiary : d)));
      return updatedDiary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update diary';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a diary entry
  const removeDiary = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteDiary(id);
      setDiaries((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete diary';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    diaries,
    loading,
    error,
    fetchDiaries,
    fetchDiary,
    addDiary,
    editDiary,
    removeDiary,
  };
};
