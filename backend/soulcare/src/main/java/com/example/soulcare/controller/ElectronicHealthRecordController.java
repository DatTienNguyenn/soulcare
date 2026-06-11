package com.example.soulcare.controller;

import com.example.soulcare.model.ElectronicHealthRecord;
import com.example.soulcare.repository.ElectronicHealthRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ehr")
@RequiredArgsConstructor
public class ElectronicHealthRecordController {
    private final ElectronicHealthRecordRepository ehrRepository;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ElectronicHealthRecord>> getPatientRecords(@PathVariable UUID patientId) {
        List<ElectronicHealthRecord> records = ehrRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return ResponseEntity.ok(records);
    }
}