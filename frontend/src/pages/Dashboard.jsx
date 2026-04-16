import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  AccountBalance as FinanceIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { financeAPI, hrAPI, inventoryAPI } from '../services/api';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 2
    }}
  >
    <Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold">
        {value}
      </Typography>
    </Box>
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: `${color}.lighter`,
        color: `${color}.main`
      }}
    >
      {icon}
    </Box>
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    transactions: 0,
    products: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [financeRes, hrRes, inventoryRes] = await Promise.all([
          financeAPI.getTransactions({ limit: 1 }),
          hrAPI.getEmployees({ limit: 1 }),
          inventoryAPI.getProducts({ limit: 1 })
        ]);

        setStats({
          employees: hrRes.data.data.pagination?.total || 0,
          transactions: financeRes.data.data.pagination?.total || 0,
          products: inventoryRes.data.data.pagination?.total || 0,
          revenue: financeRes.data.data.totals?.income || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Welcome to your Cloud ERP System
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Employees"
            value={stats.employees}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            icon={<FinanceIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.products}
            icon={<InventoryIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Transactions"
            value={stats.transactions}
            icon={<TrendingIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Activity feed will be displayed here
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Shortcuts will be displayed here
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
