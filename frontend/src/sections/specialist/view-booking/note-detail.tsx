import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useLocales } from 'src/locale/use-locales';

interface NotesDialogProps {
  open: boolean;
  onClose: () => void;
  noteText: string;
}

export function NotesDialog({ open, onClose, noteText }: NotesDialogProps) {
  const { t } = useLocales();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('specialist.bookings.dialogs.notes')}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label={t('specialist.bookings.dialogs.notes')}
          multiline
          rows={6}
          value={noteText}
          disabled
          fullWidth
          variant="outlined"
          placeholder="No notes available"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('specialist.bookings.dialogs.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
