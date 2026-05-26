package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityRequest {
    @NotNull(message = "Day of week is required")
    @Min(value = 0, message = "Day of week must be 0-6")
    @Max(value = 6, message = "Day of week must be 0-6")
    private Integer dayOfWeek; // 0=Sunday, 1=Monday, ..., 6=Saturday

    @NotBlank(message = "Start time is required")
    @Pattern(regexp = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$", message = "Start time must be in HH:MM format")
    private String startTime; // HH:MM format

    @NotBlank(message = "End time is required")
    @Pattern(regexp = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$", message = "End time must be in HH:MM format")
    private String endTime; // HH:MM format

    @Pattern(regexp = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$|^$", message = "Break time start must be in HH:MM format or empty")
    private String breakTimeStart; // Optional

    @Pattern(regexp = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$|^$", message = "Break time end must be in HH:MM format or empty")
    private String breakTimeEnd; // Optional

    private Boolean active; // true to enable, false to disable
}
