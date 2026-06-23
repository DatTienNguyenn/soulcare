package com.example.soulcare.controller;

import com.example.soulcare.dto.TestResultRequest;
import com.example.soulcare.dto.TestResultResponse;
import com.example.soulcare.dto.TestResultHistoryResponse;
import com.example.soulcare.model.User;
import com.example.soulcare.repository.PatientRepository;
import com.example.soulcare.repository.UserRepository;
import com.example.soulcare.service.TestResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/test-results")
@RequiredArgsConstructor
public class TestResultController {
    private final TestResultService resultService;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;

    /**
     * Submit test answers and save result
     */
    @PostMapping
    public ResponseEntity<TestResultResponse> submitTestResult(
            @Valid @RequestBody TestResultRequest request,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        TestResultResponse response = resultService.submitTestResult(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all test results for the current user
     */
    @GetMapping
    public ResponseEntity<List<TestResultResponse>> getUserTestResults(Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        List<TestResultResponse> results = resultService.getPatientTestResults(patientId);
        return ResponseEntity.ok(results);
    }

    /**
     * Get test results for a specific test
     */
    @GetMapping("/test/{testId}")
    public ResponseEntity<List<TestResultResponse>> getUserTestResultsByTest(
            @PathVariable UUID testId,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        List<TestResultResponse> results = resultService.getPatientTestResultsByTest(patientId, testId);
        return ResponseEntity.ok(results);
    }

    /**
     * Get a specific test result
     */
    @GetMapping("/{id}")
    public ResponseEntity<TestResultResponse> getTestResult(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        TestResultResponse result = resultService.getTestResult(id, patientId);
        return ResponseEntity.ok(result);
    }

    /**
     * Delete a test result
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestResult(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        resultService.deleteTestResult(id, patientId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all test result history for analytics
     */
    @GetMapping("/analytics/history")
    public ResponseEntity<TestResultHistoryResponse> getTestResultHistory(Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        TestResultHistoryResponse response = resultService.getTestResultHistory(patientId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get public test results for a specific patient (for specialists)
     */
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('SPECIALIST', 'ADMIN')")
    public ResponseEntity<List<TestResultResponse>> getPublicPatientTestResultsForSpecialist(
            @PathVariable UUID patientId) {
        List<TestResultResponse> results = resultService.getPublicPatientTestResultsForSpecialist(patientId);
        return ResponseEntity.ok(results);
    }

    private UUID getPatientIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return patientRepository.findByUserId(user.getId())
                .map(patient -> patient.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found for this user"));
    }
}
