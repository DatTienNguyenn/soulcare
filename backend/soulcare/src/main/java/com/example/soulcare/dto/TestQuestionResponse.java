package com.example.soulcare.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestQuestionResponse {
    private UUID id;
    private UUID testId;
    private String questionText;
    private String questionType;
    private Integer questionOrder;
    private Integer scoreWeight;
    private List<QuestionOptionResponse> options;
}
