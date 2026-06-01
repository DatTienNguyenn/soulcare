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
import { useBookingHistory } from 'src/hooks/use-booking-history';
import { AppointmentResponse } from 'src/utils/specialist-api';
import { SummaryCards } from './SummaryCards';
import { AllSessionsTab } from './AllSessionsTab';
import { CompletedSessionsTab } from './CompletedSessionsTab';
import { UpcomingSessionsTab } from './UpcomingSessionsTab';
import { SessionDetailsDialog } from './SessionDetailsDialog';
import { ReviewDialog } from './ReviewDialog';

// -------------------------------------------------------

// Utility function to convert AppointmentResponse to TherapyBooking
function convertAppointmentToTherapyBooking(appointment: AppointmentResponse): TherapyBooking {
  const scheduledDate = new Date(appointment.scheduledAt);
  return {
    id: appointment.id,
    therapistId: appointment.specialistId,
    therapistName: appointment.specialistName || 'Unknown Therapist',
    userId: appointment.patientId,
    userName: appointment.patientName || 'You',
    userEmail: appointment.patientEmail || '',
    type: 'counseling', // Default type, could be expanded based on appointment data
    date: scheduledDate,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    duration: appointment.duration,
    status:
      appointment.status === 'COMPLETED'
        ? 'completed'
        : appointment.status === 'CANCELLED'
          ? 'cancelled'
          : 'booked',
    notes: appointment.sessionNotes,
    totalPrice: Number(appointment.totalPrice),
    createdAt: new Date(appointment.createdAt),
    completedAt: appointment.completedAt ? new Date(appointment.completedAt) : undefined,
  };
}

export default function TreatmentHistoryView() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<TherapyBooking | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const { appointments, loading, error, fetchAppointments, cancelBooking } = useBookingHistory();

  // Convert API responses to TherapyBooking format
  const therapyBookings: TherapyBooking[] = appointments.map(convertAppointmentToTherapyBooking);

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
    // TODO: Submit review to backend
    console.log('Review submitted:', { rating, text, appointmentId: selectedBooking?.id });
    setOpenReviewDialog(false);
    setReviewRating(0);
    setReviewText('');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '400px' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Loading your booking history...</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Treatment History | SoulCare</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              Treatment & Booking History
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              View and manage your therapy sessions
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
              <Tab label="All Sessions" />
              <Tab label="Completed Sessions" />
              <Tab label="Upcoming Sessions" />
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
            <UpcomingSessionsTab bookings={therapyBookings} onViewDetails={handleViewDetails} />
          )}
        </Stack>
      </Container>

      {/* Details Dialog */}
      <SessionDetailsDialog
        open={openDialog}
        booking={selectedBooking}
        onClose={() => setOpenDialog(false)}
        onReview={handleOpenReviewDialog}
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
    </>
  );
}
