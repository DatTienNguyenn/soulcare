package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiaryFrequencyResponse {
    private List<ActivityFrequencyResponse> frequencies;
    private Integer totalDiaries;
}
