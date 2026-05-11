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
public class MentalHealthTestResponse {
    private UUID id;
    private String name;
    private String shortName;
    private String description;
    private Integer duration; // Duration in minutes
    private Integer totalQuestions;
    private Integer minScore;
    private Integer maxScore;
    private String scoringGuide;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
}
