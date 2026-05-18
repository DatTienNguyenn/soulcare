package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PictureSaveRequest {
    @NotBlank(message = "Drawing data is required")
    private String drawingData; // JSON string with drawing commands

    private String metadata; // JSON string with drawing metadata

    private String description; // User title/description

    private String imageUrl; // Base64 preview or URL (optional)

    private String status; // PUBLISHED, DRAFT, ARCHIVED (default: PUBLISHED)
}
