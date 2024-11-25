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
        <div >
            <div class="profilePage1">
                <h1 style={{fontSize:"xx-large", marginBottom:"100px", marginLeft:"20px"}}>Welcome, {profileData.username}</h1>
            </div>
            <div class="profilePage2">
                <p>User Name : {profileData.username}</p>
                <p>Password: {profileData.password}</p>
                <p>Name: {profileData.name}</p>
                <p>Phone: {profileData.phone}</p>
                <p>Email: {profileData.email}</p>
                <button onClick={() => navigate(`/edit/${username}`)}>Edit</button>

            </div>
        </div>
    );
};

export default ProfilePage;