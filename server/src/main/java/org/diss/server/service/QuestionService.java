package org.diss.server.service;

import org.diss.server.entity.Lesson;
import org.diss.server.entity.Question;
import org.diss.server.repository.LessonRepository;
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

    @Autowired
    private LessonRepository lessonRepository;

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

    public Question addQuestionToLesson(Long lessonId, Question question) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        question.setLesson(lesson);
        return questoionRepository.save(question);
    }

    public Question updateQuestion(Long id, Question updatedQuestion) {
        Question question = questoionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));

        question.setQuestion(updatedQuestion.getQuestion());
        question.setOptionA(updatedQuestion.getOptionA());
        question.setOptionB(updatedQuestion.getOptionB());
        question.setOptionC(updatedQuestion.getOptionC());
        question.setCorrectAnswer(updatedQuestion.getCorrectAnswer());

        return questoionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        if (!questoionRepository.existsById(id)) {
            throw new RuntimeException("Question not found with id: " + id);
        }
        questoionRepository.deleteById(id);
    }

    public void deleteQuestionsByLessonId(Long lessonId) {
        List<Question> questions = questoionRepository.findByLessonId(lessonId);
        if (questions.isEmpty()) {
            throw new RuntimeException("No questions found for lesson with id: " + lessonId);
        }
        questoionRepository.deleteAll(questions);
    }
}
