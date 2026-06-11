import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';

interface BookingSummaryCardsProps {
  stats: {
    totalBookings: number;
    completedCount: number;
    upcomingCount: number;
    totalRevenue: number;
  };
}

export function BookingSummaryCards({ stats }: BookingSummaryCardsProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography color="textSecondary" gutterBottom>
                Total Bookings
              </Typography>
              <Typography variant="h4">{stats.totalBookings}</Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography color="textSecondary" gutterBottom>
                Completed
              </Typography>
              <Typography variant="h4" sx={{ color: 'success.main' }}>
                {stats.completedCount}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography color="textSecondary" gutterBottom>
                Upcoming
              </Typography>
              <Typography variant="h4" sx={{ color: 'warning.main' }}>
                {stats.upcomingCount}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography color="textSecondary" gutterBottom>
                Total Revenue
              </Typography>
              <Typography variant="h4" sx={{ color: 'primary.main' }}>
                ${stats.totalRevenue.toFixed(2)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
