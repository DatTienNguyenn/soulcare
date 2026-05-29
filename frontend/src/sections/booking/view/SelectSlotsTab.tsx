import { useState, useMemo } from 'react';
import { Box, Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import { PublicSpecialistDTO, AvailableSlotDTO } from 'src/utils/specialist-api';
import { TherapistDetailCard } from './TherapistDetailCard';
import { DateCard } from './DateCard';
import { TimeSlotCard } from './TimeSlotCard';

interface SelectSlotsTabProps {
  therapist: PublicSpecialistDTO;
  slots: AvailableSlotDTO[];
  loading: boolean;
  onSelectSlot: (slot: AvailableSlotDTO) => void;
  onDateSelected?: (date: string) => void; // Optional: callback when date is selected
}

export function SelectSlotsTab({
  therapist,
  slots,
  loading,
  onSelectSlot,
  onDateSelected,
}: SelectSlotsTabProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slotsLoadingForDate, setSlotsLoadingForDate] = useState(false);

  // Group available slots by date and count them
  const availableDates = useMemo(() => {
    const dateMap = new Map<string, AvailableSlotDTO[]>();
    slots.forEach((slot) => {
      if (!dateMap.has(slot.date)) {
        dateMap.set(slot.date, []);
      }
      dateMap.get(slot.date)!.push(slot);
    });
    return Array.from(dateMap.entries()).map(([date, dateSlots]) => ({
      date,
      slotCount: dateSlots.length,
      slots: dateSlots,
    }));
  }, [slots]);

  // Get slots for selected date
  const selectedDateSlots = selectedDate
    ? availableDates.find((d) => d.date === selectedDate)?.slots || []
    : [];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // Optional: callback to fetch slots for this specific date if implemented
    if (onDateSelected) {
      onDateSelected(date);
    }
  };

  const handleBackToDateSelection = () => {
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (availableDates.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No available dates for this therapist
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <TherapistDetailCard therapist={therapist} />

      {!selectedDate ? (
        // Date Selection View
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Select a Date
          </Typography>
          <Grid container spacing={2}>
            {availableDates.map(({ date, slotCount }) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={date}>
                <DateCard
                  date={date}
                  slotCount={slotCount}
                  isSelected={selectedDate === date}
                  onClick={handleDateSelect}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        // Time Slot Selection View
        <Box>
          <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ flex: 1 }}>
              Available Times
            </Typography>
            <Button size="small" variant="outlined" onClick={handleBackToDateSelection}>
              Change Date
            </Button>
          </Stack>

          {slotsLoadingForDate ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedDateSlots.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No available time slots for this date
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {selectedDateSlots.map((slot) => (
                <Grid item xs={12} sm={6} md={4} key={slot.id}>
                  <TimeSlotCard slot={slot} onClick={onSelectSlot} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Stack>
  );
}
