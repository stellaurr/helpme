import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Typography,
    Box,
    CircularProgress,
    Alert,
    Button,
    Grid,
    Paper,
    IconButton,
    Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VolunteerSignUp from './VolunteerSignUp'; // Import the sign-up component

const OpportunityDetail = () => {
    const { id } = useParams(); // Get the opportunity ID from the URL
    const [opportunity, setOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchOpportunityDetail = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/volunteer/opportunity/${id}`);
            setOpportunity(response.data);
        } catch (error) {
            console.error("Error fetching opportunity detail:", error);
            setError("Could not fetch opportunity details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpportunityDetail();
    }, [id]);

    const handleSignUpClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!opportunity) {
        return <Typography>No opportunity found.</Typography>;
    }

    return (
        <Grid container spacing={2} sx={{ padding: 3 }}>
            <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom>{opportunity.title}</Typography>
                    <Typography variant="body1" gutterBottom>{opportunity.description}</Typography>
                    <Divider sx={{ marginY: 2 }} />
                    <Typography variant="body2"><strong>Location:</strong> {opportunity.location}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {opportunity.date}</Typography>
                    <Typography variant="body2"><strong>Hours:</strong> {opportunity.hoursWorked}</Typography> {/* Display hoursWorked */}
                    <Typography variant="body2"><strong>Volunteers Needed:</strong> {opportunity.volunteersNeeded}</Typography>
                    {/* Button to open sign-up form with customized color */}
                    <Button variant="contained" sx={{ backgroundColor: 'green', color: 'white', marginTop: 2 }} onClick={handleSignUpClick}>
                        Sign Up
                    </Button>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                {/* Sign Up Modal */}
                {isModalOpen && (
                    <Paper elevation={4} sx={{ padding: 3, borderRadius: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Sign Up for Opportunity</Typography>
                            <IconButton onClick={handleCloseModal}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider sx={{ marginY: 2 }} />
                        <VolunteerSignUp 
                            opportunityID={id} 
                            hoursWorked={opportunity.hoursWorked} // Pass hoursWorked to the sign-up component
                            onClose={handleCloseModal} 
                        />
                    </Paper>
                )}
            </Grid>
        </Grid>
    );
};

export default OpportunityDetail;
