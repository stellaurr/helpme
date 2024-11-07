package com.g1appdev.Hubbits.entity;

import java.util.Date;
import jakarta.persistence.*;

@Entity
@Table(name = "lostandfound")
public class LostAndFoundEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-incrementing primary key
    private int reportID;
    
    @Column(name = "reporttype") // Column name in the database
    private String reportType;

    @Column(name = "petcategory")
    private String petCategory;
    
    @Column(name = "datereported") // Column name in the database
    @Temporal(TemporalType.DATE) // Specifies the date type
    private Date dateReported;
    
    @Column(name = "lastseen") // Column name in the database
    private String lastSeen;
    
    private String description; // Description of the lost and found item
    
    @Lob // Indicates that this is a large object
    @Column(name = "imagedata") // Column name in the database
    private byte[] image; // Store image data as byte array

    // Default constructor
    public LostAndFoundEntity() {}

    // Constructor with all parameters except reportID
    public LostAndFoundEntity(String reportType, Date dateReported, String lastSeen, String description, byte[] image) {
        this.reportType = reportType;
        this.dateReported = dateReported;
        this.lastSeen = lastSeen;
        this.description = description;
        this.image = image; // Initialize the image field
    }

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

    public void setPetCategory(String petCategory) {
        this.petCategory = petCategory;
    }

    public String getPetCategory() {
        return petCategory;
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
