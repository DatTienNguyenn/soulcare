import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

import { AppointmentResponse } from 'src/utils/specialist-api';

interface SessionListProps {
  appointments: AppointmentResponse[];
  loading: boolean;
  error: string | null;
  isSpecialist: boolean;
  onSelectBooking: (booking: AppointmentResponse) => void;
  getCallStatus: (booking: AppointmentResponse) => 'ENDED' | 'NOT_STARTED' | 'AVAILABLE';
  onRateSpecialist?: (booking: AppointmentResponse) => void;
  onWriteRecord?: (booking: AppointmentResponse) => void;
  onCancelSession?: (booking: AppointmentResponse) => void;
  onReportSession?: (booking: AppointmentResponse) => void;
}

export default function SessionList({
  appointments,
  loading,
  error,
  isSpecialist,
  onSelectBooking,
  getCallStatus,
  onRateSpecialist,
  onWriteRecord,
  onCancelSession,
  onReportSession,
}: SessionListProps) {
  const upcomingBookings = appointments.filter((b) => b.status === 'PENDING');

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Typography variant="h4">Select a Session to Call</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {loading && (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress />
          </Box>
        )}
        {!loading && upcomingBookings.length === 0 && (
          <Alert severity="info">No upcoming sessions available.</Alert>
        )}
        {!loading &&
          upcomingBookings.map((booking) => {
            const targetName = isSpecialist ? booking.patientName : booking.specialistName;

            return (
              <Paper
                key={booking.id}
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h6">{targetName || 'Unknown User'}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
                  >
                    {booking.bookingType.toLowerCase()} Session
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Typography variant="body2">
                      📅 {format(new Date(booking.scheduledAt), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="body2">
                      🕐 {booking.startTime} - {booking.endTime}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  {(() => {
                    const status = getCallStatus(booking);
                    if (status === 'ENDED') {
                      return (
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                          <Button variant="outlined" color="error" disabled>
                            Session Ended
                          </Button>
                          {isSpecialist ? (
                            <Button
                              variant="contained"
                              color="info"
                              onClick={() => onWriteRecord?.(booking)}
                            >
                              Write Record
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="info"
                              onClick={() => onRateSpecialist?.(booking)}
                            >
                              Rate Specialist
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => onReportSession?.(booking)}
                          >
                            Report
                          </Button>
                        </Stack>
                      );
                    }
                    if (status === 'NOT_STARTED') {
                      return (
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                          <Button variant="outlined" color="inherit" disabled>
                            Starts at {booking.startTime}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => onCancelSession?.(booking)}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      );
                    }
                    return (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onSelectBooking(booking)}
                      >
                        Enter Call Room
                      </Button>
                    );
                  })()}
                </Box>
              </Paper>
            );
          })}
      </Stack>
    </Container>
  );
}
