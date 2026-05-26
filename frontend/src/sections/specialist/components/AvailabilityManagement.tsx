import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Chip,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Pencil as EditIcon, Trash2 as DeleteIcon, Plus as PlusIcon } from 'lucide-react';
import { useSpecialistProfile } from 'src/hooks/use-specialist-profile';
import { AvailabilityResponse } from 'src/utils/specialist-api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function AvailabilityManagement() {
  const {
    loading,
    error: apiError,
    fetchAvailability,
    createAvailability,
    updateAvailability,
    toggleAvailability,
    deleteAvailability,
  } = useSpecialistProfile();

  const [availabilities, setAvailabilities] = useState<AvailabilityResponse[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '17:00',
    breakTimeStart: '',
    breakTimeEnd: '',
  });

  // Load availability data on component mount
  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const data = await fetchAvailability();
      setAvailabilities(data);
    } catch (err) {
      console.error('Failed to load availability:', err);
    }
  };

  const handleOpenDialog = (availability?: AvailabilityResponse) => {
    if (availability) {
      setEditingId(availability.id);
      setFormData({
        dayOfWeek: availability.dayOfWeek,
        startTime: availability.startTime,
        endTime: availability.endTime,
        breakTimeStart: availability.breakTimeStart || '',
        breakTimeEnd: availability.breakTimeEnd || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '17:00',
        breakTimeStart: '',
        breakTimeEnd: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.startTime || !formData.endTime) {
      setSaveError('Please fill in all required fields');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setSaveError('End time must be after start time');
      return;
    }

    try {
      setSaveError(null);
      setSuccessMessage(null);

      if (editingId) {
        // Update existing availability
        await updateAvailability(formData.dayOfWeek, {
          dayOfWeek: formData.dayOfWeek,
          startTime: formData.startTime,
          endTime: formData.endTime,
          breakTimeStart: formData.breakTimeStart || undefined,
          breakTimeEnd: formData.breakTimeEnd || undefined,
        });
        setSuccessMessage('Availability updated successfully');
      } else {
        // Create new availability
        await createAvailability({
          dayOfWeek: formData.dayOfWeek,
          startTime: formData.startTime,
          endTime: formData.endTime,
          breakTimeStart: formData.breakTimeStart || undefined,
          breakTimeEnd: formData.breakTimeEnd || undefined,
          active: true,
        });
        setSuccessMessage('Availability created successfully');
      }

      // Reload availability data
      await loadAvailability();
      handleCloseDialog();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save availability';
      setSaveError(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    const availability = availabilities.find((a) => a.id === id);
    if (!availability) return;

    if (window.confirm('Are you sure you want to delete this availability?')) {
      try {
        await deleteAvailability(availability.dayOfWeek);
        setSuccessMessage('Availability deleted successfully');
        await loadAvailability();
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete availability';
        setSaveError(errorMsg);
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    const availability = availabilities.find((a) => a.id === id);
    if (!availability) return;

    try {
      await toggleAvailability(availability.dayOfWeek);
      setSuccessMessage(
        availability.active ? 'Availability deactivated' : 'Availability activated'
      );
      await loadAvailability();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to toggle availability';
      setSaveError(errorMsg);
    }
  };

  // Create a grid showing all days of the week
  const allDays = DAYS.map((dayName, index) => {
    const availability = availabilities.find((a) => a.dayOfWeek === index);
    return { dayName, index, availability };
  });

  return (
    <Card>
      <CardHeader
        title="Working Hours & Availability"
        action={
          <Button
            variant="contained"
            startIcon={<PlusIcon size={20} />}
            onClick={() => handleOpenDialog()}
          >
            Add Availability
          </Button>
        }
      />
      <CardContent>
        {(apiError || saveError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError || saveError}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {allDays.map(({ dayName, index, availability }) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    border: availability ? '2px solid #2E7D32' : '1px solid #ddd',
                    backgroundColor: availability ? '#f1f8f4' : '#fafafa',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {dayName}
                  </Typography>
                  {availability ? (
                    <>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="textSecondary">
                            Hours:
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {availability.startTime} - {availability.endTime}
                          </Typography>
                        </Box>
                        {availability.breakTimeStart && availability.breakTimeEnd && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="textSecondary">
                              Break:
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {availability.breakTimeStart} - {availability.breakTimeEnd}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip
                            label={availability.active ? 'Active' : 'Inactive'}
                            color={availability.active ? 'success' : 'default'}
                            size="small"
                            onClick={() => handleToggleActive(availability.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <IconButton size="small" onClick={() => handleOpenDialog(availability)}>
                            <EditIcon size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(availability.id)}
                          >
                            <DeleteIcon size={16} />
                          </IconButton>
                        </Box>
                      </Stack>
                    </>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No availability set
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingId ? 'Edit Availability' : 'Add New Availability'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Day of Week"
                select
                fullWidth
                SelectProps={{
                  native: true,
                }}
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
              >
                {DAYS.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </TextField>

              <TextField
                label="Start Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />

              <TextField
                label="End Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />

              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>
                Break Time (Optional)
              </Typography>

              <TextField
                label="Break Start Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.breakTimeStart}
                onChange={(e) => setFormData({ ...formData, breakTimeStart: e.target.value })}
              />

              <TextField
                label="Break End Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.breakTimeEnd}
                onChange={(e) => setFormData({ ...formData, breakTimeEnd: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">
              {editingId ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
