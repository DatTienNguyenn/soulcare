import {
  Box,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  Grid,
} from '@mui/material';
import { format } from 'date-fns';
import { useLocales } from 'src/locale/use-locales';

interface BookingDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedBooking: any;
  getStatusColor: (status: string) => 'success' | 'warning' | 'error' | 'default';
  onViewNotes: () => void;
  onViewPatientRecords?: () => void;
}

export function BookingDetailsDialog({
  open,
  onClose,
  selectedBooking,
  getStatusColor,
  onViewNotes,
  onViewPatientRecords,
}: BookingDetailsDialogProps) {
  const { t } = useLocales();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('specialist.bookings.dialogs.bookingDetails')}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {selectedBooking && (
          <Stack spacing={2.5}>
            {/* Patient Info Header */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar src={selectedBooking.userAvatar} sx={{ width: 80, height: 80 }} />
              <Box>
                <Typography variant="h5">{selectedBooking.userName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBooking.userEmail}
                </Typography>
              </Box>
            </Stack>

            {/* Details Grid */}
            <Grid container spacing={2} rowSpacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.tabContent.type')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedBooking.type === 'psychology'
                    ? t('treatment.filter.psychology')
                    : selectedBooking.type === 'counseling'
                      ? t('treatment.filter.counseling')
                      : selectedBooking.type === 'meditation'
                        ? t('treatment.filter.meditation')
                        : selectedBooking.type === 'behavioral'
                          ? t('treatment.filter.behavioral')
                          : selectedBooking.type === 'general'
                            ? t('treatment.filter.general')
                            : String(selectedBooking.type).charAt(0).toUpperCase() +
                              String(selectedBooking.type).slice(1)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.dateTime')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {format(selectedBooking.date, 'EEEE, MMM dd, yyyy')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedBooking.startTime} - {selectedBooking.endTime}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.duration')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedBooking.duration} minutes
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.price')}
                </Typography>
                <Typography variant="h6" sx={{ color: 'success.main' }}>
                  ${selectedBooking.totalPrice}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.status')}
                </Typography>
                <Chip
                  label={
                    selectedBooking.status === 'completed'
                      ? t('specialist.analytics.status.completed')
                      : selectedBooking.status === 'booked'
                        ? t('specialist.analytics.status.booked')
                        : selectedBooking.status === 'cancelled'
                          ? t('specialist.analytics.status.cancelled')
                          : selectedBooking.status === 'pending'
                            ? t('specialist.bookings.tabContent.pending')
                            : String(selectedBooking.status).charAt(0).toUpperCase() +
                              String(selectedBooking.status).slice(1)
                  }
                  color={getStatusColor(selectedBooking.status)}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {selectedBooking.notes && (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.notes')}
                </Typography>
                <Typography variant="body1" noWrap>
                  {selectedBooking.notes}
                </Typography>
              </Box>
            )}

            {selectedBooking.status === 'completed' && selectedBooking.rating && (
              <Box sx={{ p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  {t('specialist.bookings.dialogs.patientFeedback')}
                </Typography>
                <Typography variant="body1">
                  ⭐ {selectedBooking.rating} - {selectedBooking.feedback}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {onViewPatientRecords && (
          <Button
            onClick={onViewPatientRecords}
            variant="contained"
            color="primary"
            sx={{ mr: 'auto' }}
          >
            {t('specialist.bookings.dialogs.viewPatientRecords') || 'View Patient Records'}
          </Button>
        )}
        <Button onClick={onClose}>{t('specialist.bookings.dialogs.close')}</Button>
        {selectedBooking?.status === 'completed' && (
          <Button onClick={onViewNotes} variant="contained">
            {t('specialist.bookings.dialogs.viewNotes')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
