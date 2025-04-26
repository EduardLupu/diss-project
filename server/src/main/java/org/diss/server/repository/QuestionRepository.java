package org.diss.server.repository;

import org.diss.server.entity.Lesson;
import org.diss.server.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByLesson(Lesson lesson);
    List<Question> findByLessonId(Long lessonId);
}
