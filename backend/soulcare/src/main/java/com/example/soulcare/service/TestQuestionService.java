package com.example.soulcare.service;

import com.example.soulcare.dto.TestQuestionRequest;
import com.example.soulcare.dto.TestQuestionResponse;
import com.example.soulcare.model.TestQuestion;
import com.example.soulcare.model.QuestionOption;
import com.example.soulcare.repository.TestQuestionRepository;
import com.example.soulcare.repository.QuestionOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestQuestionService {
    private final TestQuestionRepository testQuestionRepository;
    private final QuestionOptionRepository questionOptionRepository;

    @Transactional
    public TestQuestionResponse createQuestion(UUID testId, TestQuestionRequest request) {
        TestQuestion question = TestQuestion.builder()
                .testId(testId)
                .questionText(request.getQuestionText())
                .questionType(TestQuestion.QuestionType.valueOf(request.getQuestionType()))
                .questionOrder(request.getQuestionOrder())
                .scoreWeight(request.getScoreWeight() != null ? request.getScoreWeight() : 1)
                .build();

        TestQuestion savedQuestion = testQuestionRepository.save(question);

        // Save options if provided
        if (request.getOptions() != null && !request.getOptions().isEmpty()) {
            List<QuestionOption> options = request.getOptions().stream()
                    .map(optRequest -> QuestionOption.builder()
                            .questionId(savedQuestion.getId())
                            .optionText(optRequest.getOptionText())
                            .optionValue(optRequest.getOptionValue())
                            .optionOrder(optRequest.getOptionOrder())
                            .build())
                    .collect(Collectors.toList());
            savedQuestion.setOptions(questionOptionRepository.saveAll(options));
        } else {
            savedQuestion.setOptions(List.of());
        }

        return mapToResponse(savedQuestion);
    }

    public List<TestQuestionResponse> getTestQuestions(UUID testId) {
        return testQuestionRepository.findByTestIdOrderByQuestionOrderAsc(testId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TestQuestionResponse getQuestion(UUID testId, UUID questionId) {
        TestQuestion question = testQuestionRepository.findByTestIdAndId(testId, questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return mapToResponse(question);
    }

    @Transactional
    public TestQuestionResponse updateQuestion(UUID testId, UUID questionId, TestQuestionRequest request) {
        TestQuestion question = testQuestionRepository.findByTestIdAndId(testId, questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setQuestionText(request.getQuestionText());
        question.setQuestionType(TestQuestion.QuestionType.valueOf(request.getQuestionType()));
        question.setQuestionOrder(request.getQuestionOrder());
        question.setScoreWeight(request.getScoreWeight() != null ? request.getScoreWeight() : 1);

        // Update options if provided
        if (request.getOptions() != null) {
            questionOptionRepository.deleteByQuestionId(questionId);
            List<QuestionOption> newOptions = request.getOptions().stream()
                    .map(optRequest -> QuestionOption.builder()
                            .questionId(questionId)
                            .optionText(optRequest.getOptionText())
                            .optionValue(optRequest.getOptionValue())
                            .optionOrder(optRequest.getOptionOrder())
                            .build())
                    .collect(Collectors.toList());
            question.setOptions(questionOptionRepository.saveAll(newOptions));
        } else {
            question.setOptions(List.of());
        }

        TestQuestion updated = testQuestionRepository.save(question);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteQuestion(UUID testId, UUID questionId) {
        testQuestionRepository.findByTestIdAndId(testId, questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        testQuestionRepository.deleteByTestIdAndId(testId, questionId);
    }

    private TestQuestionResponse mapToResponse(TestQuestion question) {
        return TestQuestionResponse.builder()
                .id(question.getId())
                .testId(question.getTestId())
                .questionText(question.getQuestionText())
                .questionType(question.getQuestionType().toString())
                .questionOrder(question.getQuestionOrder())
                .scoreWeight(question.getScoreWeight())
                .options(question.getOptions() != null ? question.getOptions().stream()
                        .map(opt -> new com.example.soulcare.dto.QuestionOptionResponse(
                                opt.getId(),
                                opt.getQuestionId(),
                                opt.getOptionText(),
                                opt.getOptionValue(),
                                opt.getOptionOrder()))
                        .collect(Collectors.toList()) : List.of())
                .build();
    }
}
