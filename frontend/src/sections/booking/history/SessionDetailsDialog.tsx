import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { TherapyBooking } from 'src/type/therapist';

interface SessionDetailsDialogProps {
  open: boolean;
  booking: TherapyBooking | null;
  onClose: () => void;
  onReview: () => void;
}

export function SessionDetailsDialog({
  open,
  booking,
  onClose,
  onReview,
}: SessionDetailsDialogProps) {
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Session Details</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {booking && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Therapist
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {booking.therapistName}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Type
              </Typography>
              <Typography variant="body1">
                {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date & Time
              </Typography>
              <Typography variant="body1">{format(booking.date, 'EEEE, MMM dd, yyyy')}</Typography>
              <Typography variant="body1">
                {booking.startTime} - {booking.endTime}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Duration
              </Typography>
              <Typography variant="body1">{booking.duration} minutes</Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Price
              </Typography>
              <Typography variant="h6" sx={{ color: 'success.main' }}>
                ${booking.totalPrice}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Status
              </Typography>
              <Chip
                label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                color={getStatusColor(booking.status)}
              />
            </Box>

            {booking.notes && (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Notes
                </Typography>
                <Typography variant="body1">{booking.notes}</Typography>
              </Box>
            )}

            {booking.status === 'completed' && (
              <Alert severity="success">
                Session completed on {format(booking.completedAt || new Date(), 'MMM dd, yyyy')}
              </Alert>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {booking?.status === 'completed' ? (
          <>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={onReview} variant="contained">
              Leave Review
            </Button>
          </>
        ) : (
          <>
            <Button onClick={onClose}>Close</Button>
            <Button onClick={onClose} color="error">
              Cancel Booking
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
