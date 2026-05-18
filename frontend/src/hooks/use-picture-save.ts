import { useState } from 'react';
import * as pictureAPI from 'src/utils/picture-api';
import { PictureData, PictureListItem } from 'src/utils/picture-api';

interface UsePictureSaveReturn {
  loading: boolean;
  error: string | null;
  savePicture: (data: PictureData) => Promise<PictureData>;
  updatePicture: (id: string, data: PictureData) => Promise<PictureData>;
  loadPicture: (id: string) => Promise<PictureData>;
  loadPictures: () => Promise<PictureListItem[]>;
  deletePicture: (id: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for managing picture save, load, and update operations
 */
export const usePictureSave = (): UsePictureSaveReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const savePicture = async (data: PictureData): Promise<PictureData> => {
    setLoading(true);
    setError(null);
    try {
      const result = await pictureAPI.savePicture(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save picture';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePicture = async (id: string, data: PictureData): Promise<PictureData> => {
    setLoading(true);
    setError(null);
    try {
      const result = await pictureAPI.updatePicture(id, data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update picture';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadPicture = async (id: string): Promise<PictureData> => {
    setLoading(true);
    setError(null);
    try {
      const result = await pictureAPI.getPictureById(id);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load picture';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadPictures = async (): Promise<PictureListItem[]> => {
    setLoading(true);
    setError(null);
    try {
      const result = await pictureAPI.getPictures();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load pictures';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePicture = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await pictureAPI.deletePicture(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete picture';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    savePicture,
    updatePicture,
    loadPicture,
    loadPictures,
    deletePicture,
    clearError,
  };
};
