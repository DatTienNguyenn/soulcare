import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  LinearProgress,
} from '@mui/material';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface TherapyTypeData {
  name: string;
  value: number;
}

interface TherapyTypeDistributionProps {
  data: TherapyTypeData[];
  totalBookings: number;
}

export default function TherapyTypeDistribution({
  data,
  totalBookings,
}: TherapyTypeDistributionProps) {
  return (
    <Card>
      <CardHeader title="Therapy Type Distribution" />
      <CardContent>
        <Stack spacing={2}>
          {data.map((item, index) => {
            const percentage = (item.value / totalBookings) * 100;
            return (
              <Box key={item.name}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.value} ({percentage.toFixed(0)}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 1,
                    backgroundColor: 'action.disabledBackground',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: COLORS[index % COLORS.length],
                      borderRadius: 1,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
