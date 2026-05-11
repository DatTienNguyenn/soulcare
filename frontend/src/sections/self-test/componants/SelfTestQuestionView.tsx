import {
  Box,
  Button,
  Card,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { MentalHealthTest } from 'src/_mock/_self-test';

type SelfTestQuestionViewProps = {
  selectedTest: MentalHealthTest;
  currentQuestionIndex: number;
  answers: Record<string, string | number>;
  onAnswerChange: (questionId: string, value: string | number) => void;
  onNext: VoidFunction;
  onPrevious: VoidFunction;
  onSubmit: VoidFunction;
  onExit: VoidFunction;
  allAnswered: boolean;
  t: any;
};

export default function SelfTestQuestionView({
  selectedTest,
  currentQuestionIndex,
  answers,
  onAnswerChange,
  onNext,
  onPrevious,
  onSubmit,
  onExit,
  allAnswered,
  t,
}: SelfTestQuestionViewProps) {
  const question = selectedTest.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / selectedTest.questions.length) * 100;

  return (
    <Stack spacing={3}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5">{selectedTest.shortName}</Typography>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Iconify icon="solar:close-circle-bold" />}
            onClick={onExit}
          >
            {t('selfTest.exitTest')}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('selfTest.questionProgress', {
            current: currentQuestionIndex + 1,
            total: selectedTest.questions.length,
          })}
        </Typography>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: `${progress}%`,
              height: 8,
              borderRadius: 1,
              bgcolor: 'primary.main',
              transition: 'width 0.2s ease',
            }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
          {t('selfTest.progressComplete', { percent: Math.round(progress) })}
        </Typography>
      </Box>

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            {question.question}
          </Typography>

          {question.options.length === 0 && (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[question.id] ?? ''}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
            />
          )}

          <RadioGroup
            value={String(answers[question.id] ?? '')}
            onChange={(e) => onAnswerChange(question.id, parseInt(e.target.value, 10))}
          >
            <Stack spacing={1.5}>
              {question.options.map((option) => (
                <Card
                  key={option.value}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor:
                      Number(answers[question.id]) === option.value
                        ? (theme) => theme.palette.primary.main
                        : 'transparent',
                    bgcolor:
                      Number(answers[question.id]) === option.value
                        ? (theme) => alpha(theme.palette.primary.main, 0.08)
                        : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                  onClick={() => onAnswerChange(question.id, option.value)}
                >
                  <FormControlLabel
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                    sx={{ width: '100%', m: 0 }}
                  />
                </Card>
              ))}
            </Stack>
          </RadioGroup>
        </Stack>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
        >
          {t('selfTest.previous')}
        </Button>

        {currentQuestionIndex < selectedTest.questions.length - 1 ? (
          <Button
            variant="contained"
            endIcon={<Iconify icon="solar:arrow-right-bold" />}
            onClick={onNext}
          >
            {t('selfTest.next')}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            endIcon={<Iconify icon="solar:check-circle-bold" />}
            onClick={onSubmit}
            disabled={!allAnswered}
          >
            {t('selfTest.submitTest')}
          </Button>
        )}
      </Box>
    </Stack>
  );
}
