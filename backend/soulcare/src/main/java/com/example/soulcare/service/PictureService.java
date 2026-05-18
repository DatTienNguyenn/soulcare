package com.example.soulcare.service;

import com.example.soulcare.dto.ActivityFrequencyResponse;
import com.example.soulcare.dto.DiaryFrequencyResponse;
import com.example.soulcare.dto.PictureSaveRequest;
import com.example.soulcare.dto.PictureResponse;
import com.example.soulcare.model.Picture;
import com.example.soulcare.repository.PictureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PictureService {
    private final PictureRepository pictureRepository;

    public PictureResponse savePicture(UUID patientId, PictureSaveRequest request) {
        Picture picture = Picture.builder()
                .patientId(patientId)
                .drawingData(request.getDrawingData())
                .metadata(request.getMetadata())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus() != null ? request.getStatus() : "PUBLISHED")
                .build();

        Picture savedPicture = pictureRepository.save(picture);
        return mapToResponse(savedPicture);
    }

    public PictureResponse updatePicture(UUID patientId, UUID pictureId, PictureSaveRequest request) {
        Picture picture = pictureRepository.findByIdAndPatientId(pictureId, patientId)
                .orElseThrow(() -> new RuntimeException("Picture not found"));

        picture.setDrawingData(request.getDrawingData());
        picture.setMetadata(request.getMetadata());
        picture.setDescription(request.getDescription());
        picture.setImageUrl(request.getImageUrl());
        picture.setStatus(request.getStatus() != null ? request.getStatus() : "PUBLISHED");

        Picture updatedPicture = pictureRepository.save(picture);
        return mapToResponse(updatedPicture);
    }

    @Transactional(readOnly = true)
    public PictureResponse getPicture(UUID patientId, UUID pictureId) {
        Picture picture = pictureRepository.findByIdAndPatientId(pictureId, patientId)
                .orElseThrow(() -> new RuntimeException("Picture not found"));
        return mapToResponse(picture);
    }

    @Transactional(readOnly = true)
    public List<PictureResponse> getAllPictures(UUID patientId) {
        List<Picture> pictures = pictureRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return pictures.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DiaryFrequencyResponse getDrawingFrequency(UUID patientId) {
        List<Picture> pictures = pictureRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        
        // Group pictures by created date and count them (each picture = 1 drawing session)
        Map<LocalDate, Long> frequencyMap = pictures.stream()
                .collect(Collectors.groupingBy(
                        picture -> picture.getCreatedAt().toLocalDate(),
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
                .totalDiaries(pictures.size()) // Using totalDiaries field for total sessions
                .build();
    }

    public void deletePicture(UUID patientId, UUID pictureId) {
        pictureRepository.deleteByIdAndPatientId(pictureId, patientId);
    }

    private PictureResponse mapToResponse(Picture picture) {
        return PictureResponse.builder()
                .id(picture.getId())
                .patientId(picture.getPatientId())
                .drawingData(picture.getDrawingData())
                .metadata(picture.getMetadata())
                .description(picture.getDescription())
                .imageUrl(picture.getImageUrl())
                .status(picture.getStatus())
                .createdAt(picture.getCreatedAt())
                .lastUpdate(picture.getLastUpdate())
                .build();
    }
}
