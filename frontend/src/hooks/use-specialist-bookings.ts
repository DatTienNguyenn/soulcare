import { useState, useEffect, useCallback } from 'react';
import {
  getSpecialistAppointments,
  getSpecialistAppointmentsByStatus,
  AppointmentResponse,
  AppointmentStatus,
} from 'src/utils/specialist-api';

export interface SpecialistBooking {
  id: string;
  patientId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  type: string; // bookingType from appointment
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalPrice: number;
  status: 'completed' | 'booked' | 'cancelled' | 'reported';
  rating?: number;
  feedback?: string;
  notes?: string;
  cancelledReason?: string;
}

export function useSpecialistBookings() {
  const [bookings, setBookings] = useState<SpecialistBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert AppointmentResponse to SpecialistBooking format
  const convertToSpecialistBooking = (appointment: AppointmentResponse): SpecialistBooking => {
    const statusMap: {
      [key in AppointmentStatus]: 'completed' | 'booked' | 'cancelled' | 'reported';
    } = {
      PENDING: 'booked',
      CONFIRMED: 'booked',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
      NO_SHOW: 'reported',
    };

    return {
      id: appointment.id,
      patientId: appointment.patientId,
      userName: appointment.patientName || 'Unknown Patient',
      userEmail: appointment.patientEmail || '',
      userAvatar: appointment.patientAvatar,
      type: appointment.bookingType.toLowerCase(),
      date: new Date(appointment.scheduledAt),
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      duration: appointment.duration,
      totalPrice: Number(appointment.totalPrice),
      status: statusMap[appointment.status],
      rating: appointment.reviewRating,
      feedback: appointment.reviewComment,
      notes: appointment.sessionNotes,
      cancelledReason: appointment.cancelledReason,
    };
  };

  // Fetch all bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const appointments = await getSpecialistAppointments();
      const convertedBookings = appointments.map(convertToSpecialistBooking);
      setBookings(convertedBookings);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(errorMsg);
      console.error('Error fetching specialist bookings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch bookings by status
  const fetchBookingsByStatus = useCallback(async (status: AppointmentStatus) => {
    try {
      setLoading(true);
      setError(null);
      const appointments = await getSpecialistAppointmentsByStatus(status);
      const convertedBookings = appointments.map(convertToSpecialistBooking);
      setBookings(convertedBookings);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch bookings';
      setError(errorMsg);
      console.error('Error fetching bookings by status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load bookings on mount
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Filter bookings by status locally
  const getBookingsByStatus = useCallback(
    (status: 'completed' | 'booked' | 'cancelled' | 'reported') => {
      return bookings.filter((b) => b.status === status);
    },
    [bookings]
  );

  // Calculate statistics
  const getStatistics = useCallback(
    () => ({
      totalBookings: bookings.length,
      completedCount: bookings.filter(
        (b) => b?.cancelledReason === 'EHR submitted' || b?.status === 'completed'
      ).length,
      cancelledCount: bookings.filter((b) => b.status === 'cancelled').length,
      reportedCount: bookings.filter((b) => b.status === 'reported').length,
      upcomingCount:
        bookings.length -
        bookings.filter((b) => b?.cancelledReason === 'EHR submitted' || b.status === 'completed')
          .length -
        bookings.filter((b) => b.status === 'cancelled').length -
        bookings.filter((b) => b.status === 'reported').length,
      totalRevenue: bookings
        .filter((b) => b.status !== 'cancelled' && b.status !== 'reported')
        .reduce((sum, b) => sum + b.totalPrice, 0),
      averageRating:
        bookings.filter((b) => b.rating).length > 0
          ? (
              bookings.filter((b) => b.rating).reduce((sum, b) => sum + (b.rating || 0), 0) /
              bookings.filter((b) => b.rating).length
            ).toFixed(2)
          : '0.00',
    }),
    [bookings]
  );

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    fetchBookingsByStatus,
    getBookingsByStatus,
    getStatistics,
  };
}
