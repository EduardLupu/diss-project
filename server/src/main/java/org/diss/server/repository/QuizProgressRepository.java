package org.diss.server.repository;

import org.diss.server.entity.QuizProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizProgressRepository extends JpaRepository<QuizProgress, Long> {
    List<QuizProgress> findByUserId(Long userId);
    Optional<QuizProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    void deleteByLessonId(Long lessonId);
} 