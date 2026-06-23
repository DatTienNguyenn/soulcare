package com.example.soulcare.dto;

import com.example.soulcare.model.BookingType;
import com.example.soulcare.model.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {
    private UUID id;
    private UUID patientId;
    private UUID specialistId;
    private LocalDateTime scheduledAt;
    private BookingType bookingType;
    private String startTime;
    private String endTime;
    private Integer duration;
    private AppointmentStatus status;
    private BigDecimal totalPrice;
    private String currency;
    private String sessionNotes;
    private LocalDateTime completedAt;
    private String cancelledReason;
    private LocalDateTime createdAt;
    
    // Additional fields for detail view
    private String patientName;
    private String patientEmail;
    private String patientAvatar;
    private String specialistName;
    private String specialistAvatar;
    private String specialistEmail;
    private Double specialistRating;
    
    // Review information if available
    private Integer reviewRating;
    private String reviewComment;
}
