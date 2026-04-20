import { format } from 'date-fns';
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

type AnalyticsHeatmapCardProps = {
  title: string;
  data: any[];
  maxCount: number;
  selectedYear: number;
  selectedMonth: number;
  weekdays: string[];
  activityLabel: string;
  t: any;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
};

export default function AnalyticsHeatmapCard({
  title,
  data,
  maxCount,
  selectedYear,
  selectedMonth,
  weekdays,
  activityLabel,
  t,
  onYearChange,
  onMonthChange,
}: AnalyticsHeatmapCardProps) {
  const weeks: any[] = [];
  const currentWeek: any[] = [];

  data.forEach((day, idx) => {
    currentWeek.push(day);
    if ((idx + 1) % 7 === 0) {
      weeks.push([...currentWeek]);
      currentWeek.length = 0;
    }
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const seriesData = weeks.map((week, weekIdx) => ({
    name: t('analytics.week', { number: weekIdx + 1 }),
    data: week.map((day: any, dayIdx: number) => ({
      x: weekdays[dayIdx],
      y: day.count,
    })),
  }));

  const heatmapOptions: any = {
    chart: {
      type: 'heatmap',
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
      heatmap: {
        shadeIntensity: 0.5,
        radius: 4,
        useFillColorAsStroke: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#27AE60'],
    xaxis: {
      type: 'category',
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      y: {
        formatter: (value: number) =>
          t('analytics.activityTooltip', { count: value, title: activityLabel }),
      },
    },
    stroke: {
      width: 0,
    },
    grid: {
      show: false,
    },
  };

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {format(new Date(selectedYear, selectedMonth), 'MMMM yyyy')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <FormControl sx={{ minWidth: 110 }}>
            <InputLabel>{t('analytics.year')}</InputLabel>
            <Select
              value={selectedYear}
              label={t('analytics.year')}
              onChange={(e) => onYearChange(Number(e.target.value))}
            >
              {[2024, 2025, 2026].map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 110 }}>
            <InputLabel>{t('analytics.month')}</InputLabel>
            <Select
              value={selectedMonth}
              label={t('analytics.month')}
              onChange={(e) => onMonthChange(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <MenuItem key={i} value={i}>
                  {format(new Date(2000, i), 'MMMM')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Chart options={heatmapOptions} series={seriesData} type="heatmap" height={300} />
        </Box>
      </Stack>
    </Card>
  );
}
