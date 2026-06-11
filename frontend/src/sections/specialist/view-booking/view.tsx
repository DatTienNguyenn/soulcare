import { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { SpecialistBooking, useSpecialistBookings } from 'src/hooks/use-specialist-bookings';
import { getPatientEHRs, EHRResponse } from 'src/utils/specialist-api';
import { BookingSummaryCards } from './summary-cards';
import {
  AllBookingsTab,
  BookingDetailsDialog,
  CompletedBookingsTab,
  UpcomingBookingsTab,
  UserStatsTab,
} from './all-tabs-content';
import { NotesDialog } from './note-detail';
import { EHRDetailsDialog } from './ehr-detail';

// -------------------------------------------------------

export default function SpecialistBookingView() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'booked' | 'cancelled'>(
    'all'
  );
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [ehrs, setEhrs] = useState<EHRResponse[]>([]);
  const [loadingEhrs, setLoadingEhrs] = useState(false);
  const [selectedEhr, setSelectedEhr] = useState<EHRResponse | null>(null);
  const [openEhrDialog, setOpenEhrDialog] = useState(false);

  // Use the specialist bookings hook
  const { bookings, loading, error, getBookingsByStatus, getStatistics } = useSpecialistBookings();

  const stats = getStatistics();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredBookings = (() => {
    if (filterStatus === 'all') return bookings;
    return bookings.filter((booking) => booking.status === filterStatus);
  })();

  const handleViewDetails = async (booking: SpecialistBooking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);

    // Suppress TypeScript error by casting to any
    const patientId = (booking as any).patientId;
    if (patientId) {
      setLoadingEhrs(true);
      try {
        const records = await getPatientEHRs(patientId);
        setEhrs(records);
      } catch (err) {
        console.error('Failed to fetch patient records:', err);
      } finally {
        setLoadingEhrs(false);
      }
    }
  };

  const handleOpenNoteDialog = () => {
    setOpenDialog(false);
    if (selectedBooking?.notes) {
      setNoteText(selectedBooking.notes);
    }
    setOpenNoteDialog(true);
  };

  const handleSaveNote = () => {
    setOpenNoteDialog(false);
    setNoteText('');
  };

  const handleEhrClick = (ehr: EHRResponse) => {
    setSelectedEhr(ehr);
    setOpenEhrDialog(true);
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'booked':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const completedBookings = getBookingsByStatus('completed');
  const upcomingBookings = getBookingsByStatus('booked');
  const cancelledBookings = getBookingsByStatus('cancelled');

  return (
    <>
      <Helmet>
        <title>My Bookings | Specialist</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              My Bookings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Manage and view all patient bookings
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {/* Summary Cards */}
          <BookingSummaryCards stats={stats} />

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="All Bookings" />
              <Tab label="Completed" />
              <Tab label="Upcoming" />
              <Tab label="Users" />
            </Tabs>
          </Box>

          {/* Tab 0: All Bookings */}
          {tabValue === 0 && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <AllBookingsTab
                  filteredBookings={filteredBookings}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  getStatusColor={getStatusColor}
                  handleViewDetails={handleViewDetails}
                />
              )}
            </>
          )}

          {/* Tab 1: Completed Bookings */}
          {tabValue === 1 && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <CompletedBookingsTab
                  completedBookings={completedBookings}
                  handleViewDetails={handleViewDetails}
                />
              )}
            </>
          )}

          {/* Tab 2: Upcoming Bookings */}
          {tabValue === 2 && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <UpcomingBookingsTab
                  upcomingBookings={upcomingBookings}
                  handleViewDetails={handleViewDetails}
                />
              )}
            </>
          )}

          {/* Tab 3: User Statistics */}
          {tabValue === 3 && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <UserStatsTab bookings={bookings} />
              )}
            </>
          )}
        </Stack>
      </Container>

      {/* Details Dialog */}
      <BookingDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        selectedBooking={selectedBooking}
        getStatusColor={getStatusColor}
        loadingEhrs={loadingEhrs}
        ehrs={ehrs}
        onEhrClick={handleEhrClick}
        onViewNotes={handleOpenNoteDialog}
      />

      {/* Notes Dialog */}
      <NotesDialog
        open={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
        noteText={noteText}
      />

      {/* EHR Details Dialog */}
      <EHRDetailsDialog
        open={openEhrDialog}
        onClose={() => setOpenEhrDialog(false)}
        selectedEhr={selectedEhr}
      />
    </>
  );
}
