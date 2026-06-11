import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from '@mui/material';
import { useLocales } from 'src/locale/use-locales';

export interface TopPatient {
  userId: string;
  userName: string;
  bookingCount: number;
  averageRating: number;
  totalSpent: number;
}

interface TopPatientsTableProps {
  data: TopPatient[];
}

export default function TopPatientsTable({ data }: TopPatientsTableProps) {
  const { t } = useLocales();

  return (
    <Card>
      <CardHeader title={t('specialist.analytics.charts.topPatients')} />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'background.neutral' }}>
                <TableCell>{t('specialist.analytics.table.patientName')}</TableCell>
                <TableCell align="right">{t('specialist.analytics.table.totalBookings')}</TableCell>
                <TableCell align="right">{t('specialist.analytics.table.averageRating')}</TableCell>
                <TableCell align="right">{t('specialist.analytics.table.totalRevenue')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((patient) => (
                <TableRow key={patient.userId} hover>
                  <TableCell>
                    <Typography variant="body2">{patient.userName}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip label={patient.bookingCount} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    {patient.averageRating > 0 ? (
                      <Typography variant="body2">⭐ {patient.averageRating.toFixed(1)}</Typography>
                    ) : (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {t('specialist.analytics.table.noRating')}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                      ${patient.totalSpent}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
