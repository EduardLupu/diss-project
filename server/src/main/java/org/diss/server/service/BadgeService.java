package org.diss.server.service;

import org.diss.server.entity.Badge;
import org.diss.server.entity.EarnedBadge;
import org.diss.server.repository.BadgeRepository;
import org.diss.server.repository.EarnedBadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

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
}
