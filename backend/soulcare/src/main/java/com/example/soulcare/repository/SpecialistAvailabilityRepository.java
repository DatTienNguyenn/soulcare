package com.example.soulcare.repository;

import com.example.soulcare.model.SpecialistAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpecialistAvailabilityRepository extends JpaRepository<SpecialistAvailability, UUID> {
    List<SpecialistAvailability> findBySpecialistIdOrderByDayOfWeek(UUID specialistId);
    
    List<SpecialistAvailability> findBySpecialistIdAndActiveTrueOrderByDayOfWeek(UUID specialistId);
    
    Optional<SpecialistAvailability> findBySpecialistIdAndDayOfWeek(UUID specialistId, Integer dayOfWeek);
    
    void deleteBySpecialistIdAndDayOfWeek(UUID specialistId, Integer dayOfWeek);
}
