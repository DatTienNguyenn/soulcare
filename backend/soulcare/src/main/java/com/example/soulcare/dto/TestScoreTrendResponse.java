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
public class TestScoreTrendResponse {
    private UUID id;
    private UUID testId;
    private String testName;
    private Integer score;
    private Integer maxScore;
    private String level;
    private LocalDateTime date;
}
