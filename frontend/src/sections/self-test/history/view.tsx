import { useEffect, useState } from 'react';
import {
  Container,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useMentalHealthAPI } from 'src/hooks/use-mental-health-api';
import { TestResultResponse } from 'src/utils/mental-health-api';
import { useLocales } from 'src/locale/use-locales';
import { usePatientProfile } from 'src/hooks/use-patient-profile';

const getLevelColor = (
  level: string
): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const levelLower = level?.toLowerCase() || '';
  if (levelLower.includes('severe') || levelLower.includes('critical')) return 'error';
  if (levelLower.includes('moderate') || levelLower.includes('high')) return 'warning';
  if (levelLower.includes('mild') || levelLower.includes('low')) return 'info';
  return 'success';
};

export default function SelfTestHistoryView() {
  const { fetchUserTestResults, loading, error, setError } = useMentalHealthAPI();
  const { fetchProfile, updateProfile } = usePatientProfile();
  const [testResults, setTestResults] = useState<TestResultResponse[]>([]);
  const [selectedResult, setSelectedResult] = useState<TestResultResponse | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingResults, setLoadingResults] = useState(true);
  const [isPublish, setIsPublish] = useState<boolean>(false);
  const [updatingPublish, setUpdatingPublish] = useState(false);
  const { t } = useLocales();

  // Load test results on mount
  useEffect(() => {
    const loadTestResults = async () => {
      try {
        setLoadingResults(true);
        setError(null);
        const results = await fetchUserTestResults();
        // Sort by date, most recent first
        const sorted = results.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setTestResults(sorted);
      } catch (err) {
        console.error('Failed to load test results:', err);
        setError(err instanceof Error ? err.message : 'Failed to load test results');
      } finally {
        setLoadingResults(false);
      }
    };

    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        setIsPublish(!!profile.publish);
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    loadTestResults();
    loadProfile();
  }, [fetchUserTestResults, setError, fetchProfile]);

  const handlePublishChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsPublish(checked);
    setUpdatingPublish(true);
    try {
      await updateProfile({ publish: checked });
    } catch (err) {
      console.error('Failed to update publish status:', err);
      setIsPublish(!checked); // Revert on failure
    } finally {
      setUpdatingPublish(false);
    }
  };

  const handleOpenDetails = (result: TestResultResponse) => {
    setSelectedResult(result);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResult(null);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculatePercentage = (score: number, maxScore: number): string => {
    return ((score / maxScore) * 100).toFixed(1);
  };

  if (loadingResults || loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '60vh' }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            {t('selfTestHistory.loading')}
          </Typography>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Helmet>
        <title>{t('selfTestHistory.title')}</title>
      </Helmet>

      <Stack spacing={3}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
              {t('selfTestHistory.header')}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t('selfTestHistory.description')}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={isPublish}
                onChange={handlePublishChange}
                disabled={updatingPublish}
                color="primary"
              />
            }
            label={t('selfTestHistory.publishResults') || 'Make Results Public'}
          />
        </Box>

        {testResults.length === 0 ? (
          <Alert severity="info">{t('selfTestHistory.noResults')}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('selfTestHistory.testName')}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    {t('selfTestHistory.score')}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    {t('selfTestHistory.level')}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {t('selfTestHistory.dateTaken')}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                    {t('selfTestHistory.actions')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testResults.map((result) => (
                  <TableRow key={result.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{result.testName}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {result.score} / {result.maxScore}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ({calculatePercentage(result.score, result.maxScore)}%)
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={result.level}
                        color={getLevelColor(result.level)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(result.createdAt)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenDetails(result)}
                      >
                        {t('selfTestHistory.viewDetails')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>

      {/* Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('selfTestHistory.detailsTitle')}</DialogTitle>
        <DialogContent dividers>
          {selectedResult && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        {t('selfTestHistory.testName')}
                      </Typography>
                      <Typography variant="h6">{selectedResult.testName}</Typography>
                    </Box>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        {t('selfTestHistory.score')}
                      </Typography>
                      <Typography variant="h6">
                        {selectedResult.score} / {selectedResult.maxScore}
                        <Typography variant="caption" sx={{ ml: 1 }}>
                          ({calculatePercentage(selectedResult.score, selectedResult.maxScore)}%)
                        </Typography>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        {t('selfTestHistory.level')}
                      </Typography>
                      <Chip
                        label={selectedResult.level}
                        color={getLevelColor(selectedResult.level)}
                        variant="filled"
                      />
                    </Box>
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        {t('selfTestHistory.dateTaken')}
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(selectedResult.createdAt)}
                      </Typography>
                    </Box>
                    {selectedResult.description && (
                      <Box>
                        <Typography color="textSecondary" gutterBottom>
                          {t('selfTestHistory.interpretation')}
                        </Typography>
                        <Typography variant="body2">{selectedResult.description}</Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
