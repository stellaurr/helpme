package com.g1appdev.Hubbits.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class JwtUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // private Claims extractAllClaims(String token) {
    // return Jwts.parserBuilder()
    // .setSigningKey(SECRET_KEY)
    // .build()
    // .parseClaimsJws(token)
    // .getBody();
    // }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            logger.error("Error parsing JWT token: {}", e.getMessage());
            throw e;
        }
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String username, List<String> roles) {
        logger.info("Generating JWT token for user: {}", username);
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        String token = createToken(claims, username);
        logger.info("Generated token: {}", token);
        return token;
    }

    private String createToken(Map<String, Object> claims, String subject) {
        long EXPIRATION_TIME = 1000 * 60 * 60 * 10; // 10 hours validity
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }

    public Boolean validateToken(String token, String username) {
        logger.info("Validating token for user: {}", username);
        final String extractedUsername = extractUsername(token);
        logger.info("Extracted username from token: {}", extractedUsername);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    public List<GrantedAuthority> getAuthoritiesFromToken(String token) {
        Claims claims = extractAllClaims(token);
        List<String> roles = claims.get("roles", List.class); // Retrieve roles with the "roles" key

        logger.info("Extracted roles from token: {}", roles);

        // Convert roles to Spring Security format
        return roles.stream()
                .map(SimpleGrantedAuthority::new) // Avoid double prefixing with "ROLE_"
                .collect(Collectors.toList());
    }
}
