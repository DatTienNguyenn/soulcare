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
public class TestResultResponse {
    private UUID id;
    private UUID patientId;
    private UUID testId;
    private String testName;
    private Integer score;
    private Integer maxScore;
    private String level;
    private String description;
    private String answers;
    private LocalDateTime createdAt;
}
