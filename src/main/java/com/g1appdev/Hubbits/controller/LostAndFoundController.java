package com.g1appdev.Hubbits.controller;

import com.g1appdev.Hubbits.entity.LostAndFoundEntity;
import com.g1appdev.Hubbits.service.LostAndFoundService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.text.ParseException;
import java.util.List;
import java.util.Date;

@RestController
@RequestMapping("/api/lostandfound")
public class LostAndFoundController {

    private final LostAndFoundService lostAndFoundService;

    @Autowired
    public LostAndFoundController(LostAndFoundService lostAndFoundService) {
        this.lostAndFoundService = lostAndFoundService;
    }

    @GetMapping
    public List<LostAndFoundEntity> getAllReports() {
        return lostAndFoundService.getAllReports();
    }

    @GetMapping("/{reportID}")
    public ResponseEntity<LostAndFoundEntity> getReportById(@PathVariable int reportID) {
        return lostAndFoundService.getReportById(reportID)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> createReport(
            @RequestParam("reportType") String reportType,
            @RequestParam("petCategory") String petCategory,
            @RequestParam("dateReported") String dateReported,
            @RequestParam("lastSeen") String lastSeen,
            @RequestParam("description") String description,
            @RequestParam("imageFile") MultipartFile imageFile) throws IOException {

        if (reportType == null || description == null || lastSeen == null || imageFile.isEmpty()) {
            return ResponseEntity.badRequest().body("All fields are required, including the image file.");
        }

        byte[] image = imageFile.getBytes();

        Date parsedDate;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            parsedDate = dateFormat.parse(dateReported);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Please use yyyy-MM-dd.");
        }

        LostAndFoundEntity report = new LostAndFoundEntity();
        report.setDateReported(parsedDate);
        report.setReportType(reportType);
        report.setDescription(description);
        report.setLastSeen(lastSeen);
        report.setImage(image); 
        report.setPetCategory(petCategory);

        lostAndFoundService.createReport(report);

        return ResponseEntity.ok("Report submitted successfully");
    }

    @PutMapping("/{reportID}")
    public ResponseEntity<String> updateReport(
            @PathVariable int reportID,
            @RequestParam("reportType") String reportType,
            @RequestParam("petCategory") String petCategory,
            @RequestParam("dateReported") String dateReported,
            @RequestParam("lastSeen") String lastSeen,
            @RequestParam("description") String description,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {

        
        if (reportType == null || description == null || lastSeen == null) {
            return ResponseEntity.badRequest().body("All fields are required except the image file.");
        }

        LostAndFoundEntity existingReport = lostAndFoundService.getReportById(reportID).orElse(null);
        if (existingReport == null) {
            return ResponseEntity.notFound().build();
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            existingReport.setImage(imageFile.getBytes());
        } else {
            existingReport.setImage(existingReport.getImage());
        }

        Date parsedDate;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            parsedDate = dateFormat.parse(dateReported);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Please use yyyy-MM-dd.");
        }

        // Update fields
        existingReport.setDateReported(parsedDate);
        existingReport.setReportType(reportType);
        existingReport.setPetCategory(petCategory);
        existingReport.setDescription(description);
        existingReport.setLastSeen(lastSeen);

        lostAndFoundService.updateReport(reportID, existingReport);

        return ResponseEntity.ok("Report updated successfully");
    }



    @DeleteMapping("/{reportID}")
    public ResponseEntity<Void> deleteReport(@PathVariable int reportID) {
        return lostAndFoundService.deleteReport(reportID) ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/lastseen/{lastSeen}")
    public ResponseEntity<List<LostAndFoundEntity>> findByLastSeen(@PathVariable String lastSeen) {
        List<LostAndFoundEntity> results = lostAndFoundService.findByLastSeen(lastSeen);
        return results.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(results);
    }

    @GetMapping("/api/lostandfound/search")
    public List<LostAndFoundEntity> searchReports(@RequestParam String location) {
        return lostAndFoundService.searchReports(location);
    }
}
