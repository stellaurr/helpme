import React, { useState } from 'react';
import { TextField, Button, Snackbar, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const RehomeForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        petType: '',
        breed: '',
        image: '',
        description: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simulate form submission success
        setSuccessMessage('Rehome form submitted successfully!');
        resetForm();

        // Close snackbar and form after a delay
        setTimeout(() => {
            setSuccessMessage('');
            if (onClose) {
                onClose(); // Close the form if onClose function is provided
            }
        }, 2000); // Adjust delay as needed
    };

    const resetForm = () => {
        setFormData({
            petType: '',
            breed: '',
            image: '',
            description: '',
        });
    };

    const handleSnackbarClose = () => {
        setSuccessMessage('');
    };

    return (
        <div style={styles.container}>
            <h2>Rehome Form</h2>
            <form onSubmit={handleSubmit}>
                {/* Dropdown for Pet Type */}
                <FormControl variant="outlined" fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="pet-type-label">Type of Pet</InputLabel>
                    <Select
                        labelId="pet-type-label"
                        name="petType"
                        value={formData.petType}
                        onChange={handleChange}
                        label="Type of Pet"
                    >
                        <MenuItem value="Dog">Dog</MenuItem>
                        <MenuItem value="Bird">Bird</MenuItem>
                        <MenuItem value="Cat">Cat</MenuItem>
                        <MenuItem value="Hamster">Hamster</MenuItem>
                    </Select>
                </FormControl>

                {/* Text box for Breed of Pet */}
                <TextField 
                    label="Breed of Pet" 
                    name="breed" 
                    value={formData.breed} 
                    onChange={handleChange} 
                    variant="outlined" 
                    fullWidth 
                    sx={{ marginBottom: 2 }} 
                />

                {/* Image upload */}
                <Button
                    variant="contained"
                    component="label"
                    sx={{ marginBottom: 2 }}
                >
                    Upload Image
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleFileChange}
                    />
                </Button>

                {/* Text box for Pet Description */}
                <TextField 
                    label="Pet Description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    variant="outlined" 
                    multiline 
                    rows={4} 
                    fullWidth 
                    sx={{ marginBottom: 2 }} 
                />

                <Button variant="contained" type="submit">Confirm Rehome</Button>
            </form>
            <Snackbar 
                open={!!successMessage} 
                autoHideDuration={6000} 
                onClose={handleSnackbarClose} 
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

export default RehomeForm;
