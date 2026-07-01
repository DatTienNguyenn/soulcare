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
import { useLocales } from 'src/locale/use-locales';

interface CompletedSessionsTabProps {
  bookings: TherapyBooking[];
  onViewDetails: (booking: TherapyBooking) => void;
}

export function CompletedSessionsTab({ bookings, onViewDetails }: CompletedSessionsTabProps) {
  const { t } = useLocales();
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <Grid container spacing={3}>
      {completedBookings.map((booking) => (
        <Grid item xs={12} sm={6} md={4} key={booking.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              avatar={
                <Box
                  component="img"
                  src={booking.specialistAvatar || '/assets/images/default-avatar.png'}
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
                    {t('completedSessions.dateTime')}
                  </Typography>
                  <Typography variant="body1">
                    {format(booking.date, 'MMM dd, yyyy')} at {booking.startTime}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('completedSessions.duration')}
                  </Typography>
                  <Typography variant="body1">
                    {booking.duration} {t('treatment.history.minutes')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('completedSessions.yourReview')}
                  </Typography>
                  <Rating value={3.5} readOnly size="small" />
                  <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {t('completedSessions.reviewPlaceholder')}
                  </Typography>
                </Box>

                <Box sx={{ pt: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('completedSessions.price')}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'success.main' }}>
                    ${booking.totalPrice}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button fullWidth variant="outlined" onClick={() => onViewDetails(booking)}>
                {t('completedSessions.viewDetails')}
              </Button>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
