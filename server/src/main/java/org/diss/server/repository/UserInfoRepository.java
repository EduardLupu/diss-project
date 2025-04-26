package org.diss.server.repository;

import org.diss.server.entity.UserInfo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    /**
     * get user by firstName
     * @param username
     * @return
     */
    Optional<UserInfo> findByUsername(String username);

    Optional<UserInfo> findByEmail(String email);
}