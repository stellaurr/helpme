package com.g1appdev.Hubbits.entity;

import java.util.Base64;
import java.util.Date;
import jakarta.persistence.*;

@Entity
@Table(name = "lostandfound")
public class LostAndFoundEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reportid")
    private int reportid;

    @Column(name = "reporttype", nullable = false, columnDefinition = "VARCHAR(255) DEFAULT 'lost'")
    private String reporttype = "lost";

    @Column(name = "petcategory")
    private String petcategory;

    @Temporal(TemporalType.DATE)
    @Column(name = "datereported")
    private Date datereported;

    @Column(name = "lastseen")
    private String lastseen;

    @Column(name = "description")
    private String description;

    @Lob
    @Column(name = "imagedata", columnDefinition = "LONGBLOB")
    private byte[] imagedata;

    // Default constructor
    public LostAndFoundEntity() {
    }

    // Constructor with fields
    public LostAndFoundEntity(String reporttype, String petcategory, Date datereported, String lastseen,
            String description, byte[] imagedata) {
        this.reporttype = reporttype;
        this.petcategory = petcategory;
        this.datereported = datereported;
        this.lastseen = lastseen;
        this.description = description;
        this.imagedata = imagedata;
    }

    // Getters and setters
    public int getReportid() {
        return reportid;
    }

    public void setReportid(int reportid) {
        this.reportid = reportid;
    }

    public String getReporttype() {
        return reporttype;
    }

    public void setReporttype(String reporttype) {
        this.reporttype = reporttype;
    }

    public String getPetcategory() {
        return petcategory;
    }

    public void setPetcategory(String petcategory) {
        this.petcategory = petcategory;
    }

    public Date getDatereported() {
        return datereported;
    }

    public void setDatereported(Date datereported) {
        this.datereported = datereported;
    }

    public String getLastseen() {
        return lastseen;
    }

    public void setLastseen(String lastseen) {
        this.lastseen = lastseen;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getImagedata() {
        return imagedata;
    }

    public void setImagedata(byte[] imagedata) {
        this.imagedata = imagedata;
    }

    // Method to get Base64 representation of the image
    public String getImagedataBase64() {
        if (imagedata != null && imagedata.length > 0) {
            return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imagedata);
        }
        return null;
    }
}
