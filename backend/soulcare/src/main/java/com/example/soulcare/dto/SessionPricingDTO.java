package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionPricingDTO {
    private UUID id;
    private UUID specialistId;
    private String sessionType;
    private BigDecimal pricePerSession;
    private Integer durationMinutes;
    private Boolean active;
}
