import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

const EditPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        password: "",
        dateOfBirth: "",
        phoneNumber: "",
        address: "",
    });

    const [emailIdAvailable, setEmailIdAvailable] = useState(true);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const extractUserIdFromToken = (token) => {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
        const payload = JSON.parse(jsonPayload);
        return payload.sub; 
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userId = extractUserIdFromToken(token);
        
        if (!userId) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8080/student-registration/profile/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch profile data: ${response.statusText}`);
                }
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    setFormData(data);
                } else {
                    throw new Error("Unexpected response format.");
                }
            } catch (error) {
                setMessage("Error fetching user details.");
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    
        if (name === "emailId") {
            const token = localStorage.getItem("token");
            const userId = extractUserIdFromToken(token);
            fetch(`http://localhost:8080/student-registration/check-emailId?emailId=${value}&userId=${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to check email availability.");
                    }
                    return response.json();
                })
                .then((isAvailable) => setEmailIdAvailable(isAvailable))
                .catch(() => setEmailIdAvailable(false));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const userId = extractUserIdFromToken(token);
        try {
            const response = await fetch(`http://localhost:8080/student-registration/update/${userId}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage("Details updated successfully!");
                setTimeout(() => navigate(`/profile/${userId}`), 1000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Error updating details. Please try again.");
            }
        } catch (error) {
            setMessage("An error occurred while updating details.");
        }
    };

    return (
        <div className="container">
            <h2>Edit Details</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name:</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Last Name:</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Email Id:</label>
                    <input type="email" name="emailId" value={formData.emailId} onChange={handleInputChange} required />
                    {!emailIdAvailable && <p className="error">Email Id already exists!</p>}
                </div>
                <div>
                    <label>Address:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                </div>
                <button type="submit" disabled={!emailIdAvailable}>
                    Update
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>

    );
};

export default EditPage;
