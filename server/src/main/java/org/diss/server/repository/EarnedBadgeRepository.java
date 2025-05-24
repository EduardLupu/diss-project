package org.diss.server.repository;

import org.diss.server.entity.Badge;
import org.diss.server.entity.EarnedBadge;
import org.diss.server.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EarnedBadgeRepository extends JpaRepository<EarnedBadge, Long> {

    List<EarnedBadge> findByUserId(Long userId);

    boolean existsByUserIdAndBadgeId(Long userId, Long badgeId);

    void deleteByBadgeId(Long badgeId);
}
