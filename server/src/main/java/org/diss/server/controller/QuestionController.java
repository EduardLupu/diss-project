package org.diss.server.controller;

import org.diss.server.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.diss.server.dto.QuestionWithoutAnswerDTO;
import org.diss.server.entity.Question;

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

    @PostMapping("/lesson/{lessonId}")
    public ResponseEntity<Question> addQuestion(@PathVariable Long lessonId, @RequestBody Question question) {
        Question savedQuestion = questionService.addQuestionToLesson(lessonId, question);
        return ResponseEntity.ok(savedQuestion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        return ResponseEntity.ok(questionService.updateQuestion(id, question));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/lesson/{lessonId}")
    public ResponseEntity<Void> deleteQuestionsByLessonId(@PathVariable Long lessonId) {
        questionService.deleteQuestionsByLessonId(lessonId);
        return ResponseEntity.noContent().build();
    }
}
