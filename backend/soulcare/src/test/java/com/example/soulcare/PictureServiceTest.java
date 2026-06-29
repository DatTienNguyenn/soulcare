package com.example.soulcare;

import com.example.soulcare.dto.PictureResponse;
import com.example.soulcare.dto.PictureSaveRequest;
import com.example.soulcare.model.Picture;
import com.example.soulcare.repository.PictureRepository;
import com.example.soulcare.service.PictureService;
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
class PictureServiceTest {

    @Mock
    private PictureRepository pictureRepository;

    @InjectMocks
    private PictureService pictureService;

    private UUID patientId;
    private UUID pictureId;
    private Picture picture;
    private PictureSaveRequest saveRequest;

    @BeforeEach
    void setUp() {
        patientId = UUID.randomUUID();
        pictureId = UUID.randomUUID();

        saveRequest = new PictureSaveRequest();
        saveRequest.setDescription("A test drawing");
        saveRequest.setImageUrl("http://example.com/image.png");
        saveRequest.setStatus("PUBLISHED");

        picture = Picture.builder()
                .id(pictureId)
                .patientId(patientId)
                .description(saveRequest.getDescription())
                .imageUrl(saveRequest.getImageUrl())
                .status(saveRequest.getStatus())
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Save Picture: Should save and return a picture response")
    void savePicture_shouldSaveAndReturnResponse() {
        // Arrange
        when(pictureRepository.save(any(Picture.class))).thenReturn(picture);

        // Act
        PictureResponse response = pictureService.savePicture(patientId, saveRequest);

        // Assert
        assertNotNull(response);
        assertEquals(picture.getId(), response.getId());
        assertEquals("A test drawing", response.getDescription());
        verify(pictureRepository, times(1)).save(any(Picture.class));
    }

    @Test
    @DisplayName("Update Picture: Should throw exception if picture not found")
    void updatePicture_shouldThrowException_whenNotFound() {
        // Arrange
        when(pictureRepository.findByIdAndPatientId(pictureId, patientId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> pictureService.updatePicture(patientId, pictureId, saveRequest));
        assertEquals("Picture not found", exception.getMessage());
        verify(pictureRepository, never()).save(any());
    }

    @Test
    @DisplayName("Get All Patient Pictures (Public): Should return only published pictures")
    void getAllPatientPictures_shouldReturnOnlyPublished() {
        // Arrange
        Picture privatePicture = Picture.builder().status("PRIVATE").build();
        when(pictureRepository.findByPatientIdOrderByCreatedAtDesc(patientId))
                .thenReturn(List.of(picture, privatePicture)); // picture is PUBLISHED

        // Act
        List<PictureResponse> responses = pictureService.getAllPatientPictures(patientId);

        // Assert
        assertEquals(1, responses.size());
        assertEquals(picture.getId(), responses.get(0).getId());
    }
}