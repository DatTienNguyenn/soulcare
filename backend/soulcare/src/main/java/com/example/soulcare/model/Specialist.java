package com.example.soulcare.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "specialists")
public class Specialist {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId; // Reference to User entity

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "specialty_tags", columnDefinition = "text[]")
    private String[] specialtyTags; // Array of specialties: {'depression', 'anxiety', etc.}

    @Column(name = "rating_avg", precision = 3, scale = 2)
    private BigDecimal ratingAverage; // Average rating from reviews

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
