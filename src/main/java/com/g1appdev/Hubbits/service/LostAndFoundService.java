package com.g1appdev.Hubbits.service;

import com.g1appdev.Hubbits.entity.LostAndFoundEntity;
import com.g1appdev.Hubbits.entity.UserEntity;
import com.g1appdev.Hubbits.repository.LostAndFoundRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

@Service
public class LostAndFoundService {

    @Autowired
    private LostAndFoundRepository repository;

    @Autowired
    private UserService userService;

    private static final String UPLOAD_DIR = "src/main/resources/static/lostfound-images";

    public String uploadImage(MultipartFile file) throws IOException {
        Path uploadPath = Path.of(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String newFilename = System.currentTimeMillis() + "-" + originalFilename;
        Path targetPath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return "/lostfound-images/" + newFilename;
    }

    // Create a new report
    public LostAndFoundEntity createReport(LostAndFoundEntity report, MultipartFile imageFile) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new IllegalArgumentException("User is not authenticated.");
        }

        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        Optional<UserEntity> currentUser = userService.findByUsername(username);

        if (currentUser.isEmpty()) {
            throw new IllegalArgumentException("User not found.");
        }

        // Set the creatorId
        report.setCreatorid(Math.toIntExact(currentUser.get().getUserId()));

        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageurl = uploadImage(imageFile);
                report.setImageurl(imageurl);
            } catch (IOException e) {
                throw new RuntimeException("Error saving image file", e);
            }
        }
        return repository.save(report);
    }

    // Retrieve all reports
    public List<LostAndFoundEntity> getAllReports() {
        return repository.findAll();
    }

    // Retrieve a report by ID
    public Optional<LostAndFoundEntity> getReportById(int id) {
        return repository.findById(id);
    }

    // Update an existing report
    @Transactional
    public LostAndFoundEntity updateReport(int id, LostAndFoundEntity updatedReport, MultipartFile imageFile) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new IllegalArgumentException("User is not authenticated.");
        }

        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        Optional<UserEntity> currentUser = userService.findByUsername(username);

        if (currentUser.isEmpty()) {
            throw new IllegalArgumentException("User not found.");
        }

        int currentUserId = Math.toIntExact(currentUser.get().getUserId());

        return repository.findById(id).map(existingReport -> {
            if (existingReport.getCreatorid() != currentUserId) {
                throw new IllegalArgumentException("You are not authorized to update this report.");
            }

            // Update report fields
            existingReport.setReporttype(updatedReport.getReporttype());
            existingReport.setPetcategory(updatedReport.getPetcategory());
            existingReport.setDatereported(updatedReport.getDatereported());
            existingReport.setLastseen(updatedReport.getLastseen());
            existingReport.setDescription(updatedReport.getDescription());

            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    String imageurl = uploadImage(imageFile);
                    existingReport.setImageurl(imageurl);
                } catch (IOException e) {
                    throw new RuntimeException("Error updating image file", e);
                }
            }

            return repository.save(existingReport);
        }).orElseThrow(() -> new IllegalArgumentException("Report with ID " + id + " not found"));
    }

    @Transactional
    public void deleteReport(int id) {
        // Authenticate the user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            throw new IllegalArgumentException("User is not authenticated.");
        }

        // Get the username from the SecurityContext
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        Optional<UserEntity> currentUser = userService.findByUsername(username);

        if (currentUser.isEmpty()) {
            throw new IllegalArgumentException("User not found.");
        }

        int currentUserId = Math.toIntExact(currentUser.get().getUserId());

        // Retrieve the report
        LostAndFoundEntity report = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report with ID " + id + " not found."));

        // Check authorization
        if (report.getCreatorid() != currentUserId) {
            throw new IllegalArgumentException("You are not authorized to delete this report.");
        }

        // Perform deletion
        repository.delete(report);
        System.out.println("Report with ID " + id + " deleted successfully by user with ID " + currentUserId);
    }
}
