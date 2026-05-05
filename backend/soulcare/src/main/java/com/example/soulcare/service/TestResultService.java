package com.example.soulcare.service;

import com.example.soulcare.dto.TestResultRequest;
import com.example.soulcare.dto.TestResultResponse;
import com.example.soulcare.model.TestResult;
import com.example.soulcare.repository.TestResultRepository;
import com.example.soulcare.repository.MentalHealthTestRepository;
import com.example.soulcare.model.MentalHealthTest;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TestResultService {
    private final TestResultRepository resultRepository;
    private final MentalHealthTestRepository testRepository;
    private final ObjectMapper objectMapper;

    public TestResultResponse submitTestResult(UUID patientId, TestResultRequest request) {
        UUID testId = UUID.fromString(request.getTestId());
        
        MentalHealthTest test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        try {
            String answersJson = objectMapper.writeValueAsString(request.getAnswers());
            
            TestResult result = TestResult.builder()
                    .patientId(patientId)
                    .testId(testId)
                    .testName(test.getName())
                    .answers(answersJson)
                    .build();

            // Calculate score (this is a simple sum, you may need to customize based on test logic)
            Integer score = request.getAnswers().values().stream()
                    .mapToInt(Integer::intValue)
                    .sum();
            
            result.setScore(score);
            result.setMaxScore(test.getMaxScore());

            TestResult savedResult = resultRepository.save(result);
            return mapToResponse(savedResult);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save test result: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public TestResultResponse getTestResult(UUID resultId, UUID patientId) {
        TestResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Test result not found"));
        
        if (!result.getPatientId().equals(patientId)) {
            throw new RuntimeException("Unauthorized access to test result");
        }
        
        return mapToResponse(result);
    }

    @Transactional(readOnly = true)
    public List<TestResultResponse> getPatientTestResults(UUID patientId) {
        List<TestResult> results = resultRepository.findByPatientId(patientId);
        return results.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TestResultResponse> getPatientTestResultsByTest(UUID patientId, UUID testId) {
        List<TestResult> results = resultRepository.findByPatientIdAndTestId(patientId, testId);
        return results.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteTestResult(UUID resultId, UUID patientId) {
        TestResult result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Test result not found"));
        
        if (!result.getPatientId().equals(patientId)) {
            throw new RuntimeException("Unauthorized access to test result");
        }
        
        resultRepository.delete(result);
    }

    private TestResultResponse mapToResponse(TestResult result) {
        return TestResultResponse.builder()
                .id(result.getId())
                .patientId(result.getPatientId())
                .testId(result.getTestId())
                .testName(result.getTestName())
                .score(result.getScore())
                .maxScore(result.getMaxScore())
                .level(result.getLevel())
                .description(result.getDescription())
                .answers(result.getAnswers())
                .createdAt(result.getCreatedAt())
                .build();
    }
}
