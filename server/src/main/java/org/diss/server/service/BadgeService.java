package org.diss.server.service;

import org.diss.server.entity.Badge;
import org.diss.server.entity.EarnedBadge;
import org.diss.server.entity.Lesson;
import org.diss.server.repository.BadgeRepository;
import org.diss.server.repository.EarnedBadgeRepository;
import org.diss.server.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private EarnedBadgeRepository earnedBadgeRepository;

    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }

    public List<EarnedBadge> getEarnedBadgesByUser(Long userId) {
        return earnedBadgeRepository.findByUserId(userId);
    }

    // Get all badges for a lesson
    public List<Badge> getBadgesByLesson(Long lessonId) {
        return badgeRepository.findByLessonId(lessonId);
    }

    // Save earned badge record
    public EarnedBadge saveEarnedBadge(EarnedBadge earnedBadge) {
        return earnedBadgeRepository.save(earnedBadge);
    }

    public Badge addBadgeToLesson(Long lessonId, Badge badge) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        badge.setLesson(lesson);
        return badgeRepository.save(badge);
    }

    public Badge updateBadge(Long id, Badge updatedBadge) {
        Badge badge = badgeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Badge not found with id: " + id));

        badge.setImage(updatedBadge.getImage());
        badge.setTitle(updatedBadge.getTitle());
        badge.setDescription(updatedBadge.getDescription());

        return badgeRepository.save(badge);
    }

    public void deleteBadge(Long id) {
        if (!badgeRepository.existsById(id)) {
            throw new RuntimeException("Badge not found with id: " + id);
        }
        badgeRepository.deleteById(id);
    }
}
