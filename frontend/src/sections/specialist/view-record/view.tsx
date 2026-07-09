import { useState, useEffect } from 'react';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

import {
  getSpecialistAppointments,
  AppointmentResponse,
  submitElectronicHealthRecord,
} from 'src/utils/specialist-api';
import { RecordDialog } from 'src/sections/calling/RecordDialog';
import { useLocales } from 'src/locale/use-locales';

export default function SpecialistEHRView() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocales();

  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [selectedBookingForRecord, setSelectedBookingForRecord] =
    useState<AppointmentResponse | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getSpecialistAppointments();
        setAppointments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const confirmedBookings = appointments.filter(
    (b) => b.status === 'CONFIRMED' && b.cancelledReason !== 'EHR submitted'
  );

  const handleOpenRecordDialog = (booking: AppointmentResponse) => {
    setSelectedBookingForRecord(booking);
    setRecordDialogOpen(true);
    setDiagnosis('');
    setTreatmentPlan('');
  };

  const handleCloseRecordDialog = () => {
    setRecordDialogOpen(false);
    setSelectedBookingForRecord(null);
  };

  const handleSubmitRecord = async (diag: string, plan: string) => {
    if (!selectedBookingForRecord) return;
    try {
      await submitElectronicHealthRecord(
        selectedBookingForRecord.id,
        selectedBookingForRecord.specialistId,
        diag,
        plan
      );
      // Optional: Show success message (e.g. snackbar)
    } catch (err) {
      console.error(err);
    } finally {
      handleCloseRecordDialog();
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Typography variant="h4">{t('specialist.recordTitle')}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('specialist.recordDescription')}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {loading && (
          <Box display="flex" justifyContent="center" my={5}>
            <CircularProgress />
          </Box>
        )}
        {!loading && confirmedBookings.length === 0 && (
          <Alert severity="info">{t('specialist.noSessionNeedRecord')}</Alert>
        )}
        {!loading &&
          confirmedBookings.map((booking) => {
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
                  <Typography variant="h6">{booking.patientName || 'Unknown Patient'}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
                  >
                    {booking.bookingType.toLowerCase()}
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
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => handleOpenRecordDialog(booking)}
                  >
                    {t('specialist.writeRecord')}
                  </Button>
                </Box>
              </Paper>
            );
          })}
      </Stack>

      <RecordDialog
        open={recordDialogOpen}
        onClose={handleCloseRecordDialog}
        onSubmit={handleSubmitRecord}
        diagnosis={diagnosis}
        onDiagnosisChange={setDiagnosis}
        treatmentPlan={treatmentPlan}
        onTreatmentPlanChange={setTreatmentPlan}
      />
    </Container>
  );
}
