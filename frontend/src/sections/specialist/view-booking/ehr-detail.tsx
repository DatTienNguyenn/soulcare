import {
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { EHRResponse } from 'src/utils/specialist-api';
import { useLocales } from 'src/locale/use-locales';

interface EHRDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedEhr: EHRResponse | null;
}

export function EHRDetailsDialog({ open, onClose, selectedEhr }: EHRDetailsDialogProps) {
  const { t } = useLocales();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('specialist.bookings.dialogs.ehrTitle')}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {selectedEhr && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('specialist.bookings.dialogs.date')}
              </Typography>
              <Typography variant="body1">
                {selectedEhr.createdAt
                  ? format(new Date(selectedEhr.createdAt), 'MMMM dd, yyyy HH:mm')
                  : t('specialist.bookings.dialogs.unknownDate')}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('specialist.bookings.dialogs.diagnosis')}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedEhr.diagnosis}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {t('specialist.bookings.dialogs.treatmentPlan')}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedEhr.treatmentPlan}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('specialist.bookings.dialogs.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
