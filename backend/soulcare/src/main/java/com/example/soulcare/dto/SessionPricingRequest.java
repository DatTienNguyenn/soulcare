package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionPricingRequest {
    @NotBlank(message = "Session type is required")
    private String sessionType; // PSYCHOLOGY, COUNSELING, BEHAVIORAL, MEDITATION, etc.

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal pricePerSession;

    @NotNull(message = "Duration is required")
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    @Max(value = 480, message = "Duration cannot exceed 480 minutes")
    private Integer durationMinutes; // 15-480 minutes

    private Boolean active; // true to enable, false to disable
}
