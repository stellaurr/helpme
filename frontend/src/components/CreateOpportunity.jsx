import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateOpportunity = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    hoursWorked: 0,
    volunteersNeeded: 0
  });
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility
  const [isSubmitting, setIsSubmitting] = useState(false); // State to prevent multiple submissions
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Open confirmation dialog before submitting
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await axios.post('http://localhost:8080/api/volunteer/opportunity', formData);
      navigate('/volunteer'); // Redirect to the Volunteer page after successful submission
    } catch (error) {
      console.error("Error creating opportunity:", error);
    } finally {
      setIsSubmitting(false);
      setOpenDialog(false); // Close the dialog after submission attempt
    }
  };

  const handleCancel = () => {
    setOpenDialog(false); // Close the dialog without submitting
  };

  const handleBack = () => {
    navigate('/volunteer'); // Redirect to the Volunteer page when the Back button is clicked
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Create Volunteer Opportunity
      </Typography>

      <Typography variant="body1" paragraph>
        Use this form to create a volunteer opportunity that others can sign up for. Make sure to provide detailed information such as the title, description, date, location, and number of volunteers needed to ensure a smooth volunteering experience.
      </Typography>

      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={handleBack} 
        style={{ marginBottom: '20px' }}
      >
        Back to Volunteer Page
      </Button>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          fullWidth
          value={formData.title}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          fullWidth
          value={formData.date}
          onChange={handleChange}
          required
          margin="normal"
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: today }} // Prevent selecting past dates
        />
        <TextField
          label="Location"
          name="location"
          fullWidth
          value={formData.location}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          label="Hours Worked"
          name="hoursWorked"
          type="number"
          fullWidth
          value={formData.hoursWorked}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          label="Volunteers Needed"
          name="volunteersNeeded"
          type="number"
          fullWidth
          value={formData.volunteersNeeded}
          onChange={handleChange}
          required
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Opportunity'}
        </Button>
      </form>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCancel}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title">Confirm Creation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to create this volunteer opportunity?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateOpportunity;
