import { useState, useEffect } from 'react';
import { format, startOfToday, isSameDay } from 'date-fns';
import {
  Box,
  Card,
  Grid,
  Stack,
  TextField,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locale/use-locales';
import { MOOD_OPTIONS } from 'src/type/diary';
import { IDiaryEntry, IDiaryRequest } from 'src/utils/diary-api';
import { useDiary } from 'src/hooks/use-diary';

import DiaryHeader from './componants/DiaryHeader';
import DiaryEntryCard from './componants/DiaryEntryCard';
import DiaryRecentEntries from './componants/DiaryRecentEntries';
import DiaryEntryDialog from './componants/DiaryEntryDialog';

// ----------------------------------------------------------------------

export default function DiaryView() {
  const settings = useSettingsContext();
  const { t } = useLocales();
  const { diaries, loading, error, fetchDiaries, addDiary, editDiary, removeDiary } = useDiary();

  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [diaryEntry, setDiaryEntry] = useState<IDiaryEntry | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editMood, setEditMood] = useState<IDiaryEntry['mood']>('calm');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch diaries on component mount
  useEffect(() => {
    fetchDiaries();
  }, [fetchDiaries]);

  useEffect(() => {
    const entry = diaries.find((e) => {
      const entryDate = e.date ? new Date(e.date) : new Date();
      return isSameDay(entryDate, selectedDate);
    });
    if (entry) {
      setDiaryEntry(entry);
      setEditTitle(entry.title);
      setEditContent(entry.content);
      setEditMood(entry.mood);
      setEditTags(entry.tags || []);
    } else {
      setDiaryEntry(null);
      setEditTitle('');
      setEditContent('');
      setEditMood('calm');
      setEditTags([]);
    }
  }, [selectedDate, diaries]);

  const getMoodInfo = (mood: IDiaryEntry['mood']) => MOOD_OPTIONS.find((m) => m.value === mood);

  const handleSaveEntry = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      setSaveError(t('diary.titleAndContentRequired'));
      return;
    }

    setSaveLoading(true);
    setSaveError(null);

    const entryData: IDiaryRequest = {
      title: editTitle,
      content: editContent,
      mood: editMood,
      tags: editTags,
      status: 'PUBLISHED',
      diaryDate: selectedDate,
    };

    try {
      if (diaryEntry) {
        // Update existing entry
        const updated = await editDiary(diaryEntry.id, entryData);
        if (updated) {
          setDiaryEntry(updated);
          setOpenDialog(false);
        } else {
          setSaveError(t('diary.updateFailed'));
        }
      } else {
        // Create new entry
        const created = await addDiary(entryData);
        if (created) {
          setDiaryEntry(created);
          setOpenDialog(false);
        } else {
          setSaveError(t('diary.createFailed'));
        }
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t('diary.saveFailed'));
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteEntry = async () => {
    if (diaryEntry) {
      setSaveLoading(true);
      setSaveError(null);
      try {
        await removeDiary(diaryEntry.id);
        setDiaryEntry(null);
        setEditTitle('');
        setEditContent('');
        setEditTags([]);
        setOpenDialog(false);
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : t('diary.deleteFailed'));
      } finally {
        setSaveLoading(false);
      }
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };

  const moodInfo = getMoodInfo(diaryEntry?.mood || editMood);

  if (loading && diaries.length === 0) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        <DiaryHeader
          title={t('diary.header')}
          buttonLabel={diaryEntry ? t('diary.editEntry') : t('diary.newEntry')}
          onOpenDialog={() => setOpenDialog(true)}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <Card sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={handleDateChange}
                  inputProps={{ max: format(startOfToday(), 'yyyy-MM-dd') }}
                  label={t('diary.selectDate')}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                />
              </Card>

              <DiaryEntryCard
                diaryEntry={diaryEntry}
                moodInfo={moodInfo}
                t={t}
                onClick={diaryEntry ? () => setOpenDialog(true) : undefined}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <DiaryRecentEntries
              entries={diaries}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              getMoodInfo={getMoodInfo}
              t={t}
            />
          </Grid>
        </Grid>
      </Stack>

      <DiaryEntryDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSaveError(null);
        }}
        diaryEntry={diaryEntry}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        editTitle={editTitle}
        onTitleChange={setEditTitle}
        editContent={editContent}
        onContentChange={setEditContent}
        editMood={editMood}
        onMoodChange={setEditMood}
        editTags={editTags}
        onTagsChange={setEditTags}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
        loading={saveLoading}
        error={saveError}
        t={t}
      />
    </Container>
  );
}
