package com.example.soulcare.service;

import com.example.soulcare.dto.AvailableSlotDTO;
import com.example.soulcare.dto.PublicSpecialistDTO;
import com.example.soulcare.dto.SessionPricingDTO;
import com.example.soulcare.model.*;
import com.example.soulcare.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SpecialistPublicService {
    private final SpecialistRepository specialistRepository;
    private final UserRepository userRepository;
    private final SpecialistAvailabilityRepository availabilityRepository;
    private final SpecialistSessionPricingRepository pricingRepository;
    private final AppointmentRepository appointmentRepository;
    private final ReviewRepository reviewRepository;

    /**
     * Get all specialists with basic info (no authentication required)
     */
    public List<PublicSpecialistDTO> getAllSpecialists(String specialization) {
        List<Specialist> specialists = specialistRepository.findAll();
        
        return specialists.stream()
                .map(this::convertToPublicDTO)
                .filter(dto -> specialization == null || 
                        (dto.getSpecializations() != null && dto.getSpecializations().contains(specialization)))
                .sorted((a, b) -> b.getRating().compareTo(a.getRating()))
                .collect(Collectors.toList());
    }

    /**
     * Get a specific specialist's public profile
     */
    public PublicSpecialistDTO getSpecialistDetails(UUID specialistId) {
        Specialist specialist = specialistRepository.findById(specialistId)
                .orElseThrow(() -> new RuntimeException("Specialist not found"));
        return convertToPublicDTO(specialist);
    }

    /**
     * Get available time slots for a specialist within a date range
     */
    public List<AvailableSlotDTO> getAvailableSlots(
            UUID specialistId, 
            LocalDate startDate, 
            LocalDate endDate,
            String sessionType) {
        
        List<AvailableSlotDTO> availableSlots = new ArrayList<>();
        
        // Get specialist's availability schedule
        List<SpecialistAvailability> availabilities = availabilityRepository
                .findBySpecialistIdAndActiveTrueOrderByDayOfWeek(specialistId);
        
        if (availabilities.isEmpty()) {
            return availableSlots; // No availability set
        }
        
        // Get specialist's pricing
        List<SpecialistSessionPricing> pricings = pricingRepository
                .findBySpecialistIdAndActiveTrue(specialistId);
        
        // Get booked appointments for the specialist in this date range
        List<Appointment> bookedAppointments = appointmentRepository
                .findBySpecialistIdAndStatusNotAndScheduledAtBetween(
                    specialistId,
                    AppointmentStatus.CANCELLED,
                    LocalDateTime.of(startDate, LocalTime.MIN),
                    LocalDateTime.of(endDate, LocalTime.MAX)
                );
        
        // Build availability map for quick lookup
        Map<Integer, List<SpecialistAvailability>> availabilityByDay = availabilities.stream()
                .collect(Collectors.groupingBy(SpecialistAvailability::getDayOfWeek));
        
        // Generate slots for each day in the range
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            int dayOfWeek = currentDate.getDayOfWeek().getValue() % 7; // Convert to 0-6 (0=Sunday)
            
            if (availabilityByDay.containsKey(dayOfWeek)) {
                SpecialistAvailability dayAvailability = availabilityByDay.get(dayOfWeek).get(0);
                
                // Generate hourly slots for this day
                availableSlots.addAll(generateSlotsForDay(
                    specialistId, currentDate, dayAvailability, bookedAppointments, pricings, sessionType
                ));
            }
            
            currentDate = currentDate.plusDays(1);
        }
        
        return availableSlots;
    }

    /**
     * Search specialists by various criteria
     */
    public List<PublicSpecialistDTO> searchSpecialists(
            String specialization, 
            String minRating, 
            String maxPrice) {
        
        List<PublicSpecialistDTO> specialists = getAllSpecialists(specialization);
        
        // Filter by minimum rating if provided
        if (minRating != null && !minRating.isEmpty()) {
            BigDecimal minRatingValue = new BigDecimal(minRating);
            specialists = specialists.stream()
                    .filter(s -> s.getRating() != null && s.getRating().compareTo(minRatingValue) >= 0)
                    .collect(Collectors.toList());
        }
        
        // Filter by maximum price if provided
        if (maxPrice != null && !maxPrice.isEmpty()) {
            BigDecimal maxPriceValue = new BigDecimal(maxPrice);
            specialists = specialists.stream()
                    .filter(s -> s.getHourlyRate() != null && s.getHourlyRate().compareTo(maxPriceValue) <= 0)
                    .collect(Collectors.toList());
        }
        
        return specialists;
    }

    /**
     * Get pricing options for a specific specialist
     */
    public List<SessionPricingDTO> getSpecialistPricing(UUID specialistId) {
        List<SpecialistSessionPricing> pricings = pricingRepository
                .findBySpecialistIdAndActiveTrue(specialistId);
        
        return pricings.stream()
                .map(pricing -> SessionPricingDTO.builder()
                        .id(pricing.getId())
                        .specialistId(pricing.getSpecialistId())
                        .sessionType(pricing.getSessionType())
                        .pricePerSession(pricing.getPricePerSession())
                        .durationMinutes(pricing.getDurationMinutes())
                        .active(pricing.getActive())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Helper method to convert Specialist entity to public DTO
     */
    private PublicSpecialistDTO convertToPublicDTO(Specialist specialist) {
        User user = userRepository.findById(specialist.getUserId())
                .orElse(null);
        
        // Calculate average rating from reviews manually
        List<Appointment> completedAppointments = appointmentRepository
                .findBySpecialistIdAndStatusOrderByScheduledAtDesc(specialist.getId(), AppointmentStatus.COMPLETED);
        
        BigDecimal averageRating = BigDecimal.ZERO;
        int reviewCount = 0;
        
        if (!completedAppointments.isEmpty()) {
            List<Review> reviews = new ArrayList<>();
            for (Appointment apt : completedAppointments) {
                Optional<Review> review = reviewRepository.findByAppointmentId(apt.getId());
                if (review.isPresent()) {
                    reviews.add(review.get());
                }
            }
            
            reviewCount = reviews.size();
            if (reviewCount > 0) {
                double avgRatingValue = reviews.stream()
                        .mapToDouble(r -> r.getRating() != null ? r.getRating() : 0)
                        .average()
                        .orElse(0.0);
                averageRating = BigDecimal.valueOf(avgRatingValue);
            }
        }
        
        // Get default hourly rate (first active pricing)
        BigDecimal hourlyRate = BigDecimal.ZERO;
        List<SpecialistSessionPricing> pricings = pricingRepository
                .findBySpecialistIdAndActiveTrue(specialist.getId());
        if (!pricings.isEmpty()) {
            hourlyRate = pricings.get(0).getPricePerSession();
        }
        
        // Get available hours from specialist_availability table
        List<SpecialistAvailability> availabilities = availabilityRepository
                .findBySpecialistIdAndActiveTrueOrderByDayOfWeek(specialist.getId());
        String availableHours = calculateAvailableHours(availabilities);
        
        // Get specializations/experience from specialty_tags
        List<String> specializations = specialist.getSpecialtyTags() != null ? 
                new ArrayList<String>(Arrays.asList(specialist.getSpecialtyTags())) : new ArrayList<String>();
        
        return PublicSpecialistDTO.builder()
                .id(specialist.getId())
                .name(specialist.getFullName() != null ? specialist.getFullName() : (user != null ? user.getEmail() : "Unknown"))
                .bio(specialist.getBio() != null ? specialist.getBio() : "Experienced specialist in mental health support")
                .rating(averageRating)
                .reviewCount(reviewCount)
                .hourlyRate(hourlyRate)
                .avatarUrl(user != null ? user.getAvatarUrl() : null)
                .experience(specialist.getYearsExp() != null ? specialist.getYearsExp() : 0)
                // .certifications(specializations.isEmpty() ? Arrays.asList("Certified Mental Health Professional") : specializations)
                // .languages(Arrays.asList("English")) // TODO: add to model
                .availableHours(availableHours)
                // .responseTime("Typically responds in 1 hour") // TODO: add to model
                .specializations(specializations)
                .build();
    }
    
    /**
     * Calculate available hours string from specialist availability records
     */
    private String calculateAvailableHours(List<SpecialistAvailability> availabilities) {
        if (availabilities.isEmpty()) {
            return "Not available";
        }
        
        // Get earliest start time and latest end time across all days
        LocalTime earliestStart = null;
        LocalTime latestEnd = null;
        
        for (SpecialistAvailability avail : availabilities) {
            LocalTime startTime = LocalTime.parse(avail.getStartTime());
            LocalTime endTime = LocalTime.parse(avail.getEndTime());
            
            if (earliestStart == null || startTime.isBefore(earliestStart)) {
                earliestStart = startTime;
            }
            if (latestEnd == null || endTime.isAfter(latestEnd)) {
                latestEnd = endTime;
            }
        }
        
        if (earliestStart != null && latestEnd != null) {
            return String.format("%02d:%02d - %02d:%02d", 
                    earliestStart.getHour(), earliestStart.getMinute(),
                    latestEnd.getHour(), latestEnd.getMinute());
        }
        
        return "Not available";
    }

    /**
     * Generate hourly slots for a specific day
     */
    private List<AvailableSlotDTO> generateSlotsForDay(
            UUID specialistId,
            LocalDate date,
            SpecialistAvailability dayAvailability,
            List<Appointment> bookedAppointments,
            List<SpecialistSessionPricing> pricings,
            String filterSessionType) {
        
        List<AvailableSlotDTO> slots = new ArrayList<>();
        BigDecimal defaultPrice = pricings.isEmpty() ? BigDecimal.valueOf(50) : pricings.get(0).getPricePerSession();
        
        LocalTime startTime = LocalTime.parse(dayAvailability.getStartTime());
        LocalTime endTime = LocalTime.parse(dayAvailability.getEndTime());
        LocalTime breakStart = dayAvailability.getBreakTimeStart() != null ? LocalTime.parse(dayAvailability.getBreakTimeStart()) : null;
        LocalTime breakEnd = dayAvailability.getBreakTimeEnd() != null ? LocalTime.parse(dayAvailability.getBreakTimeEnd()) : null;
        
        LocalTime currentSlotStart = startTime;
        
        while (currentSlotStart.plusHours(1).compareTo(endTime) <= 0) {
            LocalTime currentSlotEnd = currentSlotStart.plusHours(1);
            
            // Skip if this slot is during break time
            if (breakStart != null && breakEnd != null && 
                !currentSlotStart.isBefore(breakStart) && currentSlotStart.isBefore(breakEnd)) {
                currentSlotStart = breakEnd;
                continue;
            }
            
            LocalDateTime slotDateTime = LocalDateTime.of(date, currentSlotStart);
            LocalDateTime slotEndDateTime = LocalDateTime.of(date, currentSlotEnd);
            
            // Check if this slot is booked
            boolean isBooked = bookedAppointments.stream()
                    .anyMatch(apt -> isConflicting(apt, slotDateTime, slotEndDateTime));
            
            AvailableSlotDTO slot = AvailableSlotDTO.builder()
                    .id(UUID.randomUUID())
                    .specialistId(specialistId)
                    .date(date)
                    .startTime(String.format("%02d:%02d", currentSlotStart.getHour(), currentSlotStart.getMinute()))
                    .endTime(String.format("%02d:%02d", currentSlotEnd.getHour(), currentSlotEnd.getMinute()))
                    .status(isBooked ? "booked" : "available")
                    .price(defaultPrice)
                    .sessionType(filterSessionType != null ? filterSessionType : "standard")
                    .build();
            
            slots.add(slot);
            currentSlotStart = currentSlotEnd;
        }
        
        return slots;
    }

    /**
     * Check if a new slot conflicts with an existing appointment
     */
    private boolean isConflicting(Appointment apt, LocalDateTime slotStart, LocalDateTime slotEnd) {
        LocalDateTime aptStart = apt.getScheduledAt();
        LocalDateTime aptEnd = apt.getScheduledAt().plusMinutes(apt.getDuration() != null ? apt.getDuration() : 60);
        
        return !(slotEnd.isBefore(aptStart) || slotStart.isAfter(aptEnd));
    }
}
