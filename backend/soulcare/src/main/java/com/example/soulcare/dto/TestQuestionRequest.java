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
public class TestQuestionRequest {
    private String questionText;
    private String questionType; // MULTIPLE_CHOICE, RATING_SCALE, TEXT
    private Integer questionOrder;
    private Integer scoreWeight;
    private List<QuestionOptionRequest> options;
}
