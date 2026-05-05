package com.example.soulcare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.soulcare.dto.ApiResponse;
import com.example.soulcare.dto.UserProfileResponse;
import com.example.soulcare.service.UserService;

import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        UserProfileResponse profile = userService.getCurrentUserProfile(email);

        return ResponseEntity.ok(ApiResponse.success(profile, "Current user fetched successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users, "All users fetched successfully"));
    }
}
