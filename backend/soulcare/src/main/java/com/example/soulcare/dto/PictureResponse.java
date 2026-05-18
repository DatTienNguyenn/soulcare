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
public class PictureResponse {
    private UUID id;

    private UUID patientId;

    private String drawingData; // Full drawing JSON for restoration

    private String metadata; // Metadata JSON

    private String description;

    private String imageUrl;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime lastUpdate;
}
