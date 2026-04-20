import { useState } from 'react';
import { Container, Stack } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import { useLocales } from 'src/locale/use-locales';
import {
  mentalHealthTests,
  calculateTestScore,
  MentalHealthTest,
  TestResult,
} from 'src/_mock/_self-test';
import SelfTestIntro from './componants/SelfTestIntro';
import SelfTestQuestionView from './componants/SelfTestQuestionView';
import SelfTestResultView from './componants/SelfTestResultView';

export default function SelfTestView() {
  const settings = useSettingsContext();
  const { t } = useLocales();
  const [selectedTest, setSelectedTest] = useState<MentalHealthTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleStartTest = (test: MentalHealthTest) => {
    setSelectedTest(test);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTestResult(null);
    setShowResult(false);
  };

  const handleAnswerChange = (questionId: string, value: number) => {
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

  const handleSubmit = () => {
    if (!selectedTest) return;

    const scoreData = calculateTestScore(selectedTest, answers);
    const result: TestResult = {
      testId: selectedTest.id,
      testName: selectedTest.name,
      score: scoreData.score,
      maxScore: selectedTest.scoringGuide.maxScore,
      level: scoreData.level,
      color: scoreData.color,
      description: scoreData.description,
      timestamp: new Date(),
      answers,
    };

    setTestResult(result);
    setTestHistory([result, ...testHistory]);
    setShowResult(true);
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

  if (!selectedTest) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
          <SelfTestIntro
            t={t}
            tests={mentalHealthTests}
            history={testHistory}
            onStartTest={handleStartTest}
          />
        </Stack>
      </Container>
    );
  }

  if (!showResult && selectedTest) {
    return (
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack spacing={3}>
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
