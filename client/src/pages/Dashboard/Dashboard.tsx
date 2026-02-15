import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Breadcrumb } from '../../components/Breadcrumb';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/user.types';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
      <Box
        sx={{
          backgroundColor: color,
          borderRadius: 2,
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5">{value}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const isAdminOrGod = hasRole(UserRole.GOD_USER, UserRole.ADMIN_USER);

  return (
    <Box>
      <Breadcrumb />
      <Typography variant="h4" sx={{ mb: 1 }}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back, {user?.firstName}!
      </Typography>

      <Grid container spacing={3}>
        {isAdminOrGod && (
          <>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard title="Total Users" value="--" icon={<PeopleIcon />} color="#1976d2" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatCard title="Active Vendors" value="--" icon={<StoreIcon />} color="#2e7d32" />
            </Grid>
          </>
        )}
        <Grid size={{ xs: 12, sm: 6, md: isAdminOrGod ? 4 : 6 }}>
          <StatCard title="ROAS" value="--" icon={<TrendingUpIcon />} color="#ed6c02" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
