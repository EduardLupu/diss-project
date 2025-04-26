package org.diss.server.service;

import org.diss.server.entity.Question;
import org.diss.server.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.diss.server.dto.QuestionWithoutAnswerDTO;
import java.util.stream.Collectors;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questoionRepository;

    public List<Question> getAllQuestions() {
        return questoionRepository.findAll();
    }

    public List<QuestionWithoutAnswerDTO> getAllQuestionsWithoutCorrectAnswer() {
        return questoionRepository.findAll().stream()
                .map(question -> new QuestionWithoutAnswerDTO(
                        question.getId(),
                        question.getQuestion(),
                        question.getOptionA(),
                        question.getOptionB(),
                        question.getOptionC()))
                .collect(Collectors.toList());
    }

    public List<Question> getQuestionsByLessonId(Long lessonId) {
        return questoionRepository.findByLessonId(lessonId);
    }

    public List<QuestionWithoutAnswerDTO> getQuestionsWithoutAnswerByLessonId(Long lessonId) {
        return questoionRepository.findByLessonId(lessonId).stream()
                .map(question -> new QuestionWithoutAnswerDTO(
                        question.getId(),
                        question.getQuestion(),
                        question.getOptionA(),
                        question.getOptionB(),
                        question.getOptionC()))
                .collect(Collectors.toList());
    }
}
