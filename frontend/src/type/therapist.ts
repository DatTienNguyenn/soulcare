// Therapist/Specialist Types
export type TherapyType =
  | 'psychology'
  | 'counseling'
  | 'meditation'
  | 'behavioral'
  | 'cognitive'
  | 'family';

export type BookingStatus = 'available' | 'booked' | 'completed' | 'cancelled';

export interface Therapist {
  id: string;
  name: string;
  specialization: TherapyType;
  bio: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  avatarUrl: string;
  experience: number; // years
  certifications: string[];
  languages: string[];
  availableHours: string; // e.g., "9:00 AM - 6:00 PM"
  responseTime: string; // e.g., "Typically responds in 1 hour"
}

export interface TimeSlot {
  id: string;
  therapistId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  price: number;
}

export interface TherapyBooking {
  id: string;
  therapistId: string;
  therapistName: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: TherapyType;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  status: BookingStatus;
  notes?: string;
  totalPrice: number;
  createdAt: Date;
  completedAt?: Date;
}
