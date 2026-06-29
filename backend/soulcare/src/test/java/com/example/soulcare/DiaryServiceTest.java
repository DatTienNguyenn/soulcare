package com.example.soulcare;

import com.example.soulcare.dto.DiaryFrequencyResponse;
import com.example.soulcare.dto.DiaryRequest;
import com.example.soulcare.dto.DiaryResponse;
import com.example.soulcare.model.Diary;
import com.example.soulcare.model.DiaryStatus;
import com.example.soulcare.model.MoodType;
import com.example.soulcare.repository.DiaryRepository;
import com.example.soulcare.service.DiaryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiaryServiceTest {

    @Mock
    private DiaryRepository diaryRepository;

    @InjectMocks
    private DiaryService diaryService;

    private UUID patientId;
    private UUID diaryId;
    private Diary diary;
    private DiaryRequest diaryRequest;

    @BeforeEach
    void setUp() {
        patientId = UUID.randomUUID();
        diaryId = UUID.randomUUID();

        diaryRequest = new DiaryRequest();
        diaryRequest.setTitle("Test Title");
        diaryRequest.setContent("Test Content");
        diaryRequest.setMood(MoodType.HAPPY);
        diaryRequest.setTags(Arrays.asList("test", "mood"));
        diaryRequest.setDiaryDate(LocalDate.now());

        diary = Diary.builder()
                .id(diaryId)
                .patientId(patientId)
                .title(diaryRequest.getTitle())
                .content(diaryRequest.getContent())
                .mood(diaryRequest.getMood())
                .hashtag("test,mood")
                .diaryDate(diaryRequest.getDiaryDate())
                .createdAt(LocalDateTime.now())
                .status(DiaryStatus.PUBLISHED)
                .build();
    }

    @Test
    @DisplayName("Create Diary: Should save and return a diary response")
    void createDiary_shouldSaveAndReturnResponse() {
        // Arrange
        when(diaryRepository.save(any(Diary.class))).thenReturn(diary);

        // Act
        DiaryResponse response = diaryService.createDiary(patientId, diaryRequest);

        // Assert
        assertNotNull(response);
        assertEquals(diary.getId(), response.getId());
        assertEquals("Test Title", response.getTitle());
        assertEquals(MoodType.HAPPY, response.getMood());
        verify(diaryRepository, times(1)).save(any(Diary.class));
    }

    @Test
    @DisplayName("Update Diary: Should throw exception if diary not found")
    void updateDiary_shouldThrowException_whenNotFound() {
        // Arrange
        when(diaryRepository.findByIdAndPatientId(diaryId, patientId)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> diaryService.updateDiary(patientId, diaryId, diaryRequest));
        assertEquals("Diary not found", exception.getMessage());
        verify(diaryRepository, never()).save(any());
    }

    @Test
    @DisplayName("Get All Diaries: Should return empty list if no diaries exist")
    void getAllDiaries_shouldReturnEmptyList_whenNoDiaries() {
        // Arrange
        when(diaryRepository.findByPatientIdOrderByCreatedAtDesc(patientId)).thenReturn(Collections.emptyList());

        // Act
        List<DiaryResponse> responses = diaryService.getAllDiaries(patientId);

        // Assert
        assertTrue(responses.isEmpty());
    }

    @Test
    @DisplayName("Delete Diary: Should call delete on repository")
    void deleteDiary_shouldCallRepositoryDelete() {
        // Arrange
        when(diaryRepository.findByIdAndPatientId(diaryId, patientId)).thenReturn(Optional.of(diary));
        doNothing().when(diaryRepository).delete(diary);

        // Act
        diaryService.deleteDiary(patientId, diaryId);

        // Assert
        verify(diaryRepository, times(1)).delete(diary);
    }
}