package org.diss.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LessonProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserInfo user;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    private int lastCompletedParagraphIndex = -1;

    @Column(name = "is_completed")
    private boolean completed = false;

    public boolean isCompleted() {
        return completed;
    }

    public void markParagraphAsCompleted(int paragraphIndex) {
        if (paragraphIndex == lastCompletedParagraphIndex + 1) {
            this.lastCompletedParagraphIndex = paragraphIndex;
            if (lesson != null && lastCompletedParagraphIndex == lesson.getParagraphs().size() - 1) {
                this.completed = true;
            }
        }
    }
} 