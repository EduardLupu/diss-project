package org.diss.server.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserLessonStatsDTO {
    private long totalLessons;
    private long completedLessons;
    private long inProgressLessons;
}