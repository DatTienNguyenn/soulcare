import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  IconButton,
  Chip,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Pencil as EditIcon, Trash2 as DeleteIcon, Plus as PlusIcon } from 'lucide-react';
import { useSpecialistProfile } from 'src/hooks/use-specialist-profile';
import { SessionPricingResponse } from 'src/utils/specialist-api';

export default function PricingManagement() {
  const {
    loading,
    error: apiError,
    fetchSessionPricing,
    createSessionPricing,
    updatePricing,
    togglePricing,
    deletePricing,
  } = useSpecialistProfile();

  const [pricings, setPricings] = useState<SessionPricingResponse[]>([]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    sessionType: '',
    pricePerSession: 0,
    durationMinutes: 60,
  });

  // Load pricing data on component mount
  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const data = await fetchSessionPricing();
      setPricings(data);
    } catch (err) {
      console.error('Failed to load pricing:', err);
    }
  };

  const handleOpenDialog = (pricing?: SessionPricingResponse) => {
    if (pricing) {
      setEditingId(pricing.id);
      setFormData({
        sessionType: pricing.sessionType,
        pricePerSession: pricing.pricePerSession,
        durationMinutes: pricing.durationMinutes,
      });
    } else {
      setEditingId(null);
      setFormData({ sessionType: '', pricePerSession: 0, durationMinutes: 60 });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.sessionType || formData.pricePerSession <= 0) {
      setSaveError('Please fill in all fields correctly');
      return;
    }

    try {
      setSaveError(null);
      setSuccessMessage(null);

      if (editingId) {
        // Update existing pricing
        await updatePricing(formData.sessionType, {
          sessionType: formData.sessionType,
          pricePerSession: formData.pricePerSession,
          durationMinutes: formData.durationMinutes,
        });
        setSuccessMessage('Pricing updated successfully');
      } else {
        // Create new pricing
        await createSessionPricing({
          sessionType: formData.sessionType,
          pricePerSession: formData.pricePerSession,
          durationMinutes: formData.durationMinutes,
          active: true,
        });
        setSuccessMessage('Pricing created successfully');
      }

      // Reload pricing data
      await loadPricing();
      handleCloseDialog();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save pricing';
      setSaveError(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    const pricing = pricings.find((p) => p.id === id);
    if (!pricing) return;

    if (window.confirm('Are you sure you want to delete this pricing?')) {
      try {
        await deletePricing(pricing.sessionType);
        setSuccessMessage('Pricing deleted successfully');
        await loadPricing();
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete pricing';
        setSaveError(errorMsg);
      }
    }
  };

  const handleToggleActive = async (id: string) => {
    const pricing = pricings.find((p) => p.id === id);
    if (!pricing) return;

    try {
      await togglePricing(pricing.sessionType);
      setSuccessMessage(pricing.active ? 'Pricing deactivated' : 'Pricing activated');
      await loadPricing();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to toggle pricing';
      setSaveError(errorMsg);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Session Pricing"
        action={
          <Button
            variant="contained"
            startIcon={<PlusIcon size={20} />}
            onClick={() => handleOpenDialog()}
          >
            Add Pricing
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
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Session Type</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  Price
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Duration (min)
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Status
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pricings.map((pricing) => (
                <TableRow key={pricing.id}>
                  <TableCell>{pricing.sessionType}</TableCell>
                  <TableCell align="right">${pricing.pricePerSession.toFixed(2)}</TableCell>
                  <TableCell align="center">{pricing.durationMinutes}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={pricing.active ? 'Active' : 'Inactive'}
                      color={pricing.active ? 'success' : 'default'}
                      size="small"
                      onClick={() => handleToggleActive(pricing.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleOpenDialog(pricing)} title="Edit">
                      <EditIcon size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(pricing.id)}
                      title="Delete"
                    >
                      <DeleteIcon size={18} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          // </TableContainer>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingId ? 'Edit Session Pricing' : 'Add New Session Pricing'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label="Session Type"
                select
                fullWidth
                SelectProps={{
                  native: true,
                }}
                value={formData.sessionType}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
              >
                <option value="">Select session type</option>
                <option value="PSYCHOLOGY">Psychology</option>
                <option value="COUNSELING">Counseling</option>
                <option value="BEHAVIORAL">Behavioral</option>
                <option value="MEDITATION">Meditation</option>
                <option value="GENERAL">General</option>
              </TextField>

              <TextField
                label="Price per Session"
                type="number"
                fullWidth
                inputProps={{ step: '0.01', min: '0' }}
                value={formData.pricePerSession}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerSession: parseFloat(e.target.value),
                  })
                }
              />

              <TextField
                label="Duration (minutes)"
                type="number"
                fullWidth
                inputProps={{ min: '15', max: '480' }}
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationMinutes: parseInt(e.target.value),
                  })
                }
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
