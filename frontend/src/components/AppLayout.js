// src/AppLayout.js
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
const AppLayout = () => {
    const location = useLocation();

    return (
        <>
            {/* Only render Navbar if the path does not start with "/admin" */}
            {!location.pathname.startsWith("/admin") && <Navbar/>}
            <Outlet /> {/* Renders the matched child route component */}
        </>
    );
};

export default AppLayout;
