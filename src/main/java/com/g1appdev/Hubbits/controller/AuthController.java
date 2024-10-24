package com.g1appdev.Hubbits.controller;

import com.g1appdev.Hubbits.entity.UserEntity;
import com.g1appdev.Hubbits.model.AuthRequest;
import com.g1appdev.Hubbits.model.AuthResponse;
import com.g1appdev.Hubbits.repository.UserRepository;
import com.g1appdev.Hubbits.security.JwtUtil;
import com.g1appdev.Hubbits.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/manage")
    public String showManagePage() {
        return "manage"; // This returns manage.html from src/main/resources/templates
    }

    @GetMapping("/security")
    public String showSecurityLogin() {
        // This redirects to the default Spring Security login page
        return "forward:/login"; // Forward to the default login page
    }

    @GetMapping("/login") // Serve the login form
    public String showLoginForm() {
        return "login"; // This should match the name of your login.html file without the extension
    }

    @GetMapping("/signup") // Serve the signup form
    public String showSignupForm() {
        return "signup"; // Make sure to create a signup.html template
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signupUser(@RequestBody UserEntity user) {
        try {
            user.setPassword(passwordEncoder.encode(user.getPassword())); // Encode the password
            userRepository.save(user); // Save user to the repository
            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error occurred: " + e.getMessage(), HttpStatus.BAD_REQUEST); // Return error message
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        } catch (Exception e) {
            return new ResponseEntity<>(new AuthResponse("Invalid credentials"), HttpStatus.UNAUTHORIZED);
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        String token = jwtUtil.generateToken(userDetails.getUsername());
        return new ResponseEntity<>(new AuthResponse(token), HttpStatus.OK);
    }

}
