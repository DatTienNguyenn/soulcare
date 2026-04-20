import { Box, Typography } from '@mui/material';

type AnalyticsHeaderProps = {
  title: string;
  description: string;
};

export default function AnalyticsHeader({ title, description }: AnalyticsHeaderProps) {
  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {description}
      </Typography>
    </Box>
  );
}
