package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MentalHealthTestRequest {
    @NotBlank(message = "Test name is required")
    private String name;

    private String shortName;

    private String description;

    @PositiveOrZero(message = "Duration must be zero or positive")
    private Integer duration; // Duration in minutes

    @PositiveOrZero(message = "Total questions must be zero or positive")
    private Integer totalQuestions;

    @PositiveOrZero(message = "Min score must be zero or positive")
    private Integer minScore;

    @PositiveOrZero(message = "Max score must be zero or positive")
    private Integer maxScore;

    private String scoringGuide; // JSON string

    private String status; // ACTIVE, INACTIVE, ARCHIVED
}
