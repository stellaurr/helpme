import React, { useState } from 'react';
import {
  Card,
  Box,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Chip,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AdoptionForm from './AdoptionForm'; 
import RehomeForm from './RehomeForm';
import goldenImage from '../assets/golden_retriever.jpg';
import siameseImager from '../assets/siamese.jpg';
import cockatielImage from '../assets/cockatiel.jpg';


const PetList = () => {
  const [openAdoption, setOpenAdoption] = useState(false); 
  const [openRehome, setOpenRehome] = useState(false); 

  const [pets] = useState([
    {
      image: goldenImage,
      breed: 'Golden Retriever',
      type: 'Dog',
      description: 'A friendly and intelligent breed.',
    },
    {
      image: siameseImager,
      breed: 'Siamese',
      type: 'Cat',
      description: 'An affectionate and playful breed.',
    },
    {
      image: cockatielImage,
      breed: 'Cockatiel',
      type: 'Bird',
      description: 'A social and curious companion.',
    },
    // Add more pet objects as needed
  ]);

  const handleCardClick = () => {
    // Opens the modal with the adoption form
    setOpenAdoption(true);
  };

  const handleAdoptionClose = () => {
    // Closes the adoption modal
    setOpenAdoption(false);
  };

  const handleRehomeClick = () => {
    // Opens the modal with the rehome form
    setOpenRehome(true);
  };

  const handleRehomeClose = () => {
    // Closes the rehome modal
    setOpenRehome(false);
  };

  return (
    <>
      <div style={styles.pageContainer}>
        <Typography variant="h6" component="h6" sx={{ mb: 3, color: '#5A20A8', fontWeight: 'bold' }}>
          List of Pets to Adopt
        </Typography>
        <div style={styles.listContainer}>
          {pets.length > 0 ? (
            pets.map((pet, index) => (
              <Card
                key={index}
                sx={{ height: 400, display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onClick={handleCardClick} // Opens the adoption modal when card is clicked
              >
                {pet.image ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={pet.image}
                    alt={pet.breed}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 140,
                      backgroundColor: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No Image Available
                    </Typography>
                  </Box>
                )}

                <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                      label={pet.type}
                      variant="outlined"
                      color="primary"
                      sx={{
                        fontWeight: 'bold',
                        borderWidth: 1.5,
                        borderColor: 'primary.main',
                      }}
                    />
                    <Chip
                      label={pet.breed}
                      variant="outlined"
                      color="primary"
                      sx={{
                        fontWeight: 'bold',
                        borderWidth: 1.5,
                        borderColor: 'primary.main',
                      }}
                    />
                  </Stack>
                  <Typography color="#5A20A8" fontSize="12px" fontWeight="bold">
                    Pet Type
                  </Typography>
                  <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                    {pet.type}
                  </Typography>
                  <Typography color="#5A20A8" fontSize="12px" fontWeight="bold">
                    Breed
                  </Typography>
                  <Typography color="#5A20A8" fontWeight="bold" sx={{ ml: 2 }}>
                    {pet.breed}
                  </Typography>
                  <br />
                  <Typography color="#5A20A8" fontStyle="italic" fontWeight="bold" noWrap>
                    {pet.description}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body1" color="#5A20A8" fontWeight="bold">
              No pets available for adoption at the moment.
            </Typography>
          )}
        </div>
      </div>

      {/* Modal for Adoption Form */}
      <Dialog open={openAdoption} onClose={handleAdoptionClose} fullWidth maxWidth="md">
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleAdoptionClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <AdoptionForm /> {/* Render your AdoptionForm here */}
        </DialogContent>
      </Dialog>

      {/* Modal for Rehome Form */}
      <Dialog open={openRehome} onClose={handleRehomeClose} fullWidth maxWidth="md">
        <DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleRehomeClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <RehomeForm /> {/* Render your RehomeForm here */}
        </DialogContent>
      </Dialog>

      {/* Full-width Footer */}
      <Box
        sx={{
          width: '100vw',
          backgroundColor: '#6c5ce7', // Footer color
          color: 'white',
          textAlign: 'center',
          padding: '8px 0',
          position: 'fixed',
          bottom: 0,
          left: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h7" fontWeight="bold" sx={{ mr: 2 }}>
          Do you want to rehome your pet?
        </Typography>
        <ToggleButton
          onClick={handleRehomeClick} // Opens the rehome modal when clicked
          sx={{
            border: "2px solid",
            borderRadius: "25px",
            padding: "12px 36px",
            borderColor: "#6c5ce7",
            backgroundColor: "#6c5ce7",
            color: "#fff",
            "&:hover": {
              backgroundColor: "white",
              color: "#6c5ce7",
            },
          }}
        >
          Rehome
        </ToggleButton>
      </Box>
    </>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Aligns the title and list to the left
    width: '100%', // Ensures the container takes full width
    padding: '20px',
  },
  listContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'flex-start', // Aligns the cards to the left
    width: '100%', // Ensures the list takes full width
  },
};

export default PetList;
