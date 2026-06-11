import {
  Box,
  Stack,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { EHRResponse } from 'src/utils/specialist-api';
import { useLocales } from 'src/locale/use-locales';

interface BookingDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedBooking: any;
  getStatusColor: (status: string) => 'success' | 'warning' | 'error' | 'default';
  loadingEhrs: boolean;
  ehrs: EHRResponse[];
  onEhrClick: (ehr: EHRResponse) => void;
  onViewNotes: () => void;
}

export function BookingDetailsDialog({
  open,
  onClose,
  selectedBooking,
  getStatusColor,
  loadingEhrs,
  ehrs,
  onEhrClick,
  onViewNotes,
}: BookingDetailsDialogProps) {
  const { t } = useLocales();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('specialist.bookings.dialogs.bookingDetails')}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {selectedBooking && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('specialist.bookings.dialogs.patient')}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Avatar src={selectedBooking.userAvatar} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {selectedBooking.userName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {selectedBooking.userEmail}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('specialist.bookings.tabContent.type')}
              </Typography>
              <Typography variant="body1">
                {selectedBooking.type === 'psychology'
                  ? t('treatment.filter.psychology')
                  : selectedBooking.type === 'counseling'
                    ? t('treatment.filter.counseling')
                    : selectedBooking.type === 'meditation'
                      ? t('treatment.filter.meditation')
                      : selectedBooking.type === 'behavioral'
                        ? t('treatment.filter.behavioral')
                        : selectedBooking.type === 'general'
                          ? t('treatment.filter.all')
                          : String(selectedBooking.type).charAt(0).toUpperCase() +
                            String(selectedBooking.type).slice(1)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('specialist.bookings.dialogs.dateTime')}
              </Typography>
              <Typography variant="body1">
                {format(selectedBooking.date, 'EEEE, MMM dd, yyyy')}
              </Typography>
              <Typography variant="body1">
                {selectedBooking.startTime} - {selectedBooking.endTime}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('specialist.bookings.dialogs.duration')}
              </Typography>
              <Typography variant="body1">{selectedBooking.duration} minutes</Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('specialist.bookings.dialogs.price')}
              </Typography>
              <Typography variant="h6" sx={{ color: 'success.main' }}>
                ${selectedBooking.totalPrice}
              </Typography>
            </Box>

            <Box>
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
              />
            </Box>

            {selectedBooking.notes && (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.notes')}
                </Typography>
                <Typography variant="body1">{selectedBooking.notes}</Typography>
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

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                {t('specialist.bookings.dialogs.previousRecords')}
              </Typography>
              {loadingEhrs ? (
                <CircularProgress size={24} />
              ) : ehrs.length > 0 ? (
                <Stack spacing={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {ehrs.map((ehr) => (
                    <Paper
                      key={ehr.id}
                      sx={{
                        p: 2,
                        backgroundColor: 'background.neutral',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                      onClick={() => onEhrClick(ehr)}
                    >
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {ehr.createdAt
                          ? format(new Date(ehr.createdAt), 'MMM dd, yyyy')
                          : t('specialist.bookings.dialogs.unknownDate')}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {t('specialist.bookings.dialogs.diagnosis')}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} noWrap>
                          {ehr.diagnosis}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {t('specialist.bookings.dialogs.treatmentPlan')}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {ehr.treatmentPlan}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {t('specialist.bookings.dialogs.noRecords')}
                </Typography>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
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
