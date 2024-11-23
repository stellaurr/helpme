        import React, { useState, useEffect } from 'react';
        import axios from 'axios';
        import {
            Grid,
            Card,
            CardContent,
            Typography,
            Button,
            Snackbar,
            Dialog,
            DialogTitle,
            DialogContent,
            DialogActions,
            Select,
            MenuItem,
        } from '@mui/material';

        const AdoptionList = () => {
            const [adoptions, setAdoptions] = useState([]);
            const [editAdoption, setEditAdoption] = useState(null);
            const [successMessage, setSuccessMessage] = useState('');
            const [error, setError] = useState('');
            const [editDialogOpen, setEditDialogOpen] = useState(false);
            const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
            const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
            const [deleteId, setDeleteId] = useState(null);

            useEffect(() => {
                const fetchAdoptions = async () => {
                    try {
                        const response = await axios.get('http://localhost:8080/api/adoptions');
                        setAdoptions(response.data);
                    } catch (error) {
                        setError("Failed to load adoptions.");
                    }
                };

                fetchAdoptions();
            }, []);

            const handleDeleteClick = (id) => {
                setDeleteId(id);
                setDeleteDialogOpen(true);
            };

            const handleDelete = async () => {
                setDeleteDialogOpen(false);
                if (!deleteId) return;

                try {
                    await axios.delete(`http://localhost:8080/api/adoptions/${deleteId}`);
                    setAdoptions(prevAdoptions => prevAdoptions.filter(adoption => adoption.adoptionID !== deleteId));
                    setSuccessMessage("Adoption deleted successfully!");
                    setDeleteId(null);
                } catch (error) {
                    setError("Failed to delete adoption.");
                }
            };

            const handleEditAdoption = () => {
                setConfirmDialogOpen(true);
            };

            const handleConfirmUpdate = async () => {
                setConfirmDialogOpen(false);
                if (!editAdoption) return;

                try {
                    const response = await axios.put(`http://localhost:8080/api/adoptions/${editAdoption.adoptionID}`, editAdoption);
                    setAdoptions(prevAdoptions => prevAdoptions.map(adoption => (adoption.adoptionID === response.data.adoptionID ? response.data : adoption)));
                    setEditDialogOpen(false);
                    setEditAdoption(null);
                    setSuccessMessage("Adoption updated successfully!");
                } catch (error) {
                    setError("Failed to update adoption.");
                }
            };

            const handleEditClick = (adoption) => {
                setEditAdoption(adoption);
                setEditDialogOpen(true);
            };

            const pendingAdoptions = adoptions.filter(adoption => adoption.status === 'PENDING');
            const approvedAdoptions = adoptions.filter(adoption => adoption.status === 'APPROVED');
            const rejectedAdoptions = adoptions.filter(adoption => adoption.status === 'REJECTED');

            return (
                <div style={styles.container}>
                    <h2>Adoption List</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <h3>Pending Adoptions</h3>
                    <Grid container spacing={2}>
                        {pendingAdoptions.map((adoption) => (
                            <Grid item xs={12} sm={6} md={4} key={adoption.adoptionID}>
                                <Card style={styles.card}>
                                    <CardContent>
                                        <Typography variant="h6">ID: {adoption.adoptionID}</Typography>
                                        <Typography variant="body1">Name: {adoption.name}</Typography>
                                        <Typography variant="body1">Address: {adoption.address}</Typography>
                                        <Typography variant="body1">Contact: {adoption.contactNumber}</Typography>
                                        <Typography variant="body1">Pet Type: {adoption.petType}</Typography>
                                        <Typography variant="body1">Submission Date: {adoption.submissionDate}</Typography>
                                        <Typography variant="body1">Status: {adoption.status}</Typography>
                                        <div style={styles.buttonContainer}>
                                            <Button onClick={() => handleEditClick(adoption)} variant="contained" color="success" sx={{ marginRight: 1 }}>Edit</Button>
                                            <Button onClick={() => handleDeleteClick(adoption.adoptionID)} variant="contained" color="error">Delete</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <h3>Approved Adoptions</h3>
                    <Grid container spacing={2}>
                        {approvedAdoptions.map((adoption) => (
                            <Grid item xs={12} sm={6} md={4} key={adoption.adoptionID}>
                                <Card style={styles.card}>
                                    <CardContent>
                                        <Typography variant="h6">ID: {adoption.adoptionID}</Typography>
                                        <Typography variant="body1">Name: {adoption.name}</Typography>
                                        <Typography variant="body1">Address: {adoption.address}</Typography>
                                        <Typography variant="body1">Contact: {adoption.contactNumber}</Typography>
                                        <Typography variant="body1">Pet Type: {adoption.petType}</Typography>
                                        <Typography variant="body1">Submission Date: {adoption.submissionDate}</Typography>
                                        <Typography variant="body1">Status: {adoption.status}</Typography>
                                        <div style={styles.buttonContainer}>
                                            <Button onClick={() => handleEditClick(adoption)} variant="contained" color="success" sx={{ marginRight: 1 }}>Edit</Button>
                                            <Button onClick={() => handleDeleteClick(adoption.adoptionID)} variant="contained" color="error">Delete</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <h3>Rejected Adoptions</h3>
                    <Grid container spacing={2}>
                        {rejectedAdoptions.map((adoption) => (
                            <Grid item xs={12} sm={6} md={4} key={adoption.adoptionID}>
                                <Card style={styles.card}>
                                    <CardContent>
                                        <Typography variant="h6">ID: {adoption.adoptionID}</Typography>
                                        <Typography variant="body1">Name: {adoption.name}</Typography>
                                        <Typography variant="body1">Address: {adoption.address}</Typography>
                                        <Typography variant="body1">Contact: {adoption.contactNumber}</Typography>
                                        <Typography variant="body1">Pet Type: {adoption.petType}</Typography>
                                        <Typography variant="body1">Submission Date: {adoption.submissionDate}</Typography>
                                        <Typography variant="body1">Status: {adoption.status}</Typography>
                                        <div style={styles.buttonContainer}>
                                            <Button onClick={() => handleEditClick(adoption)} variant="contained" color="success" sx={{ marginRight: 1 }}>Edit</Button>
                                            <Button onClick={() => handleDeleteClick(adoption.adoptionID)} variant="contained" color="error">Delete</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={() => setSuccessMessage('')} message={successMessage} />
                    
                    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                        <DialogTitle>Edit Adoption Status</DialogTitle>
                        <DialogContent>
                            {editAdoption && (
                                <Select
                                    label="Status"
                                    value={editAdoption.status}
                                    onChange={(e) => setEditAdoption({ ...editAdoption, status: e.target.value })}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ marginBottom: 2 }}
                                >
                                    <MenuItem value="APPROVED">Approved</MenuItem>
                                    <MenuItem value="REJECTED">Rejected</MenuItem>
                                </Select>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleEditAdoption} variant="contained">Save</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Update Confirmation Dialog */}
                    <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                        <DialogTitle>Confirm Update</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to update this record?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleConfirmUpdate} variant="contained" color="primary">Do it</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this record?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
                        </DialogActions>
                    </Dialog>
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
            card: {
                width: '300px',
                minHeight: '250px',
                margin: 'auto',
            },
            buttonContainer: {
                marginTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
            },
        };

        export default AdoptionList;
