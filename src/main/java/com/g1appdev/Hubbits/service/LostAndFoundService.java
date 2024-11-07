package com.g1appdev.Hubbits.service;

import com.g1appdev.Hubbits.entity.LostAndFoundEntity;
import com.g1appdev.Hubbits.repository.LostAndFoundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LostAndFoundService {

    @Autowired
    private LostAndFoundRepository lostAndFoundRepository;

    public List<LostAndFoundEntity> getAllReports() {
        return lostAndFoundRepository.findAll();
    }

    public Optional<LostAndFoundEntity> getReportById(int reportID) {
        return lostAndFoundRepository.findById(reportID);
    }

    public LostAndFoundEntity saveReport(LostAndFoundEntity report) {
        return lostAndFoundRepository.save(report);
    }

    public void deleteReport(int reportID) {
        lostAndFoundRepository.deleteById(reportID);
    }

    public LostAndFoundEntity markAsFound(int reportID) {
        Optional<LostAndFoundEntity> optionalReport = lostAndFoundRepository.findById(reportID);
        if (optionalReport.isPresent()) {
            LostAndFoundEntity report = optionalReport.get();
            report.setReportType("Found");
            return lostAndFoundRepository.save(report);
        }
        return null;
    }
}
