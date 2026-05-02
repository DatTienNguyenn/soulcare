import { alpha } from '@mui/material/styles';
import {
  format,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { Box, Card, Stack, Typography } from '@mui/material';
import { IDiaryEntry } from 'src/utils/diary-api';

type DiaryRecentEntriesProps = {
  entries: IDiaryEntry[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  getMoodInfo: (
    mood: IDiaryEntry['mood']
  ) => { label: string; color: string; icon: React.ReactNode } | undefined;
  t: any;
};

export default function DiaryRecentEntries({
  entries,
  selectedDate,
  onSelectDate,
  getMoodInfo,
  t,
}: DiaryRecentEntriesProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekdays = (t('diary.weekdays', { returnObjects: true }) as string[] | string) || [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];
  const weekdayLabels = Array.isArray(weekdays)
    ? weekdays
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEntryForDay = (day: Date) =>
    entries.find((entry) => {
      const entryDate = entry.date ? new Date(entry.date) : null;
      return entryDate ? isSameDay(entryDate, day) : false;
    });

  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('diary.moodCalendar')}</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            {format(monthStart, 'MMMM yyyy')}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: 1,
            textAlign: 'center',
          }}
        >
          {weekdayLabels.map((weekday: string) => (
            <Typography
              key={weekday}
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 700 }}
            >
              {weekday}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gap: 1,
          }}
        >
          {days.map((day) => {
            const entry = getEntryForDay(day);
            const moodInfo = entry ? getMoodInfo(entry.mood) : undefined;
            const isSelected = isSameDay(day, selectedDate);
            const outsideMonth = !isSameMonth(day, monthStart);
            const moodBg = moodInfo?.color;

            return (
              <Box
                key={day.toISOString()}
                onClick={() => onSelectDate(day)}
                sx={{
                  p: 1,
                  minHeight: 60,
                  borderRadius: 2,
                  border: 1,
                  borderColor: isSelected ? 'primary.main' : entry ? moodBg : 'divider',
                  bgcolor: isSelected
                    ? (theme) => alpha(theme.palette.primary.main, 0.08)
                    : entry
                      ? (theme) => alpha(moodBg ?? theme.palette.grey[500], 0.24)
                      : 'background.paper',
                  cursor: 'pointer',
                  opacity: outsideMonth ? 0.48 : 1,
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: entry
                        ? 'common.black'
                        : outsideMonth
                          ? 'text.disabled'
                          : 'text.primary',
                      fontWeight: 700,
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>
                  {isSameDay(day, new Date()) && (
                    <Typography
                      variant="caption"
                      sx={{ color: entry ? 'common.black' : 'primary.main' }}
                    >
                      •
                    </Typography>
                  )}
                </Box>
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}
                >
                  {entry ? (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        // bgcolor: moodInfo?.color || 'grey.400',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      {moodInfo?.icon}
                    </Box>
                  ) : (
                    <Box sx={{ width: 32, height: 32 }} />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Card>
  );
}
