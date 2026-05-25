import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';

import { _therapists, _timeSlots } from 'src/_mock';
import { Therapist, TimeSlot, TherapyType } from 'src/type/therapist';
import { useLocales } from 'src/locale/use-locales';

// -------------------------------------------------------

export default function TherapyBookingView() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookingNotes, setBookingNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterType, setFilterType] = useState<TherapyType | 'all'>('all');
  const { t } = useLocales();
  const specializations: { label: string; value: TherapyType | 'all' }[] = [
    { label: t('treatment.filter.all'), value: 'all' },
    { label: t('treatment.filter.psychology'), value: 'psychology' },
    { label: t('treatment.filter.counseling'), value: 'counseling' },
    { label: t('treatment.filter.meditation'), value: 'meditation' },
    { label: t('treatment.filter.behavioral'), value: 'behavioral' },
    { label: t('treatment.filter.cognitive'), value: 'cognitive' },
    { label: t('treatment.filter.family'), value: 'family' },
  ];

  const filteredTherapists = _therapists.filter(
    (therapist) => filterType === 'all' || therapist.specialization === filterType
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedTherapist(null);
  };

  const handleSelectTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setTabValue(1);
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    if (slot.status === 'available') {
      setSelectedSlot(slot);
      setOpenDialog(true);
    }
  };

  const handleConfirmBooking = () => {
    if (selectedSlot && selectedTherapist) {
      setSuccessMessage(
        `Booking confirmed with ${selectedTherapist.name} on ${format(selectedSlot.date, 'MMM dd, yyyy')} at ${selectedSlot.startTime}`
      );
      setOpenDialog(false);
      setBookingNotes('');
      setSelectedSlot(null);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  };

  const getTherapistSlots = (therapistId: string) =>
    _timeSlots.filter((slot) => slot.therapistId === therapistId);

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

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={t('treatment.booking.browseTherapists')} />
              <Tab label={t('treatment.booking.bookAppointment')} disabled={!selectedTherapist} />
            </Tabs>
          </Box>

          {/* Tab 1: Browse Therapists */}
          {tabValue === 0 && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {t('treatment.booking.filterBySpecialization')}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {specializations.map((spec) => (
                    <Chip
                      key={spec.value}
                      label={spec.label}
                      onClick={() => setFilterType(spec.value)}
                      variant={filterType === spec.value ? 'filled' : 'outlined'}
                      color={filterType === spec.value ? 'primary' : 'default'}
                    />
                  ))}
                </Stack>
              </Box>

              <Grid container spacing={3}>
                {filteredTherapists.map((therapist) => (
                  <Grid item xs={12} sm={6} md={4} key={therapist.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-4px)',
                        },
                      }}
                      onClick={() => handleSelectTherapist(therapist)}
                    >
                      <CardHeader
                        avatar={
                          <Box
                            component="img"
                            src={therapist.avatarUrl}
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                          />
                        }
                        title={therapist.name}
                        subheader={therapist.specialization.toUpperCase()}
                      />
                      <CardContent>
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating
                              value={Math.round(therapist.rating * 2) / 2}
                              readOnly
                              size="small"
                            />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              ({therapist.reviewCount})
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {therapist.bio}
                            </Typography>
                          </Box>

                          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                            <Chip
                              label={`${therapist.experience} yrs exp`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`$${therapist.hourlyRate}/hr`}
                              size="small"
                              color="primary"
                            />
                          </Stack>

                          <Typography variant="body2">
                            <strong>{t('treatment.booking.available')}:</strong>{' '}
                            {therapist.availableHours}
                          </Typography>

                          <Typography variant="caption" sx={{ color: 'success.main' }}>
                            {therapist.responseTime}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          )}

          {/* Tab 2: Select Time Slot */}
          {tabValue === 1 && selectedTherapist && (
            <Stack spacing={3}>
              <Paper sx={{ p: 2, bgcolor: 'background.neutral' }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ alignItems: 'center' }}
                >
                  <Box
                    component="img"
                    src={selectedTherapist.avatarUrl}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <Stack>
                    <Typography variant="h6">{selectedTherapist.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {selectedTherapist.specialization.toUpperCase()} •{' '}
                      <Rating
                        value={Math.round(selectedTherapist.rating * 2) / 2}
                        readOnly
                        size="small"
                      />
                    </Typography>
                    <Typography variant="body2">${selectedTherapist.hourlyRate}/hour</Typography>
                  </Stack>
                </Stack>
              </Paper>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Available Time Slots
                </Typography>
                <Grid container spacing={2}>
                  {getTherapistSlots(selectedTherapist.id).map((slot) => (
                    <Grid item xs={12} sm={6} md={4} key={slot.id}>
                      <Paper
                        onClick={() => handleSelectSlot(slot)}
                        sx={{
                          p: 2,
                          cursor: slot.status === 'available' ? 'pointer' : 'default',
                          bgcolor:
                            slot.status === 'available'
                              ? 'background.paper'
                              : 'action.disabledBackground',
                          border: '1px solid',
                          borderColor: slot.status === 'available' ? 'primary.main' : 'divider',
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: slot.status === 'available' ? 2 : 0,
                            borderColor: slot.status === 'available' ? 'primary.dark' : 'divider',
                          },
                          opacity: slot.status === 'available' ? 1 : 0.6,
                        }}
                      >
                        <Stack spacing={1}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {format(slot.date, 'MMM dd, yyyy')}
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'primary.main' }}>
                            {slot.startTime} - {slot.endTime}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Chip
                              label={slot.status === 'available' ? 'Available' : 'Booked'}
                              size="small"
                              color={slot.status === 'available' ? 'success' : 'default'}
                              variant="outlined"
                            />
                            <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
                              ${slot.price}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Stack>
          )}
        </Stack>
      </Container>

      {/* Booking Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Your Booking</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Therapist
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {selectedTherapist?.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date & Time
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {selectedSlot && format(selectedSlot.date, 'MMM dd, yyyy')} at{' '}
                {selectedSlot?.startTime}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Price
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                ${selectedSlot?.price}
              </Typography>
            </Box>
            <TextField
              label="Notes (Optional)"
              multiline
              rows={3}
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              placeholder="Add any notes about your booking..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmBooking} variant="contained">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
