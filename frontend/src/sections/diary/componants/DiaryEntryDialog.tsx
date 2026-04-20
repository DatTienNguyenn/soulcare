import { format, startOfToday } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { IDiaryEntry, MOOD_OPTIONS } from 'src/_mock/_diary';

type DiaryEntryDialogProps = {
  open: boolean;
  onClose: VoidFunction;
  diaryEntry: IDiaryEntry | null;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  editTitle: string;
  onTitleChange: (value: string) => void;
  editContent: string;
  onContentChange: (value: string) => void;
  editMood: IDiaryEntry['mood'];
  onMoodChange: (mood: IDiaryEntry['mood']) => void;
  editTags: string[];
  onTagsChange: (tags: string[]) => void;
  onSave: VoidFunction;
  onDelete: VoidFunction;
  t: any;
};

export default function DiaryEntryDialog({
  open,
  onClose,
  diaryEntry,
  selectedDate,
  onDateChange,
  editTitle,
  onTitleChange,
  editContent,
  onContentChange,
  editMood,
  onMoodChange,
  editTags,
  onTagsChange,
  onSave,
  onDelete,
  t,
}: DiaryEntryDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {diaryEntry ? `${t('common.edit')} ${t('diary.header')}` : t('diary.createNew')}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label={t('diary.date')}
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            inputProps={{
              max: format(startOfToday(), 'yyyy-MM-dd'),
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label={t('diary.title')}
            value={editTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={t('diary.enterTitle')}
          />

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t('diary.selectMood')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {MOOD_OPTIONS.map((mood) => (
                <Avatar
                  key={mood.value}
                  onClick={() => onMoodChange(mood.value as IDiaryEntry['mood'])}
                  sx={{
                    bgcolor: mood.color,
                    cursor: 'pointer',
                    border:
                      editMood === mood.value
                        ? (theme) => `3px solid ${theme.palette.primary.main}`
                        : '3px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {mood.icon}
                </Avatar>
              ))}
            </Box>
          </Box>

          <TextField
            fullWidth
            label={t('diary.content')}
            value={editContent}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={t('diary.enterContent')}
            multiline
            rows={6}
          />

          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {t('diary.tags')}
            </Typography>
            <TextField
              fullWidth
              value={editTags.join(', ')}
              onChange={(e) => onTagsChange(e.target.value.split(',').map((tag) => tag.trim()))}
              placeholder={t('diary.addTags')}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        {diaryEntry && (
          <Button color="error" onClick={onDelete}>
            {t('diary.delete')}
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button
          variant="contained"
          onClick={onSave}
          disabled={!editTitle.trim() || !editContent.trim()}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
