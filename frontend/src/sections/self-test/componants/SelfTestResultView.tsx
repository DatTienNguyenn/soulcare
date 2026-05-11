import { Box, Button, Card, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { MentalHealthTest, TestResult } from 'src/_mock/_self-test';
import { getColorByLevel } from '../utils/test-transformer';

type SelfTestResultViewProps = {
  selectedTest: MentalHealthTest;
  testResult: TestResult;
  onRetake: VoidFunction;
  onBack: VoidFunction;
  t: any;
};

export default function SelfTestResultView({
  selectedTest,
  testResult,
  onRetake,
  onBack,
  t,
}: SelfTestResultViewProps) {
  const resultColor = testResult.color || getColorByLevel(testResult.level) || '#1976d2';

  return (
    <Stack spacing={3}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {t('selfTest.testResults')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {testResult.testName || selectedTest.name}
        </Typography>
      </Box>

      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              {t('selfTest.yourScore')}
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 0.5 }}
            >
              <Typography variant="h2" sx={{ color: resultColor, fontWeight: 'bold' }}>
                {testResult.score}
              </Typography>
              <Typography variant="h5" sx={{ color: 'text.secondary', pt: 1 }}>
                / {testResult.maxScore}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Chip
              label={testResult.level}
              size="medium"
              sx={{
                bgcolor: resultColor,
                color: '#fff',
                fontSize: '1rem',
                padding: '24px 16px',
              }}
            />
          </Box>

          {testResult.description && (
            <Paper
              sx={{
                p: 2,
                bgcolor: (theme) => alpha(resultColor, 0.08),
                border: (theme) => `1px solid ${alpha(resultColor, 0.24)}`,
              }}
            >
              <Typography variant="body2">{testResult.description}</Typography>
            </Paper>
          )}
        </Stack>
      </Card>

      <Paper
        sx={{
          p: 2,
          bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.24)}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'info.main' }}>
          {t('selfTest.recommendation')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {testResult.level === 'Normal' || testResult.level === 'Mild'
            ? t('selfTest.recommendationNormal')
            : testResult.level === 'Moderate'
              ? t('selfTest.recommendationModerate')
              : t('selfTest.recommendationSevere')}
        </Typography>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
          onClick={onBack}
        >
          {t('selfTest.backToTests')}
        </Button>
        <Button fullWidth variant="contained" onClick={onRetake}>
          {t('selfTest.retakeTest')}
        </Button>
      </Box>
    </Stack>
  );
}
