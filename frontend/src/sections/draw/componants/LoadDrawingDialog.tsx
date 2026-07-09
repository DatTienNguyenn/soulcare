import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { PictureListItem } from 'src/utils/picture-api';
import { useLocales } from 'src/locale/use-locales';

interface LoadDrawingDialogProps {
  open: boolean;
  loading: boolean;
  pictures: PictureListItem[];
  onLoad: (pictureId: string) => Promise<void>;
  onClose: VoidFunction;
  onLoadPictures: () => Promise<void>;
  error?: string;
}

export default function LoadDrawingDialog({
  open,
  loading,
  pictures,
  onLoad,
  onClose,
  onLoadPictures,
  error,
}: LoadDrawingDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const { t } = useLocales();

  useEffect(() => {
    if (open) {
      setLocalError(null);
      setSelectedId(null);
      onLoadPictures();
    }
  }, [open]); // Only depend on 'open' to load pictures once when dialog opens

  const handleLoad = async () => {
    if (!selectedId) return;

    setLocalError(null);
    setLoadingId(selectedId);

    try {
      await onLoad(selectedId);
      // Close dialog on successful load
      onClose();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to load drawing');
    } finally {
      setLoadingId(null);
    }
  };

  const handleClose = () => {
    setSelectedId(null);
    setLocalError(null);
    onClose();
  };

  const currentError = error || localError;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Load Drawing</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {currentError && <Alert severity="error">{currentError}</Alert>}

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : pictures.length === 0 ? (
            <Alert severity="info">No saved drawings yet. Create and save a drawing first!</Alert>
          ) : (
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {pictures.map((picture) => (
                  <ListItem key={picture.id} disablePadding>
                    <ListItemButton
                      selected={selectedId === picture.id}
                      onClick={() => setSelectedId(picture.id)}
                      disabled={loadingId !== null}
                    >
                      <ListItemText
                        primary={
                          picture.description ||
                          `Drawing from ${new Date(picture.createdAt).toLocaleDateString()}`
                        }
                        secondary={`Created: ${new Date(picture.createdAt).toLocaleString()}`}
                      />
                      {loadingId === picture.id && <CircularProgress size={20} sx={{ ml: 1 }} />}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loadingId !== null}>
          Cancel
        </Button>
        <Button
          onClick={handleLoad}
          variant="contained"
          disabled={!selectedId || loadingId !== null || loading}
          startIcon={
            loadingId ? <CircularProgress size={20} /> : <Iconify icon="solar:import-bold" />
          }
        >
          {loadingId ? 'Loading...' : 'Load'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
