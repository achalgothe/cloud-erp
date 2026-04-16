import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { companyAPI } from '../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Company Settings
  const [companySettings, setCompanySettings] = useState({
    name: user?.company || '',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    fiscalYearStart: '01-01'
  });

  // User Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    designation: ''
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    dailyReports: true,
    weeklyReports: false,
    monthlyReports: true,
    lowStockAlerts: true,
    paymentReminders: true
  });

  const handleCompanyChange = (e) => {
    setCompanySettings({
      ...companySettings,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileChange = (e) => {
    setProfileSettings({
      ...profileSettings,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (name) => {
    setNotifications({
      ...notifications,
      [name]: !notifications[name]
    });
  };

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setSuccess('Company settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving company settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // API call would go here
      updateUser({ ...user, ...profileSettings });
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Notification preferences saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        ⚙️ Settings
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Company Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              🏢 Company Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <TextField
              fullWidth
              label="Company Name"
              name="name"
              value={companySettings.name}
              onChange={handleCompanyChange}
              margin="normal"
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Currency</InputLabel>
              <Select
                name="currency"
                value={companySettings.currency}
                label="Currency"
                onChange={handleCompanyChange}
              >
                <MenuItem value="USD">USD - US Dollar</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
                <MenuItem value="GBP">GBP - British Pound</MenuItem>
                <MenuItem value="INR">INR - Indian Rupee</MenuItem>
                <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
                <MenuItem value="AUD">AUD - Australian Dollar</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Timezone</InputLabel>
              <Select
                name="timezone"
                value={companySettings.timezone}
                label="Timezone"
                onChange={handleCompanyChange}
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                <MenuItem value="Europe/London">London (GMT)</MenuItem>
                <MenuItem value="Europe/Paris">Paris (CET)</MenuItem>
                <MenuItem value="Asia/Kolkata">India (IST)</MenuItem>
                <MenuItem value="Asia/Tokyo">Tokyo (JST)</MenuItem>
                <MenuItem value="Asia/Dubai">Dubai (GST)</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Date Format</InputLabel>
              <Select
                name="dateFormat"
                value={companySettings.dateFormat}
                label="Date Format"
                onChange={handleCompanyChange}
              >
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Fiscal Year Start"
              name="fiscalYearStart"
              type="date"
              value={companySettings.fiscalYearStart}
              onChange={handleCompanyChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveCompany}
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Save Company Settings
            </Button>
          </Paper>
        </Grid>

        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              👤 Profile Settings
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={profileSettings.firstName}
              onChange={handleProfileChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={profileSettings.lastName}
              onChange={handleProfileChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={profileSettings.email}
              onChange={handleProfileChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={profileSettings.phone}
              onChange={handleProfileChange}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Designation"
              name="designation"
              value={profileSettings.designation}
              onChange={handleProfileChange}
              margin="normal"
            />

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveProfile}
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              Update Profile
            </Button>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              🔔 Notification Preferences
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      📧 Email Notifications
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.emailNotifications}
                          onChange={() => handleNotificationChange('emailNotifications')}
                        />
                      }
                      label="Enable email notifications"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      📊 Daily Reports
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.dailyReports}
                          onChange={() => handleNotificationChange('dailyReports')}
                        />
                      }
                      label="Receive daily summary"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      📈 Weekly Reports
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.weeklyReports}
                          onChange={() => handleNotificationChange('weeklyReports')}
                        />
                      }
                      label="Receive weekly analytics"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      📉 Monthly Reports
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.monthlyReports}
                          onChange={() => handleNotificationChange('monthlyReports')}
                        />
                      }
                      label="Receive monthly summary"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      ⚠️ Low Stock Alerts
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.lowStockAlerts}
                          onChange={() => handleNotificationChange('lowStockAlerts')}
                        />
                      }
                      label="Get notified for low inventory"
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      💳 Payment Reminders
                    </Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notifications.paymentReminders}
                          onChange={() => handleNotificationChange('paymentReminders')}
                        />
                      }
                      label="Receive payment due reminders"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveNotifications}
              sx={{ mt: 3 }}
              disabled={loading}
            >
              Save Preferences
            </Button>
          </Paper>
        </Grid>

        {/* System Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              ℹ️ System Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Application Version
                </Typography>
                <Typography variant="h6">v1.0.0</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Backend Status
                </Typography>
                <Typography variant="h6" color="success.main">● Online</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Database
                </Typography>
                <Typography variant="h6">In-Memory</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Last Backup
                </Typography>
                <Typography variant="h6">N/A</Typography>
              </Grid>
            </Grid>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{ mt: 2 }}
              onClick={() => window.location.reload()}
            >
              Refresh System
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
