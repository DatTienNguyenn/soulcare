package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityResponse {
    private UUID id;
    private UUID specialistId;
    private Integer dayOfWeek; // 0=Sunday, 1=Monday, ..., 6=Saturday
    private String dayName; // "Monday", "Tuesday", etc.
    private String startTime;
    private String endTime;
    private String breakTimeStart;
    private String breakTimeEnd;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
