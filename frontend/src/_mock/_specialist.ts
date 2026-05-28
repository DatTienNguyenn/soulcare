import { _mock } from './_mock';
import { Therapist } from 'src/type/therapist';

// -------------------------------------------------------
// TYPE DEFINITIONS

export interface SpecialistBooking {
  id: string;
  specialistId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  type: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'completed' | 'booked' | 'cancelled';
  notes?: string;
  totalPrice: number;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface SpecialistAnalytics {
  id: string;
  specialistId: string;
  date: Date;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  averageRating: number;
}

export interface BookingHeatmapData {
  date: Date;
  count: number;
}

export interface UserBookingStats {
  userId: string;
  userName: string;
  bookingCount: number;
  averageRating: number;
  totalSpent: number;
}

// -------------------------------------------------------
// MOCK SPECIALIST USERS (People booking with the specialist)

export const _specialistUsers = [...Array(15)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  email: _mock.email(index),
  avatar: _mock.image.avatar(index),
}));

// -------------------------------------------------------
// MOCK SPECIALIST BOOKINGS

export const _specialistBookings: SpecialistBooking[] = [
  // Completed bookings
  {
    id: _mock.id(0),
    specialistId: _mock.id(100),
    userId: _specialistUsers[0].id,
    userName: _specialistUsers[0].name,
    userEmail: _specialistUsers[0].email,
    userAvatar: _specialistUsers[0].avatar,
    type: 'psychology',
    date: new Date(2026, 4, 10),
    startTime: '09:00',
    endTime: '10:00',
    duration: 60,
    status: 'completed',
    notes: 'Patient discussed anxiety management techniques',
    totalPrice: 80,
    rating: 5,
    feedback: 'Excellent session, very professional',
    createdAt: new Date(2026, 4, 8),
    completedAt: new Date(2026, 4, 10),
  },
  {
    id: _mock.id(1),
    specialistId: _mock.id(100),
    userId: _specialistUsers[1].id,
    userName: _specialistUsers[1].name,
    userEmail: _specialistUsers[1].email,
    userAvatar: _specialistUsers[1].avatar,
    type: 'counseling',
    date: new Date(2026, 4, 12),
    startTime: '14:00',
    endTime: '15:00',
    duration: 60,
    status: 'completed',
    notes: 'Relationship counseling session',
    totalPrice: 85,
    rating: 4.5,
    feedback: 'Very helpful insights provided',
    createdAt: new Date(2026, 4, 10),
    completedAt: new Date(2026, 4, 12),
  },
  {
    id: _mock.id(2),
    specialistId: _mock.id(100),
    userId: _specialistUsers[2].id,
    userName: _specialistUsers[2].name,
    userEmail: _specialistUsers[2].email,
    userAvatar: _specialistUsers[2].avatar,
    type: 'psychology',
    date: new Date(2026, 4, 15),
    startTime: '10:30',
    endTime: '11:30',
    duration: 60,
    status: 'completed',
    notes: 'Depression treatment follow-up',
    totalPrice: 80,
    rating: 5,
    feedback: 'Best therapist ever!',
    createdAt: new Date(2026, 4, 13),
    completedAt: new Date(2026, 4, 15),
  },
  {
    id: _mock.id(3),
    specialistId: _mock.id(100),
    userId: _specialistUsers[3].id,
    userName: _specialistUsers[3].name,
    userEmail: _specialistUsers[3].email,
    userAvatar: _specialistUsers[3].avatar,
    type: 'behavioral',
    date: new Date(2026, 4, 17),
    startTime: '15:00',
    endTime: '16:00',
    duration: 60,
    status: 'completed',
    notes: 'Behavioral modification program',
    totalPrice: 90,
    rating: 4,
    feedback: 'Good techniques, will practice them',
    createdAt: new Date(2026, 4, 15),
    completedAt: new Date(2026, 4, 17),
  },
  {
    id: _mock.id(4),
    specialistId: _mock.id(100),
    userId: _specialistUsers[4].id,
    userName: _specialistUsers[4].name,
    userEmail: _specialistUsers[4].email,
    userAvatar: _specialistUsers[4].avatar,
    type: 'meditation',
    date: new Date(2026, 4, 19),
    startTime: '11:00',
    endTime: '12:00',
    duration: 60,
    status: 'completed',
    notes: 'Mindfulness meditation training',
    totalPrice: 75,
    rating: 5,
    feedback: 'Very relaxing and helpful',
    createdAt: new Date(2026, 4, 17),
    completedAt: new Date(2026, 4, 19),
  },
  {
    id: _mock.id(5),
    specialistId: _mock.id(100),
    userId: _specialistUsers[5].id,
    userName: _specialistUsers[5].name,
    userEmail: _specialistUsers[5].email,
    userAvatar: _specialistUsers[5].avatar,
    type: 'psychology',
    date: new Date(2026, 4, 21),
    startTime: '09:30',
    endTime: '10:30',
    duration: 60,
    status: 'completed',
    notes: 'PTSD therapy session',
    totalPrice: 80,
    rating: 4.5,
    feedback: 'Very understanding and supportive',
    createdAt: new Date(2026, 4, 19),
    completedAt: new Date(2026, 4, 21),
  },
  {
    id: _mock.id(6),
    specialistId: _mock.id(100),
    userId: _specialistUsers[0].id,
    userName: _specialistUsers[0].name,
    userEmail: _specialistUsers[0].email,
    userAvatar: _specialistUsers[0].avatar,
    type: 'psychology',
    date: new Date(2026, 4, 23),
    startTime: '14:30',
    endTime: '15:30',
    duration: 60,
    status: 'completed',
    notes: 'Follow-up session',
    totalPrice: 80,
    rating: 5,
    feedback: 'Great progress!',
    createdAt: new Date(2026, 4, 21),
    completedAt: new Date(2026, 4, 23),
  },

  // Booked bookings
  {
    id: _mock.id(10),
    specialistId: _mock.id(100),
    userId: _specialistUsers[6].id,
    userName: _specialistUsers[6].name,
    userEmail: _specialistUsers[6].email,
    userAvatar: _specialistUsers[6].avatar,
    type: 'counseling',
    date: new Date(2026, 5, 1),
    startTime: '10:00',
    endTime: '11:00',
    duration: 60,
    status: 'booked',
    totalPrice: 85,
    createdAt: new Date(2026, 4, 24),
  },
  {
    id: _mock.id(11),
    specialistId: _mock.id(100),
    userId: _specialistUsers[7].id,
    userName: _specialistUsers[7].name,
    userEmail: _specialistUsers[7].email,
    userAvatar: _specialistUsers[7].avatar,
    type: 'psychology',
    date: new Date(2026, 5, 2),
    startTime: '15:00',
    endTime: '16:00',
    duration: 60,
    status: 'booked',
    totalPrice: 80,
    createdAt: new Date(2026, 4, 24),
  },
  {
    id: _mock.id(12),
    specialistId: _mock.id(100),
    userId: _specialistUsers[8].id,
    userName: _specialistUsers[8].name,
    userEmail: _specialistUsers[8].email,
    userAvatar: _specialistUsers[8].avatar,
    type: 'behavioral',
    date: new Date(2026, 5, 3),
    startTime: '11:00',
    endTime: '12:00',
    duration: 60,
    status: 'booked',
    totalPrice: 90,
    createdAt: new Date(2026, 4, 24),
  },

  // Cancelled booking
  {
    id: _mock.id(13),
    specialistId: _mock.id(100),
    userId: _specialistUsers[9].id,
    userName: _specialistUsers[9].name,
    userEmail: _specialistUsers[9].email,
    userAvatar: _specialistUsers[9].avatar,
    type: 'meditation',
    date: new Date(2026, 4, 16),
    startTime: '09:00',
    endTime: '10:00',
    duration: 60,
    status: 'cancelled',
    notes: 'Patient cancelled 24 hours before',
    totalPrice: 75,
    createdAt: new Date(2026, 4, 14),
  },
];

// -------------------------------------------------------
// MOCK BOOKING HEATMAP DATA (for calendar visualization)

export const _bookingHeatmapData: BookingHeatmapData[] = [
  { date: new Date(2026, 4, 1), count: 1 },
  { date: new Date(2026, 4, 3), count: 2 },
  { date: new Date(2026, 4, 5), count: 1 },
  { date: new Date(2026, 4, 7), count: 0 },
  { date: new Date(2026, 4, 10), count: 1 },
  { date: new Date(2026, 4, 12), count: 1 },
  { date: new Date(2026, 4, 15), count: 1 },
  { date: new Date(2026, 4, 17), count: 1 },
  { date: new Date(2026, 4, 19), count: 1 },
  { date: new Date(2026, 4, 21), count: 1 },
  { date: new Date(2026, 4, 23), count: 1 },
  { date: new Date(2026, 4, 25), count: 0 },
  { date: new Date(2026, 5, 1), count: 1 },
  { date: new Date(2026, 5, 2), count: 1 },
  { date: new Date(2026, 5, 3), count: 1 },
];

// -------------------------------------------------------
// MOCK USER BOOKING STATISTICS

export const _userBookingStats: UserBookingStats[] = [
  {
    userId: _specialistUsers[0].id,
    userName: _specialistUsers[0].name,
    bookingCount: 2,
    averageRating: 5,
    totalSpent: 160,
  },
  {
    userId: _specialistUsers[1].id,
    userName: _specialistUsers[1].name,
    bookingCount: 1,
    averageRating: 4.5,
    totalSpent: 85,
  },
  {
    userId: _specialistUsers[2].id,
    userName: _specialistUsers[2].name,
    bookingCount: 1,
    averageRating: 5,
    totalSpent: 80,
  },
  {
    userId: _specialistUsers[3].id,
    userName: _specialistUsers[3].name,
    bookingCount: 1,
    averageRating: 4,
    totalSpent: 90,
  },
  {
    userId: _specialistUsers[4].id,
    userName: _specialistUsers[4].name,
    bookingCount: 1,
    averageRating: 5,
    totalSpent: 75,
  },
  {
    userId: _specialistUsers[5].id,
    userName: _specialistUsers[5].name,
    bookingCount: 1,
    averageRating: 4.5,
    totalSpent: 80,
  },
  {
    userId: _specialistUsers[6].id,
    userName: _specialistUsers[6].name,
    bookingCount: 1,
    averageRating: 0,
    totalSpent: 85,
  },
  {
    userId: _specialistUsers[7].id,
    userName: _specialistUsers[7].name,
    bookingCount: 1,
    averageRating: 0,
    totalSpent: 80,
  },
  {
    userId: _specialistUsers[8].id,
    userName: _specialistUsers[8].name,
    bookingCount: 1,
    averageRating: 0,
    totalSpent: 90,
  },
];

// -------------------------------------------------------
// MOCK SPECIALIST ANALYTICS SUMMARY

export const _specialistAnalyticsSummary = {
  totalBookings: _specialistBookings.length,
  completedBookings: _specialistBookings.filter((b) => b.status === 'completed').length,
  upcomingBookings: _specialistBookings.filter((b) => b.status === 'booked').length,
  cancelledBookings: _specialistBookings.filter((b) => b.status === 'cancelled').length,
  totalRevenue: _specialistBookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0),
  averageRating: (
    _specialistBookings.filter((b) => b.rating).reduce((sum, b) => sum + (b.rating || 0), 0) /
    _specialistBookings.filter((b) => b.rating).length
  ).toFixed(2),
  uniqueUsers: new Set(_specialistBookings.map((b) => b.userId)).size,
};
