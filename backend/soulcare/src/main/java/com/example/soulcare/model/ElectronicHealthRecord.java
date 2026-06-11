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

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "specialist_id", nullable = false)
    private UUID specialistId;

    @Column(name = "appointment_id", nullable = false)
    private UUID appointmentId;

    @Column(nullable = false, columnDefinition = "text")
    private String diagnosis;

    @Column(name = "treatment_plan", columnDefinition = "text")
    private String treatmentPlan;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}