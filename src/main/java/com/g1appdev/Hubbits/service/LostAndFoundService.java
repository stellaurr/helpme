package com.g1appdev.Hubbits.service;

import com.g1appdev.Hubbits.entity.LostAndFoundEntity;
import com.g1appdev.Hubbits.repository.LostAndFoundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Optional<LostAndFoundEntity> getReportById(int reportid) {
        return lostAndFoundRepository.findById(reportid);
    }

    public LostAndFoundEntity createReport(LostAndFoundEntity report) {
        return lostAndFoundRepository.save(report);
    }

    public LostAndFoundEntity updateReport(int reportid, LostAndFoundEntity updatedReport) {
        if (lostAndFoundRepository.existsById(reportid)) {
            updatedReport.setReportid(reportid); // Ensure the ID is set correctly
            return lostAndFoundRepository.save(updatedReport);
        } else {
            throw new IllegalArgumentException("Report not found for ID: " + reportid);
        }
    }

    public boolean deleteReport(int reportid) {
        if (lostAndFoundRepository.existsById(reportid)) {
            lostAndFoundRepository.deleteById(reportid);
            return true;
        }
        return false;
    }
}
