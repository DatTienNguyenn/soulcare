import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { TherapyBooking } from 'src/type/therapist';

interface SummaryCardsProps {
  bookings: TherapyBooking[];
}

export function SummaryCards({ bookings }: SummaryCardsProps) {
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const upcoming = bookings.filter((b) => b.status === 'booked').length;
  const totalSpent = bookings
    .filter((b) => b.status !== 'cancelled' && b.status !== 'reported')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const stats = [
    {
      label: 'Total Sessions',
      value: bookings.length,
      color: 'textSecondary' as const,
    },
    {
      label: 'Completed',
      value: completed,
      color: 'success.main' as const,
    },
    {
      label: 'Upcoming',
      value: upcoming,
      color: 'warning.main' as const,
    },
    {
      label: 'Total Spent',
      value: `$${totalSpent}`,
      color: 'primary.main' as const,
    },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="textSecondary" gutterBottom>
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
