package com.example.soulcare.controller;

import com.example.soulcare.dto.MentalHealthTestRequest;
import com.example.soulcare.dto.MentalHealthTestResponse;
import com.example.soulcare.service.MentalHealthTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tests")
@RequiredArgsConstructor
public class MentalHealthTestController {
    private final MentalHealthTestService testService;

    /**
     * Create a new mental health test (Admin only)
     */
    @PostMapping
    public ResponseEntity<MentalHealthTestResponse> createTest(
            @Valid @RequestBody MentalHealthTestRequest request,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        MentalHealthTestResponse response = testService.createTest(request, adminEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all tests
     */
    @GetMapping
    public ResponseEntity<List<MentalHealthTestResponse>> getAllTests() {
        List<MentalHealthTestResponse> tests = testService.getAllTests();
        return ResponseEntity.ok(tests);
    }

    /**
     * Get all active tests
     */
    @GetMapping("/active")
    public ResponseEntity<List<MentalHealthTestResponse>> getActiveTests() {
        List<MentalHealthTestResponse> tests = testService.getActiveTests();
        return ResponseEntity.ok(tests);
    }

    /**
     * Get a specific test by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<MentalHealthTestResponse> getTest(@PathVariable UUID id) {
        MentalHealthTestResponse test = testService.getTest(id);
        return ResponseEntity.ok(test);
    }

    /**
     * Update a test (Admin only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<MentalHealthTestResponse> updateTest(
            @PathVariable UUID id,
            @Valid @RequestBody MentalHealthTestRequest request) {
        MentalHealthTestResponse response = testService.updateTest(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Deactivate a test (Admin only)
     */
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivateTest(@PathVariable UUID id) {
        testService.deactivateTest(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete a test (Admin only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTest(@PathVariable UUID id) {
        testService.deleteTest(id);
        return ResponseEntity.noContent().build();
    }
}
