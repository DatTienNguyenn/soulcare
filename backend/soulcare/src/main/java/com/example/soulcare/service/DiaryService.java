package com.example.soulcare.service;

import com.example.soulcare.dto.DiaryRequest;
import com.example.soulcare.dto.DiaryResponse;
import com.example.soulcare.dto.DiaryFrequencyResponse;
import com.example.soulcare.dto.ActivityFrequencyResponse;
import com.example.soulcare.model.Diary;
import com.example.soulcare.model.DiaryStatus;
import com.example.soulcare.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DiaryService {
    private final DiaryRepository diaryRepository;

    public DiaryResponse createDiary(UUID patientId, DiaryRequest request) {
        Diary diary = Diary.builder()
                .patientId(patientId)
                .title(request.getTitle())
                .content(request.getContent())
                .mood(request.getMood())
                .status(request.getStatus() != null ? request.getStatus() : DiaryStatus.PUBLISHED)
                .hashtag(request.getTags() != null ? String.join(",", request.getTags()) : "")
                .diaryDate(request.getDiaryDate())
                .build();

        Diary savedDiary = diaryRepository.save(diary);
        return mapToResponse(savedDiary);
    }

    public DiaryResponse updateDiary(UUID patientId, UUID diaryId, DiaryRequest request) {
        Diary diary = diaryRepository.findByIdAndPatientId(diaryId, patientId)
                .orElseThrow(() -> new RuntimeException("Diary not found"));

        diary.setTitle(request.getTitle());
        diary.setContent(request.getContent());
        diary.setMood(request.getMood());
        diary.setStatus(request.getStatus() != null ? request.getStatus() : DiaryStatus.PUBLISHED);
        diary.setHashtag(request.getTags() != null ? String.join(",", request.getTags()) : "");
        diary.setDiaryDate(request.getDiaryDate());

        Diary updatedDiary = diaryRepository.save(diary);
        return mapToResponse(updatedDiary);
    }

    @Transactional(readOnly = true)
    public DiaryResponse getDiary(UUID patientId, UUID diaryId) {
        Diary diary = diaryRepository.findByIdAndPatientId(diaryId, patientId)
                .orElseThrow(() -> new RuntimeException("Diary not found"));
        return mapToResponse(diary);
    }

    @Transactional(readOnly = true)
    public List<DiaryResponse> getAllDiaries(UUID patientId) {
        List<Diary> diaries = diaryRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return diaries.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DiaryResponse> getDiariesByDateRange(UUID patientId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Diary> diaries = diaryRepository.findByPatientIdAndCreatedAtBetween(patientId, startDate, endDate);
        return diaries.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteDiary(UUID patientId, UUID diaryId) {
        Diary diary = diaryRepository.findByIdAndPatientId(diaryId, patientId)
                .orElseThrow(() -> new RuntimeException("Diary not found"));
        diaryRepository.delete(diary);
    }

    /**
     * Get diary frequency by date for analytics
     * Counts how many diary entries were written on each date
     */
    @Transactional(readOnly = true)
    public DiaryFrequencyResponse getDiaryFrequency(UUID patientId) {
        List<Diary> diaries = diaryRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        
        // Group diaries by created date and count them
        Map<LocalDate, Long> frequencyMap = diaries.stream()
                .collect(Collectors.groupingBy(
                        diary -> diary.getCreatedAt().toLocalDate(),
                        Collectors.counting()
                ));
        
        // Convert to ActivityFrequencyResponse list
        List<ActivityFrequencyResponse> frequencies = frequencyMap.entrySet().stream()
                .map(entry -> ActivityFrequencyResponse.builder()
                        .date(entry.getKey())
                        .count(entry.getValue().intValue())
                        .build())
                .sorted(Comparator.comparing(ActivityFrequencyResponse::getDate))
                .collect(Collectors.toList());
        
        return DiaryFrequencyResponse.builder()
                .frequencies(frequencies)
                .totalDiaries(diaries.size())
                .build();
    }

    private DiaryResponse mapToResponse(Diary diary) {
        return DiaryResponse.builder()
                .id(diary.getId())
                .patientId(diary.getPatientId())
                .title(diary.getTitle())
                .mood(diary.getMood())
                .content(diary.getContent())
                .status(diary.getStatus())
                .hashtag(diary.getHashtag())
                .diaryDate(diary.getDiaryDate())
                .createdAt(diary.getCreatedAt())
                .lastUpdate(diary.getLastUpdate())
                .build();
    }
}
