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
import { useLocales } from 'src/locale/use-locales';
import { getPatientEHRs, EHRResponse } from 'src/utils/specialist-api';
import { getPatientPictures, getPatientPictureById, PictureData } from 'src/utils/picture-api';
import { BookingSummaryCards } from './summary-cards';
import {
  AllBookingsTab,
  CompletedBookingsTab,
  UpcomingBookingsTab,
  UserStatsTab,
} from './all-tabs-content';
import { NotesDialog } from './note-detail';
import { PatientRecordDataDialog } from './patient-record-data-dialog';
import { BookingDetailsDialog } from './detail-dialog';

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
  const [openRecordDialog, setOpenRecordDialog] = useState(false);

  const [patientPictures, setPatientPictures] = useState<PictureData[]>([]);
  const [loadingPictures, setLoadingPictures] = useState(false);

  // Use the specialist bookings hook
  const { bookings, loading, error, getBookingsByStatus, getStatistics } = useSpecialistBookings();
  const { t } = useLocales();

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

  const handleViewPatientRecords = async () => {
    const patientId = selectedBooking?.patientId;
    if (!patientId) return;

    setOpenRecordDialog(true);
    setLoadingEhrs(true);
    setLoadingPictures(true);

    // Fetch EHRs
    getPatientEHRs(patientId)
      .then((records) => {
        setEhrs(records);
        setLoadingEhrs(false);
      })
      .catch((err) => {
        console.error('Failed to fetch patient records:', err);
        setLoadingEhrs(false);
      });

    try {
      // Fetch pictures for the patient
      const list = await getPatientPictures(patientId);
      // Filter only PUBLISHED pictures
      const published = list.filter((p) => p.status === 'PUBLISHED');
      // Load full data for the images
      const fullPictures = await Promise.all(
        published.map((p) => getPatientPictureById(patientId, p.id))
      );
      setPatientPictures(fullPictures);
    } catch (err) {
      console.error('Failed to load patient pictures', err);
    } finally {
      setLoadingPictures(false);
    }
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
        <title>{t('specialist.bookings.pageTitle')}</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {t('specialist.bookings.title')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('specialist.bookings.description')}
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {/* Summary Cards */}
          <BookingSummaryCards stats={stats} />

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={t('specialist.bookings.tabs.all')} />
              <Tab label={t('specialist.bookings.tabs.completed')} />
              <Tab label={t('specialist.bookings.tabs.upcoming')} />
              <Tab label={t('specialist.bookings.tabs.users')} />
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
        onViewNotes={handleOpenNoteDialog}
        onViewPatientRecords={handleViewPatientRecords}
      />

      {/* Notes Dialog */}
      <NotesDialog
        open={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
        noteText={noteText}
      />

      {/* Patient Record Data Dialog */}
      <PatientRecordDataDialog
        open={openRecordDialog}
        onClose={() => setOpenRecordDialog(false)}
        patientName={selectedBooking?.userName || 'Patient'}
        ehrs={ehrs}
        loadingEhrs={loadingEhrs}
        pictures={patientPictures}
        loadingPictures={loadingPictures}
      />
    </>
  );
}
