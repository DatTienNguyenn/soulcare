import Chart from 'react-apexcharts';
import { Card, CardHeader, CardContent, Box } from '@mui/material';

interface BookingData {
  date: string;
  bookings: number;
}

interface BookingTrendChartProps {
  data: BookingData[];
}

export default function BookingTrendChart({ data }: BookingTrendChartProps) {
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
    xaxis: {
      categories: data.map((d) => d.date),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Number of Bookings',
      },
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 4,
    },
    colors: ['#8884D8'],
  };

  const chartSeries = [
    {
      name: 'Bookings',
      data: data.map((d) => d.bookings),
    },
  ];

  return (
    <Card>
      <CardHeader title="Booking Trend" />
      <CardContent>
        <Box>
          <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />
        </Box>
      </CardContent>
    </Card>
  );
}
