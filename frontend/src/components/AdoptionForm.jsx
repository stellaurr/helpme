import React, { useState } from 'react';
import { TextField, Button, Snackbar, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios'; 

const AdoptionForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contactNumber: '',
        submissionDate: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newAdoption = {
            ...formData,
            status: 'PENDING', 
            adoptionID: Date.now(), 
        };

        resetForm();

        try {
            await axios.post('http://localhost:8080/api/adoptions', newAdoption);
            setSuccessMessage('Adoption form submitted successfully!');
            onSubmit(newAdoption); 
        } catch (error) {
            console.error('Failed to submit the adoption form:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            contactNumber: '',
            submissionDate: '',
        });
    };

    return (
        <div style={styles.container}>
            <h2>Adoption Form</h2>
            <form onSubmit={handleSubmit}>
                <TextField 
                    label="Name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    variant="outlined" 
                    required 
                    fullWidth 
                    sx={{ marginBottom: 2 }} 
                />
                <TextField 
                    label="Address" 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange} 
                    variant="outlined" 
                    required 
                    fullWidth 
                    sx={{ marginBottom: 2 }} 
                />
                <TextField 
                    label="Contact Number" 
                    name="contactNumber" 
                    value={formData.contactNumber} 
                    onChange={handleChange} 
                    variant="outlined" 
                    required 
                    fullWidth 
                    sx={{ marginBottom: 2 }} 
                />
                
                <TextField 
                    label="Submission Date" 
                    type="date" 
                    name="submissionDate" 
                    value={formData.submissionDate} 
                    onChange={handleChange} 
                    InputLabelProps={{ shrink: true }} 
                    variant="outlined" 
                    required 
                    fullWidth 
                    sx={{ marginBottom: 2 }} 
                />
                <Button variant="contained" type="submit">Submit Adoption</Button>
            </form>
            <Snackbar 
                open={!!successMessage} 
                autoHideDuration={6000} 
                onClose={() => setSuccessMessage('')} 
                message={successMessage} 
            />
        </div>
    );
};

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
    }
};

export default AdoptionForm;
