import { Box, Paper, Stack, Typography, Chip } from '@mui/material';
import { format, parse } from 'date-fns';
import { AvailableSlotDTO } from 'src/utils/specialist-api';

interface DateCardProps {
  date: string;
  slotCount: number;
  isSelected: boolean;
  onClick: (date: string) => void;
}

export function DateCard({ date, slotCount, isSelected, onClick }: DateCardProps) {
  const formattedDate = format(parse(date, 'yyyy-MM-dd', new Date()), 'EEE, MMM dd');
  const dayName = format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE');

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
          label={`${slotCount} slot${slotCount !== 1 ? 's' : ''}`}
          size="small"
          variant={isSelected ? 'filled' : 'outlined'}
          color={isSelected ? 'primary' : 'default'}
        />
      </Stack>
    </Paper>
  );
}
