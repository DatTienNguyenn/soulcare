package com.example.soulcare.service;

import com.example.soulcare.dto.MentalHealthTestRequest;
import com.example.soulcare.dto.MentalHealthTestResponse;
import com.example.soulcare.model.MentalHealthTest;
import com.example.soulcare.model.TestStatus;
import com.example.soulcare.repository.MentalHealthTestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MentalHealthTestService {
    private final MentalHealthTestRepository testRepository;

    public MentalHealthTestResponse createTest(MentalHealthTestRequest request, String adminEmail) {
        MentalHealthTest test = MentalHealthTest.builder()
                .name(request.getName())
                .shortName(request.getShortName())
                .description(request.getDescription())
                .duration(request.getDuration())
                .totalQuestions(request.getTotalQuestions())
                .minScore(request.getMinScore())
                .maxScore(request.getMaxScore())
                .scoringGuide(request.getScoringGuide())
                .status(TestStatus.valueOf(request.getStatus()))
                .createdBy(adminEmail)
                .build();

        MentalHealthTest savedTest = testRepository.save(test);
        return mapToResponse(savedTest);
    }

    public MentalHealthTestResponse updateTest(UUID testId, MentalHealthTestRequest request) {
        MentalHealthTest test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        test.setName(request.getName());
        test.setShortName(request.getShortName());
        test.setDescription(request.getDescription());
        test.setDuration(request.getDuration());
        test.setTotalQuestions(request.getTotalQuestions());
        test.setMinScore(request.getMinScore());
        test.setMaxScore(request.getMaxScore());
        test.setScoringGuide(request.getScoringGuide());

        MentalHealthTest updatedTest = testRepository.save(test);
        return mapToResponse(updatedTest);
    }

    @Transactional(readOnly = true)
    public MentalHealthTestResponse getTest(UUID testId) {
        MentalHealthTest test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));
        return mapToResponse(test);
    }

    @Transactional(readOnly = true)
    public List<MentalHealthTestResponse> getAllTests() {
        List<MentalHealthTest> tests = testRepository.findAll();
        return tests.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MentalHealthTestResponse> getActiveTests() {
        List<MentalHealthTest> tests = testRepository.findByStatus(TestStatus.ACTIVE);
        return tests.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteTest(UUID testId) {
        MentalHealthTest test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));
        testRepository.delete(test);
    }

    public void deactivateTest(UUID testId) {
        MentalHealthTest test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));
        test.setStatus(TestStatus.INACTIVE);
        testRepository.save(test);
    }

    private MentalHealthTestResponse mapToResponse(MentalHealthTest test) {
        return MentalHealthTestResponse.builder()
                .id(test.getId())
                .name(test.getName())
                .shortName(test.getShortName())
                .description(test.getDescription())
                .duration(test.getDuration())
                .totalQuestions(test.getTotalQuestions())
                .minScore(test.getMinScore())
                .maxScore(test.getMaxScore())
                .scoringGuide(test.getScoringGuide())
                .status(test.getStatus().toString())
                .createdAt(test.getCreatedAt())
                .updatedAt(test.getUpdatedAt())
                .createdBy(test.getCreatedBy())
                .build();
    }
}
