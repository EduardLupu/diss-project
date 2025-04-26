package org.diss.server.controller;

import org.diss.server.entity.Lesson;
import org.diss.server.entity.LessonProgress;
import org.diss.server.entity.UserInfo;
import org.diss.server.service.LessonProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lesson-progress")
public class LessonProgressController {

    @Autowired
    private LessonProgressService lessonProgressService;

    @PostMapping("/{lessonId}/complete-paragraph/{paragraphIndex}")
    public ResponseEntity<LessonProgress> completeParagraph(
            @AuthenticationPrincipal UserInfo user,
            @PathVariable Long lessonId,
            @PathVariable int paragraphIndex) {
        
        LessonProgress progress = lessonProgressService.markParagraphAsCompleted(user, lessonId, paragraphIndex);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/{lessonId}/status")
    public ResponseEntity<LessonProgressStatus> getLessonStatus(
            @AuthenticationPrincipal UserInfo user,
            @PathVariable Long lessonId) {
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);

        LessonProgressStatus status = new LessonProgressStatus(
            lessonProgressService.isLessonCompleted(user, lesson),
            lessonProgressService.getLastCompletedParagraphIndex(user, lesson)
        );
        return ResponseEntity.ok(status);
    }

    public static class LessonProgressStatus {
        private final boolean completed;
        private final int lastCompletedParagraphIndex;

        public LessonProgressStatus(boolean completed, int lastCompletedParagraphIndex) {
            this.completed = completed;
            this.lastCompletedParagraphIndex = lastCompletedParagraphIndex;
        }

        public boolean isCompleted() {
            return completed;
        }

        public int getLastCompletedParagraphIndex() {
            return lastCompletedParagraphIndex;
        }
    }
} 