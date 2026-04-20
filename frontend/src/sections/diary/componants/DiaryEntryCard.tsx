import { alpha } from '@mui/material/styles';
import { Avatar, Box, Card, Paper, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { IDiaryEntry } from 'src/_mock/_diary';
import DiaryTags from './DiaryTags';

type MoodInfo = {
  label: string;
  color: string;
  icon: React.ReactNode;
};

type DiaryEntryCardProps = {
  diaryEntry: IDiaryEntry | null;
  moodInfo?: MoodInfo;
  t: any;
  onClick?: () => void;
};

export default function DiaryEntryCard({ diaryEntry, moodInfo, t, onClick }: DiaryEntryCardProps) {
  if (!diaryEntry) {
    return (
      <Card sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          {t('diary.noEntry')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          {t('diary.noEntryMessage', { newEntry: t('diary.newEntry') })}
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        p: 3,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          // border: '1px solid black',
          boxShadow: onClick ? (theme) => theme.shadows[8] : 'none',
          // transform: onClick ? 'translateY(-2px)' : 'none',
        },
      }}
      onClick={onClick}
    >
      <Stack spacing={2}>
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h5">{diaryEntry.title}</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: moodInfo?.color || '#95989A',
                  width: 40,
                  height: 40,
                }}
              >
                {moodInfo?.icon}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {moodInfo?.label}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {format(diaryEntry.date, 'EEEE, MMMM d, yyyy')}
          </Typography>
        </Box>

        <DiaryTags tags={diaryEntry.tags} />

        <Paper
          sx={{
            p: 2,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {diaryEntry.content}
          </Typography>
        </Paper>

        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {t('diary.lastUpdated')}: {format(diaryEntry.updatedAt, 'MMM d, yyyy h:mm a')}
        </Typography>
      </Stack>
    </Card>
  );
}
