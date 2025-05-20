package org.diss.server.repository;

import org.diss.server.entity.Activity;
import org.springframework.data.jpa.repository.Query;
import org.diss.server.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByUserAndCreatedAt(UserInfo user, LocalDateTime createdAt);

    @Query("""
            SELECT a FROM Activity a
            WHERE a.user.id = :userId
            """)
    List<Activity> findAllActivitiesByUserId(@Param("userId") Long userId);
}
