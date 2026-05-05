package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestResultRequest {
    @NotNull(message = "Test ID is required")
    private String testId;

    @NotNull(message = "Answers are required")
    private Map<String, Integer> answers; // questionId -> answer value

    private String notes;
}
