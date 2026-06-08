import { useState, useCallback, useEffect } from 'react';
import {
  getPatientAppointments,
  getAppointmentDetails,
  updateAppointment,
  cancelAppointment,
  AppointmentResponse,
} from 'src/utils/specialist-api';

export function useBookingHistory() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all appointments for the patient
   */
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatientAppointments();
      setAppointments(data);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch appointments';
      setError(errorMsg);
      console.error('Error fetching appointments:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get appointment details
   */
  const getDetails = useCallback(async (appointmentId: string) => {
    try {
      setError(null);
      const data = await getAppointmentDetails(appointmentId);
      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch appointment details';
      setError(errorMsg);
      console.error('Error fetching appointment details:', err);
      throw err;
    }
  }, []);

  /**
   * Update appointment (add notes)
   */
  const updateBooking = useCallback(async (appointmentId: string, notes: string) => {
    try {
      setError(null);
      const updatedAppointment = await updateAppointment(appointmentId, {
        sessionNotes: notes,
      });
      // Update local state
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? updatedAppointment : apt))
      );
      return updatedAppointment;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update appointment';
      setError(errorMsg);
      console.error('Error updating appointment:', err);
      throw err;
    }
  }, []);

  /**
   * Cancel an appointment
   */
  const cancelBooking = useCallback(async (appointmentId: string, reason?: string) => {
    try {
      setError(null);
      const cancelledAppointment = await cancelAppointment(appointmentId, reason);
      // Update local state
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? cancelledAppointment : apt))
      );
      return cancelledAppointment;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to cancel appointment';
      setError(errorMsg);
      console.error('Error cancelling appointment:', err);
      throw err;
    }
  }, []);

  /**
   * Filter appointments by status
   */
  const filterByStatus = useCallback(
    (status: string) => {
      return appointments.filter((apt) => apt.status === status);
    },
    [appointments]
  );

  /**
   * Get upcoming appointments (PENDING or CONFIRMED)
   */
  const getUpcomingAppointments = useCallback(() => {
    return appointments.filter((apt) => apt.status === 'PENDING' || apt.status === 'CONFIRMED');
  }, [appointments]);

  /**
   * Get completed appointments
   */
  const getCompletedAppointments = useCallback(() => {
    return appointments.filter((apt) => apt.status === 'COMPLETED');
  }, [appointments]);

  /**
   * Reload appointments on mount
   */
  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    getDetails,
    updateBooking,
    cancelBooking,
    filterByStatus,
    getUpcomingAppointments,
    getCompletedAppointments,
  };
}
