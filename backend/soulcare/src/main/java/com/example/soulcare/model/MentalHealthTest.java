package com.example.soulcare.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "mental_health_tests")
public class MentalHealthTest {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "test_name", nullable = false, length = 255)
    private String name;

    @Column(name = "short_name", length = 50)
    private String shortName;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "duration", length = 50)
    private String duration;

    @Column(name = "total_questions")
    private Integer totalQuestions;

    @Column(name = "min_score")
    private Integer minScore;

    @Column(name = "max_score")
    private Integer maxScore;

    @Column(name = "scoring_guide", columnDefinition = "json")
    private String scoringGuide; // JSON string for flexibility

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TestStatus status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;
}
