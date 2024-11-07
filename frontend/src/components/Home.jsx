import React from 'react';
import AdoptionList from '../components/AdoptionList';
import AddAdoption from '../components/AddAdoption';

const Home = () => {
    return (
        <div>
            <h1>Adoption Management</h1>
            <AddAdoption />
            <AdoptionList />
        </div>
    );
};

export default Home;
