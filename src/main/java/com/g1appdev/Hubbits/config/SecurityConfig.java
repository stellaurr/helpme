package com.g1appdev.Hubbits.config;

import com.g1appdev.Hubbits.entity.UserEntity;
import com.g1appdev.Hubbits.security.JwtAuthenticationFilter;
import com.g1appdev.Hubbits.security.JwtFilter;
import com.g1appdev.Hubbits.security.JwtUtil;
import com.g1appdev.Hubbits.service.CustomUserDetailsService;
import com.g1appdev.Hubbits.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtFilter jwtRequestFilter;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;  // Inject PasswordEncoder

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtFilter jwtRequestFilter, JwtUtil jwtUtil, UserService userService, PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder; // Constructor injection
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeHttpRequests()
                .requestMatchers("/api/auth/login", "/api/auth/signup").permitAll()  // Allow login and signup
                .anyRequest().authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class); // Add JWT filter

        return http.build();
    }



    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .userDetailsService(userDetailsService()) // Add your user details service
                .passwordEncoder(passwordEncoder);  // Use injected passwordEncoder
        return authenticationManagerBuilder.build();
    }



    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            UserEntity user = userService.findByUsername(username);
            if (user != null) {
                return new org.springframework.security.core.userdetails.User(
                        user.getUsername(), user.getPassword(), List.of(new SimpleGrantedAuthority(user.getRole())));
            } else {
                throw new UsernameNotFoundException("User not found.");
            }
        };
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil, userService);
    }
}
