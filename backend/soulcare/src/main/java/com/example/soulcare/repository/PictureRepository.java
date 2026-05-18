package com.example.soulcare.repository;

import com.example.soulcare.model.Picture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PictureRepository extends JpaRepository<Picture, UUID> {
    List<Picture> findByPatientIdOrderByCreatedAtDesc(UUID patientId);

    Optional<Picture> findByIdAndPatientId(UUID id, UUID patientId);

    void deleteByIdAndPatientId(UUID id, UUID patientId);
}
