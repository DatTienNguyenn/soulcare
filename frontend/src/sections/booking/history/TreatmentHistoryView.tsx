import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { TherapyBooking } from 'src/type/therapist';
import { AppointmentResponse, PublicSpecialistDTO, submitReview } from 'src/utils/specialist-api';
import { SummaryCards } from './SummaryCards';
import { AllSessionsTab } from './AllSessionsTab';
import { CompletedSessionsTab } from './CompletedSessionsTab';
import { UpcomingSessionsTab } from './UpcomingSessionsTab';
import { SessionDetailsDialog } from './SessionDetailsDialog';
import { ReviewDialog } from './ReviewDialog';
import { ReasonDialog } from 'src/sections/calling/ReasonDialog';
import { useBookingHistory } from 'src/hooks/use-booking-history';
import { useTherapyBooking } from 'src/hooks/use-therapy-booking';
import axios from 'src/utils/axios';
import { useLocales } from 'src/locale/use-locales';

// -------------------------------------------------------

// Utility function to convert AppointmentResponse to TherapyBooking
function convertAppointmentToTherapyBooking(
  appointment: AppointmentResponse,
  therapists: PublicSpecialistDTO[]
): TherapyBooking {
  const scheduledDate = new Date(appointment.scheduledAt);
  const therapist = therapists.find((t) => t.id === appointment.specialistId);

  return {
    id: appointment.id,
    therapistId: appointment.specialistId,
    therapistName: appointment.specialistName || 'Unknown Therapist',
    userId: appointment.patientId,
    userName: appointment.patientName || 'You',
    userEmail: appointment.patientEmail || '',
    specialistAvatar: appointment.specialistAvatar || therapist?.avatarUrl,
    type: 'counseling', // Default type, could be expanded based on appointment data
    date: scheduledDate,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    duration: appointment.duration,
    status:
      appointment.status === 'CONFIRMED'
        ? 'completed'
        : appointment.status === 'CANCELLED'
          ? 'cancelled'
          : appointment.status === 'NO_SHOW'
            ? 'reported'
            : appointment.status === 'COMPLETED' && appointment?.cancelledReason === 'EHR submitted'
              ? 'booked'
              : 'booked', // PENDING is upcoming
    notes: appointment.sessionNotes,
    totalPrice: Number(appointment.totalPrice),
    createdAt: new Date(appointment.createdAt),
    completedAt: appointment.completedAt ? new Date(appointment.completedAt) : undefined,
  };
}

export default function TreatmentHistoryView() {
  const { t } = useLocales();
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<TherapyBooking | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<TherapyBooking | null>(null);

  const { appointments, loading, error, fetchAppointments, cancelBooking } = useBookingHistory();
  const { therapists, loading: therapistsLoading } = useTherapyBooking();

  // Convert API responses to TherapyBooking format
  const therapyBookings: TherapyBooking[] = appointments.map((appointment: AppointmentResponse) =>
    convertAppointmentToTherapyBooking(appointment, therapists)
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewDetails = (booking: TherapyBooking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleOpenReviewDialog = () => {
    setOpenDialog(false);
    setOpenReviewDialog(true);
  };

  const handleSubmitReview = async (rating: number, text: string) => {
    if (!selectedBooking) return;
    try {
      await submitReview(selectedBooking.id, selectedBooking.userId, rating, text);
      // Show success message (e.g. snackbar)
    } catch (err) {
      console.error(err);
      // Show error message
    } finally {
      setOpenReviewDialog(false);
    }
    setReviewRating(0);
    setReviewText('');
  };

  const handleOpenCancelDialog = (booking: TherapyBooking) => {
    setBookingToCancel(booking);
    setOpenCancelDialog(true);
    setOpenDialog(false); // Close details dialog if it was open
  };

  const handleConfirmCancel = async (reason: string) => {
    if (bookingToCancel) {
      try {
        await cancelBooking(bookingToCancel.id, reason);
      } catch (e) {
        console.error('Failed to cancel booking:', e);
      }
      setOpenCancelDialog(false);
      setBookingToCancel(null);
    }
  };

  const handleSaveNotes = async (notes: string) => {
    if (!selectedBooking) return;

    const originalAppointment = appointments.find(
      (a: AppointmentResponse) => a.id === selectedBooking.id
    );
    if (!originalAppointment) return;

    try {
      await axios.put<AppointmentResponse>(`/api/v1/appointments/${selectedBooking.id}`, {
        specialistId: originalAppointment.specialistId,
        scheduledAt: originalAppointment.scheduledAt,
        duration: originalAppointment.duration,
        currency: originalAppointment.currency || 'USD',
        bookingType: originalAppointment.bookingType,
        totalPrice: originalAppointment.totalPrice,
        startTime: originalAppointment.startTime,
        endTime: originalAppointment.endTime,
        sessionNotes: notes,
      });
      // Refetch appointments to get the latest data
      fetchAppointments();
    } catch (err) {
      console.error('Failed to save notes:', err);
      // You could show an error notification here
    }
  };

  if (loading || therapistsLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '400px' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>{t('treatment.history.loading')}</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('pages.treatmentHistory.title')} | SoulCare</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {t('treatment.history.pageTitle')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('treatment.history.pageSubtitle')}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" onClose={() => {}}>
              {error}
            </Alert>
          )}

          {/* Summary Cards */}
          <SummaryCards bookings={therapyBookings} />

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={t('treatment.history.filters.all')} />
              <Tab label={t('treatment.history.filters.completed')} />
              <Tab label={t('treatment.history.filters.upcoming')} />
            </Tabs>
          </Box>

          {/* Tab Content */}
          {tabValue === 0 && (
            <AllSessionsTab bookings={therapyBookings} onViewDetails={handleViewDetails} />
          )}

          {tabValue === 1 && (
            <CompletedSessionsTab bookings={therapyBookings} onViewDetails={handleViewDetails} />
          )}

          {tabValue === 2 && (
            <UpcomingSessionsTab
              bookings={therapyBookings}
              onViewDetails={handleViewDetails}
              onCancel={handleOpenCancelDialog}
            />
          )}
        </Stack>
      </Container>

      {/* Details Dialog */}
      <SessionDetailsDialog
        open={openDialog}
        booking={selectedBooking}
        onClose={() => setOpenDialog(false)}
        onReview={handleOpenReviewDialog}
        onCancel={() => selectedBooking && handleOpenCancelDialog(selectedBooking)}
        onSaveNotes={handleSaveNotes}
      />

      {/* Review Dialog */}
      <ReviewDialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
        onSubmit={handleSubmitReview}
        rating={reviewRating}
        onRatingChange={setReviewRating}
        text={reviewText}
        onTextChange={setReviewText}
      />

      {/* Cancel Dialog */}
      <ReasonDialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        onSubmit={handleConfirmCancel}
        title={t('treatment.history.cancelDialog.title')}
        description={t('treatment.history.cancelDialog.description')}
      />
    </>
  );
}
