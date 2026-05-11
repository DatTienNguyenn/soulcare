import { useState, useEffect } from 'react';
import { Container, Stack, CircularProgress, Alert } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locale/use-locales';
import { MentalHealthTest, TestResult } from 'src/_mock/_self-test';
import { useMentalHealthAPI } from 'src/hooks/use-mental-health-api';
import {
  transformAPITestToFrontend,
  getColorByLevel,
  getDescriptionByLevel,
} from './utils/test-transformer';
import SelfTestIntro from './componants/SelfTestIntro';
import SelfTestQuestionView from './componants/SelfTestQuestionView';
import SelfTestResultView from './componants/SelfTestResultView';

export default function SelfTestView() {
  const settings = useSettingsContext();
  const { t } = useLocales();
  const { fetchActiveTests, fetchTestQuestions, submitTestResult, loading, error, setError } =
    useMentalHealthAPI();

  const [tests, setTests] = useState<MentalHealthTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<MentalHealthTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [loadingTests, setLoadingTests] = useState(true);

  // Load tests on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingTests(true);
        setError(null);
        const activeTestsFromAPI = await fetchActiveTests();

        // Transform API response to frontend format
        const transformedTests = activeTestsFromAPI.map((test) => {
          try {
            return transformAPITestToFrontend(test);
          } catch (transformError) {
            console.error('Error transforming test:', test, transformError);
            throw transformError;
          }
        });
        setTests(transformedTests);
      } catch (err) {
        console.error('Failed to load tests:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load tests. Please try again.';
        setError(errorMessage);
      } finally {
        setLoadingTests(false);
      }
    };

    loadData();
  }, [fetchActiveTests, setError]);

  const handleStartTest = async (test: MentalHealthTest) => {
    try {
      // Fetch questions for this test from API
      const questionsFromAPI = await fetchTestQuestions(test.id);

      // Create a new test object with the fetched questions
      const testWithQuestions: typeof test = {
        ...test,
        questions: questionsFromAPI.map((q) => ({
          id: q.id,
          question: q.questionText,
          options: q.options.map((opt) => ({
            label: opt.optionText,
            value: opt.optionValue,
          })),
        })),
      };

      setSelectedTest(testWithQuestions);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTestResult(null);
      setShowResult(false);
    } catch (err) {
      console.error('Failed to start test:', err);
      setError('Failed to load test questions. Please try again.');
    }
  };

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleNext = () => {
    if (selectedTest && currentQuestionIndex < selectedTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTest) return;

    try {
      // Submit test result to API - answers can contain mixed types (strings and numbers)
      const apiResult = await submitTestResult(selectedTest.id, answers);

      // Convert API response to TestResult format using backend data
      const result: TestResult = {
        testId: selectedTest.id,
        testName: apiResult.testName || selectedTest.name,
        score: apiResult.score,
        maxScore: apiResult.maxScore,
        level: apiResult.level,
        color: getColorByLevel(apiResult.level),
        description: apiResult.description || getDescriptionByLevel(apiResult.level),
        timestamp: new Date(),
        answers,
      };

      setTestResult(result);
      setTestHistory([result, ...testHistory]);
      setShowResult(true);
    } catch (err) {
      console.error('Failed to submit test:', err);
      setError('Failed to submit test result. Please try again.');
    }
  };

  const handleRetakeTest = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestResult(null);
    setShowResult(false);
  };

  const allAnswered = selectedTest
    ? selectedTest.questions.every((q) => answers[q.id] !== undefined)
    : false;

  if (loadingTests) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3} alignItems="center" justifyContent="center" sx={{ py: 5 }}>
          <CircularProgress />
        </Stack>
      </Container>
    );
  }

  if (error && !selectedTest) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Stack>
      </Container>
    );
  }

  if (!selectedTest) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          <SelfTestIntro t={t} tests={tests} history={testHistory} onStartTest={handleStartTest} />
        </Stack>
      </Container>
    );
  }

  if (!showResult && selectedTest) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <SelfTestQuestionView
            selectedTest={selectedTest}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSubmit={handleSubmit}
            onExit={() => setSelectedTest(null)}
            allAnswered={allAnswered}
            t={t}
          />
        </Stack>
      </Container>
    );
  }

  if (testResult && selectedTest) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          <SelfTestResultView
            selectedTest={selectedTest}
            testResult={testResult}
            onRetake={handleRetakeTest}
            onBack={() => setSelectedTest(null)}
            t={t}
          />
        </Stack>
      </Container>
    );
  }

  return null;
}
