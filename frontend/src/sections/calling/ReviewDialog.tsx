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

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export function ReviewDialog({ open, onClose, onSubmit }: ReviewDialogProps) {
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
      <DialogTitle>Rate Your Specialist</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <Typography variant="body2">
            How was your session? Please rate your specialist and leave a comment.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Rating
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
            label="Comment (Optional)"
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Skip</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={rating === 0}
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}
