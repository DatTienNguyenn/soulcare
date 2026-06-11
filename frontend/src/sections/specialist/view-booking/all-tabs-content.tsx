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
  TextField,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { SpecialistBooking } from 'src/hooks/use-specialist-bookings';
import { EHRResponse } from 'src/utils/specialist-api';

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
  return (
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
                        Pending
                      </Typography>
                    )}
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
                    <Button size="small" onClick={() => handleViewDetails(booking)} variant="text">
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
  if (completedBookings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography color="textSecondary">No completed bookings yet</Typography>
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
              <Button fullWidth variant="outlined" onClick={() => handleViewDetails(booking)}>
                View Details
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
  if (upcomingBookings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography color="textSecondary">No upcoming bookings</Typography>
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
                  {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Therapy
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
  );
}

interface UserStatsTabProps {
  bookings: SpecialistBooking[];
}

export function UserStatsTab({ bookings }: UserStatsTabProps) {
  return (
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
  );
}

// -------------------------------------------------------
// 3. Dialogs
// -------------------------------------------------------
interface BookingDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedBooking: any;
  getStatusColor: (status: string) => 'success' | 'warning' | 'error' | 'default';
  loadingEhrs: boolean;
  ehrs: EHRResponse[];
  onEhrClick: (ehr: EHRResponse) => void;
  onViewNotes: () => void;
}

export function BookingDetailsDialog({
  open,
  onClose,
  selectedBooking,
  getStatusColor,
  loadingEhrs,
  ehrs,
  onEhrClick,
  onViewNotes,
}: BookingDetailsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                Previous Health Records
              </Typography>
              {loadingEhrs ? (
                <CircularProgress size={24} />
              ) : ehrs.length > 0 ? (
                <Stack spacing={2} sx={{ maxHeight: 300, overflowY: 'auto' }}>
                  {ehrs.map((ehr) => (
                    <Paper
                      key={ehr.id}
                      sx={{
                        p: 2,
                        backgroundColor: 'background.neutral',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'action.hover' },
                      }}
                      onClick={() => onEhrClick(ehr)}
                    >
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {ehr.createdAt
                          ? format(new Date(ehr.createdAt), 'MMM dd, yyyy')
                          : 'Unknown date'}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Diagnosis
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }} noWrap>
                          {ehr.diagnosis}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Treatment Plan
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {ehr.treatmentPlan}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No previous health records found for this patient.
                </Typography>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {selectedBooking?.status === 'completed' && (
          <Button onClick={onViewNotes} variant="contained">
            View Notes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
