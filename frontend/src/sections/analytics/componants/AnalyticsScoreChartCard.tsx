import Chart from 'react-apexcharts';
import {
  Box,
  Card,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

type AnalyticsScoreChartCardProps = {
  selectedTest: string;
  testScores: any[];
  t: any;
  onTestChange: (testId: string) => void;
  availableTests?: { testId: string; testName: string }[];
};

const getColorForLevel = (level: string | null) =>
  level === 'Very Severe'
    ? '#C0392B'
    : level === 'Severe'
      ? '#E74C3C'
      : level === 'Moderate'
        ? '#E67E22'
        : level === 'Mild'
          ? '#F39C12'
          : '#27AE60';

export default function AnalyticsScoreChartCard({
  selectedTest,
  testScores,
  t,
  onTestChange,
  availableTests = [],
}: AnalyticsScoreChartCardProps) {
  if (testScores.length === 0) {
    return (
      <Card sx={{ p: 3 }}>
        <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
          {t('analytics.noTestData')}
        </Box>
      </Card>
    );
  }

  const testMaxScore = testScores[0]?.maxScore || 100;
  const chartData = {
    series: [
      {
        name: t('analytics.score'),
        data: testScores.map((score) => ({
          x: score.date ? score.date.toLocaleDateString() : '',
          y: score.score,
          fillColor: getColorForLevel(score.level),
        })),
      },
    ],
  };

  const chartOptions: any = {
    chart: {
      type: 'bar',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 0,
      colors: ['transparent'],
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      y: {
        formatter: (value: number) => `${value}/${testMaxScore}`,
      },
    },
    colors: testScores.map((score) => getColorForLevel(score.level)),
    xaxis: {
      type: 'category',
      categories: testScores.map((score) => (score.date ? score.date.toLocaleDateString() : '')),
    },
    yaxis: {
      title: {
        text: t('analytics.score'),
      },
      min: 0,
      max: testMaxScore,
    },
    fill: {
      opacity: 1,
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6">{t('analytics.testScoresTitle')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('analytics.testScoresDescription')}
            </Typography>
          </Box>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>{t('analytics.test')}</InputLabel>
            <Select
              value={selectedTest}
              label={t('analytics.test')}
              onChange={(e) => onTestChange(e.target.value as string)}
            >
              {availableTests.length > 0 ? (
                availableTests.map((test) => (
                  <MenuItem key={test.testId} value={test.testId}>
                    {test.testName}
                  </MenuItem>
                ))
              ) : (
                <>
                  <MenuItem value="dass-21">{t('analytics.tests.dass21')}</MenuItem>
                  <MenuItem value="phq-9">{t('analytics.tests.phq9')}</MenuItem>
                  <MenuItem value="gad-7">{t('analytics.tests.gad7')}</MenuItem>
                </>
              )}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Chart options={chartOptions} series={chartData.series} type="bar" height={350} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            pt: 2,
            flexWrap: 'wrap',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {[
            { label: t('analytics.legend.normal'), color: '#27AE60' },
            { label: t('analytics.legend.mild'), color: '#F39C12' },
            { label: t('analytics.legend.moderate'), color: '#E67E22' },
            { label: t('analytics.legend.severe'), color: '#E74C3C' },
            { label: t('analytics.legend.verySevere'), color: '#C0392B' },
          ].map((item) => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: '2px' }} />
              <Typography variant="caption">{item.label}</Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Card>
  );
}
