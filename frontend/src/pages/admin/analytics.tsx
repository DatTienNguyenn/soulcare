import { Helmet } from 'react-helmet-async';
import { Container, Stack, Paper, Typography, Box } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function AdminAnalyticsPage() {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>Analytics | Admin</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          <Box>
            <h1 style={{ margin: 0 }}>Analytics</h1>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              View system analytics and statistics
            </p>
          </Box>

          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">Coming soon...</Typography>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
