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
  return (
    <Card>
      <CardHeader title="Top Patients" />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'background.neutral' }}>
                <TableCell>Patient Name</TableCell>
                <TableCell align="right">Total Bookings</TableCell>
                <TableCell align="right">Average Rating</TableCell>
                <TableCell align="right">Total Revenue</TableCell>
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
                        No rating
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
