import { useState } from 'react';
import { Grid, Stack, Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locale/use-locales';
import {
  _testScoreTrends,
  _diaryFrequency,
  _drawingFrequency,
  getCalendarHeatmapData,
} from 'src/_mock/_analytics';
import AnalyticsHeader from './componants/AnalyticsHeader';
import AnalyticsHeatmapCard from './componants/AnalyticsHeatmapCard';
import AnalyticsScoreChartCard from './componants/AnalyticsScoreChartCard';

// ----------------------------------------------------------------------

export default function AnalyticsView() {
  const settings = useSettingsContext();
  const { t } = useLocales();
  const weekdays = t('analytics.weekdays', { returnObjects: true }) as string[];
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedTest, setSelectedTest] = useState('dass-21');

  const testScores = _testScoreTrends
    .filter((item) => item.testId === selectedTest)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const diaryHeatmap = getCalendarHeatmapData(_diaryFrequency, selectedYear, selectedMonth);
  const drawingHeatmap = getCalendarHeatmapData(_drawingFrequency, selectedYear, selectedMonth);

  const diaryMaxCount = Math.max(..._diaryFrequency.map((f) => f.count));
  const drawingMaxCount = Math.max(..._drawingFrequency.map((f) => f.count));

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
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
        />
      </Stack>
    </Container>
  );
}
