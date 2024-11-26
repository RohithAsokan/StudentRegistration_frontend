import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './style.css';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:8080/student-registration/my-profile/${userId}`)
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch profile data.");
                return response.json();
            })
            .then((data) => setProfileData(data))
            .catch((error) => {
                console.error("Error fetching profile data:", error);
                navigate("/login");
            });
    }, [userId, navigate]);

    if (!profileData) return <p>Loading user details...</p>;

    return (
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
                            <button onClick={() => navigate("/edit")}>Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProfilePage;
