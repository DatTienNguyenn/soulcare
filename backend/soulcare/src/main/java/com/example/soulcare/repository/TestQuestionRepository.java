package com.example.soulcare.repository;

import com.example.soulcare.model.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TestQuestionRepository extends JpaRepository<TestQuestion, UUID> {
    List<TestQuestion> findByTestIdOrderByQuestionOrderAsc(UUID testId);
    Optional<TestQuestion> findByTestIdAndId(UUID testId, UUID questionId);
    void deleteByTestIdAndId(UUID testId, UUID questionId);
    long countByTestId(UUID testId);
}
