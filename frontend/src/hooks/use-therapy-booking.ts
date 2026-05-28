import { useState, useCallback, useEffect } from 'react';
import {
  getAllSpecialists,
  getAvailableSlots,
  PublicSpecialistDTO,
  AvailableSlotDTO,
} from 'src/utils/specialist-api';

export function useTherapyBooking() {
  const [therapists, setTherapists] = useState<PublicSpecialistDTO[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlotDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all therapists, optionally filtered by specialization
   */
  const fetchTherapists = useCallback(async (specialization?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllSpecialists(specialization);
      setTherapists(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch therapists';
      setError(errorMsg);
      console.error('Error fetching therapists:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch available time slots for a specific therapist
   */
  const fetchAvailableSlots = useCallback(
    async (specialistId: string, startDate?: string, endDate?: string, sessionType?: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAvailableSlots(specialistId, startDate, endDate, sessionType);
        setAvailableSlots(data);
        return data;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch available slots';
        setError(errorMsg);
        console.error('Error fetching available slots:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Get slots for a specific therapist (convenience method)
   */
  const getTherapistSlots = useCallback(
    (therapistId: string) => {
      return availableSlots.filter((slot) => slot.specialistId === therapistId);
    },
    [availableSlots]
  );

  /**
   * Get filtered therapists by specialization
   */
  const filterTherapistsBySpecialization = useCallback(
    (specialization: string) => {
      if (specialization === 'all') return therapists;
      return therapists.filter((t) =>
        t.specializations.some((spec) => spec.toLowerCase() === specialization.toLowerCase())
      );
    },
    [therapists]
  );

  /**
   * Reload therapists on initial mount
   */
  useEffect(() => {
    fetchTherapists();
  }, []);

  return {
    therapists,
    availableSlots,
    loading,
    error,
    fetchTherapists,
    fetchAvailableSlots,
    getTherapistSlots,
    filterTherapistsBySpecialization,
  };
}
