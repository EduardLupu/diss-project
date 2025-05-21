package org.diss.server.controller;

import lombok.RequiredArgsConstructor;
import org.diss.server.dto.QuizProgressDTO;
import org.diss.server.dto.QuizProgressRequest;
import org.diss.server.service.QuizProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz-progress")
@RequiredArgsConstructor
public class QuizProgressController {
    private final QuizProgressService quizProgressService;

    @PostMapping
    public ResponseEntity<QuizProgressDTO> saveProgress(@RequestBody QuizProgressRequest request) {
        return ResponseEntity.ok(quizProgressService.saveProgress(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuizProgressDTO>> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(quizProgressService.getUserProgress(userId));
    }
} 