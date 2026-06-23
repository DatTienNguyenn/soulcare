import { Avatar, Box, Button, Paper, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { TherapyBooking } from 'src/type/therapist';

interface UpcomingSessionsTabProps {
  bookings: TherapyBooking[];
  onViewDetails: (booking: TherapyBooking) => void;
  onCancel: (booking: TherapyBooking) => void;
}

export function UpcomingSessionsTab({
  bookings,
  onViewDetails,
  onCancel,
}: UpcomingSessionsTabProps) {
  const upcomingBookings = bookings.filter((b) => b.status === 'booked');

  return (
    <Stack spacing={2}>
      {upcomingBookings.map((booking) => (
        <Paper key={booking.id} sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <Avatar
                src={booking.specialistAvatar || '/assets/images/default-avatar.png'}
                sx={{ width: 48, height: 48 }}
              />
              <Box>
                <Typography variant="h6">{booking.therapistName}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Therapy
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2">📅 {format(booking.date, 'MMM dd, yyyy')}</Typography>
                  <Typography variant="body2">
                    🕐 {booking.startTime} - {booking.endTime}
                  </Typography>
                  <Typography variant="body2">💰 ${booking.totalPrice}</Typography>
                </Box>
              </Box>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button variant="outlined" onClick={() => onViewDetails(booking)}>
                Details
              </Button>
              <Button variant="outlined" color="error" onClick={() => onCancel(booking)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
