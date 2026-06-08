import { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { TherapyBooking } from 'src/type/therapist';

interface AllSessionsTabProps {
  bookings: TherapyBooking[];
  onViewDetails: (booking: TherapyBooking) => void;
}

export function AllSessionsTab({ bookings, onViewDetails }: AllSessionsTabProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'booked'>('all');

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

  const filteredBookings = bookings.filter((booking) => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {[
          { label: 'All', value: 'all' as const },
          { label: 'Completed', value: 'completed' as const },
          { label: 'Upcoming', value: 'booked' as const },
        ].map((filter) => (
          <Chip
            key={filter.value}
            label={filter.label}
            onClick={() => setFilterStatus(filter.value)}
            variant={filterStatus === filter.value ? 'filled' : 'outlined'}
            color={
              filterStatus === filter.value
                ? filter.value === 'booked'
                  ? 'warning'
                  : filter.value === 'completed'
                    ? 'success'
                    : 'primary'
                : 'default'
            }
          />
        ))}
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
                    <Typography variant="body2">{format(booking.date, 'MMM dd, yyyy')}</Typography>
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
                  <Chip
                    label={booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    size="small"
                    color={getStatusColor(booking.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => onViewDetails(booking)} variant="text">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
