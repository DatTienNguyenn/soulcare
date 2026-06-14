import Chart from 'react-apexcharts';
import { Card, CardHeader, CardContent, Box } from '@mui/material';
import { useLocales } from 'src/locale/use-locales';

interface BookingStatusChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export default function BookingStatusChart({ data }: BookingStatusChartProps) {
  const { t } = useLocales();

  const chartOptions: any = {
    chart: {
      type: 'pie',
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
    labels: data.map((d) => d.name),
    colors: data.map((d) => d.color),
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          formatter: (val: number) => `${val.toFixed(0)}%`,
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      y: {
        formatter: (value: number) =>
          `${value} ${t('specialist.analytics.chartLabels.bookings').toLowerCase()}`,
      },
    },
  };

  const chartSeries = data.map((d) => d.value);

  return (
    <Card>
      <CardHeader title={t('specialist.analytics.charts.bookingStatus')} />
      <CardContent>
        <Box>
          <Chart options={chartOptions} series={chartSeries} type="pie" height={300} />
        </Box>
      </CardContent>
    </Card>
  );
}
