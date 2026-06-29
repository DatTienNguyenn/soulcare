package com.example.soulcare.controller;

import com.example.soulcare.dto.DiaryFrequencyResponse;
import com.example.soulcare.dto.PictureSaveRequest;
import com.example.soulcare.dto.PictureResponse;
import com.example.soulcare.service.PictureService;
import com.example.soulcare.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pictures")
@RequiredArgsConstructor
public class PictureController {
    private final PictureService pictureService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<PictureResponse> savePicture(
            @Valid @RequestBody PictureSaveRequest request,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        PictureResponse response = pictureService.savePicture(patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PictureResponse>> getAllPictures(Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        List<PictureResponse> responses = pictureService.getAllPictures(patientId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PictureResponse> getPicture(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        PictureResponse response = pictureService.getPicture(patientId, id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PictureResponse> updatePicture(
            @PathVariable UUID id,
            @Valid @RequestBody PictureSaveRequest request,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        PictureResponse response = pictureService.updatePicture(patientId, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePicture(
            @PathVariable UUID id,
            Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        pictureService.deletePicture(patientId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/analytics/frequency")
    public ResponseEntity<DiaryFrequencyResponse> getDrawingFrequency(Authentication authentication) {
        UUID patientId = getPatientIdFromAuth(authentication);
        DiaryFrequencyResponse response = pictureService.getDrawingFrequency(patientId);
        return ResponseEntity.ok(response);
    }

    private UUID getPatientIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        return userService.getPatientIdByEmail(email);
    }

    // Get all pictures for a specific patient
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('SPECIALIST', 'ADMIN')")
    public ResponseEntity<List<PictureResponse>> getPatientPictures(@PathVariable UUID patientId) {
        return ResponseEntity.ok(pictureService.getAllPatientPictures(patientId));
    }

    // Get full details of a specific picture for a patient
    @GetMapping("/patient/{patientId}/{pictureId}")
    @PreAuthorize("hasAnyRole('SPECIALIST', 'ADMIN')")
    public ResponseEntity<PictureResponse> getPatientPictureById(
            @PathVariable UUID patientId, 
            @PathVariable UUID pictureId) {
        return ResponseEntity.ok(pictureService.getPicture(patientId, pictureId));
    }
}
