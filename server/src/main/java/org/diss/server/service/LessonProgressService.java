package org.diss.server.service;

import org.diss.server.entity.*;
import org.diss.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LessonProgressService {

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private ActivityRepository activityRepository;

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

        if (paragraphIndex == 0) {
            Activity activity = Activity.builder()
                    .type("lesson_start")
                    .name(lesson.getTitle())
                    .user(user)
                    .build();
            activityRepository.save(activity);
        }

        progress.markParagraphAsCompleted(paragraphIndex);

        return lessonProgressRepository.save(progress);
    }

    public long getInProgressLessonsCount(UserInfo user) {
        return lessonProgressRepository.countByUserAndCompletedFalse(user);
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


    public long getCompletedLessonsCount(UserInfo user) {
        return lessonProgressRepository.countByUserAndCompletedTrue(user);
    }
} 