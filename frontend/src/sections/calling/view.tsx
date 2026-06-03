import { useRef, useState, useEffect, useCallback } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { format } from 'date-fns';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import {
  getPatientAppointments,
  getSpecialistAppointments,
  AppointmentResponse,
} from 'src/utils/specialist-api';

// ----------------------------------------------------------------------

export default function CallingView() {
  const { user } = useAuthContext();
  const isSpecialist = user?.role === 'SPECIALIST' || user?.role === 'specialist';

  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<AppointmentResponse | null>(null);

  const [peerId, setPeerId] = useState<string>('');
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>('');
  const [incomingCall, setIncomingCall] = useState<MediaConnection | null>(null);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callActive, setCallActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [callStatusMessage, setCallStatusMessage] = useState<string>('');

  const isCallingRef = useRef<boolean>(false);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const currentCallRef = useRef<MediaConnection | null>(null);

  const stopLocalStream = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
  }, []);

  const handleEndCall = useCallback(() => {
    isCallingRef.current = false;
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (currentCallRef.current) {
      currentCallRef.current.close();
      currentCallRef.current = null;
    }
    stopLocalStream();
    setCallActive(false);
    setIsCalling(false);
    setCallStatusMessage('');
    setIncomingCall(null);
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  }, [stopLocalStream]);

  const setupCallListeners = useCallback(
    (call: MediaConnection) => {
      currentCallRef.current = call;

      call.on('stream', (remoteStream) => {
        setCallActive(true);
        setIsCalling(false);
        isCallingRef.current = false;
        setCallStatusMessage('');
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
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
    },
    [handleEndCall]
  );

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        let data: AppointmentResponse[] = [];
        if (isSpecialist) {
          data = await getSpecialistAppointments();
        } else {
          data = await getPatientAppointments();
        }
        setAppointments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user, isSpecialist]);

  useEffect(() => {
    if (!selectedBooking) return;

    // Deterministic Peer IDs based on appointment ID and User IDs
    // Ensures strictly binding the session, the correct patient, and the correct specialist.
    const specialistPart = `specialist-${selectedBooking.specialistId}`;
    const patientPart = `patient-${selectedBooking.patientId}`;

    const myId = `session-${selectedBooking.id}-${isSpecialist ? specialistPart : patientPart}`;
    const targetId = `session-${selectedBooking.id}-${isSpecialist ? patientPart : specialistPart}`;

    setPeerId(myId);
    setRemotePeerIdValue(targetId);

    // Initialize PeerJS with the deterministic ID
    const peer = new Peer(myId);

    peer.on('open', (id) => {
      setPeerId(id);
    });

    peer.on('call', (call) => {
      setIncomingCall(call);
    });

    peer.on('error', (err: any) => {
      console.error('PeerJS error:', err);
      if (err.type === 'peer-unavailable') {
        if (isCallingRef.current) {
          setCallStatusMessage('Waiting for the other user to join the session...');
          if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);

          // Auto-retry connection every 3 seconds
          retryTimeoutRef.current = setTimeout(() => {
            if (isCallingRef.current && localStreamRef.current) {
              const call = peer.call(targetId, localStreamRef.current);
              setupCallListeners(call);
            }
          }, 3000);
        }
      }
    });

    peerInstance.current = peer;

    return () => {
      peer.destroy();
      stopLocalStream();
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, [selectedBooking, isSpecialist, setupCallListeners, stopLocalStream]);

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
          const audioStream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          setMediaError('Camera is in use by another tab/app. Falling back to audio-only mode.');
          localStreamRef.current = audioStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = audioStream;
          }
          setIsVideoOff(true); // Visually indicate video is off
          return audioStream;
        } catch (audioError) {
          setMediaError(
            'Could not start video or audio source. Both might be in use by another application.'
          );
          return null;
        }
      } else if (error.name === 'NotAllowedError') {
        setMediaError(
          'Permission to access camera/microphone was denied. Please allow access in your browser settings.'
        );
      } else {
        setMediaError(`Failed to access media devices: ${error.message || 'Unknown error'}`);
      }
      return null;
    }
  };

  const handleCall = async () => {
    if (!remotePeerIdValue.trim()) return;

    setIsCalling(true);
    isCallingRef.current = true;
    setCallStatusMessage('Dialing...');

    const stream = localStreamRef.current || (await getMediaStream());
    if (!stream) {
      setIsCalling(false);
      isCallingRef.current = false;
      setCallStatusMessage('');
      return;
    }

    if (peerInstance.current) {
      const call = peerInstance.current.call(remotePeerIdValue, stream);
      setupCallListeners(call);
    }
  };

  const handleAnswerCall = async () => {
    if (incomingCall) {
      const stream = await getMediaStream();
      if (!stream) return;

      incomingCall.answer(stream);
      setupCallListeners(incomingCall);
      setIncomingCall(null);
    }
  };

  const handleRejectCall = () => {
    if (incomingCall) {
      incomingCall.close();
      setIncomingCall(null);
    }
  };

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

  const handleBackToList = () => {
    handleEndCall();
    setSelectedBooking(null);
    setPeerId('');
    setRemotePeerIdValue('');
  };

  const upcomingBookings = appointments.filter(
    (b) => b.status === 'PENDING' || b.status === 'CONFIRMED'
  );

  if (!selectedBooking) {
    return (
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4">Select a Session to Call</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {loading && (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          )}
          {!loading && upcomingBookings.length === 0 && (
            <Alert severity="info">No upcoming sessions available.</Alert>
          )}
          {!loading &&
            upcomingBookings.map((booking) => {
              const targetName = isSpecialist ? booking.patientName : booking.specialistName;

              return (
                <Paper
                  key={booking.id}
                  sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography variant="h6">{targetName || 'Unknown User'}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', textTransform: 'capitalize' }}
                    >
                      {booking.bookingType.toLowerCase()} Session
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Typography variant="body2">
                        📅 {format(new Date(booking.scheduledAt), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="body2">
                        🕐 {booking.startTime} - {booking.endTime}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    Enter Call Room
                  </Button>
                </Paper>
              );
            })}
        </Stack>
      </Container>
    );
  }

  const targetName = isSpecialist ? selectedBooking.patientName : selectedBooking.specialistName;

  return (
    <Container maxWidth="lg">
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Video Call with {targetName || 'User'}</Typography>
          <Button startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={handleBackToList}>
            Back to Sessions
          </Button>
        </Stack>

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
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Session Information
                </Typography>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>{isSpecialist ? 'Patient' : 'Specialist'}:</strong>{' '}
                    {targetName || 'Unknown User'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                    <strong>Target Peer ID:</strong> {remotePeerIdValue}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Your Peer ID:</strong> {peerId}
                  </Typography>
                </Card>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 2, display: 'block' }}
                >
                  Connection IDs are strictly bound to this session and its assigned users.
                </Typography>
              </Box>

              {!callActive && (
                <Box>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={handleCall}
                    disabled={!remotePeerIdValue || isCalling || !!incomingCall}
                  >
                    {isCalling ? 'Calling...' : `Start Call with ${targetName || 'User'}`}
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
                    Incoming Call from {targetName || 'User'}...
                  </Typography>
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
