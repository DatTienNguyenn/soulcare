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
} from '@mui/material';

interface ReasonDialogProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export function ReasonDialog({ open, title, description, onClose, onSubmit }: ReasonDialogProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onSubmit(reason);
    setReason('');
  };

  const handleClose = () => {
    onClose();
    setReason('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <Typography variant="body2">{description}</Typography>
          <TextField
            label="Reason"
            multiline
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please enter your reason here..."
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!reason.trim()}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
