import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import PurrLogo from "../assets/logo_colored.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        padding: "8px",
        borderBottom: "1px solid #e0e0e0",
        position: "relative",
      }}
    >
      <Toolbar>
        {/* Left Section: Logo */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            paddingLeft: "100px",
          }}
        >
          <img
            src={PurrLogo}
            alt="Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          <Typography
            variant="h6"
            component="div"
            color="primary"
            sx={{ fontWeight: "bold" }}
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
          {["Adopt", "Donate", "Lost and Found"].map((text) => (
            <Box
              key={text}
              component={Link}
              to={`/${text.toLowerCase().replace(/\s/g, "-")}`}
              sx={{
                marginX: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 20px",
                backgroundColor: "white",
                color: "primary.main",
                fontWeight: "bold",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                  backgroundColor: "lightgray",
                },
              }}
            >
              {text}
            </Box>
          ))}
          <Box
            onClick={handleMenuOpen}
            sx={{
              marginX: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 20px",
              backgroundColor: "white",
              color: "primary.main",
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
              onClick={handleMenuClose}
              sx={{
                padding: "10px 20px", // Consistent padding
                color: "primary.main", // Match the color of the notification button
                fontWeight: "bold", // Make text bold
                borderBottom: "1px solid #e0e0e0", // Optional: border between items
                "&:hover": {
                  backgroundColor: "lightgray", // Same hover effect
                },
              }}
            >
              Volunteer
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              sx={{
                padding: "10px 20px", // Consistent padding
                color: "primary.main", // Match the color of the notification button
                fontWeight: "bold", // Make text bold
                "&:hover": {
                  backgroundColor: "lightgray", // Same hover effect
                },
              }}
            >
              About Us
            </MenuItem>
          </Menu>
        </Box>

        {/* Right Section: Notifications and Login/Register */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
          >
            <NotificationsIcon />
          </IconButton>

          <Box
            component={Link}
            to="/login"
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
              "&:hover": {
                backgroundColor: "lightgray",
              },
            }}
          >
            <AccountCircleIcon
              sx={{ marginRight: "5px", borderBlockColor: "primary" }}
            />
            Login | Register
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
