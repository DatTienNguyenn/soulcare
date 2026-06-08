package com.example.soulcare.repository;

import com.example.soulcare.model.Appointment;
import com.example.soulcare.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    // Find appointments for a specific patient
    List<Appointment> findByPatientIdOrderByScheduledAtDesc(UUID patientId);
    
    // Find appointments for a specific specialist
    List<Appointment> findBySpecialistIdOrderByScheduledAtDesc(UUID specialistId);
    
    // Find appointments for a specialist by status
    List<Appointment> findBySpecialistIdAndStatusOrderByScheduledAtDesc(UUID specialistId, AppointmentStatus status);
    
    // Find completed appointments between dates
    List<Appointment> findBySpecialistIdAndStatusAndCompletedAtBetween(
            UUID specialistId, 
            AppointmentStatus status, 
            LocalDateTime startDate, 
            LocalDateTime endDate);
    
    // Find appointments for a patient with specific status
    List<Appointment> findByPatientIdAndStatusOrderByScheduledAtDesc(UUID patientId, AppointmentStatus status);
    
    // Find appointment by ID and patient ID (for authorization check)
    Optional<Appointment> findByIdAndPatientId(UUID id, UUID patientId);
    
    // Find appointment by ID and specialist ID (for authorization check)
    Optional<Appointment> findByIdAndSpecialistId(UUID id, UUID specialistId);
    
    // Find appointments for specialist in date range
    @Query("SELECT a FROM Appointment a WHERE a.specialistId = :specialistId AND a.scheduledAt BETWEEN :startDate AND :endDate ORDER BY a.scheduledAt DESC")
    List<Appointment> findSpecialistAppointmentsInDateRange(
            @Param("specialistId") UUID specialistId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
    
    // Count appointments by specialist and status
    long countBySpecialistIdAndStatus(UUID specialistId, AppointmentStatus status);
    
    // Count appointments by patient and status
    long countByPatientIdAndStatus(UUID patientId, AppointmentStatus status);
    
    // Find booked appointments for a specialist in date range (excluding cancelled)
    @Query("SELECT a FROM Appointment a WHERE a.specialistId = :specialistId AND a.status != :status AND a.scheduledAt BETWEEN :startDate AND :endDate")
    List<Appointment> findBySpecialistIdAndStatusNotAndScheduledAtBetween(
            @Param("specialistId") UUID specialistId,
            @Param("status") AppointmentStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
