package com.example.soulcare.service;

import com.example.soulcare.dto.AppointmentRequest;
import com.example.soulcare.dto.AppointmentResponse;
import com.example.soulcare.model.*;
import com.example.soulcare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final SpecialistRepository specialistRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final ReviewRepository reviewRepository;
    private final ElectronicHealthRecordRepository ehrRepository;

    /**
     * Create a new appointment (booking)
     */
    public AppointmentResponse createAppointment(UUID patientId, AppointmentRequest request) {
        // Validate specialist exists
        Specialist specialist = specialistRepository.findById(request.getSpecialistId())
                .orElseThrow(() -> new RuntimeException("Specialist not found"));

        // Validate patient exists
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Create appointment with PENDING status initially
        Appointment appointment = Appointment.builder()
                .patientId(patientId)
                .specialistId(request.getSpecialistId())
                .scheduledAt(request.getScheduledAt())
                .bookingType(request.getBookingType())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .duration(request.getDuration())
                .totalPrice(request.getTotalPrice())
                .currency(request.getCurrency())
                .sessionNotes(request.getSessionNotes())
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(savedAppointment, patient, specialist);
    }

    /**
     * Get all appointments for a specialist
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getSpecialistAppointments(UUID specialistId) {
        Specialist specialist = specialistRepository.findById(specialistId)
                .orElseThrow(() -> new RuntimeException("Specialist not found"));

        List<Appointment> appointments = appointmentRepository.findBySpecialistIdOrderByScheduledAtDesc(specialistId);
        return appointments.stream()
                .map(apt -> {
                    Patient patient = patientRepository.findById(apt.getPatientId()).orElse(null);
                    return mapToResponse(apt, patient, specialist);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get appointments for a specialist filtered by status
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getSpecialistAppointmentsByStatus(UUID specialistId, AppointmentStatus status) {
        Specialist specialist = specialistRepository.findById(specialistId)
                .orElseThrow(() -> new RuntimeException("Specialist not found"));

        List<Appointment> appointments = appointmentRepository
                .findBySpecialistIdAndStatusOrderByScheduledAtDesc(specialistId, status);
        return appointments.stream()
                .map(apt -> {
                    Patient patient = patientRepository.findById(apt.getPatientId()).orElse(null);
                    return mapToResponse(apt, patient, specialist);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get all appointments for a patient
     */
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getPatientAppointments(UUID patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        List<Appointment> appointments = appointmentRepository.findByPatientIdOrderByScheduledAtDesc(patientId);
        return appointments.stream()
                .map(apt -> {
                    Specialist specialist = specialistRepository.findById(apt.getSpecialistId()).orElse(null);
                    return mapToResponse(apt, patient, specialist);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get appointment by ID (with authorization check)
     */
    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentAsPatient(UUID patientId, UUID appointmentId) {
        Appointment appointment = appointmentRepository.findByIdAndPatientId(appointmentId, patientId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Patient patient = patientRepository.findById(patientId).orElse(null);
        Specialist specialist = specialistRepository.findById(appointment.getSpecialistId()).orElse(null);

        return mapToResponse(appointment, patient, specialist);
    }

    /**
     * Get appointment by ID as specialist
     */
    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentAsSpecialist(UUID specialistId, UUID appointmentId) {
        Appointment appointment = appointmentRepository.findByIdAndSpecialistId(appointmentId, specialistId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Patient patient = patientRepository.findById(appointment.getPatientId()).orElse(null);
        Specialist specialist = specialistRepository.findById(specialistId).orElse(null);

        return mapToResponse(appointment, patient, specialist);
    }

    /**
     * Update appointment (can be called by patient to add notes before session)
     */
    public AppointmentResponse updateAppointment(UUID patientId, UUID appointmentId, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findByIdAndPatientId(appointmentId, patientId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Only allow certain fields to be updated
        if (request.getSessionNotes() != null) {
            appointment.setSessionNotes(request.getSessionNotes());
        }
        if (request.getStartTime() != null) {
            appointment.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            appointment.setEndTime(request.getEndTime());
        }

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        Patient patient = patientRepository.findById(patientId).orElse(null);
        Specialist specialist = specialistRepository.findById(appointment.getSpecialistId()).orElse(null);

        return mapToResponse(updatedAppointment, patient, specialist);
    }

    /**
     * Confirm appointment by specialist
     */
    public AppointmentResponse confirmAppointment(UUID specialistId, UUID appointmentId) {
        Appointment appointment = appointmentRepository.findByIdAndSpecialistId(appointmentId, specialistId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.CONFIRMED);
        Appointment updated = appointmentRepository.save(appointment);

        Patient patient = patientRepository.findById(appointment.getPatientId()).orElse(null);
        Specialist specialist = specialistRepository.findById(specialistId).orElse(null);

        return mapToResponse(updated, patient, specialist);
    }

    /**
     * Complete appointment by specialist
     */
    public AppointmentResponse completeAppointment(UUID specialistId, UUID appointmentId, String sessionNotes) {
        Appointment appointment = appointmentRepository.findByIdAndSpecialistId(appointmentId, specialistId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setCompletedAt(LocalDateTime.now());
        if (sessionNotes != null) {
            appointment.setSessionNotes(sessionNotes);
        }

        Appointment updated = appointmentRepository.save(appointment);
        Patient patient = patientRepository.findById(appointment.getPatientId()).orElse(null);
        Specialist specialist = specialistRepository.findById(specialistId).orElse(null);

        return mapToResponse(updated, patient, specialist);
    }

    /**
     * Cancel appointment
     */
    public AppointmentResponse cancelAppointment(UUID appointmentId, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancelledReason(reason);
        appointment.setSessionNotes(reason); // Store in sessionNotes as well

        Appointment updated = appointmentRepository.save(appointment);
        Patient patient = patientRepository.findById(appointment.getPatientId()).orElse(null);
        Specialist specialist = specialistRepository.findById(appointment.getSpecialistId()).orElse(null);

        return mapToResponse(updated, patient, specialist);
    }

    /**
     * Mark appointment as NO_SHOW
     */
    public AppointmentResponse markNoShow(UUID appointmentId, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(AppointmentStatus.NO_SHOW);
        appointment.setCancelledReason(reason); // Store in cancelledReason

        Appointment updated = appointmentRepository.save(appointment);
        Patient patient = patientRepository.findById(appointment.getPatientId()).orElse(null);
        Specialist specialist = specialistRepository.findById(appointment.getSpecialistId()).orElse(null);

        return mapToResponse(updated, patient, specialist);
    }

    /**
     * Add or update review for a completed appointment
     */
    public AppointmentResponse addReview(UUID patientId, UUID appointmentId, Integer rating, String comment) {
        Appointment appointment = appointmentRepository.findByIdAndPatientId(appointmentId, patientId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new RuntimeException("Can only review pending appointments");
        }

        // Create or update review
        Review review = reviewRepository.findByAppointmentId(appointmentId)
                .orElse(Review.builder().appointmentId(appointmentId).build());

        review.setRating(rating);
        review.setComment(comment);
        reviewRepository.save(review);

        // Update appointment status to CONFIRMED
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        appointment = appointmentRepository.save(appointment);

        Patient patient = patientRepository.findById(patientId).orElse(null);
        Specialist specialist = specialistRepository.findById(appointment.getSpecialistId()).orElse(null);

        return mapToResponse(appointment, patient, specialist);
    }

    /**
     * Add or update Electronic Health Record (EHR) for an appointment
     */
    public ElectronicHealthRecord addElectronicHealthRecord(UUID specialistId, UUID appointmentId, String diagnosis, String treatmentPlan) {
        Appointment appointment = appointmentRepository.findByIdAndSpecialistId(appointmentId, specialistId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Create or update EHR
        ElectronicHealthRecord ehr = ehrRepository.findByAppointmentId(appointmentId)
                .orElse(ElectronicHealthRecord.builder()
                        .appointmentId(appointmentId)
                        .patientId(appointment.getPatientId())
                        .specialistId(specialistId)
                        .build());

        ehr.setDiagnosis(diagnosis);
        ehr.setTreatmentPlan(treatmentPlan);
        ehrRepository.save(ehr);

        
        // Update appointment status to COMPLETED
        if (appointment.getStatus() == AppointmentStatus.CONFIRMED) {
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment = appointmentRepository.save(appointment);
        }

        return ehr;
    }

    /**
     * Helper method to convert Appointment to AppointmentResponse
     */
    private AppointmentResponse mapToResponse(Appointment appointment, Patient patient, Specialist specialist) {
        User patientUser = patient != null ? userRepository.findById(patient.getUserId()).orElse(null) : null;
        User specialistUser = specialist != null ? userRepository.findById(specialist.getUserId()).orElse(null) : null;

        // Get review if exists
        Optional<Review> review = reviewRepository.findByAppointmentId(appointment.getId());

        AppointmentResponse response = AppointmentResponse.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatientId())
                .specialistId(appointment.getSpecialistId())
                .scheduledAt(appointment.getScheduledAt())
                .bookingType(appointment.getBookingType())
                .startTime(appointment.getStartTime())
                .endTime(appointment.getEndTime())
                .duration(appointment.getDuration())
                .status(appointment.getStatus())
                .totalPrice(appointment.getTotalPrice())
                .currency(appointment.getCurrency())
                .sessionNotes(appointment.getSessionNotes())
                .completedAt(appointment.getCompletedAt())
                .cancelledReason(appointment.getCancelledReason())
                .createdAt(appointment.getCreatedAt())
                .patientName(patient != null ? patient.getFullName() : null)
                .patientAvatar(patientUser != null ? patientUser.getAvatarUrl() : null)
                .patientEmail(patientUser != null ? patientUser.getEmail() : null)
                .specialistName(specialist != null ? specialist.getFullName() : null)
                .specialistEmail(specialistUser != null ? specialistUser.getEmail() : null)
                .specialistRating(specialist != null ? specialist.getRatingAverage() != null ? 
                        specialist.getRatingAverage().doubleValue() : null : null)
                .build();

        // Add review information if available
        review.ifPresent(r -> {
            response.setReviewRating(r.getRating());
            response.setReviewComment(r.getComment());
        });

        return response;
    }

    /**
     * Get specialist booking statistics
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getSpecialistStats(UUID specialistId) {
        Map<String, Object> stats = new HashMap<>();
        
        long totalBookings = appointmentRepository.countBySpecialistIdAndStatus(specialistId, AppointmentStatus.CONFIRMED);
        long completedBookings = appointmentRepository.countBySpecialistIdAndStatus(specialistId, AppointmentStatus.COMPLETED);
        long cancelledBookings = appointmentRepository.countBySpecialistIdAndStatus(specialistId, AppointmentStatus.CANCELLED);

        stats.put("totalBookings", totalBookings);
        stats.put("completedBookings", completedBookings);
        stats.put("cancelledBookings", cancelledBookings);
        stats.put("pendingBookings", appointmentRepository.countBySpecialistIdAndStatus(specialistId, AppointmentStatus.PENDING));

        return stats;
    }
}
