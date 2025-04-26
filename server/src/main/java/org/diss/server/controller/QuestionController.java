package org.diss.server.controller;

import org.diss.server.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import org.diss.server.dto.QuestionWithoutAnswerDTO;
import org.diss.server.entity.Question;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/question")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllQuestions() {
        return new ResponseEntity<>(questionService.getAllQuestions(), HttpStatus.OK);
    }

    @GetMapping("/getAllQuestions")
    public ResponseEntity<List<QuestionWithoutAnswerDTO>> getAllQuestionsWithoutCorrectAnswer() {
        return new ResponseEntity<>(questionService.getAllQuestionsWithoutCorrectAnswer(), HttpStatus.OK);
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<Question>> getQuestionsByLessonId(@PathVariable Long lessonId) {
        return new ResponseEntity<>(questionService.getQuestionsByLessonId(lessonId), HttpStatus.OK);
    }

    @GetMapping("/lesson/{lessonId}/without-answers")
    public ResponseEntity<List<QuestionWithoutAnswerDTO>> getQuestionsWithoutAnswerByLessonId(@PathVariable Long lessonId) {
        return new ResponseEntity<>(questionService.getQuestionsWithoutAnswerByLessonId(lessonId), HttpStatus.OK);
    }
}
