import React, { useState } from 'react';
import DonationForm from './components/DonationForm';
import DonationTable from './components/DonationTable';
import NewsFeed from './components/NewsFeed';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

function App() {
  const [currentView, setCurrentView] = useState('donation');
  const [donationToEdit, setDonationToEdit] = useState(null);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleEditClick = (donation) => {
    setDonationToEdit(donation);
    setCurrentView('donation'); // Redirect to the form view
  };

  return (
    <div>
      {/* Navbar */}
      <AppBar position="static" color="black" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6">PURR</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <AppBar position="static" color="black" elevation={0}>
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
            <Button color="inherit" onClick={() => handleViewChange('news')}>NEWS FEED</Button>
            <Button color="inherit" onClick={() => handleViewChange('donation')}>DONATE</Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit">ACCOUNT</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Conditional Rendering */}
      {currentView === 'donation' ? (
        <DonationForm onAdminClick={() => handleViewChange('table')} donationToEdit={donationToEdit} />
      ) : currentView === 'table' ? (
        <DonationTable onBackClick={() => handleViewChange('donation')} onEditClick={handleEditClick} />
      ) : (
        <NewsFeed />
      )}
    </div>
  );
}

export default App;
