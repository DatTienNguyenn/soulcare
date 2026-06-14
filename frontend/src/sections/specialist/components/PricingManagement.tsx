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
import { useLocales } from 'src/locale/use-locales';

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
  const { t } = useLocales();

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
      setSaveError(t('specialist.setting.notify.fillFieldsCorrectly'));
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
        setSuccessMessage(t('specialist.setting.notify.pricingUpdateSuccess'));
      } else {
        // Create new pricing
        await createSessionPricing({
          sessionType: formData.sessionType,
          pricePerSession: formData.pricePerSession,
          durationMinutes: formData.durationMinutes,
          active: true,
        });
        setSuccessMessage(t('specialist.setting.notify.pricingCreateSuccess'));
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

    if (window.confirm(t('specialist.setting.pricing.confirmDelete'))) {
      try {
        await deletePricing(pricing.sessionType);
        setSuccessMessage(t('specialist.setting.notify.pricingDeleteSuccess'));
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
      setSuccessMessage(
        pricing.active
          ? t('specialist.setting.notify.pricingDeactivated')
          : t('specialist.setting.notify.pricingActivated')
      );
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
        title={t('specialist.setting.pricing.title')}
        action={
          <Button
            variant="contained"
            startIcon={<PlusIcon size={20} />}
            onClick={() => handleOpenDialog()}
          >
            {t('specialist.setting.pricing.addPricing')}
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
                <TableCell sx={{ fontWeight: 'bold' }}>
                  {t('specialist.setting.pricing.sessionType')}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                  {t('specialist.setting.pricing.price')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  {t('specialist.setting.pricing.duration')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  {t('specialist.setting.pricing.status')}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  {t('specialist.setting.pricing.actions')}
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
                      label={
                        pricing.active
                          ? t('specialist.setting.pricing.active')
                          : t('specialist.setting.pricing.inactive')
                      }
                      color={pricing.active ? 'success' : 'default'}
                      size="small"
                      onClick={() => handleToggleActive(pricing.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(pricing)}
                      title={t('common.edit')}
                    >
                      <EditIcon size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(pricing.id)}
                      title={t('common.delete')}
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
            {editingId
              ? t('specialist.setting.pricing.editTitle')
              : t('specialist.setting.pricing.addTitle')}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                label={t('specialist.setting.pricing.sessionType')}
                select
                fullWidth
                SelectProps={{
                  native: true,
                }}
                value={formData.sessionType}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
              >
                <option value="">{t('specialist.setting.pricing.selectType')}</option>
                <option value="PSYCHOLOGY">{t('treatment.filter.psychology')}</option>
                <option value="COUNSELING">{t('treatment.filter.counseling')}</option>
                <option value="BEHAVIORAL">{t('treatment.filter.behavioral')}</option>
                <option value="MEDITATION">{t('treatment.filter.meditation')}</option>
                <option value="GENERAL">{t('treatment.filter.all')}</option>
              </TextField>

              <TextField
                label={t('specialist.setting.pricing.pricePerSession')}
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
                label={t('specialist.setting.pricing.durationMinutes')}
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
            <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
            <Button onClick={handleSave} variant="contained">
              {editingId
                ? t('specialist.setting.actions.update')
                : t('specialist.setting.actions.add')}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
