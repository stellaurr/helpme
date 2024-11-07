package com.g1appdev.Hubbits.service;

import com.g1appdev.Hubbits.entity.VolunteerOpportunity;
import com.g1appdev.Hubbits.entity.VolunteerSignUp;
import com.g1appdev.Hubbits.repository.VolunteerOpportunityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VolunteerOpportunityService {

    @Autowired
    private VolunteerOpportunityRepository opportunityRepository;

    // Create or save a new opportunity
    public VolunteerOpportunity createOpportunity(VolunteerOpportunity opportunity) {
        return opportunityRepository.save(opportunity);
    }

    // Retrieve all opportunities
    public List<VolunteerOpportunity> getAllOpportunities() {
        return opportunityRepository.findAll();
    }

    // Retrieve an opportunity by ID, now returns Optional
    public Optional<VolunteerOpportunity> getOpportunityById(int id) {
        return opportunityRepository.findById(id);  // Return Optional to allow better null handling
    }

    // Update an existing opportunity
    @Transactional
    public VolunteerOpportunity updateOpportunity(int id, VolunteerOpportunity updatedOpportunity) {
        Optional<VolunteerOpportunity> existingOpportunity = opportunityRepository.findById(id);
        
        if (existingOpportunity.isPresent()) {
            VolunteerOpportunity opportunity = existingOpportunity.get();
            
            // Update the existing opportunity with new values
            opportunity.setTitle(updatedOpportunity.getTitle());
            opportunity.setDescription(updatedOpportunity.getDescription());
            opportunity.setDate(updatedOpportunity.getDate());
            opportunity.setLocation(updatedOpportunity.getLocation());
            opportunity.setHoursWorked(updatedOpportunity.getHoursWorked());  // Assuming you want to update this too
            opportunity.setVolunteersNeeded(updatedOpportunity.getVolunteersNeeded()); // Update volunteers needed

            // Save and return the updated opportunity
            return opportunityRepository.save(opportunity);
        } else {
            // If opportunity not found, throw an exception
            throw new IllegalArgumentException("Opportunity with ID " + id + " not found");
        }
    }

    // Delete an opportunity by ID
    public String deleteOpportunity(int id) {
        if (opportunityRepository.existsById(id)) {
            opportunityRepository.deleteById(id);
            return "Opportunity with ID " + id + " deleted successfully"; // Added a message to clarify deletion success
        } else {
            throw new IllegalArgumentException("Opportunity with ID " + id + " not found"); // Better error handling
        }
    }

    // Get all sign-ups for a specific opportunity
    public List<VolunteerSignUp> getSignUpsForOpportunity(int opportunityId) {
        VolunteerOpportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new IllegalArgumentException("Opportunity with ID " + opportunityId + " not found"));
        return opportunity.getVolunteerSignUps();
    }
}
