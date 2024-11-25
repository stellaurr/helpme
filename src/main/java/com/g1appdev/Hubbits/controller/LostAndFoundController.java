package com.g1appdev.Hubbits.controller;

import com.g1appdev.Hubbits.entity.LostAndFoundEntity;
import com.g1appdev.Hubbits.service.LostAndFoundService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/lostandfound")
@CrossOrigin
public class LostAndFoundController {

    private final LostAndFoundService lostAndFoundService;

    @Autowired
    public LostAndFoundController(LostAndFoundService lostAndFoundService) {
        this.lostAndFoundService = lostAndFoundService;
    }

    @PostMapping
    public ResponseEntity<String> createReport(
            @RequestParam(value = "reporttype", defaultValue = "lost") String reporttype,
            @RequestParam("petcategory") String petcategory,
            @RequestParam("datereported") String datereported,
            @RequestParam("lastseen") String lastseen,
            @RequestParam("description") String description,
            @RequestParam(value = "imagefile", required = false) MultipartFile imagefile) throws IOException {

        Date parsedDate;
        try {
            parsedDate = new SimpleDateFormat("yyyy-MM-dd").parse(datereported);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Use yyyy-MM-dd.");
        }

        byte[] image = null;
        if (imagefile != null && !imagefile.isEmpty()) {
            image = imagefile.getBytes();
        }

        LostAndFoundEntity report = new LostAndFoundEntity(
                reporttype, petcategory, parsedDate, lastseen, description, image);

        lostAndFoundService.createReport(report);
        return ResponseEntity.ok("Report created successfully.");
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllReports() {
        List<Map<String, Object>> reports = lostAndFoundService.getAllReports().stream()
                .map(report -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("reportid", report.getReportid());
                    map.put("reporttype", report.getReporttype());
                    map.put("petcategory", report.getPetcategory());
                    map.put("datereported", report.getDatereported());
                    map.put("lastseen", report.getLastseen());
                    map.put("description", report.getDescription());
                    map.put("imagedata", report.getImagedataBase64());
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/{reportid}")
    public ResponseEntity<String> updateReport(
            @PathVariable int reportid,
            @RequestParam(value = "reporttype", defaultValue = "lost") String reporttype,
            @RequestParam("petcategory") String petcategory,
            @RequestParam("datereported") String datereported,
            @RequestParam("lastseen") String lastseen,
            @RequestParam("description") String description,
            @RequestParam(value = "imagefile", required = false) MultipartFile imagefile) throws IOException {

        LostAndFoundEntity existingReport = lostAndFoundService.getReportById(reportid).orElse(null);
        if (existingReport == null) {
            return ResponseEntity.notFound().build();
        }

        Date parsedDate;
        try {
            parsedDate = new SimpleDateFormat("yyyy-MM-dd").parse(datereported);
        } catch (ParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Use yyyy-MM-dd.");
        }

        byte[] image = existingReport.getImagedata();
        if (imagefile != null && !imagefile.isEmpty()) {
            image = imagefile.getBytes();
        }

        existingReport.setReporttype(reporttype);
        existingReport.setPetcategory(petcategory);
        existingReport.setDatereported(parsedDate);
        existingReport.setLastseen(lastseen);
        existingReport.setDescription(description);
        existingReport.setImagedata(image);

        lostAndFoundService.updateReport(reportid, existingReport);
        return ResponseEntity.ok("Report updated successfully.");
    }

    @DeleteMapping("/{reportid}")
    public ResponseEntity<String> deleteReport(@PathVariable int reportid) {
        if (lostAndFoundService.deleteReport(reportid)) {
            return ResponseEntity.ok("Report deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Report not found for ID: " + reportid);
        }
    }
}