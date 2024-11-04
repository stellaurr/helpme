package com.g1appdev.Hubbits.controller;

import com.g1appdev.Hubbits.entity.LostAndFoundEntity;
import com.g1appdev.Hubbits.service.LostAndFoundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/lostandfound")
@CrossOrigin(origins = "http://localhost:3000")
public class LostAndFoundController {

    @Autowired
    private LostAndFoundService lostAndFoundService;

    @GetMapping
    public List<LostAndFoundEntity> getAllReports() {
        return lostAndFoundService.getAllReports();
    }

    @GetMapping("/{id}")
    public Optional<LostAndFoundEntity> getReportById(@PathVariable int id) {
        return lostAndFoundService.getReportById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<LostAndFoundEntity> createReport(
            @RequestParam("reportType") String reportType,
            @RequestParam("dateReported") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateReported,
            @RequestParam("lastSeen") String lastSeen,
            @RequestParam("description") String description,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        LostAndFoundEntity report = new LostAndFoundEntity();
        report.setReportType(reportType);

        // Convert LocalDate to java.util.Date
        Date convertedDate = Date.from(dateReported.atStartOfDay(ZoneId.systemDefault()).toInstant());
        report.setDateReported(convertedDate);

        report.setLastSeen(lastSeen);
        report.setDescription(description);

        if (image != null && !image.isEmpty()) {
            try {
                report.setImage(image.getBytes()); // Assuming `image` is stored as a byte array (Blob)
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        LostAndFoundEntity savedReport = lostAndFoundService.saveReport(report);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReport);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LostAndFoundEntity> updateReport(@PathVariable("id") int id, @RequestBody Map<String, Object> updates) {
        Optional<LostAndFoundEntity> existingReportOpt = lostAndFoundService.getReportById(id);

        if (existingReportOpt.isPresent()) {
            LostAndFoundEntity existingReport = existingReportOpt.get();

            // Check for reportType in the updates map and update it
            if (updates.containsKey("reportType")) {
                existingReport.setReportType((String) updates.get("reportType"));
            }

            // Save only the modified field(s)
            LostAndFoundEntity updatedReport = lostAndFoundService.saveReport(existingReport);
            return ResponseEntity.ok(updatedReport);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public void deleteReport(@PathVariable int id) {
        lostAndFoundService.deleteReport(id);
    }

    @PutMapping("/{id}/found")
    public LostAndFoundEntity markAsFound(@PathVariable int id) {
        return lostAndFoundService.markAsFound(id);
    }
}
