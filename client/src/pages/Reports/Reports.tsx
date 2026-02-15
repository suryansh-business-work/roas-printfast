import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Breadcrumb } from '../../components/Breadcrumb';

const Reports = () => {
  return (
    <Box>
      <Breadcrumb />
      <Typography variant="h4" sx={{ mb: 3 }}>
        Reports
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Reports and analytics coming soon.
      </Typography>
    </Box>
  );
};

export default Reports;
