package org.diss.server.controller;

import org.diss.server.entity.Badge;
import org.diss.server.entity.BadgeDTO;
import org.diss.server.entity.EarnedBadge;
import org.diss.server.entity.UserInfo;
import org.diss.server.service.BadgeService;
import org.diss.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/badge")
public class BadgeController {

    @Autowired
    private BadgeService badgeService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBadgesForUser(@PathVariable Long userId) {

        // Get all badges in the system
        List<Badge> allBadges = badgeService.getAllBadges();

        // Get all earned badges by this user
        List<EarnedBadge> earnedBadges = badgeService.getEarnedBadgesByUser(userId);

        // Map badgeId -> isEarned for quick lookup
        Map<Long, Boolean> earnedMap = earnedBadges.stream()
                .collect(Collectors.toMap(e -> e.getBadge().getId(), EarnedBadge::isEarned));

        // Create DTO list marking which badges are earned
        List<BadgeDTO> badgeDTOs = allBadges.stream()
                .map(badge -> {
                    boolean earned = earnedMap.getOrDefault(badge.getId(), false);
                    return new BadgeDTO(
                            badge.getId(),
                            badge.getImage(),
                            badge.getTitle(),
                            badge.getDescription(),
                            earned
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(badgeDTOs);
    }

    @GetMapping("/user/{userId}/earned")
    public ResponseEntity<?> getAllEarnedBadgesByUserId(@PathVariable Long userId) {
        // Get all earned badges by this user
        List<EarnedBadge> earnedBadges = badgeService.getEarnedBadgesByUser(userId);

        // Filter only earned badges and convert to DTOs
        List<BadgeDTO> earnedBadgeDTOs = earnedBadges.stream()
                .filter(EarnedBadge::isEarned)
                .map(earnedBadge -> {
                    Badge badge = earnedBadge.getBadge();
                    return new BadgeDTO(
                            badge.getId(),
                            badge.getImage(),
                            badge.getTitle(),
                            badge.getDescription(),
                            true  // Since we filtered for earned badges, this will always be true
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(earnedBadgeDTOs);
    }

    @PostMapping("/lesson/{lessonId}")
    public ResponseEntity<Badge> addBadge(@PathVariable Long lessonId, @RequestBody Badge badge) {
        Badge savedBadge = badgeService.addBadgeToLesson(lessonId, badge);
        return ResponseEntity.ok(savedBadge);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Badge> updateBadge(@PathVariable Long id, @RequestBody Badge badge) {
        return ResponseEntity.ok(badgeService.updateBadge(id, badge));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBadge(@PathVariable Long id) {
        badgeService.deleteBadge(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<Badge>> getBadgesByLessonId(@PathVariable Long lessonId) {
        List<Badge> badges = badgeService.getBadgesByLessonId(lessonId);
        return ResponseEntity.ok(badges);
    }
}



