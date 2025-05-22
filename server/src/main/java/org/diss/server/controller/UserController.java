package org.diss.server.controller;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.diss.server.dto.AuthRequest;
import org.diss.server.dto.AuthenticationResponse;
import org.diss.server.dto.ChangePasswordRequest;
import org.diss.server.dto.RegisterRequest;

import org.diss.server.entity.UserInfo;
import org.diss.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

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

    @PostMapping("/change-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody @Valid ChangePasswordRequest request
    ) {
        userService.changePassword(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getProfilePicture/{pictureName}")
    public ResponseEntity<byte[]> getProfilePicture(@PathVariable String pictureName) {
        try {

            ClassPathResource imageFile = new ClassPathResource("avatars/" + pictureName);

            if (!imageFile.exists()) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageBytes = imageFile.getInputStream().readAllBytes();

            // Auto-detect media type based on extension
            MediaType contentType = pictureName.endsWith(".jpg") || pictureName.endsWith(".jpeg")
                    ? MediaType.IMAGE_JPEG
                    : MediaType.IMAGE_PNG;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(contentType);

            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/change-profile-picture")
    public ResponseEntity<?> changeProfilePicture(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody String profilePictureName
    ) {
        profilePictureName = profilePictureName.replace("\"", "").trim();

        boolean success = userService.changeProfilePicture(authorizationHeader, profilePictureName);

        if (success) {
            return ResponseEntity.ok("Profile picture updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to update profile picture.");
        }
    }

    @PostMapping("/upload-profile-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded.");
        }

        // Get filename
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isBlank()) {
            return ResponseEntity.badRequest().body("Invalid file name.");
        }

        // Save file to src/main/resources/avatars/
        String folderPath = new File("src/main/resources/avatars").getAbsolutePath();
        File directory = new File(folderPath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        File targetFile = new File(directory, fileName);
        try (FileOutputStream fos = new FileOutputStream(targetFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File save failed.");
        }

        boolean updated = userService.changeProfilePicture(authorizationHeader, fileName);
        if (!updated) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Failed to update profile picture.");
        }

        return ResponseEntity.ok("Profile picture uploaded and updated successfully.");
    }

}