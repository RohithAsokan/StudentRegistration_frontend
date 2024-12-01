import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import RegistrationPage from './RegistrationPage';
import ProfilePage from './ProfilePage';
import EditPage from './EditPage';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';
import CoursePage from './CoursePage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/edit/:userId" element={<EditPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />}></Route>
                <Route path="/courses/:userId" element={<CoursePage></CoursePage>}></Route>
            </Routes>
        </Router>
    );
};

export default App;
