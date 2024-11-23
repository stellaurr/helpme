package com.g1appdev.Hubbits.service;

import com.g1appdev.Hubbits.entity.DonationEntity;
import com.g1appdev.Hubbits.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    // Retrieve all donations
    public List<DonationEntity> getAllDonations() {
        return donationRepository.findAll();
    }

    // Retrieve donation by ID
    public Optional<DonationEntity> getDonationById(Long donationID) {
        return donationRepository.findById(donationID);
    }

    // Create a new donation
    public DonationEntity createDonation(DonationEntity donation) {
        return donationRepository.save(donation);
    }

    // Update an existing donation by ID
    public DonationEntity updateDonation(Long donationID, DonationEntity updatedDonation) {
        Optional<DonationEntity> donationOpt = donationRepository.findById(donationID);
        if (donationOpt.isPresent()) {
            DonationEntity donation = donationOpt.get();
            donation.setAmount(updatedDonation.getAmount());
            donation.setDonationDate(updatedDonation.getDonationDate());
            donation.setFrequency(updatedDonation.getFrequency());
            donation.setFirstName(updatedDonation.getFirstName());
            donation.setLastName(updatedDonation.getLastName());
            donation.setSpecialMessage(updatedDonation.getSpecialMessage());
            return donationRepository.save(donation);
        }
        return null;
    }

    // Delete donation by ID
    public boolean deleteDonation(Long donationID) {
        if (donationRepository.existsById(donationID)) {
            donationRepository.deleteById(donationID);
            return true;
        }
        return false;
    }
}
