package com.g1appdev.Hubbits.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
public class LostAndFoundEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int reportID;

    private String reportType; // "Lost" or "Found"
    private Date dateReported;
    private String lastSeen;
    private String description;

    @Lob
    private byte[] image; // Stores image as Blob data

    // Getters and Setters

    public int getReportID() {
        return reportID;
    }

    public void setReportID(int reportID) {
        this.reportID = reportID;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public Date getDateReported() {
        return dateReported;
    }

    public void setDateReported(Date dateReported) {
        this.dateReported = dateReported;
    }

    public String getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(String lastSeen) {
        this.lastSeen = lastSeen;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }
}
