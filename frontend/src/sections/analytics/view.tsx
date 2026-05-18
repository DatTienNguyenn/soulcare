import { useState, useEffect } from 'react';
import { Grid, Stack, Container, CircularProgress, Alert } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locale/use-locales';
import { useMentalHealthAPI } from 'src/hooks/use-mental-health-api';
import {
  _testScoreTrends,
  getCalendarHeatmapData,
  ActivityFrequency,
  TestScoreTrend,
} from 'src/_mock/_analytics';
import AnalyticsHeader from './componants/AnalyticsHeader';
import AnalyticsHeatmapCard from './componants/AnalyticsHeatmapCard';
import AnalyticsScoreChartCard from './componants/AnalyticsScoreChartCard';

// ----------------------------------------------------------------------

export default function AnalyticsView() {
  const settings = useSettingsContext();
  const { t } = useLocales();
  const { fetchTestResultHistory, fetchDiaryFrequency, fetchDrawingFrequency, loading, error } =
    useMentalHealthAPI();

  const weekdays = t('analytics.weekdays', { returnObjects: true }) as string[];
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedTest, setSelectedTest] = useState<string>('');

  // State for real data
  const [testScoreTrends, setTestScoreTrends] = useState<TestScoreTrend[]>(_testScoreTrends);
  const [diaryFrequency, setDiaryFrequency] = useState<ActivityFrequency[]>([]);
  const [drawingFrequency, setDrawingFrequency] = useState<ActivityFrequency[]>([]);
  const [availableTests, setAvailableTests] = useState<{ testId: string; testName: string }[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch analytics data on component mount
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setApiLoading(true);
        setApiError(null);

        // Fetch test result history
        const historyResponse = await fetchTestResultHistory();
        const transformedTestScores: TestScoreTrend[] = historyResponse.results.map((result) => ({
          date: new Date(result.date),
          testName: result.testName,
          testId: result.testId,
          score: result.score,
          maxScore: result.maxScore,
          level: result.level,
        }));
        setTestScoreTrends(transformedTestScores);

        // Extract unique tests from results
        const uniqueTests = Array.from(
          new Map(
            historyResponse.results.map((result) => [
              result.testId,
              { testId: result.testId, testName: result.testName },
            ])
          ).values()
        );
        setAvailableTests(uniqueTests);

        // Set selected test to first available test
        if (uniqueTests.length > 0 && !selectedTest) {
          setSelectedTest(uniqueTests[0].testId);
        }

        // Fetch diary frequency
        const frequencyResponse = await fetchDiaryFrequency();
        const transformedDiaryFrequency: ActivityFrequency[] = frequencyResponse.frequencies.map(
          (freq) => ({
            date: new Date(freq.date),
            count: freq.count,
          })
        );
        setDiaryFrequency(transformedDiaryFrequency);

        // Fetch drawing frequency
        const drawingFrequencyResponse = await fetchDrawingFrequency();
        const transformedDrawingFrequency: ActivityFrequency[] =
          drawingFrequencyResponse.frequencies.map((freq) => ({
            date: new Date(freq.date),
            count: freq.count,
          }));
        setDrawingFrequency(transformedDrawingFrequency);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics data';
        setApiError(errorMessage);
        console.error('Error fetching analytics data:', err);
        // Keep using mock data if there's an error
      } finally {
        setApiLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [fetchTestResultHistory, fetchDiaryFrequency, fetchDrawingFrequency]);

  const testScores = testScoreTrends
    .filter((item) => item.testId === selectedTest)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const diaryHeatmap = getCalendarHeatmapData(diaryFrequency, selectedYear, selectedMonth);
  const drawingHeatmap = getCalendarHeatmapData(drawingFrequency, selectedYear, selectedMonth);

  const diaryMaxCount =
    diaryFrequency.length > 0 ? Math.max(...diaryFrequency.map((f) => f.count)) : 1;
  const drawingMaxCount =
    drawingFrequency.length > 0 ? Math.max(...drawingFrequency.map((f) => f.count)) : 1;

  if (apiLoading) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '500px',
          }}
        >
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
        {apiError && <Alert severity="warning">{apiError}</Alert>}

        <AnalyticsHeader
          title={t('analytics.header.title')}
          description={t('analytics.header.description')}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <AnalyticsHeatmapCard
              title={t('analytics.diaryActivityTitle')}
              data={diaryHeatmap}
              maxCount={diaryMaxCount}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              weekdays={weekdays}
              activityLabel={t('analytics.entries')}
              t={t}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <AnalyticsHeatmapCard
              title={t('analytics.drawingActivityTitle')}
              data={drawingHeatmap}
              maxCount={drawingMaxCount}
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              weekdays={weekdays}
              activityLabel={t('analytics.sessions')}
              t={t}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />
          </Grid>
        </Grid>

        <AnalyticsScoreChartCard
          selectedTest={selectedTest}
          testScores={testScores}
          t={t}
          onTestChange={setSelectedTest}
          availableTests={availableTests}
        />
      </Stack>
    </Container>
  );
}
