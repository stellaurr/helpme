package com.g1appdev.Hubbits.controller;

import com.g1appdev.Hubbits.entity.VolunteerOpportunity;
import com.g1appdev.Hubbits.service.VolunteerOpportunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/volunteer")
public class VolunteerOpportunityController {

    @Autowired
    private VolunteerOpportunityService service;

    // Get all opportunities
    @GetMapping("/opportunities")
    public ResponseEntity<List<VolunteerOpportunity>> viewOpportunities() {
        List<VolunteerOpportunity> opportunities = service.getAllOpportunities();
        return ResponseEntity.ok(opportunities);
    }

    // Get a single opportunity by ID
    @GetMapping("/opportunity/{id}")
    public ResponseEntity<VolunteerOpportunity> getOpportunityWithSignUps(@PathVariable int id) {
        Optional<VolunteerOpportunity> opportunity = service.getOpportunityById(id);
        return opportunity
                .map(ResponseEntity::ok)  // If the opportunity exists, return it with OK status
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());  // If not found, return NOT_FOUND
    }

    // Create a new opportunity
    @PostMapping("/opportunity")
    public ResponseEntity<VolunteerOpportunity> createOpportunity(@RequestBody VolunteerOpportunity opportunity) {
        VolunteerOpportunity createdOpportunity = service.createOpportunity(opportunity);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOpportunity);
    }

    // Update an existing opportunity
    @PutMapping("/opportunity/{id}")
    public ResponseEntity<VolunteerOpportunity> updateOpportunity(@PathVariable int id, @RequestBody VolunteerOpportunity opportunity) {
        try {
            VolunteerOpportunity updatedOpportunity = service.updateOpportunity(id, opportunity);
            return ResponseEntity.ok(updatedOpportunity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Delete an opportunity
    @DeleteMapping("/opportunity/{id}")
    public ResponseEntity<Void> deleteOpportunity(@PathVariable int id) {
        try {
            service.deleteOpportunity(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
