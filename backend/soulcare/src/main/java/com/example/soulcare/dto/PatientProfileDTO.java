package com.example.soulcare.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class PatientProfileDTO {
    private UUID id;
    private UUID userId;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String avatarUrl;
    private Boolean publish;
}
