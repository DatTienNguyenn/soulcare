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
        if (request.getRole() == null) {
            throw new RuntimeException("Role is required (PATIENT or SPECIALIST)");
        }

        var user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.valueOf(request.getRole()))
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
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        return jwtService.generateToken(user);
    }
}
