package com.example.soulcare.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableSlotDTO {
    private UUID id;
    private UUID specialistId;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    
    private String startTime; // HH:MM format
    private String endTime;   // HH:MM format
    
    private String status; // "available" or "booked"
    private BigDecimal price;
    
    // Optional: session type for display
    private String sessionType;
}
