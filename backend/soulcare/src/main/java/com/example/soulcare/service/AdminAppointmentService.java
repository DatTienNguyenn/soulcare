package com.example.soulcare.service;

import com.example.soulcare.dto.AppointmentResponse;
import com.example.soulcare.model.Appointment;
import com.example.soulcare.model.AppointmentStatus;
import com.example.soulcare.model.Patient;
import com.example.soulcare.model.Specialist;
import com.example.soulcare.repository.AppointmentRepository;
import com.example.soulcare.repository.PatientRepository;
import com.example.soulcare.repository.SpecialistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminAppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final SpecialistRepository specialistRepository;

    public List<AppointmentResponse> getNoShowAppointments() {
        return appointmentRepository.findAll().stream()
                .filter(apt -> AppointmentStatus.NO_SHOW.equals(apt.getStatus()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse approveNoShow(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setSessionNotes("[ADMIN APPROVED]");
        return mapToResponse(appointmentRepository.save(appointment));
    }

    @Transactional
    public AppointmentResponse declineNoShow(UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setSessionNotes("[ADMIN DECLINED]");
        return mapToResponse(appointmentRepository.save(appointment));
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        String patientName = patientRepository.findById(appointment.getPatientId())
                .map(Patient::getFullName)
                .orElse(null);
        String specialistName = specialistRepository.findById(appointment.getSpecialistId())
                .map(Specialist::getFullName)
                .orElse(null);

        return AppointmentResponse.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatientId())
                .patientName(patientName)
                .specialistId(appointment.getSpecialistId())
                .specialistName(specialistName)
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
                .build();
    }
}