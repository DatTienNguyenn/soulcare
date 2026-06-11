import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Rating,
  Box,
} from '@mui/material';
import { useLocales } from 'src/locale/use-locales';

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export function ReviewDialog({ open, onClose, onSubmit }: ReviewDialogProps) {
  const { t } = useLocales();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
  };

  const handleClose = () => {
    onClose();
    setRating(0);
    setComment('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('calling.rateTitle')}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <Typography variant="body2">{t('calling.rateDescription')}</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {t('calling.rating')}
            </Typography>
            <Rating
              name="specialist-rating"
              value={rating}
              onChange={(_, newValue) => {
                setRating(newValue || 0);
              }}
              size="large"
            />
          </Box>

          <TextField
            label={t('calling.commentOptional')}
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('calling.commentPlaceholder')}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('calling.skip')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={rating === 0}>
          {t('calling.submitReview')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
