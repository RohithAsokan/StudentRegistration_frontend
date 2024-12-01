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
            try {
                const response = await fetch(`http://localhost:8080/student-registration/profile/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch profile data.");
                }
                const data = await response.json();
                setProfileData(data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
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
    
            {/* Main Content */}
            <div className="profile-container">
                <h1>Welcome, {profileData.username}</h1>
                <table className="profile-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Password</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{profileData.username}</td>
                            <td>{profileData.password}</td>
                            <td>{profileData.name}</td>
                            <td>{profileData.phone}</td>
                            <td>{profileData.email}</td>
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
