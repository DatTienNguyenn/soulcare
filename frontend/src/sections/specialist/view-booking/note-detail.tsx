import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

interface NotesDialogProps {
  open: boolean;
  onClose: () => void;
  noteText: string;
}

export function NotesDialog({ open, onClose, noteText }: NotesDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Session Notes</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          label="Session Notes"
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
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
