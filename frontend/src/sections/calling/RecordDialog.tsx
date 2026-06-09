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
import { useLocales } from 'src/locale/use-locales';

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
  const { t } = useLocales();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('calling.writeRecordTitle')}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t('calling.recordDescription')}
          </Typography>
          <TextField
            label={t('calling.diagnosis')}
            multiline
            rows={3}
            value={diagnosis}
            onChange={(e) => onDiagnosisChange(e.target.value)}
            placeholder={t('calling.diagnosisPlaceholder')}
            fullWidth
          />
          <TextField
            label={t('calling.treatmentPlan')}
            multiline
            rows={4}
            value={treatmentPlan}
            onChange={(e) => onTreatmentPlanChange(e.target.value)}
            placeholder={t('calling.treatmentPlanPlaceholder')}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          onClick={() => {
            onSubmit(diagnosis, treatmentPlan);
          }}
          variant="contained"
          color="primary"
          disabled={!diagnosis.trim()}
        >
          {t('calling.submitRecord')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
