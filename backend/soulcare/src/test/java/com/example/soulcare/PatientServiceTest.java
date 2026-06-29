package com.example.soulcare;

import com.example.soulcare.dto.PatientProfileDTO;
import com.example.soulcare.model.Patient;
import com.example.soulcare.model.User;
import com.example.soulcare.repository.PatientRepository;
import com.example.soulcare.repository.UserRepository;
import com.example.soulcare.service.PatientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PatientService patientService;

    private User user;
    private Patient patient;
    private String userEmail;

    @BeforeEach
    void setUp() {
        userEmail = "testpatient@soulcare.com";
        UUID userId = UUID.randomUUID();
        UUID patientId = UUID.randomUUID();

        user = User.builder()
                .id(userId)
                .email(userEmail)
                .avatarUrl("initial_avatar.jpg")
                .build();

        patient = new Patient();
        patient.setId(patientId);
        patient.setUserId(userId);
        patient.setFullName("Initial Name");
    }

    @Test
    @DisplayName("Get Profile: Should return profile when user and patient exist")
    void getPatientProfile_shouldReturnProfile_whenExists() {
        // Arrange
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(patientRepository.findByUserId(user.getId())).thenReturn(Optional.of(patient));

        // Act
        PatientProfileDTO result = patientService.getPatientProfile(userEmail);

        // Assert
        assertNotNull(result);
        assertEquals(patient.getId(), result.getId());
        assertEquals("Initial Name", result.getFullName());
        assertEquals("initial_avatar.jpg", result.getAvatarUrl());
    }

    @Test
    @DisplayName("Get Profile: Should throw exception when user not found")
    void getPatientProfile_shouldThrowException_whenUserNotFound() {
        // Arrange
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> patientService.getPatientProfile(userEmail));
        assertEquals("User not found", exception.getMessage());
    }

    @Test
    @DisplayName("Update Profile: Should update patient and user data correctly")
    void updatePatientProfile_shouldUpdateData() {
        // Arrange
        PatientProfileDTO updateData = new PatientProfileDTO();
        updateData.setFullName("Updated Name");
        updateData.setAvatarUrl("updated_avatar.jpg");

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(patientRepository.findByUserId(user.getId())).thenReturn(Optional.of(patient));
        when(patientRepository.save(any(Patient.class))).thenReturn(patient);
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Act
        PatientProfileDTO result = patientService.updatePatientProfile(userEmail, updateData);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Name", result.getFullName());
        assertEquals("updated_avatar.jpg", result.getAvatarUrl());

        // Verify that the patient's full name was updated
        assertEquals("Updated Name", patient.getFullName());
        // Verify that the user's avatar URL was updated
        assertEquals("updated_avatar.jpg", user.getAvatarUrl());
        verify(patientRepository, times(1)).save(patient);
        verify(userRepository, times(1)).save(user);
    }
}
