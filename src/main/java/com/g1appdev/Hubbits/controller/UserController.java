package com.g1appdev.Hubbits.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.g1appdev.Hubbits.entity.UserEntity;
import com.g1appdev.Hubbits.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // Create a new user
    @PostMapping
    public ResponseEntity<UserEntity> createUser(@RequestBody UserEntity user) {
        UserEntity createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    // Get all users
    @GetMapping
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        List<UserEntity> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Get a user by ID
//    @GetMapping("/{id}")
//    public ResponseEntity<UserEntity> getUserById(@PathVariable Long id) {
//        Optional<UserEntity> user = userService.findUserById(id);
//        if (user.isPresent()) {
//            return new ResponseEntity<>(user.get(), HttpStatus.OK);
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        Optional<UserEntity> user = userService.findUserById(id);
        if (user.isPresent()) {
            UserEntity foundUser = user.get();
            Map<String, Object> response = Map.of(
                    "userId", foundUser.getUserId(),
                    "username", foundUser.getUsername(),
                    "firstName", foundUser.getFirstName(),
                    "lastName", foundUser.getLastName(),
                    "email", foundUser.getEmail(),
                    "address", foundUser.getAddress(),
                    "phoneNumber", foundUser.getPhoneNumber(),
                    "role", foundUser.getRole(),
                    "profilePicture", foundUser.getProfilePictureBase64() // Send Base64 encoded profile picture
            );
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Update a user by ID with profile picture support
    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')") or  @com.g1appdev.Hubbits.service.UserService.isOwner(#id)")
    public ResponseEntity<UserEntity> updateUser(
            @PathVariable Long id,
            @RequestParam("user") String userJson,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {

        if (userService.isOwnerOrAdmin(id)) {
            // Proceed with update logic
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        try {
            UserEntity updatedUser = new ObjectMapper().readValue(userJson, UserEntity.class);
            UserEntity user = userService.updateUser(id, updatedUser, profilePicture);
            if (user != null) {
                return new ResponseEntity<>(user, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            boolean isDeleted = userService.deleteUser(id);
            if (isDeleted) {
                return ResponseEntity.ok("User deleted successfully");
            } else {
                return ResponseEntity.status(404).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting user");
        }
    }


    // Get the currently authenticated user
//    @GetMapping("/me")
//    public ResponseEntity<UserEntity> getCurrentUser() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String currentUsername = authentication != null ? authentication.getName() : null;
//
//        if (currentUsername == null) {
//            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
//        }
//
//        Optional<UserEntity> user = userService.findByUsername(currentUsername);
//        if (user.isPresent()) {
//            System.out.println("User found: " + user.get().getUsername());  // Log username to verify
//            return new ResponseEntity<>(user.get(), HttpStatus.OK);
//        } else {
//            System.out.println("User not found for username: " + currentUsername);  // Log missing user
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication != null ? authentication.getName() : null;

        if (currentUsername == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Optional<UserEntity> user = userService.findByUsername(currentUsername);
        if (user.isPresent()) {
            UserEntity foundUser = user.get();
            String profilePictureBase64 = foundUser.getProfilePicture() != null
                    ? Base64.getEncoder().encodeToString(foundUser.getProfilePicture())
                    : ""; // Default to empty string if profile picture is null

            Map<String, Object> response = Map.of(
                    "userId", foundUser.getUserId(),
                    "username", foundUser.getUsername(),
                    "firstName", foundUser.getFirstName(),
                    "lastName", foundUser.getLastName(),
                    "email", foundUser.getEmail(),
                    "address", foundUser.getAddress(),
                    "phoneNumber", foundUser.getPhoneNumber(),
                    "role", foundUser.getRole(),
                    "profilePicture", profilePictureBase64 // Send Base64 encoded or default empty string
            );
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> passwordData) {
        String oldPassword = passwordData.get("oldPassword");
        String newPassword = passwordData.get("newPassword");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication != null ? authentication.getName() : null;

        if (currentUsername == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        Optional<UserEntity> userOptional = userService.findByUsername(currentUsername);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            boolean success = userService.changePassword(user.getUserId(), oldPassword, newPassword);
            if (success) {
                return new ResponseEntity<>("Password changed successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Old password is incorrect", HttpStatus.BAD_REQUEST);
            }
        }

        return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
    }






}
