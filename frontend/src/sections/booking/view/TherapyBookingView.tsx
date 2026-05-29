import { useState, useEffect } from 'react';
import { Alert, Box, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import { format, parse } from 'date-fns';

import { TherapyType } from 'src/type/therapist';
import { useLocales } from 'src/locale/use-locales';
import { useTherapyBooking } from 'src/hooks/use-therapy-booking';
import { PublicSpecialistDTO, AvailableSlotDTO } from 'src/utils/specialist-api';
import { BrowseTherapistsTab } from './BrowseTherapistsTab';
import { SelectSlotsTab } from './SelectSlotsTab';
import { BookingConfirmDialog } from './BookingConfirmDialog';

// -------------------------------------------------------

export default function TherapyBookingView() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedTherapist, setSelectedTherapist] = useState<PublicSpecialistDTO | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlotDTO | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingNotes, setBookingNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterType, setFilterType] = useState<TherapyType | 'all'>('all');
  const { t } = useLocales();

  const {
    therapists,
    availableSlots,
    loading,
    error,
    fetchAvailableSlots,
    filterTherapistsBySpecialization,
  } = useTherapyBooking();

  const specializations: { label: string; value: string }[] = [
    { label: t('treatment.filter.all'), value: 'all' },
    { label: t('treatment.filter.psychology'), value: 'psychology' },
    { label: t('treatment.filter.counseling'), value: 'counseling' },
    { label: t('treatment.filter.meditation'), value: 'meditation' },
    { label: t('treatment.filter.behavioral'), value: 'behavioral' },
    { label: t('treatment.filter.cognitive'), value: 'cognitive' },
    { label: t('treatment.filter.family'), value: 'family' },
  ];

  const filteredTherapists = filterTherapistsBySpecialization(filterType);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedTherapist(null);
  };

  const handleSelectTherapist = async (therapist: PublicSpecialistDTO) => {
    setSelectedTherapist(therapist);
    try {
      await fetchAvailableSlots(therapist.id);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
    setTabValue(1);
  };

  const handleSelectSlot = (slot: AvailableSlotDTO) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
      setOpenDialog(true);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedSlot && selectedTherapist) {
      const slotDate = parse(selectedSlot.date, 'yyyy-MM-dd', new Date());
      setSuccessMessage(
        `Booking confirmed with ${selectedTherapist.name} on ${format(slotDate, 'MMM dd, yyyy')} at ${selectedSlot.startTime}`
      );
      setOpenDialog(false);
      setBookingNotes('');
      setSelectedSlot(null);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const getTherapistSlots = (therapistId: string) =>
    availableSlots.filter((slot) => slot.specialistId === therapistId);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              {t('treatment.booking.header')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('treatment.booking.description')}
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" onClose={() => setSuccessMessage('')}>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" onClose={() => {}}>
              {error}
            </Alert>
          )}

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={t('treatment.booking.browseTherapists')} />
              <Tab label={t('treatment.booking.bookAppointment')} disabled={!selectedTherapist} />
            </Tabs>
          </Box>

          {/* Tab 1: Browse Therapists */}
          {tabValue === 0 && (
            <BrowseTherapistsTab
              therapists={filteredTherapists}
              loading={loading}
              filterType={filterType}
              onFilterChange={setFilterType}
              onSelectTherapist={handleSelectTherapist}
              specializations={specializations}
            />
          )}

          {/* Tab 2: Select Time Slot */}
          {tabValue === 1 && selectedTherapist && (
            <SelectSlotsTab
              therapist={selectedTherapist}
              slots={getTherapistSlots(selectedTherapist.id)}
              loading={loading}
              onSelectSlot={handleSelectSlot}
            />
          )}
        </Stack>
      </Container>

      {/* Booking Dialog */}
      <BookingConfirmDialog
        open={openDialog}
        therapist={selectedTherapist}
        slot={selectedSlot}
        notes={bookingNotes}
        onNotesChange={setBookingNotes}
        onConfirm={handleConfirmBooking}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
