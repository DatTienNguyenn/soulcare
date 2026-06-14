import Chart from 'react-apexcharts';
import { Card, CardHeader, CardContent, Box } from '@mui/material';
import { useLocales } from 'src/locale/use-locales';

interface RevenueData {
  type: string;
  revenue: number;
}

interface RevenueByTypeChartProps {
  data: RevenueData[];
}

export default function RevenueByTypeChart({ data }: RevenueByTypeChartProps) {
  const { t } = useLocales();

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
        horizontal: true,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'right',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `$${val}`,
      offsetX: 10,
    },
    xaxis: {
      categories: data.map((d) => d.type),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 4,
    },
    colors: ['#00C49F'],
    tooltip: {
      enabled: true,
      theme: 'light',
      y: {
        formatter: (val: number) => `$${val}`,
      },
    },
  };

  const chartSeries = [
    {
      name: t('specialist.analytics.chartLabels.revenue'),
      data: data.map((d) => d.revenue),
    },
  ];

  return (
    <Card>
      <CardHeader title={t('specialist.analytics.charts.revenueByType')} />
      <CardContent>
        <Box>
          <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
        </Box>
      </CardContent>
    </Card>
  );
}
