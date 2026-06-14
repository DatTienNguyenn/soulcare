import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useLocales } from 'src/locale/use-locales';

interface BookingSummaryCardsProps {
  stats: {
    totalBookings: number;
    completedCount: number;
    upcomingCount: number;
    totalRevenue: number;
  };
}

export function BookingSummaryCards({ stats }: BookingSummaryCardsProps) {
  const { t } = useLocales();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography color="textSecondary" gutterBottom>
                {t('specialist.bookings.summary.totalBookings')}
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
                {t('specialist.bookings.summary.completed')}
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
                {t('specialist.bookings.summary.upcoming')}
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
                {t('specialist.bookings.summary.totalRevenue')}
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
