package org.diss.server.repository;

import org.diss.server.entity.Lesson;
import org.diss.server.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByLesson(Lesson lesson);
    List<Question> findByLessonId(Long lessonId);
    
    default String getOptionText(Long questionId, String option) {
        Optional<Question> question = findById(questionId);
        if (question.isEmpty()) {
            throw new RuntimeException("Question not found");
        }
        
        return switch (option.toUpperCase()) {
            case "A" -> question.get().getOptionA();
            case "B" -> question.get().getOptionB();
            case "C" -> question.get().getOptionC();
            default -> throw new RuntimeException("Invalid option. Must be A, B, or C");
        };
    }

    void deleteByLessonId(Long lessonId);
}
