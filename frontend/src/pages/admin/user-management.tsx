import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import {
  Container,
  Stack,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locale/use-locales';
import axiosInstance from 'src/utils/axios';

// Types
interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'ADMIN' | 'PATIENT' | 'SPECIALIST';
  photoURL: string | null;
}

interface ApiResponse {
  data: User[];
  message: string;
}

// Role colors
const getRoleColor = (role: string) => {
  switch (role) {
    case 'ADMIN':
      return 'error';
    case 'SPECIALIST':
      return 'info';
    case 'PATIENT':
      return 'success';
    default:
      return 'default';
  }
};

// ----------------------------------------------------------------------

export default function UserManagementPage() {
  const settings = useSettingsContext();
  const { t } = useLocales();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return t('userManagement.roles.admin');
      case 'SPECIALIST':
        return t('userManagement.roles.specialist');
      case 'PATIENT':
        return t('userManagement.roles.patient');
      default:
        return t('userManagement.roles.unknown');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<ApiResponse>('/api/v1/users');
        setUsers(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(t('userManagement.loadingError'));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  return (
    <>
      <Helmet>
        <title>{t('userManagement.title')} | Admin</title>
      </Helmet>

      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          <Box>
            <h1 style={{ margin: 0 }}>{t('userManagement.title')}</h1>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>{t('userManagement.subtitle')}</p>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
              }}
            >
              <CircularProgress />
            </Paper>
          ) : users.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">{t('userManagement.noUsers')}</Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>{t('userManagement.table.displayName')}</TableCell>
                    <TableCell>{t('userManagement.table.email')}</TableCell>
                    <TableCell>{t('userManagement.table.role')}</TableCell>
                    <TableCell>{t('userManagement.table.userId')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.displayName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleName(user.role)}
                          color={getRoleColor(user.role)}
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.875rem', color: '#999' }}>
                        {user.id.substring(0, 8)}...
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </Container>
    </>
  );
}
