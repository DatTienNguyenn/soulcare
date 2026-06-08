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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Leave a Review</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              How was your session?
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
            label="Your Feedback"
            multiline
            rows={4}
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Share your experience with this therapist..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onSubmit(rating, text);
          }}
          variant="contained"
        >
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );
}
