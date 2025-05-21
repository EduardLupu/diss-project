package org.diss.server.service;

import org.diss.server.dto.QuizResponseDTO;
import org.diss.server.dto.WrongAnswers;
import org.diss.server.entity.Lesson;
import org.diss.server.entity.Question;
import org.diss.server.repository.LessonRepository;
import org.diss.server.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public QuizResult evaluateQuiz(QuizResponseDTO quizResponse) {
        Lesson lesson = lessonRepository.findById(quizResponse.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        List<Question> questions = questionRepository.findByLesson(lesson);
        
        if (questions.isEmpty()) {
            throw new RuntimeException("No questions found for this lesson");
        }

        // Convert responses to a map for easier lookup
        Map<Long, String> responseMap = quizResponse.getResponses().stream()
                .collect(Collectors.toMap(
                    QuizResponseDTO.QuestionResponse::getQuestionId,
                    QuizResponseDTO.QuestionResponse::getSelectedAnswer
                ));

        int totalQuestions = questions.size();
        int correctAnswers = 0;
        List<WrongAnswers> wrongAnswers = new ArrayList<>();

        // Evaluate each question
        for (Question question : questions) {
            String userAnswer = responseMap.get(question.getId());
            if (userAnswer == null) {
                throw new RuntimeException("Missing answer for question: " + question.getId());
            }

            // Validate that the answer is A, B, or C
            if (!userAnswer.matches("[ABC]")) {
                throw new RuntimeException("Invalid answer format. Must be A, B, or C");
            }

            String correctOption = question.getCorrectAnswer();
            if (userAnswer.equals(correctOption)) {
                correctAnswers++;
            } else {
                wrongAnswers.add(new WrongAnswers(question.getQuestion(),
                        "(" + userAnswer + ") " + questionRepository.getOptionText(question.getId(), userAnswer),
                        "(" + correctOption + ") " + questionRepository.getOptionText(question.getId(), correctOption)
                ));
            }
        }

        // Calculate percentage
        double percentage = ((double) correctAnswers / totalQuestions) * 100;
        boolean passed = percentage >= 50; // Assuming 50% is the passing threshold

        return new QuizResult(
            passed,
            correctAnswers,
            totalQuestions,
            percentage,
            wrongAnswers
        );
    }

    public record QuizResult(
        boolean passed,
        int correctAnswers,
        int totalQuestions,
        double percentage,
        List<WrongAnswers> wrongAnswers
    ) {}
} 