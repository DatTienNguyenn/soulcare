import { RefObject } from 'react';
import { MediaConnection } from 'peerjs';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locale/use-locales';

interface CallRoomProps {
  targetName: string;
  isSpecialist: boolean;
  remotePeerIdValue: string;
  peerId: string;
  callActive: boolean;
  isCalling: boolean;
  incomingCall: MediaConnection | null;
  callStatusMessage: string;
  mediaError: string | null;
  isMuted: boolean;
  isVideoOff: boolean;
  onCall: () => void;
  onAnswerCall: () => void;
  onRejectCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onBackToList: () => void;
  onClearMediaError: () => void;
  remoteVideoRef: RefObject<HTMLVideoElement>;
  localVideoRef: RefObject<HTMLVideoElement>;
}

export default function CallRoom({
  targetName,
  isSpecialist,
  remotePeerIdValue,
  peerId,
  callActive,
  isCalling,
  incomingCall,
  callStatusMessage,
  mediaError,
  isMuted,
  isVideoOff,
  onCall,
  onAnswerCall,
  onRejectCall,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onBackToList,
  onClearMediaError,
  remoteVideoRef,
  localVideoRef,
}: CallRoomProps) {
  const { t } = useLocales();
  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">
            {t('calling.videoCallWith')} {targetName || t('calling.unknownUser')}
          </Typography>
          <Button startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={onBackToList}>
            {t('calling.backToSessions')}
          </Button>
        </Stack>

        {mediaError && (
          <Alert severity="warning" onClose={onClearMediaError}>
            {mediaError}
          </Alert>
        )}

        <Card sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {/* Status & Connection Panel */}
            <Stack spacing={3} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  {t('calling.sessionInfo')}
                </Typography>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>
                      {isSpecialist ? t('calling.patient') : t('calling.specialist')}:
                    </strong>{' '}
                    {targetName || t('calling.unknownUser')}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    <strong>{t('calling.targetPeerId')}</strong> {remotePeerIdValue}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>{t('calling.yourPeerId')}</strong> {peerId}
                  </Typography>
                </Card>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 2, display: 'block' }}
                >
                  {t('calling.connectionWarning')}
                </Typography>
              </Box>

              {!callActive && (
                <Box>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={onCall}
                    disabled={!remotePeerIdValue || isCalling || !!incomingCall}
                  >
                    {isCalling
                      ? t('calling.calling')
                      : `${t('calling.startCallWith')} ${targetName || t('calling.unknownUser')}`}
                  </Button>

                  {isCalling && callStatusMessage && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 2, color: 'text.secondary', display: 'flex', alignItems: 'center' }}
                    >
                      <CircularProgress size={16} sx={{ mr: 1 }} />
                      {callStatusMessage}
                    </Typography>
                  )}
                </Box>
              )}

              {incomingCall && !callActive && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    {t('calling.incomingCallFrom')} {targetName || t('calling.unknownUser')}...
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button variant="contained" color="success" onClick={onAnswerCall} size="small">
                      {t('calling.answer')}
                    </Button>
                    <Button variant="contained" color="error" onClick={onRejectCall} size="small">
                      {t('calling.reject')}
                    </Button>
                  </Stack>
                </Alert>
              )}
            </Stack>

            {/* Video Streams Panel */}
            <Box
              sx={{
                flex: 2,
                position: 'relative',
                bgcolor: 'text.primary',
                borderRadius: 2,
                overflow: 'hidden',
                aspectRatio: '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!callActive && !isCalling && !incomingCall && (
                <Typography sx={{ color: 'background.paper' }}>{t('calling.ready')}</Typography>
              )}

              {/* Remote Video (Main) */}
              <Box
                component="video"
                ref={remoteVideoRef}
                autoPlay
                playsInline
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: callActive ? 'block' : 'none',
                }}
              />

              {/* Local Video (PiP) */}
              <Box
                component="video"
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                sx={{
                  width: { xs: 100, md: 160 },
                  height: { xs: 75, md: 120 },
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  objectFit: 'cover',
                  borderRadius: 1,
                  border: (theme) => `2px solid ${theme.palette.background.paper}`,
                  display: callActive || isCalling ? 'block' : 'none',
                  zIndex: 9,
                }}
              />

              {/* Call Controls Overlay */}
              {callActive && (
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                  }}
                >
                  <IconButton
                    onClick={onToggleMute}
                    sx={{
                      bgcolor: isMuted ? 'error.main' : 'background.paper',
                      color: isMuted ? 'common.white' : 'text.primary',
                      '&:hover': {
                        bgcolor: isMuted ? 'error.dark' : 'grey.300',
                      },
                    }}
                  >
                    <Iconify icon={isMuted ? 'mingcute:mic-off-fill' : 'mingcute:mic-fill'} />
                  </IconButton>

                  <IconButton
                    onClick={onToggleVideo}
                    sx={{
                      bgcolor: isVideoOff ? 'error.main' : 'background.paper',
                      color: isVideoOff ? 'common.white' : 'text.primary',
                      '&:hover': {
                        bgcolor: isVideoOff ? 'error.dark' : 'grey.300',
                      },
                    }}
                  >
                    <Iconify
                      icon={isVideoOff ? 'mingcute:video-off-fill' : 'mingcute:video-fill'}
                    />
                  </IconButton>

                  <IconButton
                    onClick={onEndCall}
                    sx={{
                      bgcolor: 'error.main',
                      color: 'common.white',
                      '&:hover': {
                        bgcolor: 'error.dark',
                      },
                    }}
                  >
                    <Iconify icon="mingcute:phone-off-fill" />
                  </IconButton>
                </Stack>
              )}
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
