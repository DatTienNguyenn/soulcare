package com.example.soulcare.repository;

import com.example.soulcare.model.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface QuestionOptionRepository extends JpaRepository<QuestionOption, UUID> {
    List<QuestionOption> findByQuestionIdOrderByOptionOrderAsc(UUID questionId);
    void deleteByQuestionId(UUID questionId);
}
