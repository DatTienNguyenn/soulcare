import { useState, useEffect } from 'react';
import { Alert, Box, Container, Stack, Tab, Tabs, Typography } from '@mui/material';
import { format, parse } from 'date-fns';

import { TherapyType } from 'src/type/therapist';
import { useLocales } from 'src/locale/use-locales';
import { useTherapyBooking } from 'src/hooks/use-therapy-booking';
import {
  PublicSpecialistDTO,
  AvailableSlotDTO,
  createAppointment,
  BookingType,
  getSpecialistPricing,
  SessionPricingResponse,
} from 'src/utils/specialist-api';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
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
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [sessionTypes, setSessionTypes] = useState<SessionPricingResponse[]>([]);
  const [selectedSessionType, setSelectedSessionType] = useState('');
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
    setSelectedSessionType(''); // Reset session type when therapist changes
    try {
      await fetchAvailableSlots(therapist.id);
      // Fetch pricing for this specialist
      const pricing = await getSpecialistPricing(therapist.id);
      setSessionTypes(pricing);
      // Set default session type if available
      if (pricing.length > 0) {
        setSelectedSessionType(pricing[0].sessionType);
      }
    } catch (err) {
      console.error('Error fetching therapist data:', err);
    }
    setTabValue(1);
  };

  const handleSelectSlot = (slot: AvailableSlotDTO) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
      setOpenDialog(true);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedTherapist) return;

    try {
      setBookingLoading(true);
      setBookingError(null);

      // Get the selected session type pricing
      const selectedPricing = sessionTypes.find((type) => type.sessionType === selectedSessionType);
      const totalPrice = selectedPricing ? selectedPricing.pricePerSession : selectedSlot.price;
      const bookingType = selectedSessionType as BookingType;

      // Parse the date to create a proper ISO datetime
      const slotDate = parse(selectedSlot.date, 'yyyy-MM-dd', new Date());
      const [hours, minutes] = selectedSlot.startTime.split(':');
      slotDate.setHours(parseInt(hours), parseInt(minutes), 0);

      // Create ISO string without timezone offset (backend uses LocalDateTime)
      // This sends the local time as-is to the backend
      const year = slotDate.getFullYear();
      const month = String(slotDate.getMonth() + 1).padStart(2, '0');
      const day = String(slotDate.getDate()).padStart(2, '0');
      const hoursStr = String(parseInt(hours)).padStart(2, '0');
      const minutesStr = String(minutes).padStart(2, '0');

      // Construct ISO string without timezone: YYYY-MM-DDTHH:MM:SS
      const scheduledAtWithoutTz = `${year}-${month}-${day}T${hoursStr}:${minutesStr}:00`;

      // Create appointment request
      const appointmentRequest = {
        specialistId: selectedTherapist.id,
        scheduledAt: scheduledAtWithoutTz,
        bookingType,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        duration: selectedPricing?.durationMinutes || 60,
        totalPrice,
        currency: 'USD',
        sessionNotes: bookingNotes,
      };

      // Call API to create appointment
      const response = await createAppointment(appointmentRequest);

      // Show success message
      const bookingDate = format(slotDate, 'MMM dd, yyyy');
      setSuccessMessage(
        `Booking confirmed! Your appointment with ${selectedTherapist.name} is scheduled for ${bookingDate} at ${selectedSlot.startTime}`
      );

      // Clear form
      setOpenDialog(false);
      setBookingNotes('');
      setSelectedSlot(null);
      setSelectedSessionType('');
      setTabValue(0);

      // Auto-hide success message
      setTimeout(() => setSuccessMessage(''), 5000);

      console.log('Booking created:', response);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create booking';
      setBookingError(errorMsg);
      console.error('Error creating booking:', err);
    } finally {
      setBookingLoading(false);
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
              {typeof error === 'string' ? error : 'An error occurred'}
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

      <PayPalScriptProvider
        options={{
          clientId:
            'Abn-C15Gly2e5aCyjm9zDE-XirtpHxByqgMW1VqYcHlscj-vEPvicsWJ5wfdwTcbB79ttp_tkyajf7t1',
          currency: 'USD',
          intent: 'capture',
        }}
      >
        <BookingConfirmDialog
          open={openDialog}
          therapist={selectedTherapist}
          slot={selectedSlot}
          notes={bookingNotes}
          onNotesChange={setBookingNotes}
          onConfirm={handleConfirmBooking}
          onClose={() => setOpenDialog(false)}
          loading={bookingLoading}
          error={bookingError}
          sessionTypes={sessionTypes}
          selectedSessionType={selectedSessionType}
          onSessionTypeChange={setSelectedSessionType}
        />
      </PayPalScriptProvider>
    </>
  );
}
