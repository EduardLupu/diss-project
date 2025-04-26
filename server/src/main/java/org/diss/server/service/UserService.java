package org.diss.server.service;

import lombok.RequiredArgsConstructor;
import org.diss.server.dto.AuthRequest;
import org.diss.server.dto.AuthenticationResponse;
import org.diss.server.dto.RegisterRequest;
import org.diss.server.entity.UserInfo;
import org.diss.server.repository.RoleRepository;
import org.diss.server.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
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
        var userRole = roleRepository.findByName("ROLE_USER")
                // todo - better exception handling
                .orElseThrow(() -> new IllegalStateException("ROLE USER was not initiated"));

        var user = UserInfo.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .roles(List.of(userRole))
                        .build();
        userInfoRepository.save(user);
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
        return userInfoRepository.findByEmail(username);
    }

    public UserInfo getUserByToken(String authorizationHeader) {
        String token = authorizationHeader.substring(7);
        String username = jwtService.extractUsername(token);

        UserInfo user = userInfoRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return user;
    }
}