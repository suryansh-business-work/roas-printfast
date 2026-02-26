import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import config from '../../config/config';

interface CampaignPostcardProps {
  postcardImageUrl: string;
  apiBaseUrl: string;
}

const CampaignPostcard = ({ postcardImageUrl, apiBaseUrl }: CampaignPostcardProps) => {
  if (!postcardImageUrl) {
    return (
      <Box
        sx={{
          mt: 2,
          p: 3,
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 1,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No postcard image uploaded
        </Typography>
      </Box>
    );
  }

  // Build full URL from the server base (without /api/v1)
  const serverBase = apiBaseUrl.replace('/api/v1', '');
  const imageUrl = `${serverBase}${postcardImageUrl}`;

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        component="img"
        src={imageUrl}
        alt="Campaign postcard"
        sx={{
          width: '100%',
          maxHeight: 200,
          objectFit: 'contain',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      />
    </Box>
  );
};

const CampaignPostcardWrapper = ({ postcardImageUrl }: { postcardImageUrl: string }) => {
  return <CampaignPostcard postcardImageUrl={postcardImageUrl} apiBaseUrl={config.apiBaseUrl} />;
};

export default CampaignPostcardWrapper;
