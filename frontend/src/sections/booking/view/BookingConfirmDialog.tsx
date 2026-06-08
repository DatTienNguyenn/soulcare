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
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { format, parse } from 'date-fns';
import {
  PublicSpecialistDTO,
  AvailableSlotDTO,
  SessionPricingResponse,
} from 'src/utils/specialist-api';

interface BookingConfirmDialogProps {
  open: boolean;
  therapist: PublicSpecialistDTO | null;
  slot: AvailableSlotDTO | null;
  notes: string;
  onNotesChange: (notes: string) => void;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
  sessionTypes?: SessionPricingResponse[];
  selectedSessionType?: string;
  onSessionTypeChange?: (type: string) => void;
}

export function BookingConfirmDialog({
  open,
  therapist,
  slot,
  notes,
  onNotesChange,
  onConfirm,
  onClose,
  loading = false,
  error = null,
  sessionTypes = [],
  selectedSessionType = '',
  onSessionTypeChange,
}: BookingConfirmDialogProps) {
  // Calculate price based on selected session type
  const selectedPricing = sessionTypes.find((type) => type.sessionType === selectedSessionType);
  const displayPrice = selectedPricing ? selectedPricing.pricePerSession : slot?.price || 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Your Booking</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
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
          {sessionTypes.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>Session Type</InputLabel>
              <Select
                value={selectedSessionType}
                onChange={(e) => onSessionTypeChange?.(e.target.value)}
                label="Session Type"
                disabled={loading}
              >
                {sessionTypes.map((type) => (
                  <MenuItem key={type.id} value={type.sessionType}>
                    {type.sessionType} - ${type.pricePerSession} ({type.durationMinutes} min)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Price
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              ${displayPrice}
            </Typography>
          </Box>
          <TextField
            label="Notes (Optional)"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Add any notes about your booking..."
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Confirming...' : 'Confirm Booking'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
