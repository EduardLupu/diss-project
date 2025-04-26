package org.diss.server.controller;

import org.diss.server.dto.QuizResponseDTO;
import org.diss.server.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/submit")
    public ResponseEntity<QuizService.QuizResult> submitQuiz(@RequestBody QuizResponseDTO quizResponse) {
        QuizService.QuizResult result = quizService.evaluateQuiz(quizResponse);
        return ResponseEntity.ok(result);
    }
} 