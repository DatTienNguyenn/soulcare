import {
  Alert,
  Box,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Grid,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { TherapyBooking } from 'src/type/therapist';
import { useLocales } from 'src/locale/use-locales';
import axios from 'src/utils/axios';

interface SessionDetailsDialogProps {
  open: boolean;
  booking: TherapyBooking | null;
  onClose: () => void;
  onReview: () => void;
  onCancel: () => void;
  onSaveNotes: (notes: string) => Promise<void>;
}

export function SessionDetailsDialog({
  open,
  booking,
  onClose,
  onReview,
  onCancel,
  onSaveNotes,
}: SessionDetailsDialogProps) {
  const { t } = useLocales();
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (booking) {
      setNotes(booking.notes || '');
    }
  }, [booking]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSaveNotes(notes);
    setIsSaving(false);
    onClose();
  };

  const handleSummarizeDiary = async () => {
    if (!booking) return;
    setIsSummarizing(true);
    try {
      const response = await axios.get(`/api/v1/ai/summary-diary`);
      const summary = response.data.response || response.data.message || response.data;

      setNotes((prevNotes) =>
        prevNotes ? `${prevNotes}\n\n[AI Summary]\n${summary}` : `[AI Summary]\n${summary}`
      );
    } catch (error) {
      console.error('Failed to generate summary', error);
    } finally {
      setIsSummarizing(false);
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

  const isEditable = booking?.status === 'booked';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('sessionDetails.title')}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {booking && (
          <Stack spacing={2.5}>
            {/* Therapist Info Header */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={booking.specialistAvatar} sx={{ width: 80, height: 80 }} />
              <Box>
                <Typography variant="h5">{booking.therapistName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                </Typography>
              </Box>
            </Stack>

            {/* Details Grid */}
            <Grid container spacing={2} rowSpacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.dateTime')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {format(booking.date, 'EEEE, MMM dd, yyyy')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.startTime} - {booking.endTime}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.duration')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {booking.duration} {t('treatment.history.minutes')}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.price')}
                </Typography>
                <Typography variant="h6" sx={{ color: 'success.main' }}>
                  ${booking.totalPrice}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.status')}
                </Typography>
                <Chip
                  label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  color={getStatusColor(booking.status)}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Box>
              {booking.status === 'reported' && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {t('sessionDetails.adminNote')}
                </Typography>
              )}
              {booking.status !== 'reported' && (
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {t('treatment.history.notesForSpecialist')}
                </Typography>
              )}
              <TextField
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('treatment.history.notesPlaceholder')}
                disabled={!isEditable || isSaving}
              />
              {isEditable && (
                <>
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleSummarizeDiary}
                      disabled={isSummarizing}
                      startIcon={isSummarizing ? <CircularProgress size={16} /> : null}
                    >
                      {isSummarizing
                        ? t('sessionDetails.summarizing')
                        : t('sessionDetails.summarizeCta')}
                    </Button>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: 'block', color: 'text.secondary' }}
                  >
                    {t('sessionDetails.summarizeNote')}
                  </Typography>
                </>
              )}
            </Box>

            {booking.status === 'completed' && (
              <Alert severity="success">
                {t('sessionDetails.completedOn', {
                  date: format(booking.completedAt || new Date(), 'MMM dd, yyyy'),
                })}
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
        {isEditable && (
          <Button onClick={handleSave} variant="contained" disabled={isSaving}>
            {isSaving ? t('treatment.history.saving') : t('treatment.history.saveNotes')}
          </Button>
        )}
        {booking?.status === 'completed' && (
          <Button onClick={onReview} variant="contained">
            {t('sessionDetails.leaveReview')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
