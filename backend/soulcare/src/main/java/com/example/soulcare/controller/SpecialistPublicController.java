package com.example.soulcare.controller;

import com.example.soulcare.dto.AvailableSlotDTO;
import com.example.soulcare.dto.PublicSpecialistDTO;
import com.example.soulcare.dto.SessionPricingDTO;
import com.example.soulcare.service.SpecialistPublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/specialists")
@RequiredArgsConstructor
public class SpecialistPublicController {
    private final SpecialistPublicService specialistPublicService;

    /**
     * Get all specialists for browsing
     * Optional filter by specialization
     */
    @GetMapping("/public")
    public ResponseEntity<List<PublicSpecialistDTO>> getAllSpecialists(
            @RequestParam(required = false) String specialization) {
        List<PublicSpecialistDTO> specialists = specialistPublicService.getAllSpecialists(specialization);
        return ResponseEntity.ok(specialists);
    }

    /**
     * Get a specific specialist's details
     */
    @GetMapping("/{specialistId}/public")
    public ResponseEntity<PublicSpecialistDTO> getSpecialistDetails(
            @PathVariable UUID specialistId) {
        PublicSpecialistDTO specialist = specialistPublicService.getSpecialistDetails(specialistId);
        return ResponseEntity.ok(specialist);
    }

    /**
     * Get pricing options for a specialist
     */
    @GetMapping("/{specialistId}/pricing")
    public ResponseEntity<List<SessionPricingDTO>> getSpecialistPricing(
            @PathVariable UUID specialistId) {
        List<SessionPricingDTO> pricing = specialistPublicService.getSpecialistPricing(specialistId);
        return ResponseEntity.ok(pricing);
    }

    /**
     * Get available time slots for a specialist
     * @param specialistId The specialist ID
     * @param startDate Start date for slot availability (optional, defaults to today)
     * @param endDate End date for slot availability (optional, defaults to 30 days from start)
     * @param specialization Optional filter by session type/specialization
     */
    @GetMapping("/{specialistId}/available-slots")
    public ResponseEntity<List<AvailableSlotDTO>> getAvailableSlots(
            @PathVariable UUID specialistId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String sessionType) {
        if (startDate == null) {
            startDate = LocalDate.now();
        }
        if (endDate == null) {
            endDate = startDate.plusDays(30);
        }
        
        List<AvailableSlotDTO> slots = specialistPublicService.getAvailableSlots(specialistId, startDate, endDate, sessionType);
        return ResponseEntity.ok(slots);
    }

    /**
     * Search specialists by specialization(s)
     */
    @GetMapping("/search")
    public ResponseEntity<List<PublicSpecialistDTO>> searchSpecialists(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String minRating,
            @RequestParam(required = false) String maxPrice) {
        List<PublicSpecialistDTO> specialists = specialistPublicService.searchSpecialists(
            specialization, minRating, maxPrice);
        return ResponseEntity.ok(specialists);
    }
}
