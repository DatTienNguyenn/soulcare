package com.example.soulcare.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "specialist_session_pricing")
public class SpecialistSessionPricing {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "specialist_id", nullable = false)
    private UUID specialistId;

    @Column(name = "session_type", nullable = false, length = 50)
    private String sessionType; // PSYCHOLOGY, COUNSELING, BEHAVIORAL, MEDITATION, etc.

    @Column(name = "price_per_session", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerSession;

    @Column(name = "duration_minutes")
    private Integer durationMinutes; // Default: 60

    @Column(name = "active")
    private Boolean active; // true/false to enable/disable this pricing

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
