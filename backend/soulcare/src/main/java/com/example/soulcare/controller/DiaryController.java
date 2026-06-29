package com.example.soulcare.controller;

import com.example.soulcare.dto.DiaryRequest;
import com.example.soulcare.dto.DiaryResponse;
import com.example.soulcare.dto.DiaryFrequencyResponse;
import com.example.soulcare.service.DiaryService;
import com.example.soulcare.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/diaries")
@RequiredArgsConstructor
public class DiaryController {
    private final DiaryService diaryService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<DiaryResponse> createDiary(
            @Valid @RequestBody DiaryRequest request,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        DiaryResponse response = diaryService.createDiary(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<DiaryResponse>> getAllDiaries(Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        List<DiaryResponse> responses = diaryService.getAllDiaries(patientId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiaryResponse> getDiary(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        DiaryResponse response = diaryService.getDiary(patientId, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiaryResponse> updateDiary(
            @PathVariable UUID id,
            @Valid @RequestBody DiaryRequest request,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        DiaryResponse response = diaryService.updateDiary(patientId, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiary(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        diaryService.deleteDiary(patientId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/range")
    public ResponseEntity<List<DiaryResponse>> getDiariesByRange(
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        List<DiaryResponse> responses = diaryService.getDiariesByDateRange(patientId, startDate, endDate);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/analytics/frequency")
    public ResponseEntity<DiaryFrequencyResponse> getDiaryFrequency(Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        DiaryFrequencyResponse response = diaryService.getDiaryFrequency(patientId);
        return ResponseEntity.ok(response);
    }

    private UUID getPatientIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        return userService.getPatientIdByEmail(email);
    }
}
