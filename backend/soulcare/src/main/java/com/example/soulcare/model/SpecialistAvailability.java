package com.example.soulcare.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "specialist_availability")
public class SpecialistAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "specialist_id", nullable = false)
    private UUID specialistId;

    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek; // 0=Sunday, 1=Monday, ..., 6=Saturday

    @Column(name = "start_time", nullable = false, length = 5)
    private String startTime; // HH:MM format (e.g., "09:00")

    @Column(name = "end_time", nullable = false, length = 5)
    private String endTime; // HH:MM format (e.g., "17:00")

    @Column(name = "break_time_start", length = 5)
    private String breakTimeStart; // Optional break (e.g., "12:00")

    @Column(name = "break_time_end", length = 5)
    private String breakTimeEnd; // Optional break (e.g., "13:00")

    @Column(name = "active")
    private Boolean active; // true/false to enable/disable this day

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
