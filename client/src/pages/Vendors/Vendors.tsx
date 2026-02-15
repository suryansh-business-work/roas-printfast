import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Breadcrumb } from '../../components/Breadcrumb';

const Vendors = () => {
  return (
    <Box>
      <Breadcrumb />
      <Typography variant="h4" sx={{ mb: 3 }}>
        Vendors
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Vendor management coming soon.
      </Typography>
    </Box>
  );
};

export default Vendors;
