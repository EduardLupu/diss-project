package org.diss.server.repository;

import org.diss.server.entity.Badge;
import org.diss.server.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    List<Badge> findByLessonId(Long lessonId);
}
