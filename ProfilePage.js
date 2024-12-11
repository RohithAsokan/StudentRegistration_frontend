import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './style.css';
import "./course.css";

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`http://localhost:8080/student-registration/profile/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch profile data.");
                }
                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                setError("Unable to load profile.");
                setTimeout(() => navigate("/login"), 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, navigate]);

    if (loading) {
        return <p>Loading user details...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="profile-page">
            <div className="sidebar">
                <div className="sidebar-item" onClick={() => navigate(`/profile/${userId}`)}>My Profile</div>
                <div className="sidebar-item" onClick={() => navigate(`/courses/${userId}`)}>Courses</div>
                <div className="sidebar-item">Comment</div>
                <div className="sidebar-item">Tools</div>
                <div className="sidebar-item">Resources</div>
            </div>
    
            <div className="profile-container">
                <h1>Welcome, {profileData.firstName}</h1>
                <table className="profile-table">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email Id</th>
                            <th>Password</th>
                            <th>Date of Birth</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{profileData.firstName}</td>
                            <td>{profileData.lastName}</td>
                            <td>{profileData.emailId}</td>
                            <td>{profileData.password}</td>
                            <td>{profileData.dateOfBirth}</td>
                            <td>{profileData.phoneNumber}</td>
                            <td>{profileData.address}</td>
                            <td>
                                <button onClick={() => navigate(`/edit/${userId}`)}>Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
    
};

export default ProfilePage;
