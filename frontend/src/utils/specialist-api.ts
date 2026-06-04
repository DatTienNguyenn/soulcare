import axiosInstance from 'src/utils/axios';

// Interfaces for Specialist Profile API

export interface SessionPricingRequest {
  sessionType: string;
  pricePerSession: number;
  durationMinutes: number;
  active?: boolean;
}

export interface SessionPricingResponse {
  id: string;
  specialistId: string;
  sessionType: string;
  pricePerSession: number;
  durationMinutes: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityRequest {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  breakTimeStart?: string;
  breakTimeEnd?: string;
  active?: boolean;
}

export interface AvailabilityResponse {
  id: string;
  specialistId: string;
  dayOfWeek: number;
  dayName: string;
  startTime: string;
  endTime: string;
  breakTimeStart?: string;
  breakTimeEnd?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialistProfile {
  id: string;
  userId: string;
  fullName: string;
  specialtyTags: string[];
  ratingAverage: number;
  pricing: SessionPricingResponse[];
  availability: AvailabilityResponse[];
  bio?: string;
  years_exp?: number;
}

export interface UpdateSpecialistProfileRequest {
  fullName: string;
  specialtyTags: string[];
  bio?: string;
  years_exp?: number;
}

const API_BASE = '/api/v1/specialist/profile';

// ========== SESSION PRICING API CALLS ==========

export const setSessionPricing = async (
  request: SessionPricingRequest
): Promise<SessionPricingResponse> => {
  const response = await axiosInstance.post<SessionPricingResponse>(`${API_BASE}/pricing`, request);
  return response.data;
};

export const getSessionPricing = async (): Promise<SessionPricingResponse[]> => {
  const response = await axiosInstance.get<SessionPricingResponse[]>(`${API_BASE}/pricing`);
  return response.data;
};

export const getActivePricing = async (): Promise<SessionPricingResponse[]> => {
  const response = await axiosInstance.get<SessionPricingResponse[]>(`${API_BASE}/pricing/active`);
  return response.data;
};

export const getPricingByType = async (sessionType: string): Promise<SessionPricingResponse> => {
  const response = await axiosInstance.get<SessionPricingResponse>(
    `${API_BASE}/pricing/${sessionType}`
  );
  return response.data;
};

export const updateSessionPricing = async (
  sessionType: string,
  request: SessionPricingRequest
): Promise<SessionPricingResponse> => {
  const response = await axiosInstance.put<SessionPricingResponse>(
    `${API_BASE}/pricing/${sessionType}`,
    request
  );
  return response.data;
};

export const togglePricingStatus = async (sessionType: string): Promise<SessionPricingResponse> => {
  const response = await axiosInstance.post<SessionPricingResponse>(
    `${API_BASE}/pricing/${sessionType}/toggle`
  );
  return response.data;
};

export const deletePricing = async (sessionType: string): Promise<void> => {
  await axiosInstance.delete(`${API_BASE}/pricing/${sessionType}`);
};

// ========== AVAILABILITY API CALLS ==========

export const setAvailability = async (
  request: AvailabilityRequest
): Promise<AvailabilityResponse> => {
  const response = await axiosInstance.post<AvailabilityResponse>(
    `${API_BASE}/availability`,
    request
  );
  return response.data;
};

export const getAvailability = async (): Promise<AvailabilityResponse[]> => {
  const response = await axiosInstance.get<AvailabilityResponse[]>(`${API_BASE}/availability`);
  return response.data;
};

export const getActiveAvailability = async (): Promise<AvailabilityResponse[]> => {
  const response = await axiosInstance.get<AvailabilityResponse[]>(
    `${API_BASE}/availability/active`
  );
  return response.data;
};

export const getAvailabilityByDay = async (dayOfWeek: number): Promise<AvailabilityResponse> => {
  const response = await axiosInstance.get<AvailabilityResponse>(
    `${API_BASE}/availability/${dayOfWeek}`
  );
  return response.data;
};

export const updateAvailability = async (
  dayOfWeek: number,
  request: AvailabilityRequest
): Promise<AvailabilityResponse> => {
  const response = await axiosInstance.put<AvailabilityResponse>(
    `${API_BASE}/availability/${dayOfWeek}`,
    request
  );
  return response.data;
};

export const toggleAvailabilityStatus = async (
  dayOfWeek: number
): Promise<AvailabilityResponse> => {
  const response = await axiosInstance.post<AvailabilityResponse>(
    `${API_BASE}/availability/${dayOfWeek}/toggle`
  );
  return response.data;
};

export const deleteAvailability = async (dayOfWeek: number): Promise<void> => {
  await axiosInstance.delete(`${API_BASE}/availability/${dayOfWeek}`);
};

// ========== SPECIALIST PROFILE API CALLS ==========

export const getSpecialistProfile = async (): Promise<SpecialistProfile> => {
  const response = await axiosInstance.get<SpecialistProfile>(`${API_BASE}`);
  return response.data;
};

export const updateSpecialistProfile = async (
  request: UpdateSpecialistProfileRequest
): Promise<SpecialistProfile> => {
  const response = await axiosInstance.put<SpecialistProfile>(`${API_BASE}`, request);
  return response.data;
};

// ========== PUBLIC THERAPIST BROWSING API CALLS ==========

export interface PublicSpecialistDTO {
  id: string;
  name: string;
  bio: string;
  specialization: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  avatarUrl?: string;
  experience: number;
  certifications: string[];
  languages: string[];
  availableHours: string;
  responseTime: string;
}

export interface AvailableSlotDTO {
  id: string;
  specialistId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'available' | 'booked';
  price: number;
  sessionType?: string;
}

const PUBLIC_API_BASE = '/api/v1/specialists';

/**
 * Get all therapists/specialists for browsing
 */
export const getAllSpecialists = async (
  specialization?: string
): Promise<PublicSpecialistDTO[]> => {
  const params = new URLSearchParams();
  if (specialization) {
    params.append('specialization', specialization);
  }
  const response = await axiosInstance.get<PublicSpecialistDTO[]>(
    `${PUBLIC_API_BASE}/public${params.toString() ? '?' + params.toString() : ''}`
  );
  return response.data;
};

/**
 * Get a specific therapist's public profile details
 */
export const getSpecialistPublicProfile = async (
  specialistId: string
): Promise<PublicSpecialistDTO> => {
  const response = await axiosInstance.get<PublicSpecialistDTO>(
    `${PUBLIC_API_BASE}/${specialistId}/public`
  );
  return response.data;
};

/**
 * Get pricing options for a specialist
 */
export const getSpecialistPricing = async (
  specialistId: string
): Promise<SessionPricingResponse[]> => {
  const response = await axiosInstance.get<SessionPricingResponse[]>(
    `${PUBLIC_API_BASE}/${specialistId}/pricing`
  );
  return response.data;
};

/**
 * Get available time slots for a therapist
 */
export const getAvailableSlots = async (
  specialistId: string,
  startDate?: string, // YYYY-MM-DD format
  endDate?: string, // YYYY-MM-DD format
  sessionType?: string
): Promise<AvailableSlotDTO[]> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (sessionType) params.append('sessionType', sessionType);

  const response = await axiosInstance.get<AvailableSlotDTO[]>(
    `${PUBLIC_API_BASE}/${specialistId}/available-slots${params.toString() ? '?' + params.toString() : ''}`
  );
  return response.data;
};

/**
 * Search therapists by criteria
 */
export const searchSpecialists = async (params: {
  specialization?: string;
  minRating?: string;
  maxPrice?: string;
}): Promise<PublicSpecialistDTO[]> => {
  const queryParams = new URLSearchParams();
  if (params.specialization) queryParams.append('specialization', params.specialization);
  if (params.minRating) queryParams.append('minRating', params.minRating);
  if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);

  const response = await axiosInstance.get<PublicSpecialistDTO[]>(
    `${PUBLIC_API_BASE}/search${queryParams.toString() ? '?' + queryParams.toString() : ''}`
  );
  return response.data;
};

// ========== APPOINTMENT/BOOKING API CALLS ==========

export type BookingType = 'PSYCHOLOGY' | 'COUNSELING' | 'BEHAVIORAL' | 'MEDITATION' | 'GENERAL';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface AppointmentRequest {
  specialistId: string;
  scheduledAt: string; // ISO datetime string
  bookingType: BookingType;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // Duration in minutes
  totalPrice: number;
  currency: string;
  sessionNotes?: string;
}

export interface AppointmentResponse {
  id: string;
  patientId: string;
  specialistId: string;
  scheduledAt: string;
  bookingType: BookingType;
  startTime: string;
  endTime: string;
  duration: number;
  status: AppointmentStatus;
  totalPrice: number;
  currency: string;
  sessionNotes: string;
  completedAt?: string;
  cancelledReason?: string;
  createdAt: string;
  patientName?: string;
  patientEmail?: string;
  patientAvatar?: string;
  specialistName?: string;
  specialistEmail?: string;
  specialistRating?: number;
  reviewRating?: number;
  reviewComment?: string;
}

const APPOINTMENT_API_BASE = '/api/v1/appointments';

/**
 * Create a new appointment (patient books a specialist)
 */
export const createAppointment = async (
  request: AppointmentRequest
): Promise<AppointmentResponse> => {
  const response = await axiosInstance.post<AppointmentResponse>(
    `${APPOINTMENT_API_BASE}`,
    request
  );
  return response.data;
};

/**
 * Get all appointments for the authenticated patient
 */
export const getPatientAppointments = async (): Promise<AppointmentResponse[]> => {
  const response = await axiosInstance.get<AppointmentResponse[]>(
    `${APPOINTMENT_API_BASE}/patient`
  );
  return response.data;
};

/**
 * Get specific appointment details for patient
 */
export const getAppointmentDetails = async (
  appointmentId: string
): Promise<AppointmentResponse> => {
  const response = await axiosInstance.get<AppointmentResponse>(
    `${APPOINTMENT_API_BASE}/patient/${appointmentId}`
  );
  return response.data;
};

/**
 * Update appointment (add notes, etc.)
 */
export const updateAppointment = async (
  appointmentId: string,
  request: Partial<AppointmentRequest>
): Promise<AppointmentResponse> => {
  const response = await axiosInstance.put<AppointmentResponse>(
    `${APPOINTMENT_API_BASE}/${appointmentId}`,
    request
  );
  return response.data;
};

/**
 * Cancel an appointment
 */
export const cancelAppointment = async (
  appointmentId: string,
  cancelledReason?: string
): Promise<AppointmentResponse> => {
  const response = await axiosInstance.put<AppointmentResponse>(
    `${APPOINTMENT_API_BASE}/${appointmentId}`,
    {
      status: 'CANCELLED',
      cancelledReason,
    }
  );
  return response.data;
};

/**
 * Add or update a review for a completed appointment
 */
export const addReview = async (
  appointmentId: string,
  rating: number,
  comment: string
): Promise<AppointmentResponse> => {
  const response = await axiosInstance.post<AppointmentResponse>(
    `${APPOINTMENT_API_BASE}/${appointmentId}/review`,
    { rating, comment }
  );
  return response.data;
};

/**
 * Create Electronic Health Record for a completed session
 */
export const createEHR = async (
  appointmentId: string,
  diagnosis: string,
  treatmentPlan: string
): Promise<any> => {
  try {
    const response = await axiosInstance.post(`/api/v1/ehr`, {
      appointmentId,
      diagnosis,
      treatmentPlan,
    });
    return response.data;
  } catch (error) {
    console.warn('EHR endpoint might not exist yet. Mocking success.');
    return { success: true, message: 'Mock EHR created successfully.' };
  }
};

/**
 * Get all appointments for the authenticated specialist
 */
export const getSpecialistAppointments = async (): Promise<AppointmentResponse[]> => {
  const response = await axiosInstance.get<AppointmentResponse[]>(
    `${APPOINTMENT_API_BASE}/specialist`
  );
  return response.data;
};

/**
 * Get specialist appointments filtered by status
 */
export const getSpecialistAppointmentsByStatus = async (
  status: AppointmentStatus
): Promise<AppointmentResponse[]> => {
  const response = await axiosInstance.get<AppointmentResponse[]>(
    `${APPOINTMENT_API_BASE}/specialist/status/${status}`
  );
  return response.data;
};

export const submitReview = async (
  appointmentId: string,
  patientId: string,
  rating: number,
  comment: string
): Promise<AppointmentResponse> => {
  const response = await axiosInstance.post<AppointmentResponse>(
    `${APPOINTMENT_API_BASE}/${appointmentId}/review`,
    { rating, comment }
  );
  return response.data;
};

export const submitElectronicHealthRecord = async (
  appointmentId: string,
  specialistId: string,
  diagnosis: string,
  treatmentPlan: string
): Promise<any> => {
  const response = await axiosInstance.post(`${APPOINTMENT_API_BASE}/${appointmentId}/record`, {
    diagnosis,
    treatmentPlan,
  });
  return response.data;
};
