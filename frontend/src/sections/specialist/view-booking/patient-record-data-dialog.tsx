import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Stack,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { format } from 'date-fns';
import { EHRResponse } from 'src/utils/specialist-api';
import { PictureData } from 'src/utils/picture-api';
import { useLocales } from 'src/locale/use-locales';

interface PatientRecordDataDialogProps {
  open: boolean;
  onClose: () => void;
  patientName: string;
  ehrs: EHRResponse[];
  loadingEhrs: boolean;
  pictures: PictureData[];
  loadingPictures: boolean;
}

export function PatientRecordDataDialog({
  open,
  onClose,
  patientName,
  ehrs,
  loadingEhrs,
  pictures,
  loadingPictures,
}: PatientRecordDataDialogProps) {
  const { t } = useLocales();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('specialist.bookings.dialogs.patientRecords', { name: patientName }) ||
          `Patient Records: ${patientName}`}
      </DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={t('specialist.bookings.dialogs.healthRecords') || 'Health Records'} />
          <Tab label={t('specialist.bookings.dialogs.canvas') || 'Canvas'} />
        </Tabs>
      </Box>
      <DialogContent sx={{ pt: 2, minHeight: 400 }}>
        {tabValue === 0 && (
          <Box>
            {loadingEhrs ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : ehrs.length > 0 ? (
              <Stack spacing={2}>
                {ehrs.map((ehr) => (
                  <Paper key={ehr.id} sx={{ p: 2, backgroundColor: 'background.neutral' }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('specialist.bookings.dialogs.date')}
                        </Typography>
                        <Typography variant="body1">
                          {ehr.createdAt
                            ? format(new Date(ehr.createdAt), 'MMMM dd, yyyy HH:mm')
                            : t('specialist.bookings.dialogs.unknownDate')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('specialist.bookings.dialogs.diagnosis')}
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {ehr.diagnosis}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('specialist.bookings.dialogs.treatmentPlan')}
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {ehr.treatmentPlan}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <Typography color="text.secondary">
                  {t('specialist.bookings.dialogs.noRecords') || 'No health records found.'}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            {loadingPictures ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : pictures.length > 0 ? (
              <Grid container spacing={2}>
                {pictures.map((pic) => (
                  <Grid item xs={12} sm={6} key={pic.id}>
                    <Card>
                      {pic.imageUrl && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={pic.imageUrl}
                          alt={pic.description || 'Patient Canvas'}
                          sx={{ objectFit: 'cover', borderBottom: '1px solid #eee' }}
                        />
                      )}
                      <CardContent>
                        <Typography variant="subtitle1" noWrap>
                          {pic.description || 'Untitled Drawing'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pic.createdAt
                            ? format(new Date(pic.createdAt), 'MMM dd, yyyy')
                            : 'Unknown date'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <Typography color="text.secondary">
                  No published pictures found for this patient.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('specialist.bookings.dialogs.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
