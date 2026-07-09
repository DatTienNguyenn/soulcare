import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useLocales } from 'src/locale';

interface SaveDrawingDialogProps {
  open: boolean;
  loading: boolean;
  onSave: (title: string, description: string) => Promise<void>;
  onClose: VoidFunction;
  error?: string;
}

export default function SaveDrawingDialog({
  open,
  loading,
  onSave,
  onClose,
  error,
}: SaveDrawingDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const {t} = useLocales();

  const handleSave = async () => {
    setLocalError(null);

    if (!title.trim()) {
      setLocalError('Title is required');
      return;
    }

    try {
      await onSave(title.trim(), description.trim());
      // Reset form on successful save
      setTitle('');
      setDescription('');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to save drawing');
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setLocalError(null);
    onClose();
  };

  const currentError = error || localError;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Save Drawing</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {currentError && <Alert severity="error">{currentError}</Alert>}

          <TextField
            label="Title"
            placeholder="Enter drawing title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            disabled={loading}
            required
            error={!title.trim() && title !== ''}
          />

          <TextField
            label="Description (Optional)"
            placeholder="Add any notes about this drawing"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            disabled={loading}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !title.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
