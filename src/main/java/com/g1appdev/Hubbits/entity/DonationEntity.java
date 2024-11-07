package com.g1appdev.Hubbits.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "donations")
public class DonationEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationID;  // donationID as the primary key
    
    private BigDecimal amount;  // amount with decimal precision (using BigDecimal for financial values)
    
    @Temporal(TemporalType.DATE)
    private Date donationDate;  // date of the donation
    
    private String frequency;  // donation frequency (e.g., "monthly", "yearly")
    
    // Default constructor
    public DonationEntity() {
    }

    // Getters and Setters
    
    public Long getDonationID() {
        return donationID;
    }

    public void setDonationID(Long donationID) {
        this.donationID = donationID;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Date getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(Date donationDate) {
        this.donationDate = donationDate;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }
}
