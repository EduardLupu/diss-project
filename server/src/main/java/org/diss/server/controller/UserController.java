package org.diss.server.controller;


import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.Response;
import org.diss.server.dto.AuthRequest;
import org.diss.server.dto.AuthenticationResponse;
import org.diss.server.dto.RegisterRequest;
import org.diss.server.dto.StringDTO;
import org.diss.server.entity.UserInfo;
import org.diss.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public void addUser(@RequestBody RegisterRequest registerRequest) {
        userService.addUser(registerRequest);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok(userService.authenticate(authRequest));
    }

    @GetMapping("/getUserInfo/{username}")
    public UserInfo getUserInfo(@PathVariable String username) {
        return userService.getUser(username).get();
    }

    @GetMapping("/getUserInfoByToken")
    public UserInfo getUserInfoByToken(@RequestHeader("Authorization") String authorizationHeader) {
        return userService.getUserByToken(authorizationHeader);
    }
}