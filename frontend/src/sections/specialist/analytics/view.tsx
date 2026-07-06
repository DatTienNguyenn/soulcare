import { useMemo } from 'react';
import { Container, Grid, Stack, CircularProgress, Box, Alert } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSettingsContext } from 'src/components/settings';
import { useSpecialistBookings } from 'src/hooks/use-specialist-bookings';
import { useLocales } from 'src/locale/use-locales';

import {
  AnalyticsHeader,
  AnalyticsMetrics,
  BookingTrendChart,
  BookingStatusChart,
  TherapyTypeDistribution,
  RevenueByTypeChart,
  RatingDistribution,
  TopPatientsTable,
} from './components';

// -------------------------------------------------------

export default function SpecialistAnalyticsView() {
  const settings = useSettingsContext();
  const { bookings, loading, error, getStatistics } = useSpecialistBookings();
  const { t } = useLocales();

  const stats = getStatistics();

  // Calculate general stats
  const uniqueUsersCount = useMemo(() => {
    const uniqueEmails = new Set(bookings.map((b) => b.userEmail));
    return uniqueEmails.size;
  }, [bookings]);

  const averageRating = useMemo(() => {
    const ratedBookings = bookings.filter((b) => b.rating);
    if (ratedBookings.length === 0) return 0;
    const sum = ratedBookings.reduce((acc, b) => acc + (b.rating || 0), 0);
    return (sum / ratedBookings.length).toFixed(1);
  }, [bookings]);

  // Prepare data for booking trend chart
  const bookingTrendData = useMemo(() => {
    const data: any[] = [];
    const bookingsByDate: { [key: string]: number } = {};

    bookings.forEach((booking) => {
      const dateKey = new Date(booking.date).toISOString().split('T')[0];
      bookingsByDate[dateKey] = (bookingsByDate[dateKey] || 0) + 1;
    });

    Object.keys(bookingsByDate)
      .sort()
      .forEach((date) => {
        data.push({
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          bookings: bookingsByDate[date],
        });
      });

    return data;
  }, [bookings]);

  // Prepare data for booking status pie chart
  const bookingStatusData = useMemo(() => {
    return [
      {
        name: t('specialist.analytics.status.completed'),
        value: bookings.filter((b) => b.status === 'completed').length,
        color: '#00C49F',
      },
      {
        name: t('specialist.analytics.status.booked'),
        value: bookings.filter((b) => b.status === 'booked').length,
        color: '#FFBB28',
      },
      {
        name: t('specialist.analytics.status.cancelled'),
        value: bookings.filter((b) => b.status === 'cancelled').length,
        color: '#FF8042',
      },
    ].filter((item) => item.value > 0);
  }, [bookings, t]);

  // Prepare data for therapy type distribution
  const therapyTypeData = useMemo(() => {
    const typeCount: { [key: string]: number } = {};

    bookings.forEach((booking) => {
      typeCount[booking.type] = (typeCount[booking.type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
    }));
  }, [bookings]);

  // Prepare data for rating distribution
  const ratingDistribution = useMemo(() => {
    const ratedBookings = bookings.filter((b) => b.rating);
    const starsText = t('specialist.analytics.rating.stars');

    const ratingBuckets: Record<string, number> = {
      [`5 ${starsText}`]: 0,
      [`4-4.9 ${starsText}`]: 0,
      [`3-3.9 ${starsText}`]: 0,
      [`2-2.9 ${starsText}`]: 0,
      [`1-1.9 ${starsText}`]: 0,
    };

    ratedBookings.forEach((booking) => {
      const rating = booking.rating || 0;
      if (rating === 5) ratingBuckets[`5 ${starsText}`] += 1;
      else if (rating >= 4) ratingBuckets[`4-4.9 ${starsText}`] += 1;
      else if (rating >= 3) ratingBuckets[`3-3.9 ${starsText}`] += 1;
      else if (rating >= 2) ratingBuckets[`2-2.9 ${starsText}`] += 1;
      else ratingBuckets[`1-1.9 ${starsText}`] += 1;
    });

    return Object.entries(ratingBuckets)
      .map(([rating, count]) => ({
        rating,
        count,
      }))
      .filter((item) => item.count > 0);
  }, [bookings, t]);

  // Prepare top patients data
  const topPatients = useMemo(() => {
    const patientStats = bookings.reduce(
      (acc, booking) => {
        const existing = acc.find((p) => p.userEmail === booking.userEmail);
        if (existing) {
          existing.bookingCount += 1;
          if (booking.rating) {
            existing.totalRating += booking.rating;
            existing.ratedCount += 1;
          }
          if (booking?.status !== 'cancelled' && booking?.status !== 'reported') {
            existing.totalSpent += booking.totalPrice;
          }
          existing.averageRating =
            existing.ratedCount > 0 ? existing.totalRating / existing.ratedCount : 0;
        } else {
          acc.push({
            userId: booking.userEmail,
            userName: booking.userName,
            userEmail: booking.userEmail,
            bookingCount: 1,
            totalRating: booking.rating || 0,
            ratedCount: booking.rating ? 1 : 0,
            totalSpent: booking.totalPrice,
            userAvatar: booking.userAvatar,
            averageRating: booking.rating || 0,
          });
        }
        return acc;
      },
      [] as Array<{
        userId: string;
        userName: string;
        userEmail: string;
        bookingCount: number;
        totalRating: number;
        ratedCount: number;
        totalSpent: number;
        userAvatar?: string;
        averageRating: number;
      }>
    );

    return patientStats.sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 5);
  }, [bookings]);

  // Prepare revenue by type
  const revenueByType = useMemo(() => {
    const revenueData: { [key: string]: number } = {};

    bookings
      .filter((b) => b.status !== 'cancelled')
      .forEach((booking) => {
        revenueData[booking.type] = (revenueData[booking.type] || 0) + booking.totalPrice;
      });

    return Object.entries(revenueData)
      .map(([type, revenue]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [bookings]);

  // Prepare metrics data
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const metricsData = [
    {
      label: t('specialist.analytics.metrics.averageRating'),
      value: `${averageRating} ⭐`,
      sublabel: `${bookings.filter((b) => b.rating).length} ${t('specialist.analytics.metrics.ratings')}`,
      sublabelColor: 'success.main',
    },
    {
      label: t('specialist.analytics.metrics.uniquePatients'),
      value: uniqueUsersCount,
      sublabel: t('specialist.analytics.metrics.returningPatients'),
      sublabelColor: 'info.main',
    },
    {
      label: t('specialist.analytics.metrics.completionRate'),
      value:
        stats.totalBookings > 0
          ? `${((stats.completedCount / stats.totalBookings) * 100).toFixed(0)}%`
          : '0%',
      sublabel: t('specialist.analytics.metrics.sessionsCompleted'),
      sublabelColor: 'success.main',
    },
    {
      label: t('specialist.analytics.metrics.cancelRate'),
      value:
        stats.totalBookings > 0
          ? `${((cancelledCount / stats.totalBookings) * 100).toFixed(0)}%`
          : '0%',
      sublabel: t('specialist.analytics.metrics.cancelledSessions'),
      sublabelColor: 'error.main',
    },
  ];

  if (loading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ py: 5 }}>
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('specialist.analytics.pageTitle')}</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ py: 5 }}>
        <Stack spacing={3}>
          <AnalyticsHeader
            title={t('specialist.analytics.header.title')}
            description={t('specialist.analytics.header.description')}
          />

          {error && <Alert severity="error">{error}</Alert>}

          {/* Key Metrics */}
          <AnalyticsMetrics metrics={metricsData} />

          {/* Charts Row 1 */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <BookingTrendChart data={bookingTrendData} />
            </Grid>
            <Grid item xs={12} md={6}>
              <BookingStatusChart data={bookingStatusData} />
            </Grid>
          </Grid>

          {/* Charts Row 2 */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TherapyTypeDistribution data={therapyTypeData} totalBookings={bookings.length} />
            </Grid>
            <Grid item xs={12} md={6}>
              <RevenueByTypeChart data={revenueByType} />
            </Grid>
          </Grid>

          {/* Rating Distribution */}
          {ratingDistribution.length > 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RatingDistribution
                  data={ratingDistribution}
                  totalRated={bookings.filter((b) => b.rating).length}
                />
              </Grid>
            </Grid>
          )}

          {/* Top Patients */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TopPatientsTable data={topPatients} />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}
