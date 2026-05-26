package com.example.soulcare.controller;

import com.example.soulcare.dto.AppointmentRequest;
import com.example.soulcare.dto.AppointmentResponse;
import com.example.soulcare.model.AppointmentStatus;
import com.example.soulcare.repository.PatientRepository;
import com.example.soulcare.repository.SpecialistRepository;
import com.example.soulcare.repository.UserRepository;
import com.example.soulcare.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentService appointmentService;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final SpecialistRepository specialistRepository;

    /**
     * Create a new appointment (patient books a specialist)
     */
    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        AppointmentResponse response = appointmentService.createAppointment(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all appointments for the authenticated patient
     */
    @GetMapping("/patient")
    public ResponseEntity<List<AppointmentResponse>> getPatientAppointments(Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        List<AppointmentResponse> appointments = appointmentService.getPatientAppointments(patientId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get appointment details for patient
     */
    @GetMapping("/patient/{appointmentId}")
    public ResponseEntity<AppointmentResponse> getPatientAppointment(
            @PathVariable UUID appointmentId,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        AppointmentResponse response = appointmentService.getAppointmentAsPatient(patientId, appointmentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Update appointment (patient can add notes, etc.)
     */
    @PutMapping("/{appointmentId}")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @PathVariable UUID appointmentId,
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        AppointmentResponse response = appointmentService.updateAppointment(patientId, appointmentId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all appointments for the authenticated specialist
     */
    @GetMapping("/specialist")
    public ResponseEntity<List<AppointmentResponse>> getSpecialistAppointments(Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        List<AppointmentResponse> appointments = appointmentService.getSpecialistAppointments(specialistId);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get specialist appointments filtered by status
     */
    @GetMapping("/specialist/status/{status}")
    public ResponseEntity<List<AppointmentResponse>> getSpecialistAppointmentsByStatus(
            @PathVariable String status,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        AppointmentStatus appointmentStatus = AppointmentStatus.valueOf(status.toUpperCase());
        List<AppointmentResponse> appointments = appointmentService.getSpecialistAppointmentsByStatus(specialistId, appointmentStatus);
        return ResponseEntity.ok(appointments);
    }

    /**
     * Get appointment details for specialist
     */
    @GetMapping("/specialist/{appointmentId}")
    public ResponseEntity<AppointmentResponse> getSpecialistAppointment(
            @PathVariable UUID appointmentId,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        AppointmentResponse response = appointmentService.getAppointmentAsSpecialist(specialistId, appointmentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Specialist confirms an appointment
     */
    @PostMapping("/{appointmentId}/confirm")
    public ResponseEntity<AppointmentResponse> confirmAppointment(
            @PathVariable UUID appointmentId,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        AppointmentResponse response = appointmentService.confirmAppointment(specialistId, appointmentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Specialist completes an appointment
     */
    @PostMapping("/{appointmentId}/complete")
    public ResponseEntity<AppointmentResponse> completeAppointment(
            @PathVariable UUID appointmentId,
            @RequestBody(required = false) Map<String, String> body,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        String sessionNotes = body != null ? body.get("sessionNotes") : null;
        AppointmentResponse response = appointmentService.completeAppointment(specialistId, appointmentId, sessionNotes);
        return ResponseEntity.ok(response);
    }

    /**
     * Cancel an appointment (can be called by either party)
     */
    @PostMapping("/{appointmentId}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            @PathVariable UUID appointmentId,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : null;
        AppointmentResponse response = appointmentService.cancelAppointment(appointmentId, reason);
        return ResponseEntity.ok(response);
    }

    /**
     * Mark appointment as no-show
     */
    @PostMapping("/{appointmentId}/no-show")
    public ResponseEntity<AppointmentResponse> markNoShow(@PathVariable UUID appointmentId) {
        AppointmentResponse response = appointmentService.markNoShow(appointmentId);
        return ResponseEntity.ok(response);
    }

    /**
     * Add or update review for a completed appointment
     */
    @PostMapping("/{appointmentId}/review")
    public ResponseEntity<AppointmentResponse> addReview(
            @PathVariable UUID appointmentId,
            @RequestBody Map<String, Object> body,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        Integer rating = ((Number) body.get("rating")).intValue();
        String comment = (String) body.get("comment");
        
        AppointmentResponse response = appointmentService.addReview(patientId, appointmentId, rating, comment);
        return ResponseEntity.ok(response);
    }

    /**
     * Get specialist booking statistics
     */
    @GetMapping("/specialist/stats")
    public ResponseEntity<Map<String, Object>> getSpecialistStats(Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        Map<String, Object> stats = appointmentService.getSpecialistStats(specialistId);
        return ResponseEntity.ok(stats);
    }

    /**
     * Helper method to get patient ID from authentication
     */
    private UUID getPatientIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        var patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return patient.getId();
    }

    /**
     * Helper method to get specialist ID from authentication
     */
    private UUID getSpecialistIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        var specialist = specialistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Specialist not found"));
        return specialist.getId();
    }
}
