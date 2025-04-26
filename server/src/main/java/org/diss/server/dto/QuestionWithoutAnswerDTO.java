package org.diss.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionWithoutAnswerDTO {
    private Long id;
    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
} 