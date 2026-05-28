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
  Rating,
  Typography,
  Tab,
  Tabs,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import { Helmet } from 'react-helmet-async';

import { _therapyBookings, _therapists } from 'src/_mock';
import { TherapyBooking } from 'src/type/therapist';

// -------------------------------------------------------

export default function TreatmentHistoryView() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<TherapyBooking | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'booked'>('all');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [openReviewDialog, setOpenReviewDialog] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredBookings = _therapyBookings.filter((booking) => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  const handleViewDetails = (booking: TherapyBooking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleOpenReviewDialog = () => {
    setOpenDialog(false);
    setOpenReviewDialog(true);
  };

  const handleSubmitReview = () => {
    setOpenReviewDialog(false);
    setReviewRating(0);
    setReviewText('');
  };

  const getTherapistInfo = (therapistId: string) =>
    _therapists.find((therapist) => therapist.id === therapistId);

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

  const completedBookings = _therapyBookings.filter((b) => b.status === 'completed');
  const upcomingBookings = _therapyBookings.filter((b) => b.status === 'booked');

  return (
    <>
      <Helmet>
        <title>Treatment History | SoulCare</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              Treatment & Booking History
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              View and manage your therapy sessions
            </Typography>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography color="textSecondary" gutterBottom>
                      Total Sessions
                    </Typography>
                    <Typography variant="h4">{_therapyBookings.length}</Typography>
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
                      {completedBookings.length}
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
                      {upcomingBookings.length}
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
                      Total Spent
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'primary.main' }}>
                      ${_therapyBookings.reduce((sum, b) => sum + b.totalPrice, 0)}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="All Sessions" />
              <Tab label="Completed Sessions" />
              <Tab label="Upcoming Sessions" />
            </Tabs>
          </Box>

          {/* Tab 0: All Sessions */}
          {tabValue === 0 && (
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
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'background.neutral' }}>
                      <TableCell>Therapist</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking.id} hover>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {booking.therapistName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
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
                          <Chip
                            label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          )}

          {/* Tab 1: Completed Sessions */}
          {tabValue === 1 && (
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
                );
              })}
            </Grid>
          )}

          {/* Tab 2: Upcoming Sessions */}
          {tabValue === 2 && (
            <Stack spacing={2}>
              {upcomingBookings.map((booking) => (
                <Paper key={booking.id} sx={{ p: 2 }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Box>
                      <Typography variant="h6">{booking.therapistName}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Therapy
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Typography variant="body2">
                          📅 {format(booking.date, 'MMM dd, yyyy')}
                        </Typography>
                        <Typography variant="body2">
                          🕐 {booking.startTime} - {booking.endTime}
                        </Typography>
                        <Typography variant="body2">💰 ${booking.totalPrice}</Typography>
                      </Box>
                    </Box>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                      <Button variant="outlined" onClick={() => handleViewDetails(booking)}>
                        Details
                      </Button>
                      <Button variant="outlined" color="error">
                        Cancel
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          )}
        </Stack>
      </Container>

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Session Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedBooking && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Therapist
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {selectedBooking.therapistName}
                </Typography>
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

              {selectedBooking.status === 'completed' && (
                <Alert severity="success">
                  Session completed on{' '}
                  {format(selectedBooking.completedAt || new Date(), 'MMM dd, yyyy')}
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          {selectedBooking?.status === 'completed' ? (
            <>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Button onClick={handleOpenReviewDialog} variant="contained">
                Leave Review
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Button onClick={() => setOpenDialog(false)} color="error">
                Cancel Booking
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={() => setOpenReviewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Leave a Review</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                How was your session?
              </Typography>
              <Rating
                value={reviewRating}
                onChange={(event, newValue) => {
                  setReviewRating(newValue || 0);
                }}
                size="large"
              />
            </Box>
            <TextField
              label="Your Feedback"
              multiline
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this therapist..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReviewDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
