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
}

export interface UpdateSpecialistProfileRequest {
  fullName: string;
  specialtyTags: string[];
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
