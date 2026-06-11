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

interface EHRDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedEhr: EHRResponse | null;
}

export function EHRDetailsDialog({ open, onClose, selectedEhr }: EHRDetailsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Health Record Details</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {selectedEhr && (
          <Stack spacing={2}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Date
              </Typography>
              <Typography variant="body1">
                {selectedEhr.createdAt
                  ? format(new Date(selectedEhr.createdAt), 'MMMM dd, yyyy HH:mm')
                  : 'Unknown date'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Diagnosis
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedEhr.diagnosis}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Treatment Plan
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {selectedEhr.treatmentPlan}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
