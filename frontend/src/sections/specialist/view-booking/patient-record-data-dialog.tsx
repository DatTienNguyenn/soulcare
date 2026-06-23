import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Typography,
  Stack,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { format } from 'date-fns';
import { EHRResponse } from 'src/utils/specialist-api';
import { PictureData } from 'src/utils/picture-api';
import { TestResultResponse } from 'src/utils/mental-health-api';
import { useLocales } from 'src/locale/use-locales';

interface PatientRecordDataDialogProps {
  open: boolean;
  onClose: () => void;
  patientName: string;
  ehrs: EHRResponse[];
  loadingEhrs: boolean;
  pictures: PictureData[];
  loadingPictures: boolean;
  testResults: TestResultResponse[];
  loadingTestResults: boolean;
  sessionNotes?: string;
}

const getLevelColor = (
  level: string
): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
  const levelLower = level?.toLowerCase() || '';
  if (levelLower.includes('severe') || levelLower.includes('critical')) return 'error';
  if (levelLower.includes('moderate') || levelLower.includes('high')) return 'warning';
  if (levelLower.includes('mild') || levelLower.includes('low')) return 'info';
  return 'success';
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
  if (!maxScore || maxScore === 0) {
    return '0.0';
  }
  return ((score / maxScore) * 100).toFixed(1);
};

export function PatientRecordDataDialog({
  open,
  onClose,
  patientName,
  ehrs,
  loadingEhrs,
  pictures,
  loadingPictures,
  testResults,
  loadingTestResults,
  sessionNotes,
}: PatientRecordDataDialogProps) {
  const { t } = useLocales();
  const [tabValue, setTabValue] = useState(0);
  const [filterTestName, setFilterTestName] = useState<string>('all');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const testNames = useMemo(
    () => ['all', ...Array.from(new Set(testResults.map((r) => r.testName)))],
    [testResults]
  );

  const filteredTestResults = useMemo(
    () =>
      testResults.filter((r) => (filterTestName === 'all' ? true : r.testName === filterTestName)),
    [testResults, filterTestName]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('specialist.bookings.dialogs.patientRecords', { name: patientName }) ||
          `Patient Records: ${patientName}`}
      </DialogTitle>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={t('specialist.bookings.dialogs.healthRecords') || 'Health Records'} />
          <Tab label={t('specialist.bookings.dialogs.canvas') || 'Canvas'} />
          <Tab label={t('specialist.bookings.dialogs.testResults') || 'Test Results'} />
          <Tab label={t('specialist.bookings.dialogs.sessionNotes') || 'Session Notes'} />
        </Tabs>
      </Box>
      <DialogContent sx={{ pt: 2, minHeight: 400 }}>
        {tabValue === 0 && (
          <Box>
            {loadingEhrs ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : ehrs.length > 0 ? (
              <Stack spacing={2}>
                {ehrs.map((ehr) => (
                  <Paper key={ehr.id} sx={{ p: 2, backgroundColor: 'background.neutral' }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('specialist.bookings.dialogs.date')}
                        </Typography>
                        <Typography variant="body1">
                          {ehr.createdAt
                            ? format(new Date(ehr.createdAt), 'MMMM dd, yyyy HH:mm')
                            : t('specialist.bookings.dialogs.unknownDate')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('specialist.bookings.dialogs.diagnosis')}
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {ehr.diagnosis}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('specialist.bookings.dialogs.treatmentPlan')}
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {ehr.treatmentPlan}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <Typography color="text.secondary">
                  {t('specialist.bookings.dialogs.noRecords') || 'No health records found.'}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            {loadingPictures ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : pictures.length > 0 ? (
              <Grid container spacing={2}>
                {pictures.map((pic) => (
                  <Grid item xs={12} sm={6} key={pic.id}>
                    <Card>
                      {pic.imageUrl && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={pic.imageUrl}
                          alt={pic.description || 'Patient Canvas'}
                          sx={{ objectFit: 'cover', borderBottom: '1px solid #eee' }}
                        />
                      )}
                      <CardContent>
                        <Typography variant="subtitle1" noWrap>
                          {pic.description || 'Untitled Drawing'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pic.createdAt
                            ? format(new Date(pic.createdAt), 'MMM dd, yyyy')
                            : 'Unknown date'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <Typography color="text.secondary">
                  No published pictures found for this patient.
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {tabValue === 2 && (
          <Box>
            {loadingTestResults ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : testResults.length > 0 ? (
              <Stack spacing={2}>
                <FormControl size="small" sx={{ maxWidth: 240, alignSelf: 'flex-end' }}>
                  <InputLabel>Filter by Test</InputLabel>
                  <Select
                    value={filterTestName}
                    label="Filter by Test"
                    onChange={(e) => setFilterTestName(e.target.value)}
                  >
                    {testNames.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name === 'all' ? 'All Tests' : name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Test Name</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Score
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                          Level
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date Taken</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredTestResults.map((result) => (
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {filteredTestResults.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color="text.secondary">
                      No results found for this filter.
                    </Typography>
                  </Box>
                )}
              </Stack>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <Typography color="text.secondary" align="center">
                  {t('specialist.bookings.dialogs.noTestResults', { patientName: patientName }) ||
                    `No public test results found for this patient, this reason can caused by patients ${patientName} do not want to publish data.`}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {tabValue === 3 && (
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('specialist.bookings.dialogs.sessionNotes')}
            </Typography>
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap', fontStyle: 'italic', color: 'text.secondary' }}
            >
              {sessionNotes || t('specialist.bookings.dialogs.noNotes') || 'No notes available'}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('specialist.bookings.dialogs.close')}</Button>
      </DialogActions>
    </Dialog>
  );
}
