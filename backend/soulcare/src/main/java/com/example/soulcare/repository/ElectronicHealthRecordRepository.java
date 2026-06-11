package com.example.soulcare.repository;

import com.example.soulcare.model.ElectronicHealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ElectronicHealthRecordRepository extends JpaRepository<ElectronicHealthRecord, UUID> {
    List<ElectronicHealthRecord> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
    Optional<ElectronicHealthRecord> findByAppointmentId(UUID appointmentId);
}