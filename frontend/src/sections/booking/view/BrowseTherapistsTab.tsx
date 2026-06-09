import { Box, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { TherapyType } from 'src/type/therapist';
import { PublicSpecialistDTO } from 'src/utils/specialist-api';
import { useLocales } from 'src/locale/use-locales';
import { TherapistCard } from './TherapistCard';
import { TherapistFilterBar } from './TherapistFilterBar';

interface BrowseTherapistsTabProps {
  therapists: PublicSpecialistDTO[];
  loading: boolean;
  filterType: TherapyType | 'all';
  onFilterChange: (type: TherapyType | 'all') => void;
  onSelectTherapist: (therapist: PublicSpecialistDTO) => void;
  specializations: { label: string; value: string }[];
}

export function BrowseTherapistsTab({
  therapists,
  loading,
  filterType,
  onFilterChange,
  onSelectTherapist,
  specializations,
}: BrowseTherapistsTabProps) {
  const { t } = useLocales();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (therapists.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('treatment.booking.noTherapists')}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <TherapistFilterBar
        filterType={filterType}
        onFilterChange={onFilterChange}
        specializations={specializations}
      />

      <Grid container spacing={3}>
        {therapists.map((therapist) => (
          <Grid item xs={12} sm={6} md={4} key={therapist.id}>
            <TherapistCard therapist={therapist} onClick={onSelectTherapist} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
