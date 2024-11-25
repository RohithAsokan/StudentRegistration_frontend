import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import RegistrationPage from './RegistrationPage';
import ProfilePage from './ProfilePage';
import EditPage from './EditPage';
import LoginPage from './LoginPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/edit/:username" element={<EditPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    );
};

export default App;