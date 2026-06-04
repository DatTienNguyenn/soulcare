package com.example.soulcare.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "electronic_health_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElectronicHealthRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "appointment_id", nullable = false)
    private UUID appointmentId;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "specialist_id", nullable = false)
    private UUID specialistId;

    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}