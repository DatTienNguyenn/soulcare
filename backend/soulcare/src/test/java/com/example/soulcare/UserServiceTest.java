package com.example.soulcare;

import com.example.soulcare.model.Patient;
import com.example.soulcare.model.User;
import com.example.soulcare.model.Role;
import com.example.soulcare.repository.PatientRepository;
import com.example.soulcare.repository.UserRepository;
import com.example.soulcare.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private UserService userService;

    private User user;
    private Patient patient;
    private String userEmail;
    private UUID userId;
    private UUID patientId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        patientId = UUID.randomUUID();
        userEmail = "patient@soulcare.com";

        user = User.builder()
                .id(userId)
                .email(userEmail)
                .passwordHash("hashedpassword")
                .role(Role.PATIENT)
                .build();

        patient = new Patient();
        patient.setId(patientId);
        patient.setUserId(userId);
    }

    @Test
    @DisplayName("Get Patient ID by Email: Should return ID when user and patient exist")
    void getPatientIdByEmail_shouldReturnId_whenUserAndPatientExist() {
        // Arrange
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(patientRepository.findByUserId(userId)).thenReturn(Optional.of(patient));

        // Act
        UUID resultPatientId = userService.getPatientIdByEmail(userEmail);

        // Assert
        assertNotNull(resultPatientId);
        assertEquals(patientId, resultPatientId);
        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(patientRepository, times(1)).findByUserId(userId);
    }

    @Test
    @DisplayName("Get Patient ID by Email: Should throw exception when user not found")
    void getPatientIdByEmail_shouldThrowException_whenUserNotFound() {
        // Arrange
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> userService.getPatientIdByEmail(userEmail));
        verify(userRepository, times(1)).findByEmail(userEmail);
        verify(patientRepository, never()).findByUserId(any());
    }

    @Test
    @DisplayName("Get Patient ID by Email: Should throw exception when patient profile not found")
    void getPatientIdByEmail_shouldThrowException_whenPatientNotFound() {
        // Arrange
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(patientRepository.findByUserId(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> userService.getPatientIdByEmail(userEmail));
    }
}