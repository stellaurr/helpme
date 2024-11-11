// AuthModal.js
import React, { useState } from "react";
import {
    Button,
    TextField,
    Box,
    Grid,
    Paper,
    Dialog,
    Typography,
    InputAdornment,
    IconButton,
    Tabs,
    Tab,
} from "@mui/material";
import { Visibility, VisibilityOff, Close } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo_colored.png";
import authBg from "../assets/auth_bg.png"; // Import the blurred background image

const AuthModal = ({ open, handleClose }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState(0); // 0 for Login, 1 for Signup
    const navigate = useNavigate();

    const toggleShowPassword = () => setShowPassword(!showPassword);

    // Login state and handlers
    const [loginCredentials, setLoginCredentials] = useState({
        username: "",
        password: "",
    });

    const handleLoginChange = (e) => {
        setLoginCredentials({
            ...loginCredentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                loginCredentials,
                { headers: { "Content-Type": "application/json" } }
            );
            localStorage.setItem("token", response.data);
            alert("Logged in successfully");
            navigate("/profile");
            handleClose();
        } catch (error) {
            alert("Invalid username or password.");
            console.error("Error during login:", error);
        }
    };

    // Signup state and handlers
    const [signupCredentials, setSignupCredentials] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        address: "",
        phoneNumber: "",
    });

    const handleSignupChange = (e) => {
        setSignupCredentials({
            ...signupCredentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/auth/signup", signupCredentials);
            alert("Signup successful!");
            navigate("/login");
            handleClose();
        } catch (error) {
            alert("Error signing up");
            console.error("Error during signup:", error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            sx={{
                "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(8px)",
                },
                "& .MuiPaper-root": {
                    width: "auto",
                    borderRadius: 2,
                },
            }}
        >
            <Grid container component={Paper} elevation={3} sx={{ height: "70vh" }}>
                {/* Background Section */}
                <Grid
                    item
                    xs={4}
                    sx={{
                        backgroundImage: `url(${authBg})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Form Section */}
                <Grid
                    item
                    xs={8}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 4,
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            color: "grey.500",
                        }}
                    >
                        <Close />
                    </IconButton>

                    {/* Fixed Position Tabs */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: 16,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "100%",
                            backgroundColor: "white",
                            zIndex: 1,
                        }}
                    >
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            aria-label="auth tabs"
                            centered
                        >
                            <Tab label="Login" />
                            <Tab label="Signup" />
                        </Tabs>
                    </Box>

                    <Box sx={{ marginTop: "60px", width: '80%', textAlign: 'center' }}>
                        {activeTab === 0 ? (
                            // Login Form
                            <form onSubmit={handleLoginSubmit}>
                                <Box mb={2}>
                                    <img src={logo} alt="Logo" style={{ maxWidth: "60%" }} />
                                </Box>
                                <TextField
                                    label="Username"
                                    name="username"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={loginCredentials.username}
                                    onChange={handleLoginChange}
                                    required
                                />
                                <TextField
                                    label="Password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={loginCredentials.password}
                                    onChange={handleLoginChange}
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={toggleShowPassword}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                    Login
                                </Button>
                            </form>
                        ) : (
                            // Signup Form
                            <form onSubmit={handleSignupSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="First Name"
                                            name="firstName"
                                            variant="outlined"
                                            fullWidth
                                            value={signupCredentials.firstName}
                                            onChange={handleSignupChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Last Name"
                                            name="lastName"
                                            variant="outlined"
                                            fullWidth
                                            value={signupCredentials.lastName}
                                            onChange={handleSignupChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Username"
                                            name="username"
                                            variant="outlined"
                                            fullWidth
                                            value={signupCredentials.username}
                                            onChange={handleSignupChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Email"
                                            name="email"
                                            type="email"
                                            variant="outlined"
                                            fullWidth
                                            value={signupCredentials.email}
                                            onChange={handleSignupChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            variant="outlined"
                                            fullWidth
                                            value={signupCredentials.password}
                                            onChange={handleSignupChange}
                                            required
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton onClick={toggleShowPassword}>
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Address"
                                            name="address"
                                            variant="outlined"
                                            fullWidth
                                            value={signupCredentials.address}
                                            onChange={handleSignupChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Phone Number"
                                            name="phoneNumber"
                                            variant="outlined"
                                            fullWidth
                                            value={signupCredentials.phoneNumber}
                                            onChange={handleSignupChange}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button type="submit" variant="contained" color="primary" fullWidth>
                                            Signup
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default AuthModal;
