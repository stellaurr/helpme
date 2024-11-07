package com.g1appdev.Hubbits.controller;

import com.g1appdev.Hubbits.entity.DonationEntity;
import com.g1appdev.Hubbits.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from your frontend URL
public class DonationController {

    @Autowired
    private DonationService donationService;

    // Get all donations
    @GetMapping
    public List<DonationEntity> getAllDonations() {
        return donationService.getAllDonations();
    }

    // Get donation by ID
    @GetMapping("/{id}")
    public ResponseEntity<DonationEntity> getDonationById(@PathVariable Long id) {
        Optional<DonationEntity> donation = donationService.getDonationById(id);
        return donation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Create new donation
    @PostMapping
    public DonationEntity createDonation(@RequestBody DonationEntity donation) {
        return donationService.createDonation(donation);
    }

    // Update donation by ID
    @PutMapping("/{id}")
    public ResponseEntity<DonationEntity> updateDonation(@PathVariable Long id, @RequestBody DonationEntity donation) {
        DonationEntity updatedDonation = donationService.updateDonation(id, donation);
        if (updatedDonation != null) {
            return ResponseEntity.ok(updatedDonation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete donation by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonation(@PathVariable Long id) {
        boolean deleted = donationService.deleteDonation(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
