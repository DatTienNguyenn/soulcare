import { useState, useEffect } from 'react';
import { format, startOfToday, isSameDay } from 'date-fns';
import { Box, Card, Grid, Stack, TextField, Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locale/use-locales';
import { _diaryData, IDiaryEntry, MOOD_OPTIONS } from 'src/_mock/_diary';

import DiaryHeader from './componants/DiaryHeader';
import DiaryEntryCard from './componants/DiaryEntryCard';
import DiaryRecentEntries from './componants/DiaryRecentEntries';
import DiaryEntryDialog from './componants/DiaryEntryDialog';

// ----------------------------------------------------------------------

export default function DiaryView() {
  const settings = useSettingsContext();
  const { t } = useLocales();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [diaryEntry, setDiaryEntry] = useState<IDiaryEntry | null>(null);
  const [entries, setEntries] = useState<IDiaryEntry[]>(_diaryData);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editMood, setEditMood] = useState<IDiaryEntry['mood']>('calm');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const entry = entries.find((e) => isSameDay(e.date, selectedDate));
    if (entry) {
      setDiaryEntry(entry);
      setEditTitle(entry.title);
      setEditContent(entry.content);
      setEditMood(entry.mood);
      setEditTags(entry.tags);
    } else {
      setDiaryEntry(null);
      setEditTitle('');
      setEditContent('');
      setEditMood('calm');
      setEditTags([]);
    }
  }, [selectedDate, entries]);

  const getMoodInfo = (mood: IDiaryEntry['mood']) => MOOD_OPTIONS.find((m) => m.value === mood);

  const handleSaveEntry = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      return;
    }

    const now = new Date();
    const newEntry: IDiaryEntry = {
      id: diaryEntry?.id || `diary-${Date.now()}`,
      date: selectedDate,
      title: editTitle,
      content: editContent,
      mood: editMood,
      tags: editTags,
      createdAt: diaryEntry?.createdAt || now,
      updatedAt: now,
    };

    const updatedEntries = diaryEntry
      ? entries.map((e) => (e.id === diaryEntry.id ? newEntry : e))
      : [...entries, newEntry].sort((a, b) => b.date.getTime() - a.date.getTime());

    setEntries(updatedEntries);
    setDiaryEntry(newEntry);
    setOpenDialog(false);
  };

  const handleDeleteEntry = () => {
    if (diaryEntry) {
      setEntries(entries.filter((e) => e.id !== diaryEntry.id));
      setDiaryEntry(null);
      setEditTitle('');
      setEditContent('');
      setEditTags([]);
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(event.target.value));
  };

  const moodInfo = getMoodInfo(diaryEntry?.mood || editMood);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
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
              entries={entries}
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
        onClose={() => setOpenDialog(false)}
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
        t={t}
      />
    </Container>
  );
}
