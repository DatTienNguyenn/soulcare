import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { SpecialistBooking } from 'src/hooks/use-specialist-bookings';
import { EHRResponse } from 'src/utils/specialist-api';
import { useLocales } from 'src/locale/use-locales';

interface AllBookingsTabProps {
  filteredBookings: SpecialistBooking[];
  filterStatus: string;
  setFilterStatus: (status: 'all' | 'completed' | 'booked' | 'cancelled') => void;
  getStatusColor: (status: string) => 'success' | 'warning' | 'error' | 'default';
  handleViewDetails: (booking: SpecialistBooking) => void;
}

export function AllBookingsTab({
  filteredBookings,
  filterStatus,
  setFilterStatus,
  getStatusColor,
  handleViewDetails,
}: AllBookingsTabProps) {
  const { t } = useLocales();

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip
          label={t('specialist.bookings.tabs.allFilter')}
          onClick={() => setFilterStatus('all')}
          variant={filterStatus === 'all' ? 'filled' : 'outlined'}
          color={filterStatus === 'all' ? 'primary' : 'default'}
        />
        <Chip
          label={t('specialist.bookings.tabs.completed')}
          onClick={() => setFilterStatus('completed')}
          variant={filterStatus === 'completed' ? 'filled' : 'outlined'}
          color={filterStatus === 'completed' ? 'success' : 'default'}
        />
        <Chip
          label={t('specialist.bookings.tabs.upcoming')}
          onClick={() => setFilterStatus('booked')}
          variant={filterStatus === 'booked' ? 'filled' : 'outlined'}
          color={filterStatus === 'booked' ? 'warning' : 'default'}
        />
        <Chip
          label={t('specialist.analytics.status.cancelled')}
          onClick={() => setFilterStatus('cancelled')}
          variant={filterStatus === 'cancelled' ? 'filled' : 'outlined'}
          color={filterStatus === 'cancelled' ? 'error' : 'default'}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.neutral' }}>
              <TableCell>{t('specialist.bookings.tabContent.patient')}</TableCell>
              <TableCell>{t('specialist.bookings.tabContent.type')}</TableCell>
              <TableCell>{t('specialist.bookings.tabContent.dateTime')}</TableCell>
              <TableCell>{t('specialist.bookings.tabContent.duration')}</TableCell>
              <TableCell>{t('specialist.bookings.tabContent.price')}</TableCell>
              <TableCell>{t('specialist.bookings.tabContent.rating')}</TableCell>
              <TableCell>{t('specialist.bookings.tabContent.status')}</TableCell>
              <TableCell align="right">{t('specialist.bookings.tabContent.action')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar src={booking.userAvatar} sx={{ width: 32, height: 32 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {booking.userName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {booking.userEmail}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        booking.type === 'psychology'
                          ? t('treatment.filter.psychology')
                          : booking.type === 'counseling'
                            ? t('treatment.filter.counseling')
                            : booking.type === 'meditation'
                              ? t('treatment.filter.meditation')
                              : booking.type === 'behavioral'
                                ? t('treatment.filter.behavioral')
                                : booking.type === 'general'
                                  ? t('treatment.filter.general')
                                  : String(booking.type).charAt(0).toUpperCase() +
                                    String(booking.type).slice(1)
                      }
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {format(booking.date, 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {booking.startTime} - {booking.endTime}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{booking.duration} min</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ color: 'success.main', fontWeight: 600 }}>
                      ${booking.totalPrice}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {booking.rating ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2">{booking.rating}</Typography>
                        <Typography variant="body2">⭐</Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {t('specialist.bookings.tabContent.pending')}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        booking.status === 'completed'
                          ? t('specialist.analytics.status.completed')
                          : booking.status === 'booked'
                            ? t('specialist.analytics.status.booked')
                            : booking.status === 'cancelled'
                              ? t('specialist.analytics.status.cancelled')
                              : String(booking.status).charAt(0).toUpperCase() +
                                String(booking.status).slice(1)
                      }
                      size="small"
                      color={getStatusColor(booking.status)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => handleViewDetails(booking)} variant="text">
                      {t('specialist.bookings.tabContent.view')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography color="textSecondary">
                    {t('specialist.bookings.tabContent.noBookings')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

interface CompletedBookingsTabProps {
  completedBookings: SpecialistBooking[];
  handleViewDetails: (booking: SpecialistBooking) => void;
}

export function CompletedBookingsTab({
  completedBookings,
  handleViewDetails,
}: CompletedBookingsTabProps) {
  const { t } = useLocales();

  if (completedBookings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography color="textSecondary">
          {t('specialist.bookings.tabContent.noCompleted')}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {completedBookings.map((booking) => (
        <Grid item xs={12} sm={6} md={4} key={booking.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader
              avatar={<Avatar src={booking.userAvatar} />}
              title={booking.userName}
              subheader={
                booking.type === 'psychology'
                  ? t('treatment.filter.psychology')
                  : booking.type === 'counseling'
                    ? t('treatment.filter.counseling')
                    : booking.type === 'meditation'
                      ? t('treatment.filter.meditation')
                      : booking.type === 'behavioral'
                        ? t('treatment.filter.behavioral')
                        : booking.type === 'general'
                          ? t('treatment.filter.general')
                          : String(booking.type).toUpperCase()
              }
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('specialist.bookings.tabContent.dateTime')}
                  </Typography>
                  <Typography variant="body1">
                    {format(booking.date, 'MMM dd, yyyy')} at {booking.startTime}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('specialist.bookings.tabContent.duration')}
                  </Typography>
                  <Typography variant="body1">{booking.duration} minutes</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('specialist.bookings.tabContent.patientRating')}
                  </Typography>
                  {booking.rating ? (
                    <Stack spacing={1}>
                      <Typography variant="body1">
                        {'⭐'.repeat(Math.floor(booking.rating))}
                        {booking.rating % 1 !== 0 && '✨'} {booking.rating}
                      </Typography>
                      <Typography variant="caption">{booking.feedback}</Typography>
                    </Stack>
                  ) : (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {t('specialist.bookings.tabContent.noRating')}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ pt: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {t('specialist.bookings.tabContent.price')}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'success.main' }}>
                    ${booking.totalPrice}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button fullWidth variant="outlined" onClick={() => handleViewDetails(booking)}>
                {t('specialist.bookings.tabContent.viewDetails')}
              </Button>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

interface UpcomingBookingsTabProps {
  upcomingBookings: SpecialistBooking[];
  handleViewDetails: (booking: SpecialistBooking) => void;
}

export function UpcomingBookingsTab({
  upcomingBookings,
  handleViewDetails,
}: UpcomingBookingsTabProps) {
  const { t } = useLocales();

  if (upcomingBookings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography color="textSecondary">
          {t('specialist.bookings.tabContent.noUpcoming')}
        </Typography>
      </Box>
    );
  }

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
              <Avatar src={booking.userAvatar} sx={{ width: 48, height: 48 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{booking.userName}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {booking.type === 'psychology'
                    ? t('treatment.filter.psychology')
                    : booking.type === 'counseling'
                      ? t('treatment.filter.counseling')
                      : booking.type === 'meditation'
                        ? t('treatment.filter.meditation')
                        : booking.type === 'behavioral'
                          ? t('treatment.filter.behavioral')
                          : booking.type === 'general'
                            ? t('treatment.filter.general')
                            : String(booking.type).charAt(0).toUpperCase() +
                              String(booking.type).slice(1)}{' '}
                  {t('specialist.bookings.tabContent.therapy')}
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
              <Button variant="outlined" onClick={() => handleViewDetails(booking)}>
                {t('specialist.bookings.tabContent.details')}
              </Button>
              <Button variant="outlined" color="error">
                {t('specialist.bookings.tabContent.reschedule')}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

interface UserStatsTabProps {
  bookings: SpecialistBooking[];
}

export function UserStatsTab({ bookings }: UserStatsTabProps) {
  const { t } = useLocales();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={t('specialist.bookings.tabContent.userTitle')} />
          <CardContent>
            {bookings.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'background.neutral' }}>
                      <TableCell>{t('specialist.bookings.tabContent.patientName')}</TableCell>
                      <TableCell align="right">
                        {t('specialist.bookings.tabContent.totalBookings')}
                      </TableCell>
                      <TableCell align="right">
                        {t('specialist.bookings.tabContent.averageRating')}
                      </TableCell>
                      <TableCell align="right">
                        {t('specialist.bookings.tabContent.totalRevenue')}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(() => {
                      // Group bookings by patient
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
                          } else {
                            acc.push({
                              userName: booking.userName,
                              userEmail: booking.userEmail,
                              bookingCount: 1,
                              totalRating: booking.rating || 0,
                              ratedCount: booking.rating ? 1 : 0,
                              totalSpent: booking.totalPrice,
                            });
                          }
                          return acc;
                        },
                        [] as Array<{
                          userName: string;
                          userEmail: string;
                          bookingCount: number;
                          totalRating: number;
                          ratedCount: number;
                          totalSpent: number;
                        }>
                      );

                      return patientStats.map((stat) => (
                        <TableRow key={stat.userEmail} hover>
                          <TableCell>{stat.userName}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={stat.bookingCount}
                              color="primary"
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            {stat.ratedCount > 0 ? (
                              <Typography variant="body2">
                                ⭐ {(stat.totalRating / stat.ratedCount).toFixed(1)}
                              </Typography>
                            ) : (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {t('specialist.bookings.tabContent.noRating')}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              sx={{ color: 'success.main', fontWeight: 600 }}
                            >
                              ${stat.totalSpent.toFixed(2)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="textSecondary" align="center" sx={{ py: 3 }}>
                {t('specialist.bookings.tabContent.noData')}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
