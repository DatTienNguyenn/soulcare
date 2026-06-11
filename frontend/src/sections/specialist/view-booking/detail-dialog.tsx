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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Booking Details</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {selectedBooking && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Patient
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
                Type
              </Typography>
              <Typography variant="body1">
                {selectedBooking.type.charAt(0).toUpperCase() + selectedBooking.type.slice(1)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date & Time
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
                Duration
              </Typography>
              <Typography variant="body1">{selectedBooking.duration} minutes</Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Price
              </Typography>
              <Typography variant="h6" sx={{ color: 'success.main' }}>
                ${selectedBooking.totalPrice}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Status
              </Typography>
              <Chip
                label={
                  selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)
                }
                color={getStatusColor(selectedBooking.status)}
              />
            </Box>

            {selectedBooking.notes && (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Notes
                </Typography>
                <Typography variant="body1">{selectedBooking.notes}</Typography>
              </Box>
            )}

            {selectedBooking.status === 'completed' && selectedBooking.rating && (
              <Box sx={{ p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Patient Feedback
                </Typography>
                <Typography variant="body1">
                  ⭐ {selectedBooking.rating} - {selectedBooking.feedback}
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Previous Health Records
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
                          : 'Unknown date'}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Diagnosis
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} noWrap>
                          {ehr.diagnosis}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Treatment Plan
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
                  No previous health records found for this patient.
                </Typography>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {selectedBooking?.status === 'completed' && (
          <Button onClick={onViewNotes} variant="contained">
            View Notes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
