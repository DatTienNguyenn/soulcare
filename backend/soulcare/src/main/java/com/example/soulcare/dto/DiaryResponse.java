package com.example.soulcare.dto;

import com.example.soulcare.model.DiaryStatus;
import com.example.soulcare.model.MoodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiaryResponse {
    private UUID id;
    private UUID patientId;
    private String title;
    private MoodType mood;
    private String content;
    private DiaryStatus status;
    private String hashtag;
    private LocalDate diaryDate;
    private LocalDateTime createdAt;
    private LocalDateTime lastUpdate;
}
