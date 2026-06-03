import { useRef, useState, useEffect, useCallback } from 'react';
import Peer, { MediaConnection } from 'peerjs';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CallingView() {
  const [peerId, setPeerId] = useState<string>('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>('');
  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(null);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callActive, setCallActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const currentCallRef = useRef<MediaConnection | null>(null);

  useEffect(() => {
    // Initialize PeerJS
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('call', (call) => {
      setIncomingCall(call);
    });

    peerInstance.current = peer;

    return () => {
      peer.destroy();
      stopLocalStream();
    };
  }, []);

  const getMediaStream = async () => {
    try {
      setMediaError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setIsVideoOff(false);
      return stream;
    } catch (error: any) {
      console.error('Failed to get local stream', error);
      if (error.name === 'NotReadableError') {
        // Fallback to audio-only if the camera is locked by another browser/app
        try {
          console.warn('Camera in use, attempting audio-only fallback...');
          const audioStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          setMediaError('Camera is in use by another tab/app. Falling back to audio-only mode.');
          localStreamRef.current = audioStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = audioStream;
          }
          setIsVideoOff(true); // Visually indicate video is off
          return audioStream;
        } catch (audioError) {
          setMediaError('Could not start video or audio source. Both might be in use by another application.');
          return null;
        }
      } else if (error.name === 'NotAllowedError') {
        setMediaError('Permission to access camera/microphone was denied. Please allow access in your browser settings.');
      } else {
        setMediaError(`Failed to access media devices: ${error.message || 'Unknown error'}`);
      }
      return null;
    }
  };

  const stopLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
  };

  const handleCall = async () => {
    if (!remotePeerIdValue.trim()) return;

    setIsCalling(true);
    const stream = await getMediaStream();
    if (!stream) {
      setIsCalling(false);
      return;
    }

    if (peerInstance.current) {
      const call = peerInstance.current.call(remotePeerIdValue, stream);
      currentCallRef.current = call;

      call.on('stream', (remoteStream) => {
        setCallActive(true);
        setIsCalling(false);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      call.on('close', () => {
        handleEndCall();
      });

      call.on('error', (err) => {
        console.error('Call error:', err);
        handleEndCall();
      });
    }
  };

  const handleAnswerCall = async () => {
    if (incomingCall) {
      const stream = await getMediaStream();
      if (!stream) return;

      incomingCall.answer(stream);
      currentCallRef.current = incomingCall;

      incomingCall.on('stream', (remoteStream) => {
        setCallActive(true);
        setIncomingCall(null);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      incomingCall.on('close', () => {
        handleEndCall();
      });

      incomingCall.on('error', (err) => {
        console.error('Incoming call error:', err);
        handleEndCall();
      });
    }
  };

  const handleRejectCall = () => {
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(null);
    }
  };

  const handleEndCall = useCallback(() => {
    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }
    stopLocalStream();
    setCallActive(false);
    setIsCalling(false);
    setIncomingCall(null);
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  }, []);

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Typography variant="h4">Video Call</Typography>

        {mediaError && (
          <Alert severity="warning" onClose={() => setMediaError(null)}>
            {mediaError}
          </Alert>
        )}

        <Card sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {/* Status & Connection Panel */}
            <Stack spacing={3} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Your Peer ID
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    fullWidth
                    size="small"
                    value={peerId || 'Generating...'}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => navigator.clipboard.writeText(peerId)}
                    disabled={!peerId}
                  >
                    Copy
                  </Button>
                </Stack>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 1, display: 'block' }}
                >
                  Share this ID with the person you want to connect with.
                </Typography>
              </Box>

              {!callActive && (
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Call someone
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter Peer ID to call"
                      value={remotePeerIdValue}
                      onChange={(e) => setRemotePeerIdValue(e.target.value)}
                      disabled={isCalling || !!incomingCall}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCall}
                      disabled={!remotePeerIdValue || isCalling || !!incomingCall}
                    >
                      {isCalling ? 'Calling...' : 'Call'}
                    </Button>
                  </Stack>
                </Box>
              )}

              {incomingCall && !callActive && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Incoming Call...</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleAnswerCall}
                      size="small"
                    >
                      Answer
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleRejectCall}
                      size="small"
                    >
                      Reject
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
                <Typography sx={{ color: 'background.paper' }}>
                  Ready to make or receive a call
                </Typography>
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
                    onClick={toggleMute}
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
                    onClick={toggleVideo}
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
                    onClick={handleEndCall}
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
