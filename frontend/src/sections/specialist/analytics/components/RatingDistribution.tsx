import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  LinearProgress,
} from '@mui/material';

interface RatingItem {
  rating: string;
  count: number;
}

interface RatingDistributionProps {
  data: RatingItem[];
  totalRated: number;
}

export default function RatingDistribution({ data, totalRated }: RatingDistributionProps) {
  const getRatingColor = (rating: string) => {
    if (rating === '5 Stars') return '#00C49F';
    if (rating.startsWith('4')) return '#FFBB28';
    return '#FF8042';
  };

  return (
    <Card>
      <CardHeader title="Patient Rating Distribution" />
      <CardContent>
        <Stack spacing={2}>
          {data.map((item) => {
            const percentage = (item.count / totalRated) * 100;
            return (
              <Box key={item.rating}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">{item.rating}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.count} ({percentage.toFixed(0)}%)
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
                      backgroundColor: getRatingColor(item.rating),
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
