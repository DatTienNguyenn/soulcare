package com.example.soulcare.dto;

import java.util.UUID;

import com.example.soulcare.model.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private UUID id;
    private String displayName;
    private String email;
    private Role role;
    private String photoURL;
}
