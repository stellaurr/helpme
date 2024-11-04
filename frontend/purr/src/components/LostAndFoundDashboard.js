import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Card, CardContent, CardMedia, TextField, Box, MenuItem, Select, FormControl, InputLabel, Divider } from '@mui/material';
import Navbar from "./Navbar";
import PlaceholderLogo from '../assets/Purr-Dark.png';

const LostAndFoundDashboard = () => {
    const [entries, setEntries] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editableData, setEditableData] = useState({});

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/lostandfound');
            setEntries(response.data);
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    };

    const handleEdit = (entry) => {
        const formattedEntry = {
            ...entry,
            dateReported: entry.dateReported ? entry.dateReported.split('T')[0] : '',
        };
        setEditingId(entry.reportID);
        setEditableData(formattedEntry);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const updateData = {
                reportType: editableData.reportType,
                dateReported: editableData.dateReported,
                lastSeen: editableData.lastSeen,
                description: editableData.description,
            };
            await axios.put(`http://localhost:8080/api/lostandfound/${editingId}`, updateData);
            setEditingId(null);
            fetchEntries();
            alert("Entry updated successfully!");
        } catch (error) {
            console.error("Error saving entry:", error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
    };
    //
    // const handleMarkAsFound = async (id) => {
    //     try {
    //         await axios.put(`http://localhost:8080/api/lostandfound/${id}`, { reportType: 'Found' });
    //         fetchEntries();
    //         alert("Marked as found!");
    //     } catch (error) {
    //         console.error("Error marking as found:", error);
    //     }
    // };

    const handleMarkAsFound = async (id) => {
        console.log("Marking entry as found with ID:", id);
        if (!id) {
            console.error("ID is undefined or null, check the button click logic.");
            return;
        }
        try {
            await axios.put(`http://localhost:8080/api/lostandfound/${id}`, { reportType: 'Found' });
            fetchEntries();  // Refresh the list after updating
            alert("Marked as found!");
        } catch (error) {
            console.error("Error marking as found:", error);
        }
    };



    const lostEntries = entries.filter(entry => entry.reportType === 'Lost');
    const foundEntries = entries.filter(entry => entry.reportType === 'Found');

    const renderEntryCard = (entry) => (
        <Card key={entry.reportID} style={{ width: '300px', margin: '10px', textAlign: 'center' }}>
            <Box style={{ height: '300px', width: '300px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CardMedia
                    component="img"
                    image={entry.image ? `data:image/jpeg;base64,${entry.image}` : PlaceholderLogo}
                    alt="Lost or Found Pet"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </Box>
            <CardContent>
                {editingId === entry.reportID ? (
                    <>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Report Type</InputLabel>
                            <Select
                                name="reportType"
                                value={editableData.reportType}
                                onChange={handleInputChange}
                                label="Report Type"
                            >
                                <MenuItem value="Lost">Lost</MenuItem>
                                <MenuItem value="Found">Found</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Date Reported"
                            name="dateReported"
                            type="date"
                            value={editableData.dateReported}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Last Seen"
                            name="lastSeen"
                            value={editableData.lastSeen}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={editableData.description}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                        />
                        <Button onClick={handleSave} color="primary" variant="contained" style={{ marginRight: '10px' }}>
                            Save
                        </Button>
                        <Button onClick={handleCancel} variant="outlined">
                            Cancel
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="subtitle1"><strong>Report Type:</strong> {entry.reportType}</Typography>
                        <Typography variant="subtitle1"><strong>Date Reported:</strong> {entry.dateReported}</Typography>
                        <Typography variant="subtitle1"><strong>Last Seen:</strong> {entry.lastSeen}</Typography>
                        <Typography variant="subtitle1"><strong>Description:</strong> {entry.description}</Typography>
                        <Button onClick={() => handleEdit(entry)} color="primary" variant="contained" style={{ marginTop: '10px', marginRight: '5px' }}>
                            Edit
                        </Button>
                        {entry.reportType === 'Lost' && (
                            <Button onClick={() => handleMarkAsFound(entry.reportID)} color="secondary" variant="outlined" style={{ marginTop: '10px' }}>
                                Mark as Found
                            </Button>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );

    return (
        <>
            <Navbar />
            <Box textAlign="center" padding="20px">
                <Typography variant="h4">Lost and Found Dashboard</Typography>
            </Box>
            <Box padding="20px">
                <Typography variant="h5" gutterBottom>Lost Entries</Typography>
                <Box display="flex" flexWrap="wrap" justifyContent="flex-start">
                    {lostEntries.map(renderEntryCard)}
                </Box>
                <Divider style={{ margin: '20px 0' }} />
                <Typography variant="h5" gutterBottom>Found Entries</Typography>
                <Box display="flex" flexWrap="wrap" justifyContent="flex-start">
                    {foundEntries.map(renderEntryCard)}
                </Box>
            </Box>
        </>
    );
};

export default LostAndFoundDashboard;
