import { useState, useCallback } from 'react';
import axios from 'src/utils/axios';

export interface PatientProfile {
  id?: string;
  userId?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  avatarUrl?: string;
}

export function usePatientProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Note: Adjust the endpoint routes below depending on your actual API definitions
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/patients/me');
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to fetch patient profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<PatientProfile>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put('/api/patients/me', data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to update patient profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchProfile, updateProfile };
}
