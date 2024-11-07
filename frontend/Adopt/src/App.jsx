import React, { useState } from 'react';
import Menu from './components/Menu';
import AdoptionForm from './components/AdoptionForm';
import AdoptionList from './components/AdoptionList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
    const [adoptions, setAdoptions] = useState([]);

    const handleAddAdoption = (newAdoption) => {
        setAdoptions((prevAdoptions) => [...prevAdoptions, newAdoption]);
    };

    return (
        <Router>
            <div style={styles.pageContainer}>
                <Menu />
                <div style={styles.contentContainer}>
                    <Routes>
                        <Route path="/" element={<AdoptionForm onAddAdoption={handleAddAdoption} />} />
                        <Route path="/admin" element={<AdoptionList adoptions={adoptions} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        padding: '20px',
        marginTop: '64px',
    },
};

export default App;
