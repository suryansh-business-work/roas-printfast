import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { IntegrationStatus } from '../../types/integration.types';

interface IntegrationCardProps {
  name: string;
  logoUrl: string;
  description: string;
  status: IntegrationStatus | null;
  comingSoon?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

const IntegrationCard = ({
  name,
  logoUrl,
  description,
  status,
  comingSoon,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) => {
  const isConnected = status === IntegrationStatus.CONNECTED;
  const isSvg = logoUrl.endsWith('.svg');

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        opacity: comingSoon ? 0.7 : 1,
      }}
    >
      {comingSoon && (
        <Chip
          label="Coming Soon"
          size="small"
          color="warning"
          sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 600 }}
        />
      )}
      {isConnected && (
        <Chip
          icon={<CheckCircleIcon />}
          label="Connected"
          size="small"
          color="success"
          sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 600 }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
        <Box
          sx={{
            width: 120,
            height: 60,
            mx: 'auto',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            component="img"
            src={logoUrl}
            alt={`${name} logo`}
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              ...(isSvg ? { width: 120, height: 60 } : {}),
            }}
          />
        </Box>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        {comingSoon ? (
          <Button disabled size="small" variant="outlined">
            Coming Soon
          </Button>
        ) : isConnected ? (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<LinkOffIcon />}
            onClick={onDisconnect}
          >
            Disconnect
          </Button>
        ) : (
          <Button size="small" variant="contained" onClick={onConnect}>
            Connect
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default IntegrationCard;
