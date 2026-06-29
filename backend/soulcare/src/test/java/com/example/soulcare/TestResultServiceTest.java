package com.example.soulcare;

import com.example.soulcare.dto.TestResultRequest;
import com.example.soulcare.dto.TestResultResponse;
import com.example.soulcare.model.MentalHealthTest;
import com.example.soulcare.model.Patient;
import com.example.soulcare.model.TestResult;
import com.example.soulcare.repository.MentalHealthTestRepository;
import com.example.soulcare.repository.PatientRepository;
import com.example.soulcare.repository.TestResultRepository;
import com.example.soulcare.service.TestResultService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TestResultServiceTest {

    @Mock
    private TestResultRepository resultRepository;

    @Mock
    private MentalHealthTestRepository testRepository;

    @Mock
    private PatientRepository patientRepository;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private TestResultService resultService;

    private UUID patientId;
    private UUID testId;
    private MentalHealthTest test;
    private TestResultRequest request;
    private TestResult result;

    @BeforeEach
    void setUp() {
        patientId = UUID.randomUUID();
        testId = UUID.randomUUID();

        String scoringGuide = "{\"Normal\":{\"min\":0,\"max\":9},\"Mild\":{\"min\":10,\"max\":13}}";

        test = MentalHealthTest.builder()
                .id(testId)
                .name("PHQ-9")
                .maxScore(27)
                .scoringGuide(scoringGuide)
                .build();

        request = new TestResultRequest();
        request.setTestId(testId.toString());
        request.setAnswers(Map.of("q1", 1, "q2", 2, "q3", 3)); // score = 6

        result = TestResult.builder()
                .id(UUID.randomUUID())
                .patientId(patientId)
                .testId(testId)
                .score(6)
                .level("Normal")
                .build();
    }

    @Test
    @DisplayName("Submit Test: Should calculate score and level correctly and save the result")
    void submitTestResult_shouldCalculateScoreAndLevelCorrectly() {
        // Arrange
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));
        // Return the actual object that was passed to the save method
        when(resultRepository.save(any(TestResult.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        TestResultResponse response = resultService.submitTestResult(patientId, request);

        // Assert
        assertNotNull(response);
        assertEquals(6, response.getScore());
        assertEquals("Normal", response.getLevel());
        assertEquals(test.getMaxScore(), response.getMaxScore());
        verify(testRepository, times(1)).findById(testId);
        ArgumentCaptor<TestResult> resultCaptor = ArgumentCaptor.forClass(TestResult.class);
        verify(resultRepository, times(1)).save(resultCaptor.capture());

        TestResult savedResult = resultCaptor.getValue();
        assertEquals(patientId, savedResult.getPatientId());
        assertEquals(6, savedResult.getScore());
        assertEquals("Normal", savedResult.getLevel());
    }

    @Test
    @DisplayName("Get Result: Should return result for the correct patient")
    void getTestResult_shouldReturnResultForCorrectPatient() {
        // Arrange
        when(resultRepository.findById(result.getId())).thenReturn(Optional.of(result));

        // Act
        TestResultResponse response = resultService.getTestResult(result.getId(), patientId);

        // Assert
        assertNotNull(response);
        assertEquals(result.getId(), response.getId());
        verify(resultRepository, times(1)).findById(result.getId());
    }

    @Test
    @DisplayName("Get Result: Should throw exception if patient ID does not match")
    void getTestResult_shouldThrowExceptionForIncorrectPatient() {
        // Arrange
        UUID wrongPatientId = UUID.randomUUID();
        when(resultRepository.findById(result.getId())).thenReturn(Optional.of(result));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> resultService.getTestResult(result.getId(), wrongPatientId));
        verify(resultRepository, times(1)).findById(result.getId());
    }

    @Test
    @DisplayName("Get Public Results: Should return results for a public patient profile")
    void getPublicPatientTestResultsForSpecialist_shouldReturnResultsWhenPublic() {
        // Arrange
        Patient patient = new Patient();
        patient.setId(patientId);
        patient.setPublish(true);
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(resultRepository.findByPatientId(patientId)).thenReturn(List.of(result));

        // Act
        List<TestResultResponse> responses = resultService.getPublicPatientTestResultsForSpecialist(patientId);

        // Assert
        assertFalse(responses.isEmpty());
        assertEquals(1, responses.size());
        verify(patientRepository, times(1)).findById(patientId);
        verify(resultRepository, times(1)).findByPatientId(patientId);
    }

    @Test
    @DisplayName("Get Public Results: Should return empty list for a private patient profile")
    void getPublicPatientTestResultsForSpecialist_shouldReturnEmptyWhenNotPublic() {
        // Arrange
        Patient patient = new Patient();
        patient.setId(patientId);
        patient.setPublish(false);
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));

        // Act
        List<TestResultResponse> responses = resultService.getPublicPatientTestResultsForSpecialist(patientId);

        // Assert
        assertTrue(responses.isEmpty());
        verify(patientRepository, times(1)).findById(patientId);
        verify(resultRepository, never()).findByPatientId(patientId);
    }
}
