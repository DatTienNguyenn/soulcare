import { useState, useEffect } from 'react';
// import { useSetState } from 'src/hooks/use-boolean';
import { useMentalHealthTest } from 'src/hooks/use-mental-health-test';
import { useTestQuestion } from 'src/hooks/use-test-question';
import { useLocales } from 'src/locale/use-locales';

import {
  Card,
  Container,
  Stack,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import Scrollbar from 'src/components/scrollbar';
import {
  IMentalHealthTest,
  IMentalHealthTestRequest,
  ITestQuestionRequest,
} from 'src/utils/test-api';
import { QuestionForm, QuestionsList } from '../question-management';

interface FormDataState {
  name: string;
  shortName: string;
  totalQuestions: number;
  duration: number;
  minScore: number;
  maxScore: number;
  description: string;
  scoringGuide: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export default function TestManagementView() {
  const settings = useSettingsContext();
  const { t } = useLocales();
  const { tests, loading, error, fetchAllTests, addTest, editTest, removeTest } =
    useMentalHealthTest();
  const {
    questions,
    loading: questionsLoading,
    error: questionsError,
    fetchTestQuestions,
    addQuestion,
    editQuestion,
    removeQuestion,
  } = useTestQuestion();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTest, setEditingTest] = useState<IMentalHealthTest | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    shortName: '',
    totalQuestions: 0,
    duration: 0,
    minScore: 0,
    maxScore: 100,
    description: '',
    scoringGuide: '{}',
    status: 'ACTIVE',
  });
  const [submitting, setSubmitting] = useState(false);

  // Question Management State
  const [showQuestionsDialog, setShowQuestionsDialog] = useState(false);
  const [selectedTestForQuestions, setSelectedTestForQuestions] =
    useState<IMentalHealthTest | null>(null);
  const [openQuestionForm, setOpenQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [questionSubmitting, setQuestionSubmitting] = useState(false);

  // Load tests on component mount
  useEffect(() => {
    fetchAllTests();
  }, [fetchAllTests]);

  const handleOpenDialog = (test?: IMentalHealthTest) => {
    if (test) {
      setEditingTest(test);
      setFormData({
        name: test.name,
        shortName: test.shortName,
        totalQuestions: test.totalQuestions,
        duration: test.duration,
        minScore: test.minScore,
        maxScore: test.maxScore,
        description: test.description,
        scoringGuide: test.scoringGuide,
        status: test.status as any,
      });
    } else {
      setEditingTest(null);
      setFormData({
        name: '',
        shortName: '',
        totalQuestions: 0,
        duration: 0,
        minScore: 0,
        maxScore: 100,
        description: '',
        scoringGuide: '{}',
        status: 'ACTIVE',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTest(null);
  };

  const handleSaveTest = async () => {
    try {
      setSubmitting(true);
      const testData: IMentalHealthTestRequest = {
        name: formData.name,
        shortName: formData.shortName,
        totalQuestions: formData.totalQuestions,
        duration: formData.duration,
        minScore: formData.minScore,
        maxScore: formData.maxScore,
        description: formData.description,
        scoringGuide: formData.scoringGuide,
        status: formData.status,
      };

      if (editingTest) {
        await editTest(editingTest.id, testData);
      } else {
        await addTest(testData);
      }
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (window.confirm(t('testManagement.deleteConfirm'))) {
      try {
        await removeTest(testId);
      } catch (err) {
        console.error('Failed to delete test:', err);
      }
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['totalQuestions', 'minScore', 'maxScore', 'duration'].includes(name)
        ? parseInt(value) || 0
        : value,
    });
  };

  // Question Management Handlers
  const handleOpenQuestionsDialog = async (test: IMentalHealthTest) => {
    setSelectedTestForQuestions(test);
    setShowQuestionsDialog(true);
    await fetchTestQuestions(test.id);
  };

  const handleCloseQuestionsDialog = () => {
    setShowQuestionsDialog(false);
    setSelectedTestForQuestions(null);
  };

  const handleOpenQuestionForm = (question?: any) => {
    console.log('handleOpenQuestionForm called with:', question);
    setEditingQuestion(question && question.id ? question : null);
    setOpenQuestionForm(true);
  };

  const handleCloseQuestionForm = () => {
    setOpenQuestionForm(false);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = async (data: ITestQuestionRequest) => {
    if (!selectedTestForQuestions) {
      console.error('No test selected for question');
      return;
    }

    try {
      setQuestionSubmitting(true);
      if (editingQuestion && editingQuestion.id) {
        // console.log('Editing question:', editingQuestion.id);
        await editQuestion(selectedTestForQuestions.id, editingQuestion.id, data);
      } else {
        // console.log('Creating new question');
        await addQuestion(selectedTestForQuestions.id, data);
      }
      handleCloseQuestionForm();
      await fetchTestQuestions(selectedTestForQuestions.id);
    } catch (err) {
      console.error('Failed to save question:', err);
    } finally {
      setQuestionSubmitting(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!selectedTestForQuestions) return;

    if (window.confirm(t('questionManagement.deleteConfirm'))) {
      try {
        await removeQuestion(selectedTestForQuestions.id, questionId);
        await fetchTestQuestions(selectedTestForQuestions.id);
      } catch (err) {
        console.error('Failed to delete question:', err);
      }
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <div>
            <h1 style={{ margin: 0 }}>{t('testManagement.title')}</h1>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>{t('testManagement.subtitle')}</p>
          </div>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => handleOpenDialog()}
            disabled={loading}
          >
            {t('testManagement.newTest')}
          </Button>
        </Stack>

        {/* Error Alert */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Loading State */}
        {loading && !tests.length ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Tests Table */}
            <Card>
              <Scrollbar>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>{t('testManagement.table.testName')}</TableCell>
                        <TableCell align="center">{t('testManagement.table.shortName')}</TableCell>
                        <TableCell align="center">{t('testManagement.table.questions')}</TableCell>
                        <TableCell align="center">{t('testManagement.table.duration')}</TableCell>
                        <TableCell align="center">{t('testManagement.table.status')}</TableCell>
                        <TableCell align="center">{t('testManagement.table.created')}</TableCell>
                        <TableCell align="right">{t('testManagement.table.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                            {t('testManagement.noTests')}
                          </TableCell>
                        </TableRow>
                      ) : (
                        tests.map((test) => (
                          <TableRow key={test.id} hover>
                            <TableCell>
                              <Box>
                                <strong>{test.name}</strong>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={test.shortName} size="small" />
                            </TableCell>
                            <TableCell align="center">{test.totalQuestions}</TableCell>
                            <TableCell align="center">{test.duration}</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={test.status}
                                size="small"
                                color={test.status === 'ACTIVE' ? 'success' : 'default'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              {test.createdAt
                                ? new Date(test.createdAt).toLocaleDateString()
                                : t('testManagement.other.notAvailable')}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => handleOpenQuestionsDialog(test)}
                                title={t('questionManagement.actions.manageQuestions')}
                              >
                                <Iconify icon="solar:list-bold" width={20} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(test)}
                                title={t('testManagement.actions.edit')}
                              >
                                <Iconify icon="solar:pen-bold" width={20} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteTest(test.id)}
                                title={t('testManagement.actions.delete')}
                              >
                                <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </>
        )}
      </Stack>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTest
            ? t('testManagement.dialog.editTitle')
            : t('testManagement.dialog.createTitle')}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label={t('testManagement.dialog.testName')}
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder={t('testManagement.dialog.testNamePlaceholder')}
              required
            />
            <TextField
              fullWidth
              label={t('testManagement.dialog.shortName')}
              name="shortName"
              value={formData.shortName}
              onChange={handleFormChange}
              placeholder={t('testManagement.dialog.shortNamePlaceholder')}
              required
            />
            <TextField
              fullWidth
              label={t('testManagement.dialog.description')}
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              multiline
              rows={2}
              placeholder={t('testManagement.dialog.descriptionPlaceholder')}
            />
            <TextField
              fullWidth
              type="number"
              label={t('testManagement.dialog.totalQuestions')}
              name="totalQuestions"
              value={formData.totalQuestions}
              onChange={handleFormChange}
              required
            />
            <TextField
              fullWidth
              type="number"
              label={t('testManagement.dialog.duration')}
              name="duration"
              value={formData.duration}
              onChange={handleFormChange}
              placeholder="e.g., 5"
              inputProps={{ min: 0 }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                type="number"
                label={t('testManagement.dialog.minScore')}
                name="minScore"
                value={formData.minScore}
                onChange={handleFormChange}
              />
              <TextField
                fullWidth
                type="number"
                label={t('testManagement.dialog.maxScore')}
                name="maxScore"
                value={formData.maxScore}
                onChange={handleFormChange}
              />
            </Stack>
            <TextField
              fullWidth
              select
              label={t('testManagement.dialog.status')}
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              SelectProps={{
                native: true,
              }}
            >
              <option value="ACTIVE">{t('testManagement.dialog.statusActive')}</option>
              <option value="INACTIVE">{t('testManagement.dialog.statusInactive')}</option>
              <option value="ARCHIVED">{t('testManagement.dialog.statusArchived')}</option>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('testManagement.dialog.cancel')}</Button>
          <Button variant="contained" onClick={handleSaveTest} disabled={submitting}>
            {submitting ? (
              <CircularProgress size={24} />
            ) : editingTest ? (
              t('testManagement.dialog.update')
            ) : (
              t('testManagement.dialog.create')
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Questions List Dialog */}
      <QuestionsList
        open={showQuestionsDialog}
        questions={questions}
        loading={questionsLoading}
        error={questionsError}
        onClose={handleCloseQuestionsDialog}
        onAdd={handleOpenQuestionForm}
        onEdit={handleOpenQuestionForm}
        onDelete={handleDeleteQuestion}
      />

      {/* Question Form Dialog */}
      <QuestionForm
        open={openQuestionForm}
        question={editingQuestion}
        onClose={handleCloseQuestionForm}
        onSubmit={handleSaveQuestion}
        submitting={questionSubmitting}
      />
    </Container>
  );
}
