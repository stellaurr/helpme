import React, { useState } from 'react';
import { Box, CssBaseline, Typography } from '@mui/material';
import UserDashboard from './UserDashboard';
import AdminNavbar from './AdminNavbar';

// const AdminDashboard = () => {
//     // const [selectedTab, setSelectedTab] = useState('Users');
//     //
//     // const renderContent = () => {
//     //     switch (selectedTab) {
//     //         case 'Users':
//     //             return <UserDashboard />;
//     //         // You can add more cases here for other sections like Adoptions, Sponsorships, etc.
//     //         default:
//     //             return <UserDashboard />;
//     //     }
//     // };
//     //
//     // return (
//     //     <Box sx={{ display: 'flex' }}>
//     //         <CssBaseline />
//     //         <AdminNavbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
//     //         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//     //             <Typography variant="h4" align="center">{selectedTab} Dashboard</Typography>
//     //             {renderContent()}
//     //         </Box>
//     //     </Box>
//     // );
//     return (
//         <div>
//             <h1>Admin Dashboard</h1>
//         </div>
//     );
//
//
// };

import React from 'react';

const AdminDashboard = () => {
    console.log("AdminDashboard component rendered");

    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    );
};



export default AdminDashboard;
