package com.example.soulcare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSpecialistProfileRequest {
    @NotBlank
    private String fullName;

    private String[] specialtyTags; // Array of specialty tags
    
    private String bio; // Professional bio
    
    private Integer years_exp; // Years of experience
    private String avatarUrl; // URL to the specialist's avatar image
}
