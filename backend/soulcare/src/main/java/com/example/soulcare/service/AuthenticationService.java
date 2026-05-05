package com.example.soulcare.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.soulcare.auth.jwt.JwtService;
import com.example.soulcare.dto.LoginRequest;
import com.example.soulcare.dto.RegisterRequest;
import com.example.soulcare.model.Patient;
import com.example.soulcare.model.Role;
import com.example.soulcare.model.User;
import com.example.soulcare.repository.PatientRepository;
import com.example.soulcare.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PatientRepository patientRepository; // Cần tạo thêm profile patient
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterRequest request) {
        // Validate role is provided
        if (request.getRole() == null || request.getRole().isEmpty()) {
            throw new RuntimeException("Role is required (PATIENT, SPECIALIST, or ADMIN)");
        }

        // Validate role is one of the valid enum values
        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole() + ". Must be PATIENT, SPECIALIST, or ADMIN");
        }

        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        var user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        userRepository.save(user);

        String fullName = request.getFirstName() + " " + request.getLastName();

        if (user.getRole() == Role.PATIENT) {
            var patient = new Patient();
            patient.setUserId(user.getId());
            patient.setFullName(fullName); 
            patientRepository.save(patient);
        }

        return jwtService.generateToken(user);
    }

    public String login(LoginRequest request) {
        // Validate role is provided
        if (request.getRole() == null || request.getRole().isEmpty()) {
            throw new RuntimeException("Role is required for login");
        }

        // Validate role is one of the valid enum values
        Role requestedRole;
        try {
            requestedRole = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole() + ". Must be PATIENT, SPECIALIST, or ADMIN");
        }

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Validate that the requested role matches the user's actual role
        if (user.getRole() != requestedRole) {
            throw new RuntimeException("Invalid role for this user account");
        }

        return jwtService.generateToken(user);
    }
}
