package org.diss.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WrongAnswers {
    private String question;

    private String wrongAnswer;

    private String correctAnswer;
}
