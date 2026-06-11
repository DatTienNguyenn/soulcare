import { useMemo } from 'react';
import { Container, Grid, Stack, CircularProgress, Box, Alert } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSettingsContext } from 'src/components/settings';
import { useSpecialistBookings } from 'src/hooks/use-specialist-bookings';

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
  }, []);

  // Prepare data for booking status pie chart
  const bookingStatusData = useMemo(() => {
    return [
      {
        name: 'Completed',
        value: bookings.filter((b) => b.status === 'completed').length,
        color: '#00C49F',
      },
      {
        name: 'Booked',
        value: bookings.filter((b) => b.status === 'booked').length,
        color: '#FFBB28',
      },
      {
        name: 'Cancelled',
        value: bookings.filter((b) => b.status === 'cancelled').length,
        color: '#FF8042',
      },
    ].filter((item) => item.value > 0);
  }, [bookings]);

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
    const ratingBuckets = {
      '5 Stars': 0,
      '4-4.9 Stars': 0,
      '3-3.9 Stars': 0,
      '2-2.9 Stars': 0,
      '1-1.9 Stars': 0,
    };

    ratedBookings.forEach((booking) => {
      const rating = booking.rating || 0;
      if (rating === 5) ratingBuckets['5 Stars'] += 1;
      else if (rating >= 4) ratingBuckets['4-4.9 Stars'] += 1;
      else if (rating >= 3) ratingBuckets['3-3.9 Stars'] += 1;
      else if (rating >= 2) ratingBuckets['2-2.9 Stars'] += 1;
      else ratingBuckets['1-1.9 Stars'] += 1;
    });

    return Object.entries(ratingBuckets)
      .map(([rating, count]) => ({
        rating,
        count,
      }))
      .filter((item) => item.count > 0);
  }, [bookings]);

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
          existing.totalSpent += booking.totalPrice;
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
      label: 'Average Rating',
      value: `${averageRating} ⭐`,
      sublabel: `${bookings.filter((b) => b.rating).length} ratings`,
      sublabelColor: 'success.main',
    },
    {
      label: 'Unique Patients',
      value: uniqueUsersCount,
      sublabel: 'Returning patients',
      sublabelColor: 'info.main',
    },
    {
      label: 'Completion Rate',
      value:
        stats.totalBookings > 0
          ? `${((stats.completedCount / stats.totalBookings) * 100).toFixed(0)}%`
          : '0%',
      sublabel: 'Sessions completed',
      sublabelColor: 'success.main',
    },
    {
      label: 'Cancel Rate',
      value:
        stats.totalBookings > 0
          ? `${((cancelledCount / stats.totalBookings) * 100).toFixed(0)}%`
          : '0%',
      sublabel: 'Cancelled sessions',
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
        <title>Analytics | Specialist</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ py: 5 }}>
        <Stack spacing={3}>
          <AnalyticsHeader
            title="Analytics Dashboard"
            description="Overview of your bookings and performance metrics"
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
