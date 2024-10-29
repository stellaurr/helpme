// UserDashboard.js
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import Navbar from './Navbar';

const UserDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch user data from the backend
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users'); // Change this URL to your actual API endpoint
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = (userId) => {
        // Delete user logic
        axios.delete(`http://localhost:8080/api/users/${userId}`)
            .then(response => {
                setUsers(users.filter(user => user.userId !== userId));
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };

    const handleEdit = (userId) => {
        // Edit user logic (e.g., redirect to an edit form page)
        alert(`Editing user with ID: ${userId}`);
    };

    return (
        <>
            <Navbar />
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Phone Number</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.userId}>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.address}</TableCell>
                            <TableCell>{user.phoneNumber}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEdit(user.userId)} color="primary">
                                    <Edit />
                                </IconButton>
                                <IconButton onClick={() => handleDelete(user.userId)} color="secondary">
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            </>

    );
};

export default UserDashboard;
