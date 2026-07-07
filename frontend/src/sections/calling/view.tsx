import { useRef, useState, useEffect, useCallback } from 'react';
import Peer, { MediaConnection } from 'peerjs';

import { useAuthContext } from 'src/auth/hooks';
import axios from 'src/utils/axios';
import {
  getPatientAppointments,
  getSpecialistAppointments,
  AppointmentResponse,
  submitReview,
  submitElectronicHealthRecord,
} from 'src/utils/specialist-api';

import { useLocales } from 'src/locale/use-locales';
import SessionList from './session-list';
import CallRoom from './call-room';
import { ReviewDialog } from './ReviewDialog';
import { RecordDialog } from './RecordDialog';
import { ReasonDialog } from './ReasonDialog';

// ----------------------------------------------------------------------

export default function CallingView() {
  const { t } = useLocales();
  const { user } = useAuthContext();
  const isSpecialist = user?.role === 'SPECIALIST' || user?.role === 'specialist';

  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<AppointmentResponse | null>(null);

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState<AppointmentResponse | null>(null);

  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [selectedBookingForRecord, setSelectedBookingForRecord] =
    useState<AppointmentResponse | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');

  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [reasonDialogType, setReasonDialogType] = useState<'CANCEL' | 'REPORT' | null>(null);
  const [selectedBookingForReason, setSelectedBookingForReason] =
    useState<AppointmentResponse | null>(null);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update current time every minute to check schedule
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getCallStatus = useCallback(
    (booking: AppointmentResponse) => {
      const appointmentDate = new Date(booking.scheduledAt);
      const [startHour, startMinute] = booking.startTime.split(':').map(Number);
      const [endHour, endMinute] = booking.endTime.split(':').map(Number);

      const startTime = new Date(appointmentDate);
      startTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date(appointmentDate);
      endTime.setHours(endHour, endMinute, 0, 0);

      const bufferStartTime = new Date(startTime.getTime() - 5 * 60000); // 5 minutes before

      if (currentTime > endTime) return 'ENDED';
      if (currentTime < bufferStartTime) return 'NOT_STARTED';
      return 'AVAILABLE';
    },
    [currentTime]
  );

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
    const peer = new Peer(myId, {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          {
            urls: 'stun:stun.relay.metered.ca:80',
          },
          {
            urls: 'turn:global.relay.metered.ca:80',
            username: 'd74c570ded24965293eada86',
            credential: '2hl8F4CyQLWTSxyV',
          },
          {
            urls: 'turn:global.relay.metered.ca:80?transport=tcp',
            username: 'd74c570ded24965293eada86',
            credential: '2hl8F4CyQLWTSxyV',
          },
          {
            urls: 'turn:global.relay.metered.ca:443',
            username: 'd74c570ded24965293eada86',
            credential: '2hl8F4CyQLWTSxyV',
          },
          {
            urls: 'turns:global.relay.metered.ca:443?transport=tcp',
            username: 'd74c570ded24965293eada86',
            credential: '2hl8F4CyQLWTSxyV',
          },
        ],
      },
    });

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
          setCallStatusMessage(t('calling.waitingForUser'));
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
          setMediaError(t('calling.cameraInUse'));
          localStreamRef.current = audioStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = audioStream;
          }
          setIsVideoOff(true); // Visually indicate video is off
          return audioStream;
        } catch (audioError) {
          setMediaError(t('calling.mediaErrorBoth'));
          return null;
        }
      } else if (error.name === 'NotAllowedError') {
        setMediaError(t('calling.mediaErrorPermission'));
      } else {
        setMediaError(`${t('calling.mediaErrorGeneric')} ${error.message || 'Unknown error'}`);
      }
      return null;
    }
  };

  const handleCall = async () => {
    if (!remotePeerIdValue.trim()) return;

    setIsCalling(true);
    isCallingRef.current = true;
    setCallStatusMessage(t('calling.dialing'));

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

  const handleOpenReviewDialog = (booking: AppointmentResponse) => {
    setSelectedBookingForReview(booking);
    setReviewDialogOpen(true);
  };

  const handleCloseReviewDialog = () => {
    setReviewDialogOpen(false);
    setSelectedBookingForReview(null);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!selectedBookingForReview) return;
    try {
      await submitReview(
        selectedBookingForReview.id,
        selectedBookingForReview.patientId,
        rating,
        comment
      );
      // Show success message (e.g. snackbar)
    } catch (err) {
      console.error(err);
      // Show error message
    } finally {
      handleCloseReviewDialog();
    }
  };

  const handleOpenRecordDialog = (booking: AppointmentResponse) => {
    setSelectedBookingForRecord(booking);
    setRecordDialogOpen(true);
    setDiagnosis('');
    setTreatmentPlan('');
  };

  const handleCloseRecordDialog = () => {
    setRecordDialogOpen(false);
    setSelectedBookingForRecord(null);
  };

  const handleSubmitRecord = async (diag: string, plan: string) => {
    if (!selectedBookingForRecord) return;
    try {
      await submitElectronicHealthRecord(
        selectedBookingForRecord.id,
        selectedBookingForRecord.specialistId,
        diag,
        plan
      );
      // Show success message (e.g. snackbar)
    } catch (err) {
      console.error(err);
      // Show error message
    } finally {
      handleCloseRecordDialog();
    }
  };

  const handleCancelSession = async (booking: AppointmentResponse) => {
    setSelectedBookingForReason(booking);
    setReasonDialogType('CANCEL');
    setReasonDialogOpen(true);
  };

  const handleReportSession = async (booking: AppointmentResponse) => {
    setSelectedBookingForReason(booking);
    setReasonDialogType('REPORT');
    setReasonDialogOpen(true);
  };

  const handleSubmitReason = async (reason: string) => {
    if (!selectedBookingForReason || !reasonDialogType) return;
    try {
      const endpoint = reasonDialogType === 'CANCEL' ? 'cancel' : 'no-show';
      const response = await axios.post(
        `/api/v1/appointments/${selectedBookingForReason.id}/${endpoint}`,
        {
          reason,
        }
      );
      const updatedAppointment = response.data;
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === updatedAppointment.id ? updatedAppointment : apt))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setReasonDialogOpen(false);
      setSelectedBookingForReason(null);
      setReasonDialogType(null);
    }
  };

  if (!selectedBooking) {
    return (
      <>
        <SessionList
          appointments={appointments}
          loading={loading}
          error={error}
          isSpecialist={isSpecialist}
          onSelectBooking={setSelectedBooking}
          getCallStatus={getCallStatus}
          onRateSpecialist={handleOpenReviewDialog}
          onWriteRecord={handleOpenRecordDialog}
          onCancelSession={handleCancelSession}
          onReportSession={handleReportSession}
        />

        <ReviewDialog
          open={reviewDialogOpen}
          onClose={handleCloseReviewDialog}
          onSubmit={handleSubmitReview}
        />

        <RecordDialog
          open={recordDialogOpen}
          onClose={handleCloseRecordDialog}
          onSubmit={handleSubmitRecord}
          diagnosis={diagnosis}
          onDiagnosisChange={setDiagnosis}
          treatmentPlan={treatmentPlan}
          onTreatmentPlanChange={setTreatmentPlan}
        />

        <ReasonDialog
          open={reasonDialogOpen}
          title={
            reasonDialogType === 'CANCEL' ? t('calling.cancelSession') : t('calling.reportSession')
          }
          description={
            reasonDialogType === 'CANCEL' ? t('calling.cancelReason') : t('calling.reportReason')
          }
          onClose={() => setReasonDialogOpen(false)}
          onSubmit={handleSubmitReason}
        />
      </>
    );
  }

  const targetName = isSpecialist ? selectedBooking.patientName : selectedBooking.specialistName;

  return (
    <CallRoom
      targetName={targetName || 'User'}
      isSpecialist={isSpecialist}
      remotePeerIdValue={remotePeerIdValue}
      peerId={peerId}
      callActive={callActive}
      isCalling={isCalling}
      incomingCall={incomingCall}
      callStatusMessage={callStatusMessage}
      mediaError={mediaError}
      isMuted={isMuted}
      isVideoOff={isVideoOff}
      onCall={handleCall}
      onAnswerCall={handleAnswerCall}
      onRejectCall={handleRejectCall}
      onToggleMute={toggleMute}
      onToggleVideo={toggleVideo}
      onEndCall={handleEndCall}
      onBackToList={handleBackToList}
      onClearMediaError={() => setMediaError(null)}
      remoteVideoRef={remoteVideoRef}
      localVideoRef={localVideoRef}
    />
  );
}
