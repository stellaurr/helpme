import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Snackbar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const DonationForm = ({ onAdminClick, donationToEdit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    donationDate: '',
    frequency: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Prefill form if donationToEdit is passed (edit mode)
  useEffect(() => {
    if (donationToEdit) {
      setFormData({
        amount: donationToEdit.amount,
        donationDate: donationToEdit.donationDate,
        frequency: donationToEdit.frequency,
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

  return (
    <Box component="form" onSubmit={handleSubmit} sx={styles.container}>
      <Typography variant="h6">{donationToEdit ? 'Update Donation' : 'Make a Donation'}</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        <Button type="submit" variant="contained" color="primary" sx={styles.button}>
          {donationToEdit ? 'UPDATE' : 'DONATE'}
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={successMessage}
      />

      <Button onClick={onAdminClick} sx={styles.backButton}>ADMIN</Button>
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
