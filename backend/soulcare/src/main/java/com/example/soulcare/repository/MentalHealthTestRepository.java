package com.example.soulcare.repository;

import com.example.soulcare.model.MentalHealthTest;
import com.example.soulcare.model.TestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MentalHealthTestRepository extends JpaRepository<MentalHealthTest, UUID> {
    List<MentalHealthTest> findByStatus(TestStatus status);
    List<MentalHealthTest> findAll();
}
