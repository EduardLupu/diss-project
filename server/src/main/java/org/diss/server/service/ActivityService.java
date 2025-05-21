package org.diss.server.service;

import lombok.RequiredArgsConstructor;
import org.diss.server.entity.Activity;
import org.diss.server.entity.UserInfo;
import org.diss.server.repository.ActivityRepository;
import org.diss.server.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private UserInfoRepository userInfoRepository;

    public List<Activity> findAllActivitiesByUserId(Long userId) {

        UserInfo user = userInfoRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID::" + userId));

        // Check if the user is null
        if (user == null) {
            throw new RuntimeException("User not found with ID::" + userId);
        }

        return activityRepository.findAllActivitiesByUserId(userId);
    }
}
