package com.example.soulcare.repository;

import com.example.soulcare.model.Specialist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SpecialistRepository extends JpaRepository<Specialist, UUID> {
    Optional<Specialist> findByUserId(UUID userId);
}
