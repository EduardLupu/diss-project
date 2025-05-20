package org.diss.server.controller;

import lombok.RequiredArgsConstructor;
import org.diss.server.entity.Activity;
import org.diss.server.service.ActivityService;
import org.diss.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor

public class ActivityController {

    private final ActivityService activityService;
    private final UserService userService;

    @GetMapping("/{userId}/user")
    public ResponseEntity<List<Activity>> getAllActivitiesByUserId(
            @PathVariable Long userId) {
        return ResponseEntity.ok(activityService.findAllActivitiesByUserId(userId));
    }


}
