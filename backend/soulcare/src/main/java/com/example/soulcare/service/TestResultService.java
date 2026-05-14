package com.example.soulcare.service;

import com.example.soulcare.dto.TestResultRequest;
import com.example.soulcare.dto.TestResultResponse;
import com.example.soulcare.dto.TestScoreTrendResponse;
import com.example.soulcare.dto.TestResultHistoryResponse;
import com.example.soulcare.model.TestResult;
import com.example.soulcare.repository.TestResultRepository;
import com.example.soulcare.repository.MentalHealthTestRepository;
import com.example.soulcare.model.MentalHealthTest;
import com.fasterxml.jackson.databind.JsonNode;
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

            // Calculate score (sum only numeric values, ignore string answers)
            Integer score = request.getAnswers().values().stream()
                    .filter(v -> v instanceof Number)
                    .mapToInt(v -> ((Number) v).intValue())
                    .sum();
            
            result.setScore(score);
            result.setMaxScore(test.getMaxScore());

            // Determine level and description based on scoring guide
            if (test.getScoringGuide() != null && !test.getScoringGuide().isEmpty()) {
                ScoringLevelResult levelResult = determineLevelFromScoringGuide(score, test.getScoringGuide());
                result.setLevel(levelResult.level);
                result.setDescription(levelResult.description);
            }

            TestResult savedResult = resultRepository.save(result);
            return mapToResponse(savedResult);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save test result: " + e.getMessage());
        }
    }

    /**
     * Determine the level (normal/mild/moderate/severe/very severe) based on score and scoring guide
     */
    private ScoringLevelResult determineLevelFromScoringGuide(Integer score, String scoringGuideJson) {
        try {
            JsonNode scoreGuide = objectMapper.readTree(scoringGuideJson);
            
            // Iterate through all levels in the scoring guide
            for (java.util.Iterator<String> it = scoreGuide.fieldNames(); it.hasNext(); ) {
                String levelName = it.next();
                JsonNode levelNode = scoreGuide.get(levelName);
                
                int minScore = levelNode.get("min").asInt();
                int maxScore = levelNode.get("max").asInt();
                String description = levelNode.has("description") ? levelNode.get("description").asText() : "";
                
                // Check if score falls within this level's range
                if (score >= minScore && score <= maxScore) {
                    return new ScoringLevelResult(levelName, description);
                }
            }
            
            // If no level matches, return the highest level as default
            return new ScoringLevelResult("Very Severe", "");
        } catch (Exception e) {
            return new ScoringLevelResult("Unknown", "");
        }
    }

    /**
     * Helper class to hold level and description
     */
    private static class ScoringLevelResult {
        String level;
        String description;
        
        ScoringLevelResult(String level, String description) {
            this.level = level;
            this.description = description;
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

    /**
     * Get all test result history for a patient with test metadata
     */
    @Transactional(readOnly = true)
    public TestResultHistoryResponse getTestResultHistory(UUID patientId) {
        List<TestResult> results = resultRepository.findByPatientId(patientId);
        
        List<TestScoreTrendResponse> trends = results.stream()
                .sorted((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()))
                .map(this::mapToScoreTrendResponse)
                .collect(Collectors.toList());
        
        return TestResultHistoryResponse.builder()
                .results(trends)
                .totalResults(trends.size())
                .build();
    }

    private TestScoreTrendResponse mapToScoreTrendResponse(TestResult result) {
        return TestScoreTrendResponse.builder()
                .id(result.getId())
                .testId(result.getTestId())
                .testName(result.getTestName())
                .score(result.getScore())
                .maxScore(result.getMaxScore())
                .level(result.getLevel())
                .date(result.getCreatedAt())
                .build();
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
