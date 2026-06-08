import { Box, Paper, Rating, Stack, Typography } from '@mui/material';
import { PublicSpecialistDTO } from 'src/utils/specialist-api';

interface TherapistDetailCardProps {
  therapist: PublicSpecialistDTO;
}

export function TherapistDetailCard({ therapist }: TherapistDetailCardProps) {
  return (
    <Paper sx={{ p: 2, bgcolor: 'background.neutral' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
        <Box
          component="img"
          src={therapist.avatarUrl || '/assets/images/default-avatar.png'}
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
        <Stack sx={{ flex: 1 }}>
          <Typography variant="h6">{therapist.name}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            {therapist.specializations && therapist.specializations.length > 0
              ? therapist.specializations[0].toUpperCase()
              : 'Specialist'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Rating value={Math.round(therapist.rating * 2) / 2} readOnly size="small" />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              ({therapist.reviewCount})
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2">
              <strong>${therapist.hourlyRate}/hour</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {therapist.experience} years exp.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
