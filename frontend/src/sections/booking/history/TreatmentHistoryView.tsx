import { useState } from 'react';
import { Box, Container, Stack, Typography, Tab, Tabs } from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { _therapyBookings } from 'src/_mock';
import { TherapyBooking } from 'src/type/therapist';
import { SummaryCards } from './SummaryCards';
import { AllSessionsTab } from './AllSessionsTab';
import { CompletedSessionsTab } from './CompletedSessionsTab';
import { UpcomingSessionsTab } from './UpcomingSessionsTab';
import { SessionDetailsDialog } from './SessionDetailsDialog';
import { ReviewDialog } from './ReviewDialog';

// -------------------------------------------------------

export default function TreatmentHistoryView() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<TherapyBooking | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

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

  const handleSubmitReview = (rating: number, text: string) => {
    // TODO: Submit review to backend
    console.log('Review submitted:', { rating, text });
    setOpenReviewDialog(false);
    setReviewRating(0);
    setReviewText('');
  };

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

          {/* Summary Cards */}
          <SummaryCards bookings={_therapyBookings} />

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
            <AllSessionsTab bookings={_therapyBookings} onViewDetails={handleViewDetails} />
          )}

          {tabValue === 1 && (
            <CompletedSessionsTab bookings={_therapyBookings} onViewDetails={handleViewDetails} />
          )}

          {tabValue === 2 && (
            <UpcomingSessionsTab bookings={_therapyBookings} onViewDetails={handleViewDetails} />
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
