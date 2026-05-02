package com.example.soulcare.dto;

import com.example.soulcare.model.DiaryStatus;
import com.example.soulcare.model.MoodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiaryRequest {
    private String title;
    private String content;
    private MoodType mood;
    private List<String> tags;
    private DiaryStatus status;
    private LocalDate diaryDate;
}
