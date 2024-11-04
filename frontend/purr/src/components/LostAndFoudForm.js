import React, { useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { AppBar, Toolbar, Typography, TextField, Button, MenuItem } from '@mui/material';

const LostAndFoundForm = () => {
    const [formData, setFormData] = useState({
        reportType: 'Lost',
        dateReported: '',
        lastSeen: '',
        description: '',
        image: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("reportType", formData.reportType);
        formDataToSend.append("dateReported", formData.dateReported);
        formDataToSend.append("lastSeen", formData.lastSeen);
        formDataToSend.append("description", formData.description);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        try {
            await axios.post('http://localhost:8080/api/lostandfound', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Submission successful!");
        } catch (error) {
            console.error("Error submitting lost and found entry:", error);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div style={{ width: '100%', maxWidth: '500px', padding: '20px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Report Lost or Found Pet</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <TextField
                            select
                            label="Report Type"
                            name="reportType"
                            value={formData.reportType}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        >
                            <MenuItem value="Lost">Lost</MenuItem>
                            <MenuItem value="Found">Found</MenuItem>
                        </TextField>
                        <TextField
                            label="Date Reported"
                            name="dateReported"
                            type="date"
                            value={formData.dateReported}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Last Seen Location"
                            name="lastSeen"
                            value={formData.lastSeen}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            style={{ marginTop: '10px' }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: '20px', padding: '10px 0' }}
                        >
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LostAndFoundForm;
