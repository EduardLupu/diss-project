package org.diss.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String question;
    private String optionA;
    private String optionB;
    private String optionC;
    private String correctAnswer;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}
