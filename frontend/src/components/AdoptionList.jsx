import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Button,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const AdoptionList = () => {
    const [adoptions, setAdoptions] = useState([]);
    const [rehomes, setRehomes] = useState([]); // State to store rehome records
    const [editRehome, setEditRehome] = useState(null);
    const [editAdoption, setEditAdoption] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();
    const [newStatus, setNewStatus] = useState('');

    // Fetch adoption and rehome records
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const adoptionResponse = await axios.get('http://localhost:8080/api/adoptions');
                const rehomeResponse = await axios.get('http://localhost:8080/api/pet/getAllPets'); 
                setAdoptions(adoptionResponse.data);
                setRehomes(rehomeResponse.data); // Store rehome data
            } catch (error) {
                setError("Failed to load records.");
            }
        };

        fetchRecords();
    }, []);

    const handleBack = () => {
        navigate('/adopt'); 
    };

    
    const handleEditClick = (adoption) => {
        setEditAdoption(adoption); // Set the adoption being edited
        setNewStatus(adoption.status); // Pre-fill the status dropdown
        setEditDialogOpen(true); // Open the dialog
    };

    // Close the edit dialog
    const handleDialogClose = () => {
        setEditDialogOpen(false);
        setEditAdoption(null);
    };

    // Handle status change
    const handleStatusChange = (event) => {
        setNewStatus(event.target.value);
    };

    // Save the updated status
    const handleSaveStatus = async () => {
        try {
            if (editAdoption) {
                const updatedAdoption = { ...editAdoption, status: newStatus };
                await axios.put(`http://localhost:8080/api/adoptions/${editAdoption.adoptionID}`, updatedAdoption);
    
                // Update the local state with the new status
                setAdoptions((prev) =>
                    prev.map((adoption) =>
                        adoption.adoptionID === editAdoption.adoptionID ? { ...adoption, status: newStatus } : adoption
                    )
                );
    
                setSuccessMessage('Adoption status updated successfully!');
            }
        } catch (error) {
            setError('Failed to update adoption status.');
        } finally {
            handleDialogClose(); // Close the dialog after saving
        }
    };
    

    const handleEditRehomeClick = (rehome) => {
        setEditRehome(rehome); // Set the rehome being edited
        setNewStatus(rehome.status); // Pre-fill the status dropdown
        setEditDialogOpen(true); // Open the dialog
    };

    const handleSaveRehomeStatus = async () => {
        try {
            if (editRehome) {
                console.log("Editing rehome: ", editRehome);
                
                const petToAdd = {
                    name: editRehome.name,
                    type: editRehome.type,
                    breed: editRehome.breed,
                    age: editRehome.age,
                    gender: editRehome.gender,
                    description: editRehome.description,
                    photo: editRehome.photo,  // Assuming the photo is part of the rehome data
                    status: "AVAILABLE",  // Set the status to "AVAILABLE" when adding to PetList
                    userName: editRehome.userName,  // Assuming these fields are part of the rehome
                    address: editRehome.address,
                    contactNumber: editRehome.contactNumber,
                    submissionDate: editRehome.submissionDate,
                };
    
                if (newStatus === "REJECTED") {
                    console.log("Rehome rejected, deleting pet from rehome list");
                    await axios.delete(`http://localhost:8080/api/pet/deletePetDetails/${editRehome.pid}`);
                    setRehomes((prev) => prev.filter((rehome) => rehome.pid !== editRehome.pid));
                    setSuccessMessage("Rehome record rejected and deleted.");
                } else if (newStatus === "ACCEPTED_REHOME") {
                    console.log("Rehome accepted, adding pet to PetList");
                    const response = await axios.post("http://localhost:8080/api/pet/postpetrecord", petToAdd);
                    console.log("Response from adding pet: ", response);
    
                    // Remove the approved rehome from the rehome list
                    setRehomes((prev) => prev.filter((rehome) => rehome.pid !== editRehome.pid));
    
                    // Optionally update the PetList by refetching or adding the new pet locally
                    fetchRecords();  // Fetch updated PetList after approval
    
                    setSuccessMessage("Rehome approved and pet added to PetList.");
                }
            }
        } catch (error) {
            console.error("Error updating rehome status: ", error);
            setError("Failed to update rehome status.");
        } finally {
            handleDialogClose();  // Close the dialog after processing
        }
    };    

    const renderAdoptionCards = (adoptionList) => (
        adoptionList.map((adoption) => (
            <Grid item xs={12} sm={6} md={5} key={adoption.adoptionID}>
                <Card style={styles.card}>
                    <CardContent>
                        <Typography variant="h6">ID: {adoption.adoptionID}</Typography>
                        <Typography variant="body1">Name: {adoption.name}</Typography>
                        <Typography variant="body1">Address: {adoption.address}</Typography>
                        <Typography variant="body1">Contact Number: {adoption.contactNumber}</Typography>
                        <Typography variant="body1">Pet Type: {adoption.petType}</Typography>
                        <Typography variant="body1">Breed: {adoption.breed}</Typography>
                        <Typography variant="body1">Description: {adoption.petDescription}</Typography>
                        <Typography variant="body1">Submission Date: {adoption.submissionDate}</Typography>
                        <Typography variant="body1">Status: {adoption.status}</Typography>
                        <div style={styles.buttonContainer}>
                        <IconButton color="primary" onClick={() => handleEditClick(adoption)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="primary">
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        ))
    );

    const renderRehomeCards = (rehomeList) => (
        rehomeList.map((rehome) => (
            <Grid item xs={12} sm={6} md={5} key={rehome.pid}>
                <Card style={styles.card}>
                    <CardContent>
                        <Typography variant="h6">ID: {rehome.pid}</Typography>
                        <Typography variant="body1">Name: {rehome.name}</Typography>
                        <Typography variant="body1">Type: {rehome.type}</Typography>
                        <Typography variant="body1">Breed: {rehome.breed}</Typography>
                        <Typography variant="body1">Age: {rehome.age}</Typography>
                        <Typography variant="body1">Gender: {rehome.gender}</Typography>
                        <Typography variant="body1">Description: {rehome.description}</Typography>
                        <Typography variant="body1">User Name: {rehome.userName}</Typography>
                        <Typography variant="body1">Address: {rehome.address}</Typography>
                        <Typography variant="body1">Contact Number: {rehome.contactNumber}</Typography>
                        <Typography variant="body1">Submission Date: {rehome.submissionDate}</Typography>
                        <Typography variant="body1">Status: {rehome.status}</Typography>
                        <div style={styles.buttonContainer}>
                            <IconButton color="primary" onClick={() => handleEditRehomeClick(rehome)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="primary">
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        ))
    );
    

    return (
        <div style={styles.container}>
            <IconButton onClick={handleBack} style={styles.backButton}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" sx={{ fontFamily: "'Caramel', sans-serif", fontWeight: "bold", color: '#5A20A8' }}>
                Adoption and Rehome List
            </Typography>
            {error && <Typography variant="body1" sx={{ color: 'red' }}>{error}</Typography>}

            <Grid container spacing={4}>
                {/* Left Column for Adoptions */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={styles.centeredLeftHeading}>Pending Adoptions</Typography>
                    <Grid container spacing={2}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'PENDING'))}
                    </Grid>

                    <Typography variant="h6" sx={styles.centeredLeftHeading}>Approved Adoptions</Typography>
                    <Grid container spacing={2}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'APPROVED'))}
                    </Grid>

                    <Typography variant="h6" sx={styles.centeredLeftHeading}>Rejected Adoptions</Typography>
                    <Grid container spacing={2}>
                        {renderAdoptionCards(adoptions.filter(adoption => adoption.status === 'REJECTED'))}
                    </Grid>
                </Grid>

                {/* Right Column for Rehome */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={styles.centeredRightHeading}>Pending Rehome</Typography>
                    <Grid container spacing={2}>
                        {renderRehomeCards(rehomes.filter(rehome => rehome.status === 'PENDING_REHOME'))}
                    </Grid>

                    <Typography variant="h6" sx={styles.centeredRightHeading}>Approved Rehome</Typography>
                    <Grid container spacing={2}>
                        {renderRehomeCards(rehomes.filter(rehome => rehome.status === 'ACCEPTED_REHOME'))}
                    </Grid>
                    

                </Grid>
            </Grid>

            <Dialog open={editDialogOpen} onClose={handleDialogClose}>
    <DialogTitle>{editAdoption ? "Edit Adoption Status" : "Edit Rehome Status"}</DialogTitle>
    <DialogContent>
        <Select value={newStatus} onChange={handleStatusChange} fullWidth>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
        </Select>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleDialogClose} color="secondary">
            Cancel
        </Button>
        <Button onClick={editAdoption ? handleSaveStatus : handleSaveRehomeStatus} color="primary">
            Save
        </Button>
    </DialogActions>
</Dialog>


            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')} message={successMessage} />

        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
    },
    backButton: {
        alignSelf: 'flex-start', 
    },
    card: {
        width: '300px',
        minHeight: '250px',
        margin: 'auto',
        marginBottom: '20px',
        padding: '10px',
    },
    buttonContainer: {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    centeredLeftHeading: {
        textAlign: 'left',
        paddingLeft: '30%',
        fontFamily: "'Arial', sans-serif",
        fontWeight: 'bold',
        color: '#5A20A8',
        marginBottom: '10px',
    },
    centeredRightHeading: {
        textAlign: 'right',
        paddingRight: '40%',
        fontFamily: "'Arial', sans-serif",
        fontWeight: 'bold',
        color: '#5A20A8',
        marginBottom: '10px',
    },
};

export default AdoptionList;