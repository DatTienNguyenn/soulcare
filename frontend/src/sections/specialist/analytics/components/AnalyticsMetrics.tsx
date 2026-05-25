import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';

export interface MetricCard {
  label: string;
  value: string | number;
  sublabel?: string;
  sublabelColor?: string;
}

interface AnalyticsMetricsProps {
  metrics: MetricCard[];
}

export default function AnalyticsMetrics({ metrics }: AnalyticsMetricsProps) {
  return (
    <Grid container spacing={2}>
      {metrics.map((metric, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography color="textSecondary" gutterBottom>
                  {metric.label}
                </Typography>
                <Typography variant="h4">{metric.value}</Typography>
                {metric.sublabel && (
                  <Typography
                    variant="caption"
                    sx={{ color: metric.sublabelColor || 'text.secondary' }}
                  >
                    {metric.sublabel}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
