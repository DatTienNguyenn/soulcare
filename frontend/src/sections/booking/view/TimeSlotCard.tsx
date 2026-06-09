import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import { format, parse } from 'date-fns';
import { AvailableSlotDTO } from 'src/utils/specialist-api';
import { useLocales } from 'src/locale/use-locales';

interface TimeSlotCardProps {
  slot: AvailableSlotDTO;
  onClick: (slot: AvailableSlotDTO) => void;
}

export function TimeSlotCard({ slot, onClick }: TimeSlotCardProps) {
  const { t } = useLocales();
  const isAvailable = slot.status === 'available';

  return (
    <Paper
      onClick={() => onClick(slot)}
      sx={{
        p: 2,
        cursor: isAvailable ? 'pointer' : 'default',
        bgcolor: isAvailable ? 'background.paper' : 'action.disabledBackground',
        border: '1px solid',
        borderColor: isAvailable ? 'primary.main' : 'divider',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: isAvailable ? 2 : 0,
          borderColor: isAvailable ? 'primary.dark' : 'divider',
        },
        opacity: isAvailable ? 1 : 0.6,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {format(parse(slot.date, 'yyyy-MM-dd', new Date()), 'MMM dd, yyyy')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'primary.main' }}>
          {slot.startTime} - {slot.endTime}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Chip
            label={isAvailable ? t('treatment.booking.available') : t('treatment.booking.booked')}
            size="small"
            color={isAvailable ? 'success' : 'default'}
            variant="outlined"
          />
          <Typography variant="subtitle2" sx={{ color: 'success.main' }}>
            ${slot.price}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
