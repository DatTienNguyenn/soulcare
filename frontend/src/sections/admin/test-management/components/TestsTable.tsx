import {
  Card,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { IMentalHealthTest } from 'src/utils/test-api';

interface TestsTableProps {
  tests: IMentalHealthTest[];
  loading: boolean;
  onEdit: (test: IMentalHealthTest) => void;
  onDelete: (testId: string) => void;
  onManageQuestions: (test: IMentalHealthTest) => void;
  t: any;
}

export default function TestsTable({
  tests,
  loading,
  onEdit,
  onDelete,
  onManageQuestions,
  t,
}: TestsTableProps) {
  if (loading && !tests.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
                        onClick={() => onManageQuestions(test)}
                        title={t('questionManagement.actions.manageQuestions')}
                      >
                        <Iconify icon="solar:list-bold" width={20} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(test)}
                        title={t('testManagement.actions.edit')}
                      >
                        <Iconify icon="solar:pen-bold" width={20} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(test.id)}
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
  );
}
