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
import { useUser } from "./UserContext";

const Navbar = () => {
    const { user, clearUser } = useUser();
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

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

    const openAuthModal = () => {
        // Ensure the profile menu is closed before opening auth modal
        handleProfileMenuClose();
        setAuthModalOpen(true);
    };
    const closeAuthModal = () => setAuthModalOpen(false);

    const handleProfileClick = () => {
        navigate("/profile");
        handleProfileMenuClose();
    };

    const logout = () => {
        // Clear user and reset any open menus
        clearUser();
        handleProfileMenuClose(); // Ensure profile menu is closed on logout
        navigate("/home");
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

                <Box sx={{ display: "flex", alignItems: "center", paddingRight: "100px" }}>
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

                    {user ? (
                        <>
                            <Box
                                onClick={handleProfileMenuOpen}
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
                                {user.firstName}
                            </Box>
                            <Menu
                                anchorEl={profileAnchorEl}
                                open={Boolean(profileAnchorEl)}
                                onClose={handleProfileMenuClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
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
