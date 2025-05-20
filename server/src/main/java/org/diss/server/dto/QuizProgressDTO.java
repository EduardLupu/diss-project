package org.diss.server.dto;

import lombok.Data;

@Data
public class QuizProgressDTO {
    private Long id;
    private Long userId;
    private Long lessonId;
    private int score;
    private boolean completed;
    private int attempts;
} 