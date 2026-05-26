import { useState, useCallback } from 'react';
import {
  SessionPricingRequest,
  SessionPricingResponse,
  AvailabilityRequest,
  AvailabilityResponse,
  SpecialistProfile,
  UpdateSpecialistProfileRequest,
  setSessionPricing,
  getSessionPricing,
  getActivePricing,
  updateSessionPricing as updateSessionPricingAPI,
  togglePricingStatus,
  deletePricing as deletePricingAPI,
  setAvailability,
  getAvailability,
  getActiveAvailability,
  updateAvailability as updateAvailabilityAPI,
  toggleAvailabilityStatus,
  deleteAvailability as deleteAvailabilityAPI,
  getSpecialistProfile,
  updateSpecialistProfile as updateSpecialistProfileAPI,
} from 'src/utils/specialist-api';

export function useSpecialistProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========== PRICING CALLBACKS ==========

  const fetchSessionPricing = useCallback(async (): Promise<SessionPricingResponse[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSessionPricing();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch pricing';
      setError(errorMsg);
      console.error('Error fetching pricing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivePricing = useCallback(async (): Promise<SessionPricingResponse[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActivePricing();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch active pricing';
      setError(errorMsg);
      console.error('Error fetching active pricing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSessionPricing = useCallback(
    async (request: SessionPricingRequest): Promise<SessionPricingResponse> => {
      try {
        setLoading(true);
        setError(null);
        const data = await setSessionPricing(request);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create pricing';
        setError(errorMsg);
        console.error('Error creating pricing:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updatePricing = useCallback(
    async (
      sessionType: string,
      request: SessionPricingRequest
    ): Promise<SessionPricingResponse> => {
      try {
        setLoading(true);
        setError(null);
        const data = await updateSessionPricingAPI(sessionType, request);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update pricing';
        setError(errorMsg);
        console.error('Error updating pricing:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const togglePricing = useCallback(
    async (sessionType: string): Promise<SessionPricingResponse> => {
      try {
        setLoading(true);
        setError(null);
        const data = await togglePricingStatus(sessionType);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to toggle pricing';
        setError(errorMsg);
        console.error('Error toggling pricing:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deletePricing = useCallback(async (sessionType: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deletePricingAPI(sessionType);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete pricing';
      setError(errorMsg);
      console.error('Error deleting pricing:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== AVAILABILITY CALLBACKS ==========

  const fetchAvailability = useCallback(async (): Promise<AvailabilityResponse[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAvailability();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch availability';
      setError(errorMsg);
      console.error('Error fetching availability:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveAvailability = useCallback(async (): Promise<AvailabilityResponse[]> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActiveAvailability();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch active availability';
      setError(errorMsg);
      console.error('Error fetching active availability:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAvailability = useCallback(
    async (request: AvailabilityRequest): Promise<AvailabilityResponse> => {
      try {
        setLoading(true);
        setError(null);
        const data = await setAvailability(request);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create availability';
        setError(errorMsg);
        console.error('Error creating availability:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateAvailability = useCallback(
    async (dayOfWeek: number, request: AvailabilityRequest): Promise<AvailabilityResponse> => {
      try {
        setLoading(true);
        setError(null);
        const data = await updateAvailabilityAPI(dayOfWeek, request);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update availability';
        setError(errorMsg);
        console.error('Error updating availability:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const toggleAvailability = useCallback(
    async (dayOfWeek: number): Promise<AvailabilityResponse> => {
      try {
        setLoading(true);
        setError(null);
        const data = await toggleAvailabilityStatus(dayOfWeek);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to toggle availability';
        setError(errorMsg);
        console.error('Error toggling availability:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAvailability = useCallback(async (dayOfWeek: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await deleteAvailabilityAPI(dayOfWeek);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete availability';
      setError(errorMsg);
      console.error('Error deleting availability:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== PROFILE CALLBACK ==========

  const fetchProfile = useCallback(async (): Promise<SpecialistProfile> => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSpecialistProfile();
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMsg);
      console.error('Error fetching profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (request: UpdateSpecialistProfileRequest): Promise<SpecialistProfile> => {
      try {
        setLoading(true);
        setError(null);
        const data = await updateSpecialistProfileAPI(request);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update profile';
        setError(errorMsg);
        console.error('Error updating profile:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    // Pricing
    fetchSessionPricing,
    fetchActivePricing,
    createSessionPricing,
    updatePricing,
    togglePricing,
    deletePricing,
    // Availability
    fetchAvailability,
    fetchActiveAvailability,
    createAvailability,
    updateAvailability,
    toggleAvailability,
    deleteAvailability,
    // Profile
    fetchProfile,
    updateProfile,
  };
}
