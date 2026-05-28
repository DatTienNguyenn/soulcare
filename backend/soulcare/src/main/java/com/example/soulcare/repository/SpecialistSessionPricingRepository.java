package com.example.soulcare.repository;

import com.example.soulcare.model.SpecialistSessionPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpecialistSessionPricingRepository extends JpaRepository<SpecialistSessionPricing, UUID> {
    List<SpecialistSessionPricing> findBySpecialistIdAndActiveTrue(UUID specialistId);
    
    List<SpecialistSessionPricing> findBySpecialistId(UUID specialistId);
    
    Optional<SpecialistSessionPricing> findBySpecialistIdAndSessionType(UUID specialistId, String sessionType);
    
    void deleteBySpecialistIdAndSessionType(UUID specialistId, String sessionType);
}
