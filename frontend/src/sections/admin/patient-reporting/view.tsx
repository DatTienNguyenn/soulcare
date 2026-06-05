import { useState, useEffect } from 'react';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  Container,
  Typography,
  Card,
  TableContainer,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import Scrollbar from 'src/components/scrollbar';
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

type Appointment = {
  id: string;
  patientId: string;
  patientName?: string;
  specialistId: string;
  specialistName?: string;
  scheduledAt: string;
  status: string;
  bookingType: string;
  cancelledReason?: string;
  sessionNotes?: string;
};

export default function NoShowsView() {
  const settings = useSettingsContext();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchNoShows = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/admin/appointments/no-shows');
        setAppointments(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch no-show appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchNoShows();
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'decline') => {
    try {
      setActionLoading(id);
      const response = await axios.post(`/api/v1/admin/appointments/${id}/${action}`);

      // Update the processed appointment in the list
      setAppointments((prev) => prev.map((apt) => (apt.id === id ? response.data : apt)));
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} appointment`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">No-Show Appointments</Typography>
      </Stack>

      {error && (
        <Typography color="error" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      <Card>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Specialist Name</TableCell>
                  <TableCell>Scheduled At</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Session Notes</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No NO_SHOW appointments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((row) => (
                    <TableRow hover key={row.id}>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {row.patientName || row.patientId}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {row.specialistName || row.specialistId}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {new Date(row.scheduledAt).toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>
                        {row.bookingType || 'Standard'}
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="error">
                          {row.status}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.cancelledReason || 'N/A'}</TableCell>
                      <TableCell align="right">
                        {row.sessionNotes?.includes('[ADMIN APPROVED]') ? (
                          <Typography variant="subtitle2" color="success.main">
                            APPROVED
                          </Typography>
                        ) : row.sessionNotes?.includes('[ADMIN DECLINED]') ? (
                          <Typography variant="subtitle2" color="error.main">
                            DECLINED
                          </Typography>
                        ) : actionLoading === row.id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Approve">
                              <IconButton
                                color="success"
                                onClick={() => handleAction(row.id, 'approve')}
                              >
                                <Iconify icon="eva:checkmark-circle-2-fill" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Decline">
                              <IconButton
                                color="error"
                                onClick={() => handleAction(row.id, 'decline')}
                              >
                                <Iconify icon="eva:close-circle-fill" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </Container>
  );
}
