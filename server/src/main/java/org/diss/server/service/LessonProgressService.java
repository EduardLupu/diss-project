package org.diss.server.service;

import org.diss.server.entity.Lesson;
import org.diss.server.entity.LessonProgress;
import org.diss.server.entity.UserInfo;
import org.diss.server.repository.LessonProgressRepository;
import org.diss.server.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LessonProgressService {

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Transactional
    public LessonProgress getOrCreateProgress(UserInfo user, Lesson lesson) {
        return lessonProgressRepository.findByUserAndLesson(user, lesson)
                .orElseGet(() -> {
                    LessonProgress newProgress = new LessonProgress();
                    newProgress.setUser(user);
                    newProgress.setLesson(lesson);
                    return lessonProgressRepository.save(newProgress);
                });
    }

    @Transactional
    public LessonProgress markParagraphAsCompleted(UserInfo user, Long lessonId, int paragraphIndex) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        if (paragraphIndex < 0 || paragraphIndex >= lesson.getParagraphs().size()) {
            throw new IllegalArgumentException("Invalid paragraph index");
        }

        LessonProgress progress = getOrCreateProgress(user, lesson);
        progress.markParagraphAsCompleted(paragraphIndex);
        return lessonProgressRepository.save(progress);
    }

    public boolean isLessonCompleted(UserInfo user, Lesson lesson) {
        return lessonProgressRepository.findByUserAndLesson(user, lesson)
                .map(LessonProgress::isCompleted)
                .orElse(false);
    }

    public int getLastCompletedParagraphIndex(UserInfo user, Lesson lesson) {
        return lessonProgressRepository.findByUserAndLesson(user, lesson)
                .map(LessonProgress::getLastCompletedParagraphIndex)
                .orElse(-1);
    }
} 