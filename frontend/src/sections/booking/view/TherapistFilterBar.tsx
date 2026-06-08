import { Box, Chip, Stack, Typography } from '@mui/material';
import { TherapyType } from 'src/type/therapist';

interface TherapistFilterBarProps {
  filterType: TherapyType | 'all';
  onFilterChange: (type: TherapyType | 'all') => void;
  specializations: { label: string; value: string }[];
}

export function TherapistFilterBar({
  filterType,
  onFilterChange,
  specializations,
}: TherapistFilterBarProps) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Filter by Specialization
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
        {specializations.map((spec) => (
          <Chip
            key={spec.value}
            label={spec.label}
            onClick={() => onFilterChange(spec.value as TherapyType | 'all')}
            variant={filterType === spec.value ? 'filled' : 'outlined'}
            color={filterType === spec.value ? 'primary' : 'default'}
          />
        ))}
      </Stack>
    </Box>
  );
}
