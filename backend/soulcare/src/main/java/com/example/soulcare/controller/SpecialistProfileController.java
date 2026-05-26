package com.example.soulcare.controller;

import com.example.soulcare.dto.AvailabilityRequest;
import com.example.soulcare.dto.AvailabilityResponse;
import com.example.soulcare.dto.SessionPricingRequest;
import com.example.soulcare.dto.SessionPricingResponse;
import com.example.soulcare.dto.UpdateSpecialistProfileRequest;
import com.example.soulcare.repository.SpecialistRepository;
import com.example.soulcare.repository.UserRepository;
import com.example.soulcare.service.SpecialistProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/specialist/profile")
@RequiredArgsConstructor
public class SpecialistProfileController {
    private final SpecialistProfileService profileService;
    private final UserRepository userRepository;
    private final SpecialistRepository specialistRepository;

    // ========== SESSION PRICING ENDPOINTS ==========

    /**
     * Set or update session pricing
     */
    @PostMapping("/pricing")
    public ResponseEntity<SessionPricingResponse> setSessionPricing(
            @Valid @RequestBody SessionPricingRequest request,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        SessionPricingResponse response = profileService.setSessionPricing(specialistId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all pricing (including inactive)
     */
    @GetMapping("/pricing")
    public ResponseEntity<List<SessionPricingResponse>> getPricing(Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        List<SessionPricingResponse> pricings = profileService.getSpecialistPricing(specialistId);
        return ResponseEntity.ok(pricings);
    }

    /**
     * Get only active pricing
     */
    @GetMapping("/pricing/active")
    public ResponseEntity<List<SessionPricingResponse>> getActivePricing(Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        List<SessionPricingResponse> pricings = profileService.getActivePricing(specialistId);
        return ResponseEntity.ok(pricings);
    }

    /**
     * Get pricing for specific session type
     */
    @GetMapping("/pricing/{sessionType}")
    public ResponseEntity<SessionPricingResponse> getPricingByType(
            @PathVariable String sessionType,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        SessionPricingResponse response = profileService.getPricingByType(specialistId, sessionType);
        return ResponseEntity.ok(response);
    }

    /**
     * Update pricing for a session type
     */
    @PutMapping("/pricing/{sessionType}")
    public ResponseEntity<SessionPricingResponse> updateSessionPricing(
            @PathVariable String sessionType,
            @Valid @RequestBody SessionPricingRequest request,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        // Override the session type from URL
        request.setSessionType(sessionType);
        SessionPricingResponse response = profileService.setSessionPricing(specialistId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Toggle pricing active status
     */
    @PostMapping("/pricing/{sessionType}/toggle")
    public ResponseEntity<SessionPricingResponse> togglePricingStatus(
            @PathVariable String sessionType,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        SessionPricingResponse response = profileService.togglePricingStatus(specialistId, sessionType);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete pricing
     */
    @DeleteMapping("/pricing/{sessionType}")
    public ResponseEntity<Void> deletePricing(
            @PathVariable String sessionType,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        profileService.deletePricing(specialistId, sessionType);
        return ResponseEntity.noContent().build();
    }

    // ========== AVAILABILITY ENDPOINTS ==========

    /**
     * Set or update availability for a day
     */
    @PostMapping("/availability")
    public ResponseEntity<AvailabilityResponse> setAvailability(
            @Valid @RequestBody AvailabilityRequest request,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        AvailabilityResponse response = profileService.setAvailability(specialistId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all availability (including inactive)
     */
    @GetMapping("/availability")
    public ResponseEntity<List<AvailabilityResponse>> getAvailability(Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        List<AvailabilityResponse> availabilities = profileService.getSpecialistAvailability(specialistId);
        return ResponseEntity.ok(availabilities);
    }

    /**
     * Get only active availability
     */
    @GetMapping("/availability/active")
    public ResponseEntity<List<AvailabilityResponse>> getActiveAvailability(Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        List<AvailabilityResponse> availabilities = profileService.getActiveAvailability(specialistId);
        return ResponseEntity.ok(availabilities);
    }

    /**
     * Get availability for specific day
     */
    @GetMapping("/availability/{dayOfWeek}")
    public ResponseEntity<AvailabilityResponse> getAvailabilityByDay(
            @PathVariable Integer dayOfWeek,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        AvailabilityResponse response = profileService.getAvailabilityByDay(specialistId, dayOfWeek);
        return ResponseEntity.ok(response);
    }

    /**
     * Update availability for a day
     */
    @PutMapping("/availability/{dayOfWeek}")
    public ResponseEntity<AvailabilityResponse> updateAvailability(
            @PathVariable Integer dayOfWeek,
            @Valid @RequestBody AvailabilityRequest request,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        // Override the day of week from URL
        request.setDayOfWeek(dayOfWeek);
        AvailabilityResponse response = profileService.setAvailability(specialistId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Toggle availability active status for a day
     */
    @PostMapping("/availability/{dayOfWeek}/toggle")
    public ResponseEntity<AvailabilityResponse> toggleAvailabilityStatus(
            @PathVariable Integer dayOfWeek,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        AvailabilityResponse response = profileService.toggleAvailabilityStatus(specialistId, dayOfWeek);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete availability for a day
     */
    @DeleteMapping("/availability/{dayOfWeek}")
    public ResponseEntity<Void> deleteAvailability(
            @PathVariable Integer dayOfWeek,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        profileService.deleteAvailability(specialistId, dayOfWeek);
        return ResponseEntity.noContent().build();
    }

    // ========== SPECIALIST PROFILE ENDPOINT ==========

    /**
     * Update specialist profile (fullName and specialtyTags)
     */
    @PutMapping
    public ResponseEntity<Map<String, Object>> updateSpecialistProfile(
            @Valid @RequestBody UpdateSpecialistProfileRequest request,
            Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        Map<String, Object> profile = profileService.updateSpecialistProfile(specialistId, request);
        return ResponseEntity.ok(profile);
    }

    /**
     * Get complete specialist profile with pricing and availability
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getSpecialistProfile(Authentication authentication) {
        UUID specialistId = getSpecialistIdFromAuth(authentication);
        Map<String, Object> profile = profileService.getSpecialistProfile(specialistId);
        return ResponseEntity.ok(profile);
    }

    // ========== HELPER METHODS ==========

    private UUID getSpecialistIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        var specialist = specialistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Specialist not found"));
        return specialist.getId();
    }
}
