import { Box, Card, CardContent, CardHeader, Chip, Rating, Stack, Typography } from '@mui/material';
import { PublicSpecialistDTO } from 'src/utils/specialist-api';
import { useLocales } from 'src/locale/use-locales';

interface TherapistCardProps {
  therapist: PublicSpecialistDTO;
  onClick: (therapist: PublicSpecialistDTO) => void;
}

export function TherapistCard({ therapist, onClick }: TherapistCardProps) {
  const { t } = useLocales();
  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-4px)',
        },
      }}
      onClick={() => onClick(therapist)}
    >
      <CardHeader
        avatar={
          <Box
            component="img"
            src={therapist.avatarUrl || '/assets/images/default-avatar.png'}
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        }
        title={therapist.name}
        subheader={t('treatment.booking.specialist').toUpperCase()}
      />
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={Math.round(therapist.rating * 2) / 2} readOnly size="small" />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              ({therapist.reviewCount})
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {therapist.bio}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            <Chip
              label={`${therapist.experience} ${t('treatment.booking.yrsExp')}`}
              size="small"
              variant="outlined"
            />
            <Chip
              label={`$${therapist.hourlyRate}${t('treatment.booking.perHour')}`}
              size="small"
              color="primary"
            />
          </Stack>

          {therapist.specializations && therapist.specializations.length > 0 && (
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}
              >
                <strong>{t('treatment.booking.specializations')}</strong>
              </Typography>
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                {therapist.specializations.map((spec, idx) => (
                  <Chip
                    key={idx}
                    label={spec.charAt(0).toUpperCase() + spec.slice(1).toLowerCase()}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Box>
          )}

          {therapist.languages && therapist.languages.length > 0 && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              <strong>{t('treatment.booking.languages')}</strong> {therapist.languages.join(', ')}
            </Typography>
          )}

          <Typography variant="body2">
            <strong>{t('treatment.booking.availableLabel')}</strong> {therapist.availableHours}
          </Typography>

          <Typography variant="caption" sx={{ color: 'success.main' }}>
            {therapist.responseTime}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
