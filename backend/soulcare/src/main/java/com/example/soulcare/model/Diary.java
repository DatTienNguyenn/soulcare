package com.example.soulcare.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "diaries")
public class Diary {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "mood")
    @Enumerated(EnumType.STRING)
    private MoodType mood;

    @Column(name = "content", columnDefinition = "text")
    private String content;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private DiaryStatus status;

    @Column(name = "hashtag")
    private String hashtag;

    @Column(name = "diary_date")
    private LocalDate diaryDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "last_update")
    private LocalDateTime lastUpdate;
}
