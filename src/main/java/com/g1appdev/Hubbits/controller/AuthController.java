package com.g1appdev.Hubbits.controller;

import com.g1appdev.Hubbits.config.PasswordEncoderConfig;
import com.g1appdev.Hubbits.entity.UserEntity;
import com.g1appdev.Hubbits.service.UserService;
import com.g1appdev.Hubbits.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
//
//import com.g1appdev.Hubbits.model.AuthenticationRequest;
//import com.g1appdev.Hubbits.model.AuthenticationResponse;
//import com.g1appdev.Hubbits.service.MyUserDetailsService;
//import com.g1appdev.Hubbits.util.JwtUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")

public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

//    @Autowired
//    private MyUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;


    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);






    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody UserEntity newUser) {
        // Log the incoming request for debugging purposes
        logger.info("Signup request received: FirstName={}, LastName={}, Username={}, Email={}, Address={}, PhoneNumber={}",
                newUser.getFirstName(), newUser.getLastName(), newUser.getUsername(), newUser.getEmail(),
                newUser.getAddress(), newUser.getPhoneNumber());

        try {
            // Set a default role for new users
            newUser.setRole("USER");

            // Attempt to save the user via service
            userService.createUser(newUser);

            // Log success and return response
            logger.info("User successfully saved: Username={}", newUser.getUsername());
            return ResponseEntity.ok("User saved successfully");

        } catch (Exception e) {
            // Log the exception if something goes wrong
            logger.error("Error during signup", e);
            return ResponseEntity.status(500).body("Error during user registration: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody UserEntity loginRequest) {
        logger.info("Login attempt with username: {}", loginRequest.getUsername());

        // Load the user details
        UserDetails userDetails = userService.loadUserByUsername(loginRequest.getUsername());

        // Log passwords
        logger.info("Incoming password: {}", loginRequest.getPassword());
        logger.info("Stored password (hashed): {}", userDetails.getPassword());

        // Compare passwords
        if (!passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPassword())) {
            logger.error("Passwords do NOT match!");
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        logger.info("Passwords match!");

        // Authenticate the user
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            logger.info("User {} authenticated successfully", loginRequest.getUsername());
        } catch (AuthenticationException e) {
            logger.error("Authentication failed for user: {}", loginRequest.getUsername());
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtTokenUtil.generateToken(loginRequest.getUsername());
        return ResponseEntity.ok(token);
    }


    @GetMapping("/login")
    public String loginPage() {
        return "login";  // Serve login.html from src/main/resources/templates
    }

    @GetMapping("/signup")
    public String signupPage() {
        return "signup";  // Serve login.html from src/main/resources/templates
    }

    @GetMapping("/test")
    public String testPage() {
        return "test";  // This will resolve to test.html
    }





//    @PostMapping("/login")
//    public ResponseEntity<AuthenticationResponse> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
//
//        try {
//            authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
//            );
//        } catch (BadCredentialsException e) {
//            throw new Exception("Incorrect username or password", e);
//        }
//
//        final UserDetails userDetails = userDetailsService
//                .loadUserByUsername(authenticationRequest.getUsername());
//
//        final String jwt = jwtTokenUtil.generateToken(userDetails);
//
//        return ResponseEntity.ok(new AuthenticationResponse(jwt));
//    }
}
