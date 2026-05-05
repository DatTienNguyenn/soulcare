package com.example.soulcare.repository;

import com.example.soulcare.model.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, UUID> {
    List<TestResult> findByPatientId(UUID patientId);
    List<TestResult> findByPatientIdAndTestId(UUID patientId, UUID testId);
}
