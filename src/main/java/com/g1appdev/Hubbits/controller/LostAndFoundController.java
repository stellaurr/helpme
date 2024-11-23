package com.g1appdev.Hubbits.controller;

import com.g1appdev.Hubbits.entity.LostAndFoundEntity;
import com.g1appdev.Hubbits.entity.UserEntity;
import com.g1appdev.Hubbits.service.LostAndFoundService;
import com.g1appdev.Hubbits.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lostandfound")
public class LostAndFoundController {

    private static final Logger logger = LoggerFactory.getLogger(LostAndFoundController.class);
    private final LostAndFoundService lostAndFoundService;
    private final UserService userService;

    @Autowired
    public LostAndFoundController(LostAndFoundService lostAndFoundService, UserService userService) {
        this.lostAndFoundService = lostAndFoundService;
        this.userService = userService;
    }

    // Get all reports with "Posted by username" included
    @GetMapping
    public List<ReportResponse> getAllReports() {
        logger.info("Received request to fetch all reports");
        List<LostAndFoundEntity> reports = lostAndFoundService.getAllReports();
        logger.info("Total reports found: {}", reports.size());

        return reports.stream()
                .map(report -> {
                    logger.info("Processing report ID: {}, Posted by: {}", report.getReportID(),
                            report.getUser().getUsername());
                    return new ReportResponse(
                            report.getReportID(),
                            report.getReportType(),
                            report.getPetCategory(),
                            report.getDateReported(),
                            report.getLastSeen(),
                            report.getDescription(),
                            report.getImage(),
                            report.getUser().getUsername());
                })
                .collect(Collectors.toList());
    }

    // Get a specific report by ID with "Posted by username"
    @GetMapping("/{reportID}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable int reportID) {
        return lostAndFoundService.getReportById(reportID)
                .map(report -> ResponseEntity.ok(new ReportResponse(
                        report.getReportID(),
                        report.getReportType(),
                        report.getPetCategory(),
                        report.getDateReported(),
                        report.getLastSeen(),
                        report.getDescription(),
                        report.getImage(),
                        report.getUser().getUsername() // Include username
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> createReport(
            @RequestParam("reportType") String reportType,
            @RequestParam("petCategory") String petCategory,
            @RequestParam("dateReported") String dateReported,
            @RequestParam("lastSeen") String lastSeen,
            @RequestParam("description") String description,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {

        logger.info("Starting createReport endpoint");

        // Retrieve authenticated username from SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            logger.error("Authentication failed: User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        String username = authentication.getName();
        logger.info("Authenticated user: {}", username);

        // Fetch user from the database
        UserEntity user;
        try {
            user = userService.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found for username: " + username));
            logger.info("User fetched successfully: {}", user.getUsername());
        } catch (Exception e) {
            logger.error("Error fetching user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching user: " + e.getMessage());
        }

        // Parse date
        Date parsedDate;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            parsedDate = dateFormat.parse(dateReported);
            logger.info("Parsed date successfully: {}", parsedDate);
        } catch (ParseException e) {
            logger.error("Invalid date format: {}", dateReported);
            return ResponseEntity.badRequest().body("Invalid date format. Please use yyyy-MM-dd.");
        }

        // Parse image if provided
        byte[] image = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                image = imageFile.getBytes();
                logger.info("Image file processed successfully");
            } catch (IOException e) {
                logger.error("Error processing image file: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing image file");
            }
        }

        // Create the report
        try {
            LostAndFoundEntity report = new LostAndFoundEntity();
            report.setReportType(reportType);
            report.setPetCategory(petCategory);
            report.setDateReported(parsedDate);
            report.setLastSeen(lastSeen);
            report.setDescription(description);
            report.setImage(image);
            report.setUser(user);

            lostAndFoundService.createReport(report);
            logger.info("Report created successfully for user: {}", username);
            return ResponseEntity.ok("Report created successfully.");
        } catch (Exception e) {
            logger.error("Error creating report: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating report: " + e.getMessage());
        }
    }

    // DTO for response with "Posted by username"
    public static class ReportResponse {
        private int reportID;
        private String reportType;
        private String petCategory;
        private Date dateReported;
        private String lastSeen;
        private String description;
        private byte[] image;
        private String postedBy; // Added username

        public ReportResponse(int reportID, String reportType, String petCategory, Date dateReported, String lastSeen,
                String description, byte[] image, String postedBy) {
            this.reportID = reportID;
            this.reportType = reportType;
            this.petCategory = petCategory;
            this.dateReported = dateReported;
            this.lastSeen = lastSeen;
            this.description = description;
            this.image = image;
            this.postedBy = postedBy;
        }
    }
}
