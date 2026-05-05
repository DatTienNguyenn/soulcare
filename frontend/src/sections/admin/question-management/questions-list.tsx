import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Box,
  Stack,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locale/use-locales';
import { ITestQuestion } from 'src/utils/test-api';

interface QuestionsListProps {
  open: boolean;
  questions: ITestQuestion[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onAdd: () => void;
  onEdit: (question: ITestQuestion) => void;
  onDelete: (questionId: string) => void;
}

export default function QuestionsList({
  open,
  questions,
  loading,
  error,
  onClose,
  onAdd,
  onEdit,
  onDelete,
}: QuestionsListProps) {
  const { t } = useLocales();

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return t('questionManagement.dialog.multipleChoice');
      case 'RATING_SCALE':
        return t('questionManagement.dialog.ratingScale');
      case 'TEXT':
        return t('questionManagement.dialog.textQuestion');
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth disableEscapeKeyDown>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <span>{t('questionManagement.title')}</span>
          <Button
            variant="contained"
            size="small"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={onAdd}
          >
            {t('questionManagement.newQuestion')}
          </Button>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : questions.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>{t('questionManagement.noQuestions')}</Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>{t('questionManagement.table.order')}</TableCell>
                  <TableCell>{t('questionManagement.table.questionText')}</TableCell>
                  <TableCell>{t('questionManagement.table.type')}</TableCell>
                  <TableCell align="center">{t('questionManagement.table.options')}</TableCell>
                  <TableCell align="center">{t('questionManagement.table.weight')}</TableCell>
                  <TableCell align="right">{t('questionManagement.table.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id} hover>
                    <TableCell>{question.questionOrder}</TableCell>
                    <TableCell>
                      <span
                        style={{
                          maxWidth: '300px',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {question.questionText}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getQuestionTypeLabel(question.questionType)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">{question.options?.length || 0}</TableCell>
                    <TableCell align="center">{question.scoreWeight}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(question)}
                        title={t('questionManagement.actions.edit')}
                      >
                        <Iconify icon="solar:pen-bold" width={20} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(question.id)}
                        title={t('questionManagement.actions.delete')}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
