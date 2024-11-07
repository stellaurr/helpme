import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from "react-router-dom";
import ReactDOM from "react-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, Toolbar, Box, Button, Typography } from "@mui/material";
import Home from "./components/Home";
import LostAndFound from "./components/LostAndFound";
import Sponsor from "./components/Sponsor";
import Adoption from "./components/Adoption";
import Volunteer from "./components/Volunteer";
import Login from "./components/Login";
import logoWhite from "./assets/logo_white.png"; // Adjust path as necessary

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="fixed" sx={{ mb: 4 }}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              height: 50,
            }}
          >
            <Box display="flex" alignItems="center">
              <Box
                component="img"
                src={logoWhite}
                alt="Purr"
                sx={{ height: 40, mr: 2 }}
              />
              <Typography variant="h6">Purr</Typography>
            </Box>
          </Toolbar>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              height: 50,
            }}
          >
            <Box display="flex">
              <Button
                color="inherit"
                component={NavLink}
                to="/home"
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                  textDecoration: isActive ? "underline" : "none",
                })}
              >
                HOME
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/lost-and-found"
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                  textDecoration: isActive ? "underline" : "none",
                })}
              >
                Lost and Found
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/sponsor"
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                  textDecoration: isActive ? "underline" : "none",
                })}
              >
                Sponsor
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/adoption"
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                  textDecoration: isActive ? "underline" : "none",
                })}
              >
                Adoption
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/volunteer"
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                  textDecoration: isActive ? "underline" : "none",
                })}
              >
                Volunteer
              </Button>
            </Box>
            <Box display="flex">
              <Button
                color="inherit"
                component={NavLink}
                to="/login"
                style={({ isActive }) => ({
                  fontWeight: isActive ? "bold" : "normal",
                  textDecoration: isActive ? "underline" : "none",
                })}
              >
                Login
              </Button>
              <Button variant="contained" color="secondary">
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ mt: 8 }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/lost-and-found" element={<LostAndFound />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

export default App;
