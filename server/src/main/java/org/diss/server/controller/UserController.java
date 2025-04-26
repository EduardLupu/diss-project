package org.diss.server.controller;

import org.diss.server.dto.AuthRequest;
import org.diss.server.dto.AuthenticationResponse;
import org.diss.server.dto.RegisterRequest;

import org.diss.server.entity.UserInfo;
import org.diss.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> addUser(@RequestBody RegisterRequest registerRequest) {
        userService.addUser(registerRequest);
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok(userService.authenticate(authRequest));
    }

    @GetMapping("/getUserInfo/{username}")
    public ResponseEntity<UserInfo> getUserInfo(@PathVariable String username) {
        return userService.getUser(username)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/getUserInfoByToken")
    public ResponseEntity<UserInfo> getUserInfoByToken(@RequestHeader("Authorization") String authorizationHeader) {
        return userService.getUserByToken(authorizationHeader)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}