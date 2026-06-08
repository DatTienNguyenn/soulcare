import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
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
  TextField,
  Typography,
  Tab,
  Tabs,
  Avatar,
  Badge,
  CircularProgress,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';

import { SpecialistBooking, useSpecialistBookings } from 'src/hooks/use-specialist-bookings';

// -------------------------------------------------------

export default function SpecialistBookingView() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'booked' | 'cancelled'>(
    'all'
  );
  const [openNoteDialog, setOpenNoteDialog] = useState(false);
  const [noteText, setNoteText] = useState('');

  // Use the specialist bookings hook
  const { bookings, loading, error, getBookingsByStatus, getStatistics } = useSpecialistBookings();

  const stats = getStatistics();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredBookings = (() => {
    if (filterStatus === 'all') return bookings;
    return bookings.filter((booking) => booking.status === filterStatus);
  })();

  const handleViewDetails = (booking: SpecialistBooking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleOpenNoteDialog = () => {
    setOpenDialog(false);
    if (selectedBooking?.notes) {
      setNoteText(selectedBooking.notes);
    }
    setOpenNoteDialog(true);
  };

  const handleSaveNote = () => {
    setOpenNoteDialog(false);
    setNoteText('');
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'booked':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const completedBookings = getBookingsByStatus('completed');
  const upcomingBookings = getBookingsByStatus('booked');
  const cancelledBookings = getBookingsByStatus('cancelled');

  return (
    <>
      <Helmet>
        <title>My Bookings | Specialist</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              My Bookings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Manage and view all patient bookings
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {/* Summary Cards */}
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

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="All Bookings" />
              <Tab label="Completed" />
              <Tab label="Upcoming" />
              <Tab label="Users" />
            </Tabs>
          </Box>

          {/* Tab 0: All Bookings */}
          {tabValue === 0 && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label="All"
                      onClick={() => setFilterStatus('all')}
                      variant={filterStatus === 'all' ? 'filled' : 'outlined'}
                      color={filterStatus === 'all' ? 'primary' : 'default'}
                    />
                    <Chip
                      label="Completed"
                      onClick={() => setFilterStatus('completed')}
                      variant={filterStatus === 'completed' ? 'filled' : 'outlined'}
                      color={filterStatus === 'completed' ? 'success' : 'default'}
                    />
                    <Chip
                      label="Upcoming"
                      onClick={() => setFilterStatus('booked')}
                      variant={filterStatus === 'booked' ? 'filled' : 'outlined'}
                      color={filterStatus === 'booked' ? 'warning' : 'default'}
                    />
                    <Chip
                      label="Cancelled"
                      onClick={() => setFilterStatus('cancelled')}
                      variant={filterStatus === 'cancelled' ? 'filled' : 'outlined'}
                      color={filterStatus === 'cancelled' ? 'error' : 'default'}
                    />
                  </Box>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: 'background.neutral' }}>
                          <TableCell>Patient</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Date & Time</TableCell>
                          <TableCell>Duration</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="right">Action</TableCell>
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
                                    booking.type.charAt(0).toUpperCase() + booking.type.slice(1)
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
                                <Typography
                                  variant="subtitle2"
                                  sx={{ color: 'success.main', fontWeight: 600 }}
                                >
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
                                    Pending
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={
                                    booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
                                  }
                                  size="small"
                                  color={getStatusColor(booking.status)}
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  size="small"
                                  onClick={() => handleViewDetails(booking)}
                                  variant="text"
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                              <Typography color="textSecondary">No bookings found</Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </>
          )}

          {/* Tab 1: Completed Bookings */}
          {tabValue === 1 && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : completedBookings.length > 0 ? (
                <Grid container spacing={3}>
                  {completedBookings.map((booking) => (
                    <Grid item xs={12} sm={6} md={4} key={booking.id}>
                      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <CardHeader
                          avatar={<Avatar src={booking.userAvatar} />}
                          title={booking.userName}
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
                                Patient Rating
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
                                  No rating yet
                                </Typography>
                              )}
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
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => handleViewDetails(booking)}
                          >
                            View Details
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography color="textSecondary">No completed bookings yet</Typography>
                </Box>
              )}
            </>
          )}

          {/* Tab 2: Upcoming Bookings */}
          {tabValue === 2 && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : upcomingBookings.length > 0 ? (
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
                              {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Therapy
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body2">
                                📅 {format(booking.date, 'MMM dd, yyyy')}
                              </Typography>
                              <Typography variant="body2">
                                🕐 {booking.startTime} - {booking.endTime}
                              </Typography>
                              <Typography variant="body2">💰 ${booking.totalPrice}</Typography>
                            </Box>
                          </Box>
                        </Stack>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                          <Button variant="outlined" onClick={() => handleViewDetails(booking)}>
                            Details
                          </Button>
                          <Button variant="outlined" color="error">
                            Reschedule
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <Typography color="textSecondary">No upcoming bookings</Typography>
                </Box>
              )}
            </>
          )}

          {/* Tab 3: User Statistics */}
          {tabValue === 3 && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card>
                      <CardHeader title="Patient Booking Statistics" />
                      <CardContent>
                        {bookings.length > 0 ? (
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: 'background.neutral' }}>
                                  <TableCell>Patient Name</TableCell>
                                  <TableCell align="right">Total Bookings</TableCell>
                                  <TableCell align="right">Average Rating</TableCell>
                                  <TableCell align="right">Total Revenue</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(() => {
                                  // Group bookings by patient
                                  const patientStats = bookings.reduce(
                                    (acc, booking) => {
                                      const existing = acc.find(
                                        (p) => p.userEmail === booking.userEmail
                                      );
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
                                          <Typography
                                            variant="caption"
                                            sx={{ color: 'text.secondary' }}
                                          >
                                            No rating
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
                            No booking data available
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Stack>
      </Container>

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedBooking && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Patient
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <Avatar src={selectedBooking.userAvatar} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {selectedBooking.userName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {selectedBooking.userEmail}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Type
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.type.charAt(0).toUpperCase() + selectedBooking.type.slice(1)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Date & Time
                </Typography>
                <Typography variant="body1">
                  {format(selectedBooking.date, 'EEEE, MMM dd, yyyy')}
                </Typography>
                <Typography variant="body1">
                  {selectedBooking.startTime} - {selectedBooking.endTime}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Duration
                </Typography>
                <Typography variant="body1">{selectedBooking.duration} minutes</Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Price
                </Typography>
                <Typography variant="h6" sx={{ color: 'success.main' }}>
                  ${selectedBooking.totalPrice}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Status
                </Typography>
                <Chip
                  label={
                    selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)
                  }
                  color={getStatusColor(selectedBooking.status)}
                />
              </Box>

              {selectedBooking.notes && (
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Notes
                  </Typography>
                  <Typography variant="body1">{selectedBooking.notes}</Typography>
                </Box>
              )}

              {selectedBooking.status === 'completed' && selectedBooking.rating && (
                <Box sx={{ p: 2, backgroundColor: 'info.lighter', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Patient Feedback
                  </Typography>
                  <Typography variant="body1">
                    ⭐ {selectedBooking.rating} - {selectedBooking.feedback}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {selectedBooking?.status === 'completed' && (
            <Button onClick={handleOpenNoteDialog} variant="contained">
              View Notes
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog
        open={openNoteDialog}
        onClose={() => setOpenNoteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Session Notes</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Session Notes"
            multiline
            rows={6}
            value={noteText}
            disabled
            fullWidth
            variant="outlined"
            placeholder="No notes available"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNoteDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
