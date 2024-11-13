import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography, Button, TextField, Avatar, Grid, Stack, InputAdornment, IconButton } from '@mui/material';
import Navbar from './Navbar';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        address: '',
        phoneNumber: ''
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [passwordChange, setPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



    useEffect(() => {
        fetchUser();
    }, []);

    // const fetchUser = async () => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         console.error("Token is missing. Please log in again.");
    //         return;
    //     }
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/users/me', {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    //         setUser(response.data);
    //         setEditFormData({
    //             firstName: response.data.firstName,
    //             lastName: response.data.lastName,
    //             username: response.data.username,
    //             email: response.data.email,
    //             address: response.data.address,
    //             phoneNumber: response.data.phoneNumber
    //         });
    //         if (response.data.profilePicture) {
    //             setProfilePicture(`data:image/jpeg;base64,${response.data.profilePicture}`);
    //         } else {
    //             setProfilePicture(null); // No profile picture
    //         }
    //     } catch (error) {
    //         console.error('Error fetching user:', error);
    //     }
    // };

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token is missing. Please log in again.");
            return;
        }
        try {
            const response = await axios.get('http://localhost:8080/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("API response data:", response.data); // Log API response
            setUser(response.data);
            setEditFormData({
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                username: response.data.username,
                email: response.data.email,
                address: response.data.address,
                phoneNumber: response.data.phoneNumber
            });
            if (response.data.profilePicture) {
                setProfilePicture(`data:image/jpeg;base64,${response.data.profilePicture}`);
            } else {
                setProfilePicture(null); // No profile picture
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };


    const handleEdit = () => setEditingUserId(user.userId);

    const handleCancelEdit = () => {
        setEditingUserId(null);
        fetchUser();
    };

    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        // setProfilePicture(e.target.files[0]);

        const file = e.target.files[0];
        setProfilePicture(file);
    };

    const handleSaveEdit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token is missing. Please log in again.");
            return;
        }
        const formData = new FormData();
        formData.append('user', JSON.stringify(editFormData));
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }
        try {
            const response = await axios.put(
                `http://localhost:8080/api/users/${user.userId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (response.status === 200) {
                console.log("User updated successfully");
                fetchUser();
                setEditingUserId(null);
            } else {
                console.error("Failed to update user");
            }
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token is missing. Please log in again.");
            return;
        }
        try {
            const response = await axios.post(
                `http://localhost:8080/api/users/change-password`,
                passwordData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                alert("Password changed successfully!");
                setPasswordChange(false);
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                console.error("Failed to change password");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("An error occurred while changing the password.");
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (

            <Container>
                <Box sx={{ mt: 5 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Profile
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            p: 4,
                            borderRadius: 2,
                            boxShadow: 3,
                            bgcolor: 'background.paper',
                            maxWidth: 700,
                            mx: 'auto',
                        }}
                    >
                        <Avatar
                            src={profilePicture && typeof profilePicture === 'string' ? profilePicture : null}
                            alt="Profile Picture"
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: 'grey.300',
                                mr: 4,
                                fontSize: '48px',
                            }}
                        >
                            {profilePicture ? '' : user.firstName ? user.firstName[0] : ''}
                        </Avatar>

                        <Box sx={{ flexGrow: 1 }}>
                            <Stack spacing={2}>
                                {editingUserId === user.userId ? (
                                    <>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    name="firstName"
                                                    label="First Name"
                                                    value={editFormData.firstName}
                                                    onChange={handleEditChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    name="lastName"
                                                    label="Last Name"
                                                    value={editFormData.lastName}
                                                    onChange={handleEditChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="username"
                                                    label="Username"
                                                    value={editFormData.username}
                                                    onChange={handleEditChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="email"
                                                    label="Email"
                                                    value={editFormData.email}
                                                    onChange={handleEditChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="address"
                                                    label="Address"
                                                    value={editFormData.address}
                                                    onChange={handleEditChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    name="phoneNumber"
                                                    label="Phone Number"
                                                    value={editFormData.phoneNumber}
                                                    onChange={handleEditChange}
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                />
                                            </Grid>
                                        </Grid>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ margin: '20px 0' }}
                                        />
                                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                                            <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                                                Save
                                            </Button>
                                            <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                                                Cancel
                                            </Button>
                                        </Box>
                                    </>
                                ) : (
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="First Name"
                                                variant="outlined"
                                                value={user.firstName}
                                                fullWidth
                                                InputProps={{ readOnly: true }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Last Name"
                                                variant="outlined"
                                                value={user.lastName}
                                                fullWidth
                                                InputProps={{ readOnly: true }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Username"
                                                variant="outlined"
                                                value={user.username}
                                                fullWidth
                                                InputProps={{ readOnly: true }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Email"
                                                variant="outlined"
                                                value={user.email}
                                                fullWidth
                                                InputProps={{ readOnly: true }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Address"
                                                variant="outlined"
                                                value={user.address}
                                                fullWidth
                                                InputProps={{ readOnly: true }}
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Phone Number"
                                                variant="outlined"
                                                value={user.phoneNumber}
                                                fullWidth
                                                InputProps={{ readOnly: true }}
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                    {!editingUserId && (
                                        <Button variant="contained" color="primary" onClick={handleEdit}>
                                            Edit Profile
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => setPasswordChange(!passwordChange)}
                                    >
                                        Change Password
                                    </Button>
                                </Box>
                                {passwordChange && (
                                    <Box sx={{ mt: 3 }}>
                                        <TextField
                                            label="Old Password"
                                            name="oldPassword"
                                            type={showOldPassword ? "text" : "password"}
                                            value={passwordData.oldPassword}
                                            onChange={(e) =>
                                                setPasswordData({ ...passwordData, oldPassword: e.target.value })
                                            }
                                            fullWidth
                                            margin="normal"
                                            size="small"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={()=>setShowOldPassword(!showOldPassword)} edge="end">
                                                            {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <TextField
                                            label="New Password"
                                            name="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) =>
                                                setPasswordData({ ...passwordData, newPassword: e.target.value })
                                            }
                                            fullWidth
                                            margin="normal"
                                            size="small"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={()=>setShowNewPassword(!showNewPassword)} edge="end">
                                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <TextField
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) =>
                                                setPasswordData({
                                                    ...passwordData,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                            fullWidth
                                            margin="normal"
                                            size="small"

                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                            <Button variant="contained" color="primary" onClick={handlePasswordChange}>
                                                Confirm
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => setPasswordChange(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Container>

    );
};

export default Profile;
