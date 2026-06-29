package com.example.soulcare;

import com.example.soulcare.dto.PublicSpecialistDTO;
import com.example.soulcare.model.*;
import com.example.soulcare.repository.*;
import com.example.soulcare.service.SpecialistPublicService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SpecialistPublicServiceTest {

    @Mock
    private SpecialistRepository specialistRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SpecialistAvailabilityRepository availabilityRepository;
    @Mock
    private SpecialistSessionPricingRepository pricingRepository;
    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private SpecialistPublicService specialistPublicService;

    private UUID specialistId;
    private Specialist specialist;
    private User specialistUser;

    @BeforeEach
    void setUp() {
        specialistId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        specialist = new Specialist();
        specialist.setId(specialistId);
        specialist.setUserId(userId);
        specialist.setFullName("Dr. Strange");
        specialist.setSpecialtyTags(new String[]{"Tâm lý", "Trầm cảm"});

        specialistUser = User.builder()
                .id(userId)
                .email("strange@test.com")
                .avatarUrl("avatar_url")
                .build();
    }

    @Test
    @DisplayName("Get All Specialists: Should return a list of public DTOs")
    void getAllSpecialists_shouldReturnPublicDTOs() {
        // Arrange
        when(specialistRepository.findAll()).thenReturn(Collections.singletonList(specialist));
        when(userRepository.findById(specialist.getUserId())).thenReturn(Optional.of(specialistUser));
        when(appointmentRepository.findBySpecialistIdAndStatusOrderByScheduledAtDesc(specialistId, AppointmentStatus.COMPLETED))
                .thenReturn(Collections.emptyList());
        when(pricingRepository.findBySpecialistIdAndActiveTrue(specialistId)).thenReturn(Collections.emptyList());
        when(availabilityRepository.findBySpecialistIdAndActiveTrueOrderByDayOfWeek(specialistId)).thenReturn(Collections.emptyList());

        // Act
        List<PublicSpecialistDTO> result = specialistPublicService.getAllSpecialists(null);

        // Assert
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Dr. Strange", result.get(0).getName());
        assertTrue(result.get(0).getSpecializations().contains("Tâm lý"));
    }

    @Test
    @DisplayName("Get Specialist Details: Should return correct DTO when specialist exists")
    void getSpecialistDetails_shouldReturnDTO_whenExists() {
        // Arrange
        when(specialistRepository.findById(specialistId)).thenReturn(Optional.of(specialist));
        when(userRepository.findById(specialist.getUserId())).thenReturn(Optional.of(specialistUser));
        when(appointmentRepository.findBySpecialistIdAndStatusOrderByScheduledAtDesc(specialistId, AppointmentStatus.COMPLETED))
                .thenReturn(Collections.emptyList());
        when(pricingRepository.findBySpecialistIdAndActiveTrue(specialistId)).thenReturn(Collections.emptyList());
        when(availabilityRepository.findBySpecialistIdAndActiveTrueOrderByDayOfWeek(specialistId)).thenReturn(Collections.emptyList());

        // Act
        PublicSpecialistDTO dto = specialistPublicService.getSpecialistDetails(specialistId);

        // Assert
        assertNotNull(dto);
        assertEquals(specialistId, dto.getId());
        assertEquals("Dr. Strange", dto.getName());
    }

    @Test
    @DisplayName("Get Specialist Details: Should throw exception when specialist not found")
    void getSpecialistDetails_shouldThrowException_whenNotFound() {
        // Arrange
        when(specialistRepository.findById(specialistId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> specialistPublicService.getSpecialistDetails(specialistId));
        assertEquals("Specialist not found", exception.getMessage());
    }
}