package com.example.soulcare.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.soulcare.dto.UserProfileResponse;
import com.example.soulcare.model.User;
import com.example.soulcare.repository.PatientRepository;
import com.example.soulcare.repository.SpecialistRepository;
import com.example.soulcare.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final SpecialistRepository specialistRepository;

    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return UserProfileResponse.builder()
                .id(user.getId())
                .displayName(toDisplayName(user.getEmail()))
                .email(user.getEmail())
                .role(user.getRole())
                .photoURL(user.getAvatarUrl())
                .build();
    }

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> UserProfileResponse.builder()
                        .id(user.getId())
                        .displayName(toDisplayName(user.getEmail()))
                        .email(user.getEmail())
                        .role(user.getRole())
                        .photoURL(user.getAvatarUrl())
                        .build())
                .toList();
    }

    public UUID getPatientIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return patientRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Patient profile not found for user: " + email)).getId();
    }

    public UUID getSpecialistIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return specialistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Specialist profile not found for user: " + email)).getId();
    }

    private String toDisplayName(String email) {
        if (email == null || email.isBlank()) {
            return "User";
        }

        String localPart = email.split("@")[0].replace('.', ' ').replace('_', ' ').trim();
        if (localPart.isEmpty()) {
            return "User";
        }

        return Character.toUpperCase(localPart.charAt(0)) + localPart.substring(1);
    }
}
