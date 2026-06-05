package com.example.soulcare.controller;

import com.example.soulcare.dto.AppointmentResponse;
import com.example.soulcare.service.AdminAppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin/appointments")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminAppointmentController {
    private final AdminAppointmentService adminAppointmentService;

    @GetMapping("/no-shows")
    public ResponseEntity<List<AppointmentResponse>> getNoShowAppointments() {
        return ResponseEntity.ok(adminAppointmentService.getNoShowAppointments());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<AppointmentResponse> approveNoShow(@PathVariable UUID id) {
        return ResponseEntity.ok(adminAppointmentService.approveNoShow(id));
    }

    @PostMapping("/{id}/decline")
    public ResponseEntity<AppointmentResponse> declineNoShow(@PathVariable UUID id) {
        return ResponseEntity.ok(adminAppointmentService.declineNoShow(id));
    }
}