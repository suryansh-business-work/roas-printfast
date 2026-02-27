import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Breadcrumb } from '../../components/Breadcrumb';
import IntegrationCard from './IntegrationCard';
import ServiceTitanDialog from './ServiceTitanDialog';
import {
  IIntegration,
  IntegrationProvider,
  IntegrationStatus,
} from '../../types/integration.types';
import { IVendor } from '../../types/vendor.types';
import * as integrationService from '../../services/integration.service';
import * as vendorService from '../../services/vendor.service';

const LOGOS = {
  serviceTitan: 'https://ik.imagekit.io/esdata1/roas/ServiceTitan.svg',
  jobber: 'https://ik.imagekit.io/esdata1/roas/jobber.png',
  serviceWare: 'https://ik.imagekit.io/esdata1/roas/serviceware.png',
};

const Integrations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const vendorIdParam = searchParams.get('vendorId') || '';

  const [vendors, setVendors] = useState<IVendor[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState(vendorIdParam);
  const [integrations, setIntegrations] = useState<IIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stDialogOpen, setStDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    vendorService.listAllActiveVendors().then((res) => {
      if (res.success && res.data) setVendors(res.data);
    });
  }, []);

  const fetchIntegrations = useCallback(async () => {
    if (!selectedVendorId) return;
    setIsLoading(true);
    try {
      const res = await integrationService.getVendorIntegrations(selectedVendorId);
      if (res.success && res.data) setIntegrations(res.data);
    } catch {
      /* handled */
    } finally {
      setIsLoading(false);
    }
  }, [selectedVendorId]);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const getStatus = (provider: IntegrationProvider): IntegrationStatus | null => {
    const found = integrations.find((i) => i.provider === provider);
    return found ? found.status : null;
  };

  const handleVendorChange = (id: string) => {
    setSelectedVendorId(id);
    setSearchParams({ vendorId: id });
  };

  const handleDisconnect = async (provider: IntegrationProvider) => {
    try {
      const res = await integrationService.disconnectIntegration({
        vendorId: selectedVendorId,
        provider,
      });
      if (res.success) {
        setSnackbar({ open: true, message: 'Disconnected successfully', severity: 'success' });
        fetchIntegrations();
      }
    } catch {
      setSnackbar({ open: true, message: 'Failed to disconnect', severity: 'error' });
    }
  };

  const handleJobberConnect = () => {
    // Open OAuth popup for Jobber
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    window.open(
      'https://api.getjobber.com/api/oauth/authorize',
      'jobber-oauth',
      `width=${width},height=${height},left=${left},top=${top}`,
    );
    setSnackbar({
      open: true,
      message: 'Jobber OAuth popup opened. Complete the authorization flow.',
      severity: 'success',
    });
  };

  return (
    <Box>
      <Breadcrumb />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Integrations
      </Typography>

      <TextField
        select
        label="Select Vendor"
        value={selectedVendorId}
        onChange={(e) => handleVendorChange(e.target.value)}
        size="small"
        sx={{ mb: 3, minWidth: 280 }}
      >
        {vendors.map((v) => (
          <MenuItem key={v.vendorId} value={v.vendorId}>
            {v.name}
          </MenuItem>
        ))}
      </TextField>

      {!selectedVendorId && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Please select a vendor to manage integrations.
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : selectedVendorId ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <IntegrationCard
              name="Service Titan"
              logoUrl={LOGOS.serviceTitan}
              description="Connect your Service Titan account for automated job tracking and reporting."
              status={getStatus(IntegrationProvider.SERVICE_TITAN)}
              onConnect={() => setStDialogOpen(true)}
              onDisconnect={() => handleDisconnect(IntegrationProvider.SERVICE_TITAN)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <IntegrationCard
              name="Jobber"
              logoUrl={LOGOS.jobber}
              description="Connect your Jobber account via OAuth for seamless job management."
              status={getStatus(IntegrationProvider.JOBBER)}
              onConnect={handleJobberConnect}
              onDisconnect={() => handleDisconnect(IntegrationProvider.JOBBER)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <IntegrationCard
              name="ServiceWare"
              logoUrl={LOGOS.serviceWare}
              description="ServiceWare integration for field service management."
              status={null}
              comingSoon
              onConnect={() => {}}
              onDisconnect={() => {}}
            />
          </Grid>
        </Grid>
      ) : null}

      <ServiceTitanDialog
        open={stDialogOpen}
        vendorId={selectedVendorId}
        onClose={() => setStDialogOpen(false)}
        onSuccess={() => {
          setStDialogOpen(false);
          setSnackbar({ open: true, message: 'Service Titan connected!', severity: 'success' });
          fetchIntegrations();
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Integrations;
