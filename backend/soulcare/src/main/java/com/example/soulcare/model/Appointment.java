package com.example.soulcare.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "appointments")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "specialist_id", nullable = false)
    private UUID specialistId;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Column(name = "booking_type")
    @Enumerated(EnumType.STRING)
    private BookingType bookingType;

    @Column(name = "start_time", length = 5) // Format: HH:MM
    private String startTime;

    @Column(name = "end_time", length = 5) // Format: HH:MM
    private String endTime;

    @Column(name = "duration") // Duration in minutes
    private Integer duration;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "currency", length = 3)
    private String currency; // USD, EUR, VND, etc.

    @Column(name = "session_notes", columnDefinition = "text")
    private String sessionNotes;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "cancelled_reason", columnDefinition = "text")
    private String cancelledReason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
