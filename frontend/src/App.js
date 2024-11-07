import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import Home from "./components/Home";
import LostAndFound from "./components/LostAndFound";
import Sponsor from "./components/Sponsor";
import Adoption from "./components/Adoption";
import Volunteer from "./components/Volunteer";


import Profile from "./components/Profile";

// import ReactDOM from "react-dom";

function App() {
  return (
      <Router>
        <div>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
              <Route path="/users" element={<UserDashboard/>} />
              <Route path="/profile" element={<Profile/>} />
            <Route path="/" element={<Login />} />  {/* Default to login */}
            <Route path="/home" element={<Home />} />
            <Route path="/lost-and-found" element={<LostAndFound />} />
            <Route path="/sponsor" element={<Sponsor />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/volunteer" element={<Volunteer />} />

          </Routes>
        </div>
      </Router>
  );
}

//ReactDOM.render(<App />, document.getElementById("root"));

export default App;


