import { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { format, parse } from 'date-fns';

import { TherapyType } from 'src/type/therapist';
import { useLocales } from 'src/locale/use-locales';
import { useTherapyBooking } from 'src/hooks/use-therapy-booking';
import { PublicSpecialistDTO, AvailableSlotDTO } from 'src/utils/specialist-api';

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
      // Fetch available slots for the selected therapist
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
      // Parse the date from the slot
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
            <Stack spacing={3}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {!loading && (
                <>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      {t('treatment.booking.filterBySpecialization')}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                      {specializations.map((spec) => (
                        <Chip
                          key={spec.value}
                          label={spec.label}
                          onClick={() => setFilterType(spec.value as TherapyType | 'all')}
                          variant={filterType === spec.value ? 'filled' : 'outlined'}
                          color={filterType === spec.value ? 'primary' : 'default'}
                        />
                      ))}
                    </Stack>
                  </Box>

                  {filteredTherapists.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        No therapists available for this specialization
                      </Typography>
                    </Box>
                  ) : (
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
                                  src={therapist.avatarUrl || '/assets/images/default-avatar.png'}
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                  }}
                                />
                              }
                              title={therapist.name}
                              subheader={'SPECIALIST'}
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

                                {therapist.specializations &&
                                  therapist.specializations.length > 0 && (
                                    <Box>
                                      <Typography
                                        variant="caption"
                                        sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
                                      >
                                        <strong>Specializations:</strong>
                                      </Typography>
                                      <Stack
                                        direction="row"
                                        spacing={0.5}
                                        sx={{ flexWrap: 'wrap' }}
                                      >
                                        {therapist.specializations.map((spec, idx) => (
                                          <Chip
                                            key={idx}
                                            label={
                                              spec.charAt(0).toUpperCase() +
                                              spec.slice(1).toLowerCase()
                                            }
                                            size="small"
                                            variant="outlined"
                                          />
                                        ))}
                                      </Stack>
                                    </Box>
                                  )}

                                {therapist.languages && therapist.languages.length > 0 && (
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    <strong>Languages:</strong> {therapist.languages.join(', ')}
                                  </Typography>
                                )}

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
                  )}
                </>
              )}
            </Stack>
          )}

          {/* Tab 2: Select Time Slot */}
          {tabValue === 1 && selectedTherapist && (
            <Stack spacing={3}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {!loading && (
                <>
                  <Paper sx={{ p: 2, bgcolor: 'background.neutral' }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      sx={{ alignItems: 'center' }}
                    >
                      <Box
                        component="img"
                        src={selectedTherapist.avatarUrl || '/assets/images/default-avatar.png'}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <Stack sx={{ flex: 1 }}>
                        <Typography variant="h6">{selectedTherapist.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          {selectedTherapist.specializations &&
                          selectedTherapist.specializations.length > 0
                            ? selectedTherapist.specializations[0].toUpperCase()
                            : 'Specialist'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating
                            value={Math.round(selectedTherapist.rating * 2) / 2}
                            readOnly
                            size="small"
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            ({selectedTherapist.reviewCount})
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body2">
                            <strong>${selectedTherapist.hourlyRate}/hour</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {selectedTherapist.experience} years exp.
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Paper>

                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      Available Time Slots
                    </Typography>
                    {getTherapistSlots(selectedTherapist.id).length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          No available slots for this therapist
                        </Typography>
                      </Box>
                    ) : (
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
                                borderColor:
                                  slot.status === 'available' ? 'primary.main' : 'divider',
                                transition: 'all 0.3s',
                                '&:hover': {
                                  boxShadow: slot.status === 'available' ? 2 : 0,
                                  borderColor:
                                    slot.status === 'available' ? 'primary.dark' : 'divider',
                                },
                                opacity: slot.status === 'available' ? 1 : 0.6,
                              }}
                            >
                              <Stack spacing={1}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {format(
                                    parse(slot.date, 'yyyy-MM-dd', new Date()),
                                    'MMM dd, yyyy'
                                  )}
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
                    )}
                  </Box>
                </>
              )}
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
                {selectedSlot &&
                  format(parse(selectedSlot.date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy')}{' '}
                at {selectedSlot?.startTime}
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
