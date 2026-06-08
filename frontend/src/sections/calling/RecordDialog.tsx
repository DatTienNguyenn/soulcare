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

interface RecordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (diagnosis: string, treatmentPlan: string) => void;
  diagnosis: string;
  onDiagnosisChange: (value: string) => void;
  treatmentPlan: string;
  onTreatmentPlanChange: (value: string) => void;
}

export function RecordDialog({
  open,
  onClose,
  onSubmit,
  diagnosis,
  onDiagnosisChange,
  treatmentPlan,
  onTreatmentPlanChange,
}: RecordDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Write Electronic Health Record</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Please fill in the clinical details for the patient session.
          </Typography>
          <TextField
            label="Diagnosis"
            multiline
            rows={3}
            value={diagnosis}
            onChange={(e) => onDiagnosisChange(e.target.value)}
            placeholder="Enter diagnosis..."
            fullWidth
          />
          <TextField
            label="Treatment Plan"
            multiline
            rows={4}
            value={treatmentPlan}
            onChange={(e) => onTreatmentPlanChange(e.target.value)}
            placeholder="Enter treatment plan..."
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onSubmit(diagnosis, treatmentPlan);
          }}
          variant="contained"
          color="primary"
          disabled={!diagnosis.trim()}
        >
          Submit Record
        </Button>
      </DialogActions>
    </Dialog>
  );
}
