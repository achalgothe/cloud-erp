import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Email as EmailIcon, ArrowBack as ArrowBackIcon, ContentCopy } from '@mui/icons-material';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.forgotPassword({ email });
      setSuccess(true);
      setResetLink(response.data.data?.resetLink || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resetLink);
    alert('Link copied to clipboard!');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 2 }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/login"
            sx={{ mb: 2 }}
          >
            Back to Login
          </Button>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'primary.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}
            >
              <EmailIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Forgot Password?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No worries! Enter your email and we'll send you reset instructions.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="bold" gutterBottom>
                Email Sent!
              </Typography>
              <Typography variant="body2" paragraph>
                We've sent password reset instructions to <strong>{email}</strong>
              </Typography>
              
              {resetLink && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Demo: Click the link below (check console for details)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={resetLink}
                      InputProps={{ readOnly: true }}
                      sx={{ bgcolor: 'background.paper' }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleCopyLink}
                      startIcon={<ContentCopy />}
                    >
                      Copy
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    href={resetLink}
                    sx={{ mt: 1 }}
                  >
                    Open Reset Page
                  </Button>
                </Box>
              )}
              
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              >
                Back to Login
              </Button>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                margin="normal"
                required
                autoComplete="email"
              />

              <Box sx={{ mt: 1, mb: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !email}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{' '}
              <Link to="/login" style={{ textDecoration: 'none' }}>
                Back to Login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
