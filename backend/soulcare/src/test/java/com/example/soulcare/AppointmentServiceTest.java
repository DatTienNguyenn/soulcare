package com.example.soulcare;

import com.example.soulcare.dto.AppointmentRequest;
import com.example.soulcare.dto.AppointmentResponse;
import com.example.soulcare.model.*;
import com.example.soulcare.repository.*;
import com.example.soulcare.service.AppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private SpecialistRepository specialistRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PatientRepository patientRepository;
    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private UUID patientId;
    private UUID specialistId;
    private UUID appointmentId;
    private Patient patient;
    private Specialist specialist;
    private User patientUser;
    private User specialistUser;
    private Appointment appointment;
    private AppointmentRequest appointmentRequest;

    @BeforeEach
    void setUp() {
        patientId = UUID.randomUUID();
        specialistId = UUID.randomUUID();
        appointmentId = UUID.randomUUID();

        patient = new Patient();
        patient.setId(patientId);
        patient.setUserId(UUID.randomUUID());
        patient.setFullName("Test Patient");

        specialist = new Specialist();
        specialist.setId(specialistId);
        specialist.setUserId(UUID.randomUUID());
        specialist.setFullName("Test Specialist");

        patientUser = User.builder().id(patient.getUserId()).email("patient@test.com").avatarUrl("patient_avatar").build();
        specialistUser = User.builder().id(specialist.getUserId()).email("specialist@test.com").avatarUrl("specialist_avatar").build();

        appointmentRequest = new AppointmentRequest();
        appointmentRequest.setSpecialistId(specialistId);
        appointmentRequest.setScheduledAt(LocalDateTime.now().plusDays(1));

        appointment = Appointment.builder()
                .id(appointmentId)
                .patientId(patientId)
                .specialistId(specialistId)
                .scheduledAt(appointmentRequest.getScheduledAt())
                .status(AppointmentStatus.PENDING)
                .build();
    }

    @Test
    @DisplayName("Create Appointment: Should succeed when patient and specialist exist")
    void createAppointment_shouldSucceed_whenValid() {
        // Arrange
        when(specialistRepository.findById(specialistId)).thenReturn(Optional.of(specialist));
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);
        when(userRepository.findById(patient.getUserId())).thenReturn(Optional.of(patientUser));
        when(userRepository.findById(specialist.getUserId())).thenReturn(Optional.of(specialistUser));
        when(reviewRepository.findByAppointmentId(any())).thenReturn(Optional.empty());

        // Act
        AppointmentResponse response = appointmentService.createAppointment(patientId, appointmentRequest);

        // Assert
        assertNotNull(response);
        assertEquals(appointmentId, response.getId());
        assertEquals(AppointmentStatus.PENDING, response.getStatus());
        assertEquals("Test Patient", response.getPatientName());
        assertEquals("Test Specialist", response.getSpecialistName());
        verify(appointmentRepository, times(1)).save(any(Appointment.class));
    }

    @Test
    @DisplayName("Create Appointment: Should fail when specialist not found")
    void createAppointment_shouldFail_whenSpecialistNotFound() {
        // Arrange
        when(specialistRepository.findById(specialistId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> appointmentService.createAppointment(patientId, appointmentRequest));
        assertEquals("Specialist not found", exception.getMessage());
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    @DisplayName("Get Specialist Appointments: Should return list of appointments")
    void getSpecialistAppointments_shouldReturnAppointments() {
        // Arrange
        when(specialistRepository.findById(specialistId)).thenReturn(Optional.of(specialist));
        when(appointmentRepository.findBySpecialistIdOrderByScheduledAtDesc(specialistId)).thenReturn(Collections.singletonList(appointment));
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(userRepository.findById(patient.getUserId())).thenReturn(Optional.of(patientUser));
        when(userRepository.findById(specialist.getUserId())).thenReturn(Optional.of(specialistUser));

        // Act
        List<AppointmentResponse> responses = appointmentService.getSpecialistAppointments(specialistId);

        // Assert
        assertFalse(responses.isEmpty());
        assertEquals(1, responses.size());
        assertEquals(appointmentId, responses.get(0).getId());
    }

    @Test
    @DisplayName("Confirm Appointment: Should change status to CONFIRMED")
    void confirmAppointment_shouldChangeStatus() {
        // Arrange
        when(appointmentRepository.findByIdAndSpecialistId(appointmentId, specialistId)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        appointmentService.confirmAppointment(specialistId, appointmentId);

        // Assert
        assertEquals(AppointmentStatus.CONFIRMED, appointment.getStatus());
        verify(appointmentRepository, times(1)).save(appointment);
    }
}