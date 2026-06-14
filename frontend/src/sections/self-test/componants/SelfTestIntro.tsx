import { Box, Button, Card, Chip, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { MentalHealthTest, TestResult } from 'src/_mock/_self-test';

type SelfTestIntroProps = {
  t: any;
  tests: MentalHealthTest[];
  history: TestResult[];
  onStartTest: (test: MentalHealthTest) => void;
};

export default function SelfTestIntro({ t, tests, history, onStartTest }: SelfTestIntroProps) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {t('selfTest.header')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('selfTest.description')}
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 2,
          bgcolor: (theme) => alpha(theme.palette.warning.main, 0.08),
          border: (theme) => `1px solid ${alpha(theme.palette.warning.main, 0.24)}`,
          borderRadius: 1,
        }}
      >
        <Stack direction="row" spacing={2}>
          <Iconify icon="solar:info-circle-bold" sx={{ color: 'warning.main', fontSize: 24 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'warning.main', mb: 0.5 }}>
              {t('selfTest.disclaimerTitle')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('selfTest.disclaimerBody')}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {tests.map((test) => (
          <Grid item xs={12} md={6} lg={4} key={test.id}>
            <Card
              sx={{
                p: 3,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: (theme) => theme.shadows[8],
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => onStartTest(test)}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {test.shortName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {test.name}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  {test.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Iconify icon="solar:clock-circle-bold" />}
                    label={test.duration}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<Iconify icon="solar:list-bold" />}
                    label={t('selfTest.questions', { count: test.totalQuestions })}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Button variant="contained" fullWidth sx={{ mt: 1 }}>
                  {t('selfTest.takeTest')}
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {history.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t('selfTest.previousResults')}
          </Typography>
          <Grid container spacing={2}>
            {history.slice(0, 6).map((result, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="subtitle2">{result.testName}</Typography>
                      <Chip
                        label={result.level}
                        size="small"
                        sx={{ bgcolor: result.color, color: '#fff' }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {new Date(result.timestamp).toLocaleDateString()}{' '}
                      {new Date(result.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                    <Divider />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2">Score:</Typography>
                      <Typography variant="h6">
                        {result.score}/{result.maxScore}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  );
}
