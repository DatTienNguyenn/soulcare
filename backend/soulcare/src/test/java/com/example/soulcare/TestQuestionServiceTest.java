package com.example.soulcare;

import com.example.soulcare.dto.QuestionOptionRequest;
import com.example.soulcare.dto.TestQuestionRequest;
import com.example.soulcare.dto.TestQuestionResponse;
import com.example.soulcare.model.QuestionOption;
import com.example.soulcare.model.TestQuestion;
import com.example.soulcare.repository.QuestionOptionRepository;
import com.example.soulcare.repository.TestQuestionRepository;
import com.example.soulcare.service.TestQuestionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TestQuestionServiceTest {

    @Mock
    private TestQuestionRepository testQuestionRepository;

    @Mock
    private QuestionOptionRepository questionOptionRepository;

    @InjectMocks
    private TestQuestionService testQuestionService;

    private UUID testId;
    private UUID questionId;
    private TestQuestion question;
    private TestQuestionRequest request;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        questionId = UUID.randomUUID();

        question = TestQuestion.builder()
                .id(questionId)
                .testId(testId)
                .questionText("Sample question?")
                .questionType(TestQuestion.QuestionType.MULTIPLE_CHOICE)
                .questionOrder(1)
                .options(new ArrayList<>())
                .build();

        request = new TestQuestionRequest();
        request.setQuestionText("Sample question?");
        request.setQuestionType("MULTIPLE_CHOICE");
        request.setQuestionOrder(1);

        QuestionOptionRequest optionRequest = new QuestionOptionRequest();
        optionRequest.setOptionText("Option 1");
        optionRequest.setOptionValue(1);
        optionRequest.setOptionOrder(1);
        request.setOptions(List.of(optionRequest));
    }

    @Test
    void createQuestion_shouldReturnCreatedQuestionWithOptions() {
        // Arrange
        when(testQuestionRepository.save(any(TestQuestion.class))).thenAnswer(invocation -> {
            TestQuestion q = invocation.getArgument(0);
            q.setId(questionId); // Simulate saving and getting an ID
            if (q.getOptions() != null) {
                q.getOptions().forEach(opt -> opt.setQuestionId(q.getId()));
            }
            return q;
        });

        // Act
        TestQuestionResponse response = testQuestionService.createQuestion(testId, request);

        // Assert
        assertNotNull(response);
        assertEquals(request.getQuestionText(), response.getQuestionText());
        assertFalse(response.getOptions().isEmpty());
        assertEquals(1, response.getOptions().size());
        assertEquals("Option 1", response.getOptions().get(0).getOptionText());
        verify(testQuestionRepository, times(2)).save(any(TestQuestion.class)); // Once for question, once for options
    }

    @Test
    void getTestQuestions_shouldReturnListOfQuestions() {
        // Arrange
        when(testQuestionRepository.findByTestIdOrderByQuestionOrderAsc(testId)).thenReturn(List.of(question));

        // Act
        List<TestQuestionResponse> responses = testQuestionService.getTestQuestions(testId);

        // Assert
        assertFalse(responses.isEmpty());
        assertEquals(1, responses.size());
        assertEquals(question.getQuestionText(), responses.get(0).getQuestionText());
        verify(testQuestionRepository, times(1)).findByTestIdOrderByQuestionOrderAsc(testId);
    }

    @Test
    void deleteQuestion_shouldCompleteSuccessfully() {
        // Arrange
        when(testQuestionRepository.findByTestIdAndId(testId, questionId)).thenReturn(Optional.of(question));
        doNothing().when(testQuestionRepository).deleteByTestIdAndId(testId, questionId);

        // Act
        testQuestionService.deleteQuestion(testId, questionId);

        // Assert
        verify(testQuestionRepository, times(1)).findByTestIdAndId(testId, questionId);
        verify(testQuestionRepository, times(1)).deleteByTestIdAndId(testId, questionId);
    }
}

