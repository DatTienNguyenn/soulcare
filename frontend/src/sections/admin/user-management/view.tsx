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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify';

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
  const [openDialog, setOpenDialog] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'PATIENT',
  });

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setCreateError(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'PATIENT',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCreateError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUser = async () => {
    try {
      setCreateLoading(true);
      setCreateError(null);

      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setCreateError(t('userManagement.error.validationFailed'));
        setCreateLoading(false);
        return;
      }

      // Call register API
      const response = await axiosInstance.post('/api/v1/auth/register', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      });

      // Refresh users list
      const usersResponse = await axiosInstance.get<ApiResponse>('/api/v1/users');
      setUsers(usersResponse.data.data);

      // Close dialog and reset form
      handleCloseDialog();
    } catch (err) {
      console.error('Error creating user:', err);
      setCreateError(err instanceof Error ? err.message : t('userManagement.error.createFailed'));
    } finally {
      setCreateLoading(false);
    }
  };

  const fetchAllUsers = async () => {
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
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <h1 style={{ margin: 0 }}>{t('userManagement.title')}</h1>
              <p style={{ margin: '8px 0 0 0', color: '#666' }}>{t('userManagement.subtitle')}</p>
            </Box>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="outlined"
                startIcon={<Iconify icon="mingcute:refresh-line" />}
                onClick={fetchAllUsers}
                sx={{ mt: 0.5 }}
              >
                {t('userManagement.reload')}
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={handleOpenDialog}
                sx={{ mt: 0.5 }}
              >
                {t('userManagement.newUser')}
              </Button>
            </div>
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

      {/* Create User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('userManagement.createNewUser')}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {createError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createError}
            </Alert>
          )}
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label={t('signup.firstName') || 'First Name'}
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
                placeholder="John"
              />
              <TextField
                fullWidth
                label={t('signup.lastName') || 'Last Name'}
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
                placeholder="Doe"
              />
            </Stack>

            <TextField
              fullWidth
              type="email"
              label={t('login.email') || 'Email'}
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              placeholder="john.doe@example.com"
            />

            <TextField
              fullWidth
              type="password"
              label={t('login.password') || 'Password'}
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              placeholder="••••••••"
            />

            <FormControl fullWidth>
              <InputLabel>{t('userManagement.role') || 'Role'}</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                label={t('userManagement.role') || 'Role'}
              >
                <MenuItem value="PATIENT">
                  {t('userManagement.roles.patient') || 'Patient'}
                </MenuItem>
                <MenuItem value="SPECIALIST">
                  {t('userManagement.roles.specialist') || 'Specialist'}
                </MenuItem>
                <MenuItem value="ADMIN">{t('userManagement.roles.admin') || 'Admin'}</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>{t('common.cancel') || 'Cancel'}</Button>
          <LoadingButton loading={createLoading} onClick={handleCreateUser} variant="contained">
            {t('common.create')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
