package com.example.soulcare;

import com.example.soulcare.dto.MentalHealthTestRequest;
import com.example.soulcare.dto.MentalHealthTestResponse;
import com.example.soulcare.model.MentalHealthTest;
import com.example.soulcare.model.TestStatus;
import com.example.soulcare.repository.MentalHealthTestRepository;
import com.example.soulcare.service.MentalHealthTestService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MentalHealthTestServiceTest {

    @Mock
    private MentalHealthTestRepository testRepository;

    @InjectMocks
    private MentalHealthTestService testService;

    private MentalHealthTest test;
    private MentalHealthTestRequest request;
    private UUID testId;
    private String adminEmail;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        adminEmail = "admin@soulcare.com";

        test = MentalHealthTest.builder()
                .id(testId)
                .name("Test Name")
                .shortName("T1")
                .description("Test Description")
                .status(TestStatus.ACTIVE)
                .createdBy(adminEmail)
                .build();

        request = new MentalHealthTestRequest();
        request.setName("Test Name");
        request.setShortName("T1");
        request.setDescription("Test Description");
        request.setStatus("ACTIVE");
    }

    @Test
    void createTest_shouldReturnCreatedTest() {
        // Arrange
        when(testRepository.save(any(MentalHealthTest.class))).thenReturn(test);

        // Act
        MentalHealthTestResponse response = testService.createTest(request, adminEmail);

        // Assert
        assertNotNull(response);
        assertEquals(test.getName(), response.getName());
        assertEquals(test.getCreatedBy(), response.getCreatedBy());
        verify(testRepository, times(1)).save(any(MentalHealthTest.class));
    }

    @Test
    void updateTest_shouldReturnUpdatedTest() {
        // Arrange
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));
        when(testRepository.save(any(MentalHealthTest.class))).thenReturn(test);
        request.setName("Updated Name");

        // Act
        MentalHealthTestResponse response = testService.updateTest(testId, request);

        // Assert
        assertNotNull(response);
        assertEquals("Updated Name", response.getName());
        verify(testRepository, times(1)).findById(testId);
        verify(testRepository, times(1)).save(test);
    }

    @Test
    void getTest_shouldReturnTestWhenFound() {
        // Arrange
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));

        // Act
        MentalHealthTestResponse response = testService.getTest(testId);

        // Assert
        assertNotNull(response);
        assertEquals(testId, response.getId());
        verify(testRepository, times(1)).findById(testId);
    }

    @Test
    void getTest_shouldThrowExceptionWhenNotFound() {
        // Arrange
        when(testRepository.findById(testId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> testService.getTest(testId));
        verify(testRepository, times(1)).findById(testId);
    }

    @Test
    void getAllTests_shouldReturnListOfTests() {
        // Arrange
        when(testRepository.findAll()).thenReturn(List.of(test));

        // Act
        List<MentalHealthTestResponse> responses = testService.getAllTests();

        // Assert
        assertFalse(responses.isEmpty());
        assertEquals(1, responses.size());
        verify(testRepository, times(1)).findAll();
    }

    @Test
    void deleteTest_shouldCompleteSuccessfully() {
        // Arrange
        when(testRepository.findById(testId)).thenReturn(Optional.of(test));
        doNothing().when(testRepository).delete(test);

        // Act
        testService.deleteTest(testId);

        // Assert
        verify(testRepository, times(1)).findById(testId);
        verify(testRepository, times(1)).delete(test);
    }
}

