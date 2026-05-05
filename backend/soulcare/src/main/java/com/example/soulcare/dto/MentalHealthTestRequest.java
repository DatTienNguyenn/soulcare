package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentalHealthTestRequest {
    @NotBlank(message = "Test name is required")
    private String name;

    private String shortName;

    private String description;

    private String duration;

    @Positive(message = "Total questions must be positive")
    private Integer totalQuestions;

    @Positive(message = "Min score must be positive")
    private Integer minScore;

    @Positive(message = "Max score must be positive")
    private Integer maxScore;

    private String scoringGuide; // JSON string

    private String status; // ACTIVE, INACTIVE, ARCHIVED
}
