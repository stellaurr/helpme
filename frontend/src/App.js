import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import UserDashboard from "./components/UserDashboard";
import Home from "./components/Home";
import LostAndFound from "./components/LostAndFound";
import Sponsor from "./components/Sponsor";
import DonationForm from "./components/DonationForm";
import DonationTable from "./components/DonationTable";
import VolunteerSignUp from "./components/VolunteerSignUpList";
import CreateOpportunity from "./components/CreateOpportunity";
import Volunteer from "./components/Volunteer";
import VolunteerOpportunities from "./components/VolunteerOpportunities";
import OpportunityDetail from "./components/OpportunityDetail";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NoMatch from "./components/NoMatch";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import PetList from "./components/PetList";
import AdminDashboard from "./components/AdminDashboard";
import { UserProvider } from "./components/UserContext";


const theme = createTheme({
  palette: {
    primary: {
      main: "#675BC8",
    },
  },
});



function App() {
  return (
      <UserProvider>
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UserDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Home />} /> {/* Default to login */}
          <Route path="/home" element={<Home />} />
          <Route path="/lost-and-found" element={<LostAndFound />} />
          <Route path="/sponsor" element={<Sponsor />} />
          <Route path="/adopt" element={<PetList />} />
          
          <Route path="/donate" element={<DonationForm />} />
          <Route path="/donation_dash" element={<DonationTable />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route
            path="/admin/manage-opportunities"
            element={<VolunteerOpportunities />}
          />
          <Route
            path="/admin/manage-volunteers"
            element={<VolunteerSignUp />}
          />
          <Route path="/opportunity/:id" element={<OpportunityDetail />} />
          <Route path="/book" element={<CreateOpportunity />} />
          <Route path="/admin" element={<AdminDashboard/>} />

        </Routes>
      </Router>
    </ThemeProvider>
</UserProvider>
  );
}

export default App;
