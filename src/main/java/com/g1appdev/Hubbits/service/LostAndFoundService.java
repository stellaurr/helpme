package com.g1appdev.Hubbits.service;

import com.g1appdev.Hubbits.entity.LostAndFoundEntity;
import com.g1appdev.Hubbits.repository.LostAndFoundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class LostAndFoundService {

    private final LostAndFoundRepository lostAndFoundRepository;

    @Autowired
    public LostAndFoundService(LostAndFoundRepository lostAndFoundRepository) {
        this.lostAndFoundRepository = lostAndFoundRepository;
    }

    public List<LostAndFoundEntity> getAllReports() {
        return lostAndFoundRepository.findAll();
    }

    public Optional<LostAndFoundEntity> getReportById(int reportID) {
        return lostAndFoundRepository.findById(reportID);
    }

    public LostAndFoundEntity createReport(LostAndFoundEntity report) {
        return lostAndFoundRepository.save(report);
    }

    public LostAndFoundEntity updateReport(int reportID, LostAndFoundEntity updatedReport) {
        if (lostAndFoundRepository.existsById(reportID)) {
            updatedReport.setReportID(reportID);
            return lostAndFoundRepository.save(updatedReport);
        }
        return null;
    }

    public boolean deleteReport(int reportID) {
        if (lostAndFoundRepository.existsById(reportID)) {
            lostAndFoundRepository.deleteById(reportID);
            return true;
        }
        return false;
    }

    public List<LostAndFoundEntity> findByLastSeen(String lastSeen) {
        return lostAndFoundRepository.findByLastSeen(lastSeen);
    }

    public void submitReport(String reportType, String petCategory, String description, String lastSeen, byte[] image) {
        LostAndFoundEntity report = new LostAndFoundEntity();
        report.setReportType(reportType);
        report.setPetCategory(petCategory);
        report.setDescription(description);
        report.setDateReported(new Date());
        report.setLastSeen(lastSeen);
        report.setImage(image);

        lostAndFoundRepository.save(report);
        System.out.println("Report Submitted: " + reportType + " - " + description);
    }

    public List<LostAndFoundEntity> searchReports(String location) {
        System.out.println("Searching reports for location: " + location);
        return lostAndFoundRepository.findByLastSeen(location);
    }
}
