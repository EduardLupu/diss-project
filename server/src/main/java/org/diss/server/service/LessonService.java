package org.diss.server.service;

import org.diss.server.entity.Lesson;
import org.diss.server.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

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

    public void deleteLesson(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new RuntimeException("Lesson not found with id: " + id);
        }
        lessonRepository.deleteById(id);
    }
}
