package org.diss.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizResponseDTO {
    private Long lessonId;
    private List<QuestionResponse> responses;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class QuestionResponse {
        private Long questionId;
        private String selectedAnswer;  // Must be "A", "B", or "C"
    }
} 