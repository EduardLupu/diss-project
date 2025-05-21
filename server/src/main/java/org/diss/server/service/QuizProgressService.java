package org.diss.server.service;

import lombok.RequiredArgsConstructor;
import org.diss.server.dto.QuizProgressDTO;
import org.diss.server.dto.QuizProgressRequest;
import org.diss.server.entity.Lesson;
import org.diss.server.entity.QuizProgress;
import org.diss.server.entity.UserInfo;
import org.diss.server.repository.LessonRepository;
import org.diss.server.repository.QuizProgressRepository;
import org.diss.server.repository.UserInfoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizProgressService {
    private final QuizProgressRepository quizProgressRepository;
    private final UserInfoRepository userRepository;
    private final LessonRepository lessonRepository;

    public QuizProgressDTO saveProgress(QuizProgressRequest request) {
        UserInfo user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        QuizProgress existingProgress = quizProgressRepository
                .findByUserIdAndLessonId(request.getUserId(), request.getLessonId())
                .orElse(new QuizProgress());

        if(!existingProgress.isCompleted()) {
            existingProgress.setUser(user);
            existingProgress.setLesson(lesson);
            existingProgress.setScore(request.getScore());
            existingProgress.setCompleted(request.getScore() == 100);
            existingProgress.setAttempts(existingProgress.getAttempts() + 1);

            QuizProgress savedProgress = quizProgressRepository.save(existingProgress);
            return convertToDTO(savedProgress);
        } else {
            return convertToDTO(existingProgress);
        }
    }

    public List<QuizProgressDTO> getUserProgress(Long userId) {
        return quizProgressRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private QuizProgressDTO convertToDTO(QuizProgress progress) {
        QuizProgressDTO dto = new QuizProgressDTO();
        dto.setId(progress.getId());
        dto.setUserId(progress.getUser().getId());
        dto.setLessonId(progress.getLesson().getId());
        dto.setScore(progress.getScore());
        dto.setCompleted(progress.isCompleted());
        dto.setAttempts(progress.getAttempts());
        return dto;
    }
} 