package com.example.soulcare.service;

import com.example.soulcare.dto.PatientProfileDTO;
import com.example.soulcare.model.Patient;
import com.example.soulcare.model.User;
import com.example.soulcare.repository.PatientRepository;
import com.example.soulcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientService {
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientProfileDTO getPatientProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        return mapToDTO(patient, user);
    }

    public PatientProfileDTO updatePatientProfile(String email, PatientProfileDTO profileData) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        if (profileData.getFullName() != null) {
            patient.setFullName(profileData.getFullName());
        }
        if (profileData.getDateOfBirth() != null) {
            patient.setDateOfBirth(profileData.getDateOfBirth());
        }
        if (profileData.getGender() != null) {
            patient.setGender(profileData.getGender());
        }
        if (profileData.getPublish() != null) {
            patient.setPublish(profileData.getPublish());
        }

        patient = patientRepository.save(patient);

        if (profileData.getAvatarUrl() != null) {
            user.setAvatarUrl(profileData.getAvatarUrl());
            userRepository.save(user);
        }

        return mapToDTO(patient, user);
    }

    private PatientProfileDTO mapToDTO(Patient patient, User user) {
        PatientProfileDTO dto = new PatientProfileDTO();
        dto.setId(patient.getId());
        dto.setUserId(patient.getUserId());
        dto.setFullName(patient.getFullName());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setPublish(patient.isPublish());
        return dto;
    }
}
