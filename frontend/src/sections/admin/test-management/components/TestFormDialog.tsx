import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  CircularProgress,
} from '@mui/material';
import { IMentalHealthTest } from 'src/utils/test-api';
import ScoringGuideSection from './ScoringGuideSection';

interface FormDataState {
  name: string;
  shortName: string;
  totalQuestions: number;
  duration: number;
  minScore: number;
  maxScore: number;
  description: string;
  scoringGuide: {
    Normal: { min: number; max: number; color: string };
    Mild: { min: number; max: number; color: string };
    Moderate: { min: number; max: number; color: string };
    Severe: { min: number; max: number; color: string };
    'Very Severe': { min: number; max: number; color: string };
  } | null;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

interface TestFormDialogProps {
  open: boolean;
  editingTest: IMentalHealthTest | null;
  formData: FormDataState;
  submitting: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAddDefaultLevels: () => void;
  onScoringLevelChange: (level: string, field: 'min' | 'max', value: number) => void;
  t: any;
}

export default function TestFormDialog({
  open,
  editingTest,
  formData,
  submitting,
  onClose,
  onSave,
  onFormChange,
  onAddDefaultLevels,
  onScoringLevelChange,
  t,
}: TestFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingTest
          ? t('testManagement.dialog.editTitle')
          : t('testManagement.dialog.createTitle')}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label={t('testManagement.dialog.testName')}
            name="name"
            value={formData.name}
            onChange={onFormChange}
            placeholder={t('testManagement.dialog.testNamePlaceholder')}
            required
          />
          <TextField
            fullWidth
            label={t('testManagement.dialog.shortName')}
            name="shortName"
            value={formData.shortName}
            onChange={onFormChange}
            placeholder={t('testManagement.dialog.shortNamePlaceholder')}
            required
          />
          <TextField
            fullWidth
            label={t('testManagement.dialog.description')}
            name="description"
            value={formData.description}
            onChange={onFormChange}
            multiline
            rows={2}
            placeholder={t('testManagement.dialog.descriptionPlaceholder')}
          />
          <TextField
            fullWidth
            type="number"
            label={t('testManagement.dialog.totalQuestions')}
            name="totalQuestions"
            value={formData.totalQuestions}
            onChange={onFormChange}
            required
          />
          <TextField
            fullWidth
            type="number"
            label={t('testManagement.dialog.duration')}
            name="duration"
            value={formData.duration}
            onChange={onFormChange}
            placeholder="e.g., 5"
            inputProps={{ min: 0 }}
          />
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              type="number"
              label={t('testManagement.dialog.minScore')}
              name="minScore"
              value={formData.minScore}
              onChange={onFormChange}
            />
            <TextField
              fullWidth
              type="number"
              label={t('testManagement.dialog.maxScore')}
              name="maxScore"
              value={formData.maxScore}
              onChange={onFormChange}
            />
          </Stack>

          {/* Scoring Guide Section */}
          <ScoringGuideSection
            scoringGuide={formData.scoringGuide}
            onAddDefaultLevels={onAddDefaultLevels}
            onLevelChange={onScoringLevelChange}
            t={t}
          />

          <TextField
            fullWidth
            select
            label={t('testManagement.dialog.status')}
            name="status"
            value={formData.status}
            onChange={onFormChange}
            SelectProps={{
              native: true,
            }}
          >
            <option value="ACTIVE">{t('testManagement.dialog.statusActive')}</option>
            <option value="INACTIVE">{t('testManagement.dialog.statusInactive')}</option>
            <option value="ARCHIVED">{t('testManagement.dialog.statusArchived')}</option>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('testManagement.dialog.cancel')}</Button>
        <Button variant="contained" onClick={onSave} disabled={submitting}>
          {submitting ? (
            <CircularProgress size={24} />
          ) : editingTest ? (
            t('testManagement.dialog.update')
          ) : (
            t('testManagement.dialog.create')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
