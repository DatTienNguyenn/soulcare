import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { TherapyBooking } from 'src/type/therapist';
import { _therapists } from 'src/_mock';

interface CompletedSessionsTabProps {
  bookings: TherapyBooking[];
  onViewDetails: (booking: TherapyBooking) => void;
}

export function CompletedSessionsTab({ bookings, onViewDetails }: CompletedSessionsTabProps) {
  const getTherapistInfo = (therapistId: string) =>
    _therapists.find((therapist) => therapist.id === therapistId);

  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <Grid container spacing={3}>
      {completedBookings.map((booking) => {
        const therapist = getTherapistInfo(booking.therapistId);
        return (
          <Grid item xs={12} sm={6} md={4} key={booking.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardHeader
                avatar={
                  <Box
                    component="img"
                    src={therapist?.avatarUrl}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                }
                title={booking.therapistName}
                subheader={booking.type.toUpperCase()}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Date & Time
                    </Typography>
                    <Typography variant="body1">
                      {format(booking.date, 'MMM dd, yyyy')} at {booking.startTime}
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
                      Your Review
                    </Typography>
                    <Rating value={3.5} readOnly size="small" />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      Great session, very helpful with my anxiety concerns.
                    </Typography>
                  </Box>

                  <Box sx={{ pt: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Price
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'success.main' }}>
                      ${booking.totalPrice}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button fullWidth variant="outlined" onClick={() => onViewDetails(booking)}>
                  View Details
                </Button>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
