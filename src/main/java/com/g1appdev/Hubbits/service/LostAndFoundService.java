package com.g1appdev.Hubbits.service;

import com.g1appdev.Hubbits.entity.LostAndFoundEntity;
import com.g1appdev.Hubbits.repository.LostAndFoundRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = uploadImage(imageFile);
                report.setImageUrl(imageUrl);
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
        return repository.findById(id).map(existingReport -> {
            existingReport.setReporttype(updatedReport.getReporttype());
            existingReport.setPetcategory(updatedReport.getPetcategory());
            existingReport.setDatereported(updatedReport.getDatereported());
            existingReport.setLastseen(updatedReport.getLastseen());
            existingReport.setDescription(updatedReport.getDescription());

            if (imageFile != null && !imageFile.isEmpty()) {
                try {
                    String imageUrl = uploadImage(imageFile);
                    existingReport.setImageUrl(imageUrl);
                } catch (IOException e) {
                    throw new RuntimeException("Error updating image file", e);
                }
            }

            return repository.save(existingReport);
        }).orElseThrow(() -> new IllegalArgumentException("Report with ID " + id + " not found"));
    }

    // Delete a report by ID
    public void deleteReport(int id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("Report with ID " + id + " not found");
        }
        repository.deleteById(id);
    }
}
