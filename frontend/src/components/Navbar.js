import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import PurrLogo from "../assets/logo_colored.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AuthModal from "./AuthModal";

const Navbar = () => {
    const [anchorEl, setAnchorEl] = useState(null); // Anchor for "Join Us" dropdown
    const [profileAnchorEl, setProfileAnchorEl] = useState(null); // Anchor for user profile dropdown
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const firstName = localStorage.getItem("firstName"); // Retrieve first name from local storage

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileMenuOpen = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setProfileAnchorEl(null);
    };

    const openAuthModal = () => setAuthModalOpen(true);
    const closeAuthModal = () => setAuthModalOpen(false);

    const isJoinUsActive =
        location.pathname === "/volunteer" || location.pathname === "/about-us";

    const handleProfileClick = () => {
        navigate("/profile");
        handleProfileMenuClose();
    };

    const logout = () => {
        localStorage.removeItem("token");      // Remove the token
        localStorage.removeItem("firstName");  // Remove the user's first name
        window.location.reload();              // Reload the page to update the UI
    };

    return (
        <AppBar
            position="static"
            color="inherit"
            elevation={0}
            sx={{
                padding: "8px",
                position: "relative",
                borderBottom: "60px solid",
                borderColor: "primary.main",
            }}
        >
            <Toolbar>
                {/* Left Section: Logo */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: "200px",
                    }}
                >
                    <img
                        src={PurrLogo}
                        alt="Logo"
                        style={{ height: "60px", marginRight: "10px" }}
                    />
                    <Typography
                        variant="h4"
                        component="div"
                        color="primary"
                        sx={{ fontWeight: "bold", fontFamily: "'Caramel', sans-serif" }}
                    >
                        Purr
                    </Typography>
                </Box>

                {/* Center Section: Navigation Links */}
                <Box
                    sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {["Home", "Adopt", "Donate", "Lost and Found"].map((text) => {
                        const linkPath = `/${text.toLowerCase().replace(/\s/g, "-")}`;
                        const isActive = location.pathname === linkPath;
                        return (
                            <Box
                                key={text}
                                component={Link}
                                to={linkPath}
                                sx={{
                                    marginX: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "10px 20px",
                                    borderRadius: "20px",
                                    backgroundColor: isActive ? "primary.main" : "white",
                                    color: isActive ? "white" : "primary.main",
                                    fontWeight: "bold",
                                    textDecoration: "none",
                                    "&:hover": {
                                        backgroundColor: "lightgray",
                                    },
                                }}
                            >
                                {text}
                            </Box>
                        );
                    })}
                    <Box
                        onClick={handleMenuOpen}
                        sx={{
                            marginX: 1,
                            display: "flex",
                            alignItems: "center",
                            padding: "10px 20px",
                            borderRadius: "20px",
                            backgroundColor: isJoinUsActive ? "primary.main" : "white",
                            color: isJoinUsActive ? "white" : "primary.main",
                            cursor: "pointer",
                            fontWeight: "bold",
                            "&:hover": {
                                backgroundColor: "lightgray",
                            },
                        }}
                    >
                        Join Us <ArrowDropDownIcon sx={{ marginLeft: "5px" }} />
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem
                            component={Link}
                            to="/volunteer"
                            onClick={handleMenuClose}
                            sx={{
                                padding: "10px 20px",
                                color: "primary.main",
                                fontWeight: "bold",
                                "&:hover": { backgroundColor: "lightgray" },
                            }}
                        >
                            Volunteer
                        </MenuItem>
                        <MenuItem
                            component={Link}
                            to="/about-us"
                            onClick={handleMenuClose}
                            sx={{
                                padding: "10px 20px",
                                color: "primary.main",
                                fontWeight: "bold",
                                "&:hover": { backgroundColor: "lightgray" },
                            }}
                        >
                            About Us
                        </MenuItem>
                    </Menu>
                </Box>

                {/* Right Section: Notifications and Login/Register */}
                <Box
                    sx={{ display: "flex", alignItems: "center", paddingRight: "100px" }}
                >
                    <IconButton
                        color="primary"
                        sx={{
                            marginX: 1,
                            padding: "10px 15px",
                            backgroundColor: "white",
                            color: "primary.main",
                            cursor: "pointer",
                            borderRadius: "50px",
                            border: "2px solid",
                            borderColor: "primary.main",
                            "&:hover": { backgroundColor: "lightgray" },
                        }}
                    >
                        <NotificationsIcon />
                    </IconButton>

                    {firstName ? (
                        <>
                            <Box
                                onClick={handleProfileMenuOpen} // Open profile menu on click
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "10px 20px",
                                    backgroundColor: "white",
                                    color: "primary.main",
                                    cursor: "pointer",
                                    borderRadius: "50px",
                                    border: "2px solid",
                                    borderColor: "primary.main",
                                    "&:hover": { backgroundColor: "lightgray" },
                                }}
                            >
                                <AccountCircleIcon sx={{ marginRight: "5px" }} />
                                {firstName}
                            </Box>
                            <Menu
                                anchorEl={profileAnchorEl}
                                open={Boolean(profileAnchorEl)}
                                onClose={handleProfileMenuClose}
                            >
                                <MenuItem
                                    onClick={handleProfileClick}
                                    sx={{
                                        padding: "10px 20px",
                                        color: "primary.main",
                                        fontWeight: "bold",
                                        "&:hover": { backgroundColor: "lightgray" },
                                    }}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={logout}
                                    sx={{
                                        padding: "10px 20px",
                                        color: "primary.main",
                                        fontWeight: "bold",
                                        "&:hover": { backgroundColor: "lightgray" },
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <Box
                            onClick={openAuthModal}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                padding: "10px 20px",
                                backgroundColor: "white",
                                color: "primary.main",
                                cursor: "pointer",
                                borderRadius: "50px",
                                border: "2px solid",
                                borderColor: "primary.main",
                                "&:hover": { backgroundColor: "lightgray" },
                            }}
                        >
                            <AccountCircleIcon sx={{ marginRight: "5px" }} />
                            Login | Register
                        </Box>
                    )}
                </Box>
                <AuthModal open={authModalOpen} handleClose={closeAuthModal} />
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
