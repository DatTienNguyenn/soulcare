import { useMemo } from 'react';
import { Container, Grid, Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useSettingsContext } from 'src/components/settings';

import {
  _specialistBookings,
  _userBookingStats,
  _specialistAnalyticsSummary,
} from 'src/_mock/_specialist';
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

  // Prepare data for booking trend chart
  const bookingTrendData = useMemo(() => {
    const data: any[] = [];
    const bookingsByDate: { [key: string]: number } = {};

    _specialistBookings.forEach((booking) => {
      const dateKey = booking.date.toISOString().split('T')[0];
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
        value: _specialistBookings.filter((b) => b.status === 'completed').length,
        color: '#00C49F',
      },
      {
        name: 'Booked',
        value: _specialistBookings.filter((b) => b.status === 'booked').length,
        color: '#FFBB28',
      },
      {
        name: 'Cancelled',
        value: _specialistBookings.filter((b) => b.status === 'cancelled').length,
        color: '#FF8042',
      },
    ].filter((item) => item.value > 0);
  }, []);

  // Prepare data for therapy type distribution
  const therapyTypeData = useMemo(() => {
    const typeCount: { [key: string]: number } = {};

    _specialistBookings.forEach((booking) => {
      typeCount[booking.type] = (typeCount[booking.type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
    }));
  }, []);

  // Prepare data for rating distribution
  const ratingDistribution = useMemo(() => {
    const ratedBookings = _specialistBookings.filter((b) => b.rating);
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
  }, []);

  // Prepare top patients data
  const topPatients = useMemo(() => {
    return _userBookingStats.sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 5);
  }, []);

  // Prepare revenue by type
  const revenueByType = useMemo(() => {
    const revenueData: { [key: string]: number } = {};

    _specialistBookings
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
  }, []);

  // Prepare metrics data
  const metricsData = [
    {
      label: 'Average Rating',
      value: `${_specialistAnalyticsSummary.averageRating} ⭐`,
      sublabel: `${_specialistBookings.filter((b) => b.rating).length} ratings`,
      sublabelColor: 'success.main',
    },
    {
      label: 'Unique Patients',
      value: _specialistAnalyticsSummary.uniqueUsers,
      sublabel: 'Returning patients',
      sublabelColor: 'info.main',
    },
    {
      label: 'Completion Rate',
      value: `${((_specialistAnalyticsSummary.completedBookings / _specialistAnalyticsSummary.totalBookings) * 100).toFixed(0)}%`,
      sublabel: 'Sessions completed',
      sublabelColor: 'success.main',
    },
    {
      label: 'Cancel Rate',
      value: `${((_specialistAnalyticsSummary.cancelledBookings / _specialistAnalyticsSummary.totalBookings) * 100).toFixed(0)}%`,
      sublabel: 'Cancelled sessions',
      sublabelColor: 'error.main',
    },
  ];

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
              <TherapyTypeDistribution
                data={therapyTypeData}
                totalBookings={_specialistBookings.length}
              />
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
                  totalRated={_specialistBookings.filter((b) => b.rating).length}
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
