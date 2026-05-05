import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Box,
  IconButton,
  Chip,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locale/use-locales';
import { ITestQuestion, ITestQuestionRequest, IQuestionOptionRequest } from 'src/utils/test-api';

interface QuestionFormProps {
  open: boolean;
  question?: ITestQuestion | null;
  onClose: () => void;
  onSubmit: (data: ITestQuestionRequest) => Promise<void>;
  submitting: boolean;
}

export default function QuestionForm({
  open,
  question,
  onClose,
  onSubmit,
  submitting,
}: QuestionFormProps) {
  const { t } = useLocales();
  const [formData, setFormData] = useState<ITestQuestionRequest>({
    questionText: '',
    questionType: 'MULTIPLE_CHOICE',
    questionOrder: 1,
    scoreWeight: 1,
    options: [],
  });

  useEffect(() => {
    if (question) {
      setFormData({
        questionText: question.questionText,
        questionType: question.questionType,
        questionOrder: question.questionOrder,
        scoreWeight: question.scoreWeight,
        options: (question.options || []).map((opt) => ({
          optionText: opt.optionText,
          optionValue: opt.optionValue,
          optionOrder: opt.optionOrder,
        })),
      });
    } else {
      setFormData({
        questionText: '',
        questionType: 'MULTIPLE_CHOICE',
        questionOrder: 1,
        scoreWeight: 1,
        options: [],
      });
    }
  }, [question, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'questionOrder' || name === 'scoreWeight' ? parseInt(value as string) : value,
    }));
  };

  const handleAddOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          optionText: '',
          optionValue: 0,
          optionOrder: (prev.options.length || 0) + 1,
        },
      ],
    }));
  };

  const handleOptionChange = (
    index: number,
    field: keyof IQuestionOptionRequest,
    value: string | number
  ) => {
    setFormData((prev) => {
      const newOptions = [...prev.options];
      newOptions[index] = {
        ...newOptions[index],
        [field]:
          field === 'optionValue' || field === 'optionOrder' ? parseInt(value as string) : value,
      };
      return { ...prev, options: newOptions };
    });
  };

  const handleRemoveOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableEscapeKeyDown>
      <DialogTitle>
        {question
          ? t('questionManagement.dialog.editTitle')
          : t('questionManagement.dialog.createTitle')}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label={t('questionManagement.dialog.questionText')}
            name="questionText"
            value={formData.questionText}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />

          <TextField
            fullWidth
            select
            label={t('questionManagement.dialog.questionType')}
            name="questionType"
            value={formData.questionType}
            onChange={handleChange}
          >
            <MenuItem value="MULTIPLE_CHOICE">
              {t('questionManagement.dialog.multipleChoice')}
            </MenuItem>
            <MenuItem value="RATING_SCALE">{t('questionManagement.dialog.ratingScale')}</MenuItem>
            <MenuItem value="TEXT">{t('questionManagement.dialog.textQuestion')}</MenuItem>
          </TextField>

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              type="number"
              label={t('questionManagement.dialog.questionOrder')}
              name="questionOrder"
              value={formData.questionOrder}
              onChange={handleChange}
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              type="number"
              label={t('questionManagement.dialog.scoreWeight')}
              name="scoreWeight"
              value={formData.scoreWeight}
              onChange={handleChange}
              inputProps={{ min: 1 }}
            />
          </Stack>

          {formData.questionType !== 'TEXT' && (
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <span style={{ fontWeight: 500 }}>Options</span>
                <Button
                  size="small"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  onClick={handleAddOption}
                >
                  {t('questionManagement.dialog.addOption')}
                </Button>
              </Stack>

              <Stack spacing={1}>
                {formData.options.map((option, index) => (
                  <Box key={index} sx={{ p: 1.5, border: '1px solid #eee', borderRadius: 1 }}>
                    <Stack spacing={1}>
                      <TextField
                        fullWidth
                        size="small"
                        label={t('questionManagement.dialog.optionText')}
                        value={option.optionText}
                        onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                        placeholder="e.g., Strongly Agree"
                      />
                      <Stack direction="row" spacing={1}>
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          label={t('questionManagement.dialog.optionValue')}
                          value={option.optionValue}
                          onChange={(e) => handleOptionChange(index, 'optionValue', e.target.value)}
                          inputProps={{ min: 0 }}
                        />
                        <TextField
                          fullWidth
                          type="number"
                          size="small"
                          label={t('questionManagement.dialog.optionOrder')}
                          value={option.optionOrder}
                          onChange={(e) => handleOptionChange(index, 'optionOrder', e.target.value)}
                          inputProps={{ min: 1 }}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveOption(index)}
                          title={t('questionManagement.dialog.removeOption')}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('questionManagement.dialog.cancel')}</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <CircularProgress size={24} />
          ) : question ? (
            t('questionManagement.dialog.update')
          ) : (
            t('questionManagement.dialog.create')
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
