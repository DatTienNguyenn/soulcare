package com.example.soulcare.repository;

import com.example.soulcare.model.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, UUID> {
    List<Diary> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
    
    Optional<Diary> findByIdAndPatientId(UUID id, UUID patientId);
    
    List<Diary> findByPatientIdAndCreatedAtBetween(UUID patientId, LocalDateTime startDate, LocalDateTime endDate);
}
