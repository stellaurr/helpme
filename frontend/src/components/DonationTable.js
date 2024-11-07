import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, Grid, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';

const DonationTable = ({ onBackClick, onEditClick }) => {
  const [donations, setDonations] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/donations');
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/donations/${deleteId}`);
      setDonations(donations.filter(donation => donation.donationID !== deleteId));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting donation:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleEditClick = (donation) => {
    onEditClick(donation); // Pass the selected donation to the parent component (App.js)
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Donation Records</Typography>

      {/* Grid for donation cards */}
      <Grid container spacing={3}>
        {donations.map((donation) => (
          <Grid item xs={12} sm={6} md={4} key={donation.donationID}>
            <Card sx={{ padding: 2 }}>
              <CardContent>
                <Typography variant="h6">ID: {donation.donationID}</Typography>
                <Typography variant="body1">Amount: {donation.amount}</Typography>
                <Typography variant="body1">Donation Date: {donation.donationDate}</Typography>
                <Typography variant="body1">Frequency: {donation.frequency}</Typography>
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <Button color="secondary" onClick={() => handleDeleteClick(donation.donationID)}>Delete</Button>
                  <Button color="primary" onClick={() => handleEditClick(donation)}>Edit</Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Back Button */}
      <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={onBackClick}>Back to Form</Button>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this donation?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DonationTable;
