import { Helmet } from 'react-helmet-async';
import { Container, Stack, Paper, Typography, Box } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function UserManagementPage() {
  const settings = useSettingsContext();

  return (
    <>
      <Helmet>
        <title>User Management | Admin</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          <Box>
            <h1 style={{ margin: 0 }}>User Management</h1>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>Manage system users and roles</p>
          </Box>

          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">Coming soon...</Typography>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
