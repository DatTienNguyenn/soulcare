package com.example.soulcare.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.soulcare.dto.UserProfileResponse;
import com.example.soulcare.model.User;
import com.example.soulcare.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return UserProfileResponse.builder()
                .id(user.getId())
                .displayName(toDisplayName(user.getEmail()))
                .email(user.getEmail())
                .role(user.getRole())
                .photoURL(null)
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
                        .photoURL(null)
                        .build())
                .toList();
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
