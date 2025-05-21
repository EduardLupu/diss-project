package org.diss.server.dto;

import lombok.Data;

@Data
public class QuizProgressRequest {
    private Long userId;
    private Long lessonId;
    private int score;
} 