package com.g1appdev.Hubbits.service;

import com.g1appdev.Hubbits.entity.UserEntity;
import com.g1appdev.Hubbits.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;



    public UserEntity createUser(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword())); // Encode the password
        return userRepository.save(user);
    }

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll(); // Retrieve all users
    }


    public Optional<UserEntity> findUserById(Long userId) {
        return userRepository.findById(userId); // Find a user by ID
    }


    public Optional<UserEntity> findUserByUsername(String username) {
        return userRepository.findByUsername(username); // Find a user by username
    }

    public UserEntity updateUser(Long userId, UserEntity updatedUser) {
        return userRepository.findById(userId)
                .map(user -> {
                    // Set all fields from updatedUser
                    user.setUsername(updatedUser.getUsername());
                    user.setFirstName(updatedUser.getFirstName());
                    user.setLastName(updatedUser.getLastName());
                    user.setEmail(updatedUser.getEmail());
                    user.setPassword(passwordEncoder.encode(updatedUser.getPassword())); // Encode the password
                    user.setAddress(updatedUser.getAddress());
                    user.setPhoneNumber(updatedUser.getPhoneNumber());
                    user.setRole(updatedUser.getRole());
                    // Note: You may choose to leave createdAt as is, or update it if desired
                    return userRepository.save(user); // Save the updated user
                })
                .orElse(null); // Return null if user not found
    }

    public boolean deleteUser(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId); // Delete the user
            return true; // Return true if deleted
        }
        return false; // Return false if user not found
    }

}