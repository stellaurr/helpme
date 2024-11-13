import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, FormControl, InputLabel, Select, MenuItem, ToggleButton } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import FeaturedImage from '../assets/featured.png'; // Import the image

const DonationForm = ({ onAdminClick, donationToEdit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    donationDate: '',
    frequency: '',
    firstName: '',  // Added
    lastName: '',   // Added
    specialMessage: '', // Added
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  // Prefill form if donationToEdit is passed (edit mode)
  useEffect(() => {
    if (donationToEdit) {
      setFormData({
        amount: donationToEdit.amount,
        donationDate: donationToEdit.donationDate,
        frequency: donationToEdit.frequency,
        firstName: donationToEdit.firstName || '',  // Added
        lastName: donationToEdit.lastName || '',    // Added
        specialMessage: donationToEdit.specialMessage || '', // Added
      });
    }
  }, [donationToEdit]);  // Runs when donationToEdit changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (donationToEdit) {
        // Update the existing donation
        await axios.put(`http://localhost:8080/api/donations/${donationToEdit.donationID}`, formData);
        setSuccessMessage('Donation updated successfully!');
      } else {
        // Submit a new donation
        await axios.post('http://localhost:8080/api/donations', formData);
        setSuccessMessage('Donation submitted successfully!');
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Submission error:', error);
      setSuccessMessage('Submission failed. Try again.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // New function to handle Admin button click and navigate to DonationTable
  const handleAdminClick = () => {
    navigate('/donation_dash');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', paddingTop: '10px' }}>
      {/* Image and Text Box - Takes up 7/12 of the page */}
      <Box sx={{ flex: 7, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ paddingBottom: '8px' }}>FEATURED PET:</Typography>
        <Typography variant="h8" sx={{ paddingBottom: '8px' }}>Say hello to Max! He is a 2-month-old Golden Retriever!</Typography>
        <img src={FeaturedImage} alt="Featured Pet" style={{ width: '70%', height: 'auto', borderRadius: '10px' }} />
      </Box>

      {/* Form Box - Takes up 5/12 of the page */}
      <Box sx={{ flex: 5, display: 'flex', flexDirection: 'column', paddingTop: '20px' }}>
        <Box component="form" onSubmit={handleSubmit} sx={styles.container}>
          <Typography variant="h6" sx={{ marginBottom: '16px' }}>{donationToEdit ? 'Update Donation' : 'Make a Donation'}</Typography>
            <TextField
              name="firstName"
              label="First Name"
              variant="outlined"
              sx={styles.textField}
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              name="lastName"
              label="Last Name"
              variant="outlined"
              sx={styles.textField}
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              name="amount"
              label="Amount"
              variant="outlined"
              sx={styles.textField}
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <TextField
              name="donationDate"
              label="Donation Date"
              variant="outlined"
              sx={styles.textField}
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.donationDate}
              onChange={handleChange}
              required
            />
            <FormControl variant="outlined" fullWidth sx={styles.textField}>
              <InputLabel id="frequency-label">Frequency</InputLabel>
              <Select
                labelId="frequency-label"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                label="Frequency"
                required
              >
                <MenuItem value="One-time">One-time</MenuItem>
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            {/* New fields for Special Message */}
            <TextField
              name="specialMessage"
              label="Special Message"
              variant="outlined"
              sx={styles.textField}
              multiline
              rows={3}
              value={formData.specialMessage}
              onChange={handleChange}
            />
            <ToggleButton
              onClick={handleSubmit}
              sx={{
                border: "2px solid",
                borderRadius: "8px",
                padding: "12px 36px",
                borderColor: "primary.main",
                backgroundColor: "primary.main",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "white",
                  color: "primary.main",
                },
              }}
            >
              {donationToEdit ? 'UPDATE' : 'DONATE'}
            </ToggleButton>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={successMessage}
          />

          <ToggleButton
            onClick={handleAdminClick}
            sx={{
              border: "2px solid",
              borderRadius: "8px",
              padding: "12px 36px",
              borderColor: "primary.main",
              backgroundColor: "primary.main",
              color: "#fff",
              "&:hover": {
                backgroundColor: "white",
                color: "primary.main",
              },
            }}
          >
            ADMIN
          </ToggleButton>
        </Box>
      </Box>
      
    </Box>
  );
};

// CSS styles for centering and formatting
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
    margin: '0 auto',
    maxWidth: '600px',
    gap: '16px',
    flex: 5,
    backgroundColor: '#F9F9F9',  // Added background color
    borderRadius: '8px',          // Rounded corners for rectangle
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',  // Optional: adds a shadow effect
  },
  textField: {
    width: '300px',
    marginBottom: '16px',
  },
  button: {
    marginTop: '16px',
    width: '300px',
  },
  backButton: {
    marginTop: '16px',
    color: 'gray',
  },
};

export default DonationForm;
