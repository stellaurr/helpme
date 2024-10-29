import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import PurrLogo from '../assets/Purr-Light.png';

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                    <img src={PurrLogo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
                    <Typography variant="h6" component="div">
                        Purr
                    </Typography>
                </Box>
                <Button color="inherit" component={Link} to="/login">
                    Login
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                    Signup
                </Button>
                <Button color="inherit" component={Link} to="/users">
                    Dashboard
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
