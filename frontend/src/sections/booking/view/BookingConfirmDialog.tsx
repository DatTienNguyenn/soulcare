import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format, parse } from 'date-fns';
import { PublicSpecialistDTO, AvailableSlotDTO } from 'src/utils/specialist-api';

interface BookingConfirmDialogProps {
  open: boolean;
  therapist: PublicSpecialistDTO | null;
  slot: AvailableSlotDTO | null;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function BookingConfirmDialog({
  open,
  therapist,
  slot,
  notes,
  onNotesChange,
  onConfirm,
  onClose,
}: BookingConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Your Booking</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Therapist
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {therapist?.name}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Date & Time
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {slot && format(parse(slot.date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy')} at{' '}
              {slot?.startTime}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Price
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              ${slot?.price}
            </Typography>
          </Box>
          <TextField
            label="Notes (Optional)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add any notes about your booking..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained">
          Confirm Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
}
