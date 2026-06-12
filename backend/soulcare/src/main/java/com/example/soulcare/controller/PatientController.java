package com.example.soulcare.controller;

import com.example.soulcare.dto.PatientProfileDTO;
import com.example.soulcare.service.PatientService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    // Handles: GET /api/patients/me
    @GetMapping("/me")
    public ResponseEntity<PatientProfileDTO> getMyProfile(Authentication authentication) {
        // Assuming your authentication principal holds the user's email or ID
        String userEmail = authentication.getName(); 
        PatientProfileDTO profile = patientService.getPatientProfile(userEmail);
        return ResponseEntity.ok(profile);
    }

    // Handles: PUT /api/patients/me
    @PutMapping("/me")
    public ResponseEntity<PatientProfileDTO> updateMyProfile(
            Authentication authentication, 
            @RequestBody PatientProfileDTO profileData) {
        
        String userEmail = authentication.getName();
        PatientProfileDTO updatedProfile = patientService.updatePatientProfile(userEmail, profileData);
        return ResponseEntity.ok(updatedProfile);
    }
}
