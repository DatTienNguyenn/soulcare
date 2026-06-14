package com.example.soulcare.service;

import com.example.soulcare.dto.AvailabilityRequest;
import com.example.soulcare.dto.AvailabilityResponse;
import com.example.soulcare.dto.SessionPricingRequest;
import com.example.soulcare.dto.SessionPricingResponse;
import com.example.soulcare.model.Specialist;
import com.example.soulcare.model.SpecialistAvailability;
import com.example.soulcare.model.SpecialistSessionPricing;
import com.example.soulcare.model.User;
import com.example.soulcare.repository.SpecialistAvailabilityRepository;
import com.example.soulcare.repository.SpecialistRepository;
import com.example.soulcare.repository.SpecialistSessionPricingRepository;
import com.example.soulcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SpecialistProfileService {
    private final SpecialistRepository specialistRepository;
    private final SpecialistSessionPricingRepository pricingRepository;
    private final SpecialistAvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;

    private static final String[] DAYS_OF_WEEK = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

    // ========== SESSION PRICING MANAGEMENT ==========

    /**
     * Add or update session pricing for a specialist
     */
    public SessionPricingResponse setSessionPricing(UUID specialistId, SessionPricingRequest request) {
        Specialist specialist = specialistRepository.findById(specialistId)
                .orElseThrow(() -> new RuntimeException("Specialist not found"));

        // Check if pricing already exists
        Optional<SpecialistSessionPricing> existing = pricingRepository
                .findBySpecialistIdAndSessionType(specialistId, request.getSessionType());

        SpecialistSessionPricing pricing;
        if (existing.isPresent()) {
            // Update existing
            pricing = existing.get();
            pricing.setPricePerSession(request.getPricePerSession());
            pricing.setDurationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 60);
            if (request.getActive() != null) {
                pricing.setActive(request.getActive());
            }
        } else {
            // Create new
            pricing = SpecialistSessionPricing.builder()
                    .specialistId(specialistId)
                    .sessionType(request.getSessionType())
                    .pricePerSession(request.getPricePerSession())
                    .durationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 60)
                    .active(request.getActive() != null ? request.getActive() : true)
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        SpecialistSessionPricing saved = pricingRepository.save(pricing);
        return mapPricingToResponse(saved);
    }

    /**
     * Get all pricing for a specialist (including inactive)
     */
    @Transactional(readOnly = true)
    public List<SessionPricingResponse> getSpecialistPricing(UUID specialistId) {
        List<SpecialistSessionPricing> pricings = pricingRepository.findBySpecialistId(specialistId);
        return pricings.stream()
                .map(this::mapPricingToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get only active pricing for a specialist
     */
    @Transactional(readOnly = true)
    public List<SessionPricingResponse> getActivePricing(UUID specialistId) {
        List<SpecialistSessionPricing> pricings = pricingRepository.findBySpecialistIdAndActiveTrue(specialistId);
        return pricings.stream()
                .map(this::mapPricingToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get pricing for a specific session type
     */
    @Transactional(readOnly = true)
    public SessionPricingResponse getPricingByType(UUID specialistId, String sessionType) {
        SpecialistSessionPricing pricing = pricingRepository
                .findBySpecialistIdAndSessionType(specialistId, sessionType)
                .orElseThrow(() -> new RuntimeException("Pricing not found for session type: " + sessionType));
        return mapPricingToResponse(pricing);
    }

    /**
     * Delete session pricing
     */
    public void deletePricing(UUID specialistId, String sessionType) {
        pricingRepository.deleteBySpecialistIdAndSessionType(specialistId, sessionType);
    }

    /**
     * Toggle pricing active status
     */
    public SessionPricingResponse togglePricingStatus(UUID specialistId, String sessionType) {
        SpecialistSessionPricing pricing = pricingRepository
                .findBySpecialistIdAndSessionType(specialistId, sessionType)
                .orElseThrow(() -> new RuntimeException("Pricing not found"));

        pricing.setActive(!pricing.getActive());
        SpecialistSessionPricing saved = pricingRepository.save(pricing);
        return mapPricingToResponse(saved);
    }

    // ========== AVAILABILITY MANAGEMENT ==========

    /**
     * Set or update availability for a specific day
     */
    public AvailabilityResponse setAvailability(UUID specialistId, AvailabilityRequest request) {
        Specialist specialist = specialistRepository.findById(specialistId)
                .orElseThrow(() -> new RuntimeException("Specialist not found"));

        // Validate times
        if (!isValidTimeRange(request.getStartTime(), request.getEndTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        // Check if availability already exists
        Optional<SpecialistAvailability> existing = availabilityRepository
                .findBySpecialistIdAndDayOfWeek(specialistId, request.getDayOfWeek());

        SpecialistAvailability availability;
        if (existing.isPresent()) {
            // Update existing
            availability = existing.get();
            availability.setStartTime(request.getStartTime());
            availability.setEndTime(request.getEndTime());
            availability.setBreakTimeStart(request.getBreakTimeStart());
            availability.setBreakTimeEnd(request.getBreakTimeEnd());
            if (request.getActive() != null) {
                availability.setActive(request.getActive());
            }
        } else {
            // Create new
            availability = SpecialistAvailability.builder()
                    .specialistId(specialistId)
                    .dayOfWeek(request.getDayOfWeek())
                    .startTime(request.getStartTime())
                    .endTime(request.getEndTime())
                    .breakTimeStart(request.getBreakTimeStart())
                    .breakTimeEnd(request.getBreakTimeEnd())
                    .active(request.getActive() != null ? request.getActive() : true)
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        SpecialistAvailability saved = availabilityRepository.save(availability);
        return mapAvailabilityToResponse(saved);
    }

    /**
     * Get all availability slots for a specialist (including inactive)
     */
    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getSpecialistAvailability(UUID specialistId) {
        List<SpecialistAvailability> availabilities = availabilityRepository
                .findBySpecialistIdOrderByDayOfWeek(specialistId);
        return availabilities.stream()
                .map(this::mapAvailabilityToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get only active availability slots
     */
    @Transactional(readOnly = true)
    public List<AvailabilityResponse> getActiveAvailability(UUID specialistId) {
        List<SpecialistAvailability> availabilities = availabilityRepository
                .findBySpecialistIdAndActiveTrueOrderByDayOfWeek(specialistId);
        return availabilities.stream()
                .map(this::mapAvailabilityToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get availability for a specific day
     */
    @Transactional(readOnly = true)
    public AvailabilityResponse getAvailabilityByDay(UUID specialistId, Integer dayOfWeek) {
        SpecialistAvailability availability = availabilityRepository
                .findBySpecialistIdAndDayOfWeek(specialistId, dayOfWeek)
                .orElseThrow(() -> new RuntimeException("No availability set for day: " + DAYS_OF_WEEK[dayOfWeek]));
        return mapAvailabilityToResponse(availability);
    }

    /**
     * Delete availability for a specific day
     */
    public void deleteAvailability(UUID specialistId, Integer dayOfWeek) {
        availabilityRepository.deleteBySpecialistIdAndDayOfWeek(specialistId, dayOfWeek);
    }

    /**
     * Toggle availability active status
     */
    public AvailabilityResponse toggleAvailabilityStatus(UUID specialistId, Integer dayOfWeek) {
        SpecialistAvailability availability = availabilityRepository
                .findBySpecialistIdAndDayOfWeek(specialistId, dayOfWeek)
                .orElseThrow(() -> new RuntimeException("Availability not found"));

        availability.setActive(!availability.getActive());
        SpecialistAvailability saved = availabilityRepository.save(availability);
        return mapAvailabilityToResponse(saved);
    }

    // ========== SPECIALIST PROFILE MANAGEMENT ==========

    /**
     * Update specialist profile (fullName, specialtyTags, bio, and years_exp)
     */
    public Map<String, Object> updateSpecialistProfile(UUID specialistId, com.example.soulcare.dto.UpdateSpecialistProfileRequest request) {
        Specialist specialist = specialistRepository.findById(specialistId)
                .orElseThrow(() -> new RuntimeException("Specialist not found"));

        specialist.setFullName(request.getFullName());
        specialist.setSpecialtyTags(request.getSpecialtyTags());
        if (request.getBio() != null) {
            specialist.setBio(request.getBio());
        }
        if (request.getYears_exp() != null) {
            specialist.setYearsExp(request.getYears_exp());
        }
        
        Specialist updated = specialistRepository.save(specialist);

        // Update user avatar
        User user = userRepository.findById(specialist.getUserId()).orElse(null);
        if (user != null && request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
            userRepository.save(user);
        }

        // Return updated profile with all data
        List<SessionPricingResponse> pricings = getSpecialistPricing(specialistId);
        List<AvailabilityResponse> availabilities = getSpecialistAvailability(specialistId);

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", updated.getId());
        profile.put("userId", updated.getUserId());
        profile.put("fullName", updated.getFullName());
        profile.put("specialtyTags", updated.getSpecialtyTags());
        profile.put("bio", updated.getBio());
        profile.put("years_exp", updated.getYearsExp());
        profile.put("ratingAverage", updated.getRatingAverage());
        profile.put("avatarUrl", user != null ? user.getAvatarUrl() : null);
        profile.put("pricing", pricings);
        profile.put("availability", availabilities);

        return profile;
    }

    /**
     * Get specialist profile with pricing and availability
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getSpecialistProfile(UUID specialistId) {
        Specialist specialist = specialistRepository.findById(specialistId)
                .orElseThrow(() -> new RuntimeException("Specialist not found"));

        User user = userRepository.findById(specialist.getUserId()).orElse(null);

        List<SessionPricingResponse> pricings = getSpecialistPricing(specialistId);
        List<AvailabilityResponse> availabilities = getSpecialistAvailability(specialistId);

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", specialist.getId());
        profile.put("userId", specialist.getUserId());
        profile.put("fullName", specialist.getFullName());
        profile.put("specialtyTags", specialist.getSpecialtyTags());
        profile.put("bio", specialist.getBio());
        profile.put("years_exp", specialist.getYearsExp());
        profile.put("ratingAverage", specialist.getRatingAverage());
        profile.put("avatarUrl", user != null ? user.getAvatarUrl() : null);
        profile.put("pricing", pricings);
        profile.put("availability", availabilities);

        return profile;
    }

    // ========== HELPER METHODS ==========

    private boolean isValidTimeRange(String startTime, String endTime) {
        // Simple string comparison for HH:MM format
        return startTime.compareTo(endTime) < 0;
    }

    private SessionPricingResponse mapPricingToResponse(SpecialistSessionPricing pricing) {
        return SessionPricingResponse.builder()
                .id(pricing.getId())
                .specialistId(pricing.getSpecialistId())
                .sessionType(pricing.getSessionType())
                .pricePerSession(pricing.getPricePerSession())
                .durationMinutes(pricing.getDurationMinutes())
                .active(pricing.getActive())
                .createdAt(pricing.getCreatedAt())
                .updatedAt(pricing.getUpdatedAt())
                .build();
    }

    private AvailabilityResponse mapAvailabilityToResponse(SpecialistAvailability availability) {
        return AvailabilityResponse.builder()
                .id(availability.getId())
                .specialistId(availability.getSpecialistId())
                .dayOfWeek(availability.getDayOfWeek())
                .dayName(DAYS_OF_WEEK[availability.getDayOfWeek()])
                .startTime(availability.getStartTime())
                .endTime(availability.getEndTime())
                .breakTimeStart(availability.getBreakTimeStart())
                .breakTimeEnd(availability.getBreakTimeEnd())
                .active(availability.getActive())
                .createdAt(availability.getCreatedAt())
                .updatedAt(availability.getUpdatedAt())
                .build();
    }
}
