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
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
  const firstDayWeekday = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Assuming weekdays array is [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  // firstDayWeekday: 0=Sun, 1=Mon, 2=Tue, ..., 6=Sat
  const emptySlots = firstDayWeekday === 0 ? 6 : firstDayWeekday;

  const weeks: any[] = [];
  let currentWeek: any[] = [];

  for (let i = 0; i < emptySlots; i++) {
    currentWeek.push(null);
  }

  // Add all data points with actual dates
  data.forEach((day, idx) => {
    const dateObj = new Date(selectedYear, selectedMonth, idx + 1);
    currentWeek.push({
      ...day,
      date: dateObj,
      dayOfMonth: idx + 1,
    });

    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const seriesData = weeks.map((week, weekIdx) => ({
    name: t('analytics.week', { number: weekIdx + 1 }),
    data: week.map((day: any, dayIdx: number) => ({
      x: weekdays[dayIdx],
      y: day?.count ?? 0,
      date: day?.date ? format(day.date, 'yyyy-MM-dd') : '',
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
      custom: ({
        series,
        seriesIndex,
        dataPointIndex,
      }: {
        series: any;
        seriesIndex: number;
        dataPointIndex: number;
      }) => {
        const dataPoint = seriesData[seriesIndex]?.data?.[dataPointIndex];
        if (!dataPoint || dataPoint.y === 0) {
          return '';
        }
        return `<div class="apexcharts-tooltip-custom" style="padding: 8px; background: #fff; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <span style="font-weight: 600;">${dataPoint.date || ''}</span><br />
          <span>${activityLabel}: ${dataPoint.y}</span>
        </div>`;
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
