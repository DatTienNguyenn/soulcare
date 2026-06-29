package com.example.soulcare;

import com.example.soulcare.dto.AvailabilityRequest;
import com.example.soulcare.dto.AvailabilityResponse;
import com.example.soulcare.dto.SessionPricingRequest;
import com.example.soulcare.dto.SessionPricingResponse;
import com.example.soulcare.model.Specialist;
import com.example.soulcare.model.SpecialistAvailability;
import com.example.soulcare.model.SpecialistSessionPricing;
import com.example.soulcare.repository.SpecialistAvailabilityRepository;
import com.example.soulcare.repository.SpecialistRepository;
import com.example.soulcare.repository.SpecialistSessionPricingRepository;
import com.example.soulcare.service.SpecialistProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SpecialistProfileServiceTest {

    @Mock
    private SpecialistRepository specialistRepository;
    @Mock
    private SpecialistSessionPricingRepository pricingRepository;
    @Mock
    private SpecialistAvailabilityRepository availabilityRepository;

    @InjectMocks
    private SpecialistProfileService specialistProfileService;

    private UUID specialistId;
    private Specialist specialist;

    @BeforeEach
    void setUp() {
        specialistId = UUID.randomUUID();
        specialist = new Specialist();
        specialist.setId(specialistId);
        specialist.setUserId(UUID.randomUUID());
    }

    @Test
    @DisplayName("Set Session Pricing: Should create new pricing if not exists")
    void setSessionPricing_shouldCreateNew_whenNotExists() {
        // Arrange
        SessionPricingRequest request = new SessionPricingRequest("COUNSELING", BigDecimal.valueOf(100), 60, true);
        when(specialistRepository.findById(specialistId)).thenReturn(Optional.of(specialist));
        when(pricingRepository.findBySpecialistIdAndSessionType(specialistId, "COUNSELING")).thenReturn(Optional.empty());
        when(pricingRepository.save(any(SpecialistSessionPricing.class))).thenAnswer(invocation -> {
            SpecialistSessionPricing saved = invocation.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        // Act
        SessionPricingResponse response = specialistProfileService.setSessionPricing(specialistId, request);

        // Assert
        assertNotNull(response);
        assertEquals("COUNSELING", response.getSessionType());
        assertEquals(0, BigDecimal.valueOf(100).compareTo(response.getPricePerSession()));
        verify(pricingRepository, times(1)).save(any(SpecialistSessionPricing.class));
    }

    @Test
    @DisplayName("Set Session Pricing: Should update existing pricing")
    void setSessionPricing_shouldUpdate_whenExists() {
        // Arrange
        SessionPricingRequest request = new SessionPricingRequest("COUNSELING", BigDecimal.valueOf(120), 60, true);
        SpecialistSessionPricing existingPricing = SpecialistSessionPricing.builder()
                .id(UUID.randomUUID())
                .specialistId(specialistId)
                .sessionType("COUNSELING")
                .pricePerSession(BigDecimal.valueOf(100))
                .build();

        when(specialistRepository.findById(specialistId)).thenReturn(Optional.of(specialist));
        when(pricingRepository.findBySpecialistIdAndSessionType(specialistId, "COUNSELING")).thenReturn(Optional.of(existingPricing));
        when(pricingRepository.save(any(SpecialistSessionPricing.class))).thenReturn(existingPricing);

        // Act
        SessionPricingResponse response = specialistProfileService.setSessionPricing(specialistId, request);

        // Assert
        assertNotNull(response);
        assertEquals(0, BigDecimal.valueOf(120).compareTo(response.getPricePerSession()));
        verify(pricingRepository, times(1)).save(existingPricing);
    }

    @Test
    @DisplayName("Set Availability: Should throw exception for invalid time range")
    void setAvailability_shouldThrowException_forInvalidTimeRange() {
        // Arrange
        AvailabilityRequest request = new AvailabilityRequest(1, "10:00", "09:00", null, null, true);
        when(specialistRepository.findById(specialistId)).thenReturn(Optional.of(specialist));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> specialistProfileService.setAvailability(specialistId, request));
        assertEquals("End time must be after start time", exception.getMessage());
    }
}