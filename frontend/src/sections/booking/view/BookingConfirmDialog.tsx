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
import { PayPalButtons } from '@paypal/react-paypal-js';
import { format, parse } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { useState } from 'react';
import {
  PublicSpecialistDTO,
  AvailableSlotDTO,
  SessionPricingResponse,
} from 'src/utils/specialist-api';
import { useLocales } from 'src/locale/use-locales';

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
  const { t, currentLang } = useLocales();
  const dateLocale = currentLang.value.includes('vi') ? vi : enUS;

  // Calculate price based on selected session type
  const selectedPricing = sessionTypes.find((type) => type.sessionType === selectedSessionType);
  const displayPrice = selectedPricing ? selectedPricing.pricePerSession : slot?.price || 0;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showErrorPayment = () => {
    return <Alert severity="error">{errorMessage}</Alert>;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('treatment.booking.confirmBookingTitle')}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('treatment.booking.therapist')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {therapist?.name}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('treatment.booking.dateTime')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {slot &&
                format(parse(slot.date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy', {
                  locale: dateLocale,
                })}{' '}
              at {slot?.startTime}
            </Typography>
          </Box>
          {sessionTypes.length > 0 && (
            <FormControl fullWidth>
              <InputLabel>{t('treatment.booking.sessionType')}</InputLabel>
              <Select
                value={selectedSessionType}
                onChange={(e) => onSessionTypeChange?.(e.target.value)}
                label={t('treatment.booking.sessionType')}
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
              {t('treatment.booking.totalPrice')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              ${displayPrice}
            </Typography>
          </Box>
          <TextField
            label={t('treatment.booking.notesOptional')}
            multiline
            rows={3}
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={t('treatment.booking.notesPlaceholder')}
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {t('common.cancel')}
        </Button>

        {displayPrice > 0 ? (
          <Box sx={{ minWidth: 200, zIndex: 1 }}>
            <PayPalButtons
              style={{ layout: 'horizontal', height: 36, color: 'blue' }}
              createOrder={(data: any, actions: any) => {
                return actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [
                    {
                      amount: {
                        currency_code: 'USD',
                        value: displayPrice.toString(),
                      },
                      description: `Therapy Booking - ${therapist?.name}`,
                    },
                  ],
                });
              }}
              onApprove={(data: any, actions: any) => {
                if (actions.order) {
                  return actions.order.capture().then((details: any) => {
                    // Payment successful, trigger the actual booking creation
                    return onConfirm();
                  });
                }
                return Promise.resolve();
              }}
              onError={(err: any) => {
                console.error('PayPal Checkout onError', err);
                // Optionally handle errors here (e.g. show a notification)
                showErrorPayment();
              }}
            />
          </Box>
        ) : (
          <Button
            onClick={onConfirm}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? t('treatment.booking.confirming') : t('treatment.booking.confirmBooking')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
