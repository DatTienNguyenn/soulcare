import { Box, Paper, Stack, Typography, Chip } from '@mui/material';
import { format, parse } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { AvailableSlotDTO } from 'src/utils/specialist-api';
import { useLocales } from 'src/locale/use-locales';

interface DateCardProps {
  date: string;
  slotCount: number;
  isSelected: boolean;
  onClick: (date: string) => void;
}

export function DateCard({ date, slotCount, isSelected, onClick }: DateCardProps) {
  const { t, currentLang } = useLocales();

  const dateLocale = currentLang.value.includes('vi') ? vi : enUS;
  const formattedDate = format(parse(date, 'yyyy-MM-dd', new Date()), 'EEE, MMM dd', {
    locale: dateLocale,
  });
  const dayName = format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE', { locale: dateLocale });

  return (
    <Paper
      onClick={() => onClick(date)}
      sx={{
        p: 2,
        cursor: 'pointer',
        border: '2px solid',
        borderColor: isSelected ? 'primary.main' : 'divider',
        bgcolor: isSelected ? 'primary.lighter' : 'background.paper',
        transition: 'all 0.3s',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 2,
        },
      }}
    >
      <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {dayName}
        </Typography>
        <Typography variant="h6" sx={{ color: isSelected ? 'primary.main' : 'text.primary' }}>
          {formattedDate}
        </Typography>
        <Chip
          label={`${slotCount} ${slotCount !== 1 ? t('treatment.booking.slots') : t('treatment.booking.slot')}`}
          size="small"
          variant={isSelected ? 'filled' : 'outlined'}
          color={isSelected ? 'primary' : 'default'}
        />
      </Stack>
    </Paper>
  );
}
