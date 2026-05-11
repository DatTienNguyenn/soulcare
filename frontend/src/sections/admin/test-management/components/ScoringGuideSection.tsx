import { Box, Button, Stack, TextField, Alert } from '@mui/material';

interface ScoringLevel {
  min: number;
  max: number;
  color: string;
}

interface ScoringGuideSectionProps {
  scoringGuide: Record<string, ScoringLevel> | null;
  onAddDefaultLevels: () => void;
  onLevelChange: (level: string, field: 'min' | 'max', value: number) => void;
  t: any;
}

export default function ScoringGuideSection({
  scoringGuide,
  onAddDefaultLevels,
  onLevelChange,
  t,
}: ScoringGuideSectionProps) {
  return (
    <Box sx={{ pt: 2, border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h4 style={{ margin: '0 0 8px 0' }}>{t('testManagement.dialog.scoringLevels')}</h4>
        {!scoringGuide && (
          <Button size="small" variant="outlined" onClick={onAddDefaultLevels}>
            Use Default Levels
          </Button>
        )}
      </Box>

      {scoringGuide && Object.entries(scoringGuide).length > 0 ? (
        <Stack spacing={1.5}>
          {Object.entries(scoringGuide).map(([level, guide]) => (
            <Stack
              key={level}
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ p: 1, backgroundColor: '#fafafa', borderRadius: 0.5 }}
            >
              <Box sx={{ width: 100, display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '2px',
                    backgroundColor: guide?.color || '#999',
                    mr: 1,
                  }}
                />
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{level}</span>
              </Box>
              <TextField
                type="number"
                label="Min"
                size="small"
                value={guide?.min || 0}
                onChange={(e) => onLevelChange(level, 'min', parseInt(e.target.value) || 0)}
                sx={{ width: 90 }}
                inputProps={{ inputMode: 'numeric' }}
              />
              <TextField
                type="number"
                label="Max"
                size="small"
                value={guide?.max || 0}
                onChange={(e) => onLevelChange(level, 'max', parseInt(e.target.value) || 0)}
                sx={{ width: 90 }}
                inputProps={{ inputMode: 'numeric' }}
              />
            </Stack>
          ))}
        </Stack>
      ) : (
        <Alert severity="info">
          Scoring levels not set. Click "Use Default Levels" to add the standard 5-level scale
          (Normal, Mild, Moderate, Severe, Very Severe), or you can customize them later.
        </Alert>
      )}
    </Box>
  );
}
