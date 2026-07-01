import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useLocales } from 'src/locale/use-locales';

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
  rating: number;
  onRatingChange: (value: number) => void;
  text: string;
  onTextChange: (value: string) => void;
}

export function ReviewDialog({
  open,
  onClose,
  onSubmit,
  rating,
  onRatingChange,
  text,
  onTextChange,
}: ReviewDialogProps) {
  const { t } = useLocales();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('reviewDialog.title')}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t('reviewDialog.subtitle')}
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => {
                onRatingChange(newValue || 0);
              }}
              size="large"
            />
          </Box>
          <TextField
            label={t('reviewDialog.feedbackLabel')}
            multiline
            rows={4}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={t('reviewDialog.feedbackPlaceholder')}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          onClick={() => {
            onSubmit(rating, text);
          }}
          variant="contained"
        >
          {t('reviewDialog.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
