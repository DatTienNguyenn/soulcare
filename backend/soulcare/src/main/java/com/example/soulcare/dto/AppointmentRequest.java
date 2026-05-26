package com.example.soulcare.dto;

import com.example.soulcare.model.BookingType;
import com.example.soulcare.model.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {
    @NotNull(message = "Specialist ID is required")
    private UUID specialistId;

    @NotNull(message = "Scheduled date/time is required")
    private LocalDateTime scheduledAt;

    @NotNull(message = "Booking type is required")
    private BookingType bookingType;

    @NotBlank(message = "Start time is required")
    @Pattern(regexp = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$", message = "Start time must be in HH:MM format")
    private String startTime; // Format: HH:MM

    @NotBlank(message = "End time is required")
    @Pattern(regexp = "^([0-1][0-9]|2[0-3]):[0-5][0-9]$", message = "End time must be in HH:MM format")
    private String endTime; // Format: HH:MM

    @NotNull(message = "Duration is required")
    @Positive(message = "Duration must be positive")
    private Integer duration; // Duration in minutes

    @NotNull(message = "Total price is required")
    private BigDecimal totalPrice;

    @NotBlank(message = "Currency is required")
    @Size(min = 3, max = 3, message = "Currency must be 3 characters")
    private String currency; // USD, EUR, VND, etc.

    private String sessionNotes;

    // Fields for updating appointment status
    private AppointmentStatus status;
    private String cancelledReason;
}
