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
@Table(name = "pictures")
public class Picture {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "drawing_data", columnDefinition = "text")
    private String drawingData; // JSON string containing drawing commands

    @Column(name = "image_url", columnDefinition = "text")
    private String imageUrl; // Base64 PNG image data

    @Column(name = "metadata", columnDefinition = "text")
    private String metadata; // JSON string containing drawing metadata

    @Column(name = "description", columnDefinition = "text")
    private String description; // User-provided title or description

    @Column(name = "status", length = 20)
    private String status; // PUBLISHED, DRAFT, ARCHIVED

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "last_update")
    private LocalDateTime lastUpdate;
}
