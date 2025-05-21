package org.diss.server.service;

import lombok.RequiredArgsConstructor;
import org.diss.server.dto.AuthRequest;
import org.diss.server.dto.AuthenticationResponse;
import org.diss.server.dto.ChangePasswordRequest;
import org.diss.server.dto.RegisterRequest;
import org.diss.server.entity.Activity;
import org.diss.server.entity.UserInfo;
import org.diss.server.repository.ActivityRepository;
import org.diss.server.repository.RoleRepository;
import org.diss.server.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.util.*;

/**
 * the user service implementation
 */
@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private ActivityRepository activityRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private Environment env;
    @Autowired
    private final RoleRepository roleRepository;

    /**
     * register a new user
     *
     * @param request
     * @return
     */
    public void addUser(RegisterRequest request) {
        if (userInfoRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already in use.");
        }

        var userRole = roleRepository.findByName("ROLE_USER")
                // todo - better exception handling
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));

        UserInfo user = UserInfo.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .roles(List.of(userRole))
                        .build();

        userInfoRepository.save(user);

        Activity activity = Activity.builder()
                .type("register")
                .name("Registration success")
                .user(user)
                .build();

        activityRepository.save(activity);
    }

    public AuthenticationResponse authenticate(AuthRequest authRequest) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );

        var claims = new HashMap<String, Object>();
        var user = ((UserInfo) auth.getPrincipal());
        claims.put("fullName", user.getFullName());
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("username", user.getUsername());

        var jwtToken = jwtService.generateToken(claims, (UserInfo) auth.getPrincipal());
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public Optional<UserInfo> getUser(String username) {
        return userInfoRepository.findByUsername(username);
    }

    public Optional<UserInfo> getUserByToken(String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        System.out.println("Received token: " + token);
        String username = jwtService.extractUsername(token);

        return userInfoRepository.findByUsername(username);
    }

    public void changePassword(ChangePasswordRequest request) {
        var user = userInfoRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userInfoRepository.save(user);
    }
}