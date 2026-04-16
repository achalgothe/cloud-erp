import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { AccessTime, CheckCircle, Cancel } from '@mui/icons-material';
import { hrAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInTime, setCheckInTime] = useState(null);

  useEffect(() => {
    fetchAttendance();
    // Update time every second
    const timer = setInterval(() => {
      setCheckInTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await hrAPI.getAttendance({ limit: 30 });
      setAttendance(response.data.data.attendance || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await hrAPI.checkIn({ location: { latitude: 0, longitude: 0 } });
      alert('Check-in successful!');
      fetchAttendance();
    } catch (error) {
      alert(error.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await hrAPI.checkOut({ location: { latitude: 0, longitude: 0 } });
      alert('Check-out successful!');
      fetchAttendance();
    } catch (error) {
      alert(error.response?.data?.message || 'Check-out failed');
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Attendance
      </Typography>

      {/* Check-in/Check-out Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'success.lighter' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
                <Box>
                  <Typography variant="h6">Check In</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mark your arrival
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckIn}
                sx={{ mt: 2 }}
              >
                Check In Now
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: 'warning.lighter' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AccessTime sx={{ fontSize: 48, color: 'warning.main' }} />
                <Box>
                  <Typography variant="h6">Check Out</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mark your departure
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCheckOut}
                sx={{ mt: 2, bgcolor: 'warning.main', '&:hover': { bgcolor: 'warning.dark' } }}
              >
                Check Out Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Current Time */}
      <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Current Time: {checkInTime || 'Loading...'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Typography>
      </Paper>

      {/* Attendance History */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Employee</strong></TableCell>
              <TableCell><strong>Check In</strong></TableCell>
              <TableCell><strong>Check Out</strong></TableCell>
              <TableCell><strong>Hours</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No attendance records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              attendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {record.employee?.user?.firstName || 'N/A'} {record.employee?.user?.lastName || ''}
                  </TableCell>
                  <TableCell>
                    {record.checkIn?.time ? new Date(record.checkIn.time).toLocaleTimeString() : '-'}
                  </TableCell>
                  <TableCell>
                    {record.checkOut?.time ? new Date(record.checkOut.time).toLocaleTimeString() : '-'}
                  </TableCell>
                  <TableCell>{record.workingHours || 0} hrs</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={record.status === 'present' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Attendance;
