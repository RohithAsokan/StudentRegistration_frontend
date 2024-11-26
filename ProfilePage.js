import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './style.css';

const ProfilePage = () => {
    const { username } = useParams();
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`http://localhost:8080/student-registration/my-profile/${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch profile data");
                }
                return response.json();
            })
            .then((data) => setProfileData(data))
            .catch((error) => console.error("Error fetching profile data:", error));
    }, [username]);

    if (!profileData) {
        return <p>Loading user details...</p>;
    }

    return (
        <div className="profile-container">
            <h1>Welcome, {profileData.username}</h1>
            <table className="profile-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Password</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Email Id</th>
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
                            <button onClick={() => navigate(`/edit/${username}`)}>Edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ProfilePage;
