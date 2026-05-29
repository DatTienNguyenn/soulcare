package com.example.soulcare.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicSpecialistDTO {
    private UUID id;
    private String name;
    private String bio;
    private String specialization; // primary specialization (first tag)
    private Integer yearsOfExperience;
    private List<String> specializations; // all specialty tags
    private BigDecimal rating;
    private Integer reviewCount;
    private BigDecimal hourlyRate; // default session pricing
    private String avatarUrl; // from User.profilePicture
    private Integer experience; // years
    private List<String> certifications;
    private List<String> languages;
    private String availableHours; // e.g., "9:00 AM - 6:00 PM"
    private String responseTime; // e.g., "Typically responds in 1 hour"

    public void setSpecializationsFromArray(String[] specialtyTags) {
        if (specialtyTags != null && specialtyTags.length > 0) {
            this.specializations = Arrays.asList(specialtyTags);
            this.specialization = specialtyTags[0];
        }
    }
}
