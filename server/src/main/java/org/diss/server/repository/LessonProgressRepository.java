package org.diss.server.repository;

import org.diss.server.entity.Lesson;
import org.diss.server.entity.LessonProgress;
import org.diss.server.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByUserAndLesson(UserInfo user, Lesson lesson);

    long countByUserAndCompletedTrue(UserInfo user);

    long countByUserAndCompletedFalse(UserInfo user);
} 