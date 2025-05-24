package org.diss.server.service;

import jakarta.transaction.Transactional;
import org.diss.server.entity.Badge;
import org.diss.server.entity.Lesson;
import org.diss.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private EarnedBadgeRepository earnedBadgeRepository;

    @Autowired
    private QuizProgressRepository quizProgressRepository;

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    public List<Lesson> getAll() {
        return lessonRepository.findAll();
    }

    public Lesson addLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(Long id, Lesson updatedLesson) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        lesson.setTitle(updatedLesson.getTitle());
        lesson.setEstimatedTime(updatedLesson.getEstimatedTime());
        lesson.setDescription(updatedLesson.getDescription());
        lesson.setParagraphs(updatedLesson.getParagraphs());

        return lessonRepository.save(lesson);
    }

    @Transactional
    public void deleteLesson(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new RuntimeException("Lesson not found with id: " + id);
        }

        List<Badge> badges = badgeRepository.findByLessonId(id);

        for (Badge badge : badges) {
            earnedBadgeRepository.deleteByBadgeId(badge.getId());
        }

        badgeRepository.deleteByLessonId(id);

        quizProgressRepository.deleteByLessonId(id);

        questionRepository.deleteByLessonId(id);

        lessonProgressRepository.deleteByLessonId(id);

        lessonRepository.deleteById(id);
    }

    public Lesson getLessonById(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
    }
}
