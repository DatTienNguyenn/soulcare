import { useState, useEffect } from 'react';
import { useMentalHealthTest } from 'src/hooks/use-mental-health-test';
import { useTestQuestion } from 'src/hooks/use-test-question';
import { useLocales } from 'src/locale/use-locales';
import { Container, Stack, Button, Box, Alert, CircularProgress } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import {
  IMentalHealthTest,
  IMentalHealthTestRequest,
  ITestQuestionRequest,
} from 'src/utils/test-api';
import { QuestionForm, QuestionsList } from '../question-management';
import TestsTable from './components/TestsTable';
import TestFormDialog from './components/TestFormDialog';

interface FormDataState {
  name: string;
  shortName: string;
  totalQuestions: number;
  duration: number;
  minScore: number;
  maxScore: number;
  description: string;
  scoringGuide: {
    Normal: { min: number; max: number; color: string };
    Mild: { min: number; max: number; color: string };
    Moderate: { min: number; max: number; color: string };
    Severe: { min: number; max: number; color: string };
    'Very Severe': { min: number; max: number; color: string };
  } | null;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

const LEVEL_COLORS = {
  Normal: '#4CAF50',
  Mild: '#8BC34A',
  Moderate: '#FFC107',
  Severe: '#FF9800',
  'Very Severe': '#F44336',
};

const getInitialScoringGuide = () => ({
  Normal: { min: 0, max: 10, color: LEVEL_COLORS.Normal },
  Mild: { min: 11, max: 20, color: LEVEL_COLORS.Mild },
  Moderate: { min: 21, max: 30, color: LEVEL_COLORS.Moderate },
  Severe: { min: 31, max: 40, color: LEVEL_COLORS.Severe },
  'Very Severe': { min: 41, max: 50, color: LEVEL_COLORS['Very Severe'] },
});

const INITIAL_SCORING_GUIDE = getInitialScoringGuide();

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
    scoringGuide: null,
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

      // Parse scoring guide with fallback to null
      let parsedScoringGuide: typeof formData.scoringGuide = null;
      if (test.scoringGuide) {
        try {
          const parsed = JSON.parse(test.scoringGuide);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            parsedScoringGuide = parsed;
          }
        } catch (e) {
          console.error('Failed to parse scoring guide, leaving as null:', e);
        }
      }

      // Set form data with fallback values
      const newFormData = {
        name: test.name || '',
        shortName: test.shortName || '',
        totalQuestions: test.totalQuestions || 0,
        duration: test.duration || 0,
        minScore: test.minScore || 0,
        maxScore: test.maxScore || 100,
        description: test.description || '',
        scoringGuide: parsedScoringGuide,
        status: (test.status || 'ACTIVE') as 'ACTIVE' | 'INACTIVE' | 'ARCHIVED',
      };
      setFormData(newFormData);
    } else {
      setEditingTest(null);
      const newFormData = {
        name: '',
        shortName: '',
        totalQuestions: 0,
        duration: 0,
        minScore: 0,
        maxScore: 100,
        description: '',
        scoringGuide: null,
        status: 'ACTIVE' as const,
      };
      setFormData(newFormData);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTest(null);
    // Reset form data to initial state
    setFormData({
      name: '',
      shortName: '',
      totalQuestions: 0,
      duration: 0,
      minScore: 0,
      maxScore: 100,
      description: '',
      scoringGuide: null,
      status: 'ACTIVE',
    });
  };

  const handleSaveTest = async () => {
    try {
      setSubmitting(true);

      // Validate form data before saving
      if (!formData.name.trim() || !formData.shortName.trim()) {
        console.error('Test name and short name are required');
        return;
      }

      if (!formData.scoringGuide) {
        console.error('Scoring guide is required - please set the scoring levels');
        alert('Please set the scoring levels before saving.');
        return;
      }

      const testData: IMentalHealthTestRequest = {
        name: formData.name,
        shortName: formData.shortName,
        totalQuestions: formData.totalQuestions,
        duration: formData.duration,
        minScore: formData.minScore,
        maxScore: formData.maxScore,
        description: formData.description,
        scoringGuide: JSON.stringify(formData.scoringGuide),
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

  const handleScoringGuideChange = (level: string, field: 'min' | 'max', value: number) => {
    if (!formData.scoringGuide) return; // Can't modify if scoring guide is not set

    setFormData({
      ...formData,
      scoringGuide: {
        ...formData.scoringGuide,
        [level]: {
          ...(formData.scoringGuide[level as keyof typeof formData.scoringGuide] || {}),
          [field]: value,
        },
      },
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
        await editQuestion(selectedTestForQuestions.id, editingQuestion.id, data);
      } else {
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mingcute:refresh-line" />}
              onClick={() => fetchAllTests()}
              disabled={loading}
            >
              {t('testManagement.refresh')}
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => handleOpenDialog()}
              disabled={loading}
            >
              {t('testManagement.newTest')}
            </Button>
          </div>
        </Stack>

        {/* Error Alert */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Tests Table */}
        <TestsTable
          tests={tests}
          loading={loading}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteTest}
          onManageQuestions={handleOpenQuestionsDialog}
          t={t}
        />
      </Stack>

      {/* Test Form Dialog */}
      <TestFormDialog
        open={openDialog}
        editingTest={editingTest}
        formData={formData}
        submitting={submitting}
        onClose={handleCloseDialog}
        onSave={handleSaveTest}
        onFormChange={handleFormChange}
        onAddDefaultLevels={() =>
          setFormData({ ...formData, scoringGuide: getInitialScoringGuide() })
        }
        onScoringLevelChange={handleScoringGuideChange}
        t={t}
      />

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
