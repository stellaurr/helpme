import React, { useState,useRef } from "react";
import { TextField, Button, Typography, Snackbar, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import axios from "axios";

const RehomeForm = () => {
  const [formData, setFormData] = useState({
    petType: "",
    breed: "",
    description: "",
    image: null,  // To handle image upload
    name: "",
    address: "",
    contactNumber: "",
    submissionDate: "",
    age: "",
    gender: "",  // Gender field
    userName: "", // Add userName here
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPetData({
        ...petData,
        image: file,
    });
};

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Allow only numeric input for contactNumber
    if (name === "contactNumber" && !/^\d*$/.test(value)) return; // Restrict non-numeric input

    setFormData((prev) => ({
      ...prev,
      [name]: name === "image" ? files[0] : value,  // Handle file input separately
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("type", formData.petType);
    form.append("breed", formData.breed);
    form.append("age", formData.age); // Add age
    form.append("gender", formData.gender); // Add gender
    form.append("description", formData.description);
    form.append("photo", formData.image);  // Append image
    form.append("userName", formData.userName); 
    form.append("address", formData.address);
    form.append("contactNumber", formData.contactNumber);
    form.append("submissionDate", formData.submissionDate);
    form.append("status", "PENDING_REHOME"); // Set status to pending rehome

    resetForm();

    try {
        await axios.post("http://localhost:8080/api/pet/postpetrecord", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Pet successfully rehomed!");
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("There was an error rehoming the pet. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      petType: '',
      breed: '',
      age: '',
      gender: '', // Reset gender
      description: '',
      image: null, // Reset image
      userName: '',
      address: '',
      contactNumber: '',
      submissionDate: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input using ref
    }
  };
  

  const styles = {
    container: {
      padding: "8px", // Reduced padding to decrease overall form height
      maxWidth: "1200px", // Limiting the width
      margin: "0 auto", // Centering the form
    },
    columns: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap", // Ensure columns wrap on smaller screens
      gap: "10px", // Reduced gap between columns
    },
    leftColumn: {
      flex: 1,
      border: "2px solid #5A20A8", // Border around left column
      padding: "10px", // Reduced padding
      boxSizing: "border-box",
    },
    rightColumn: {
      flex: 1,
      padding: "10px", // Reduced padding
      boxSizing: "border-box",
    },
    buttonContainer: {
      marginTop: "10px", // Reduced margin for button container
      display: "flex",
      justifyContent: "center",
    },
  };

  return (
    <div style={styles.container}>
      <Typography variant="h4" sx={{ color: "#5A20A8", marginBottom: 2, fontFamily: "'Caramel', sans-serif", fontWeight: "bold", textAlign: "center" }}>
        Rehome Your Pet
      </Typography>
      <div style={styles.columns}>
        <div style={styles.leftColumn}>
          <TextField
            label="Name of Pet"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Pet Type"
            name="petType"
            fullWidth
            value={formData.petType}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Breed"
            name="breed"
            fullWidth
            value={formData.breed}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Age"
            name="age"
            fullWidth
            value={formData.age}
            onChange={handleChange}
            required
            type="number"
            sx={{ marginBottom: 2 }}
          />

          {/* Gender dropdown */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            name="description"
            fullWidth
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
            sx={{ marginBottom: 2 }}
          />
          {/* Image upload field */}
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"
            required
            ref={fileInputRef}
            style={{ marginBottom: "16px", display: "block" }}
          />
        </div>

        {/* Adopter's Info */}
        <div style={styles.rightColumn}>
          <TextField
            label="Your Name"
            name="userName"
            fullWidth
            value={formData.userName}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            value={formData.address}
            onChange={handleChange}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            fullWidth
            value={formData.contactNumber}
            onChange={handleChange}
            required
            type="tel"
            sx={{ marginBottom: 2 }}
          />
          <TextField
  label="Submission Date"
  type="date"
  name="submissionDate"
  value={formData.submissionDate || new Date().toISOString().split('T')[0]} // Set today's date by default
  onChange={handleChange}
  InputLabelProps={{ shrink: true }}
  inputProps={{
    min: new Date().toISOString().split('T')[0], // today's date as the minimum
    max: new Date().toISOString().split('T')[0]  // today's date as the maximum
  }}
  variant="outlined"
  required
  fullWidth
  sx={{ marginBottom: 2 }}
/>

        </div>
      </div>
      <div style={styles.buttonContainer}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#5A20A8",
            color: "white",
            "&:hover": { backgroundColor: "#431880" },
            width: "200px",
          }}
          onClick={handleSubmit}
        >
          Confirm Rehome
        </Button>
      </div>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#5A20A8',
            color: 'white'
          }
        }}
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#5A20A8',
            color: 'white'
          }
        }}
      />
    </div>
  );
};

export default RehomeForm;