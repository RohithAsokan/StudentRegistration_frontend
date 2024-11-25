import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './style.css';

const EditPage = () => {
    const { username } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        password: "",
        phone: "",
        email: "",
    });
    const [message, setMessage] = useState("");
    useEffect(() => {
        fetch(`http://localhost:8080/student-registration/my-profile/${username}`)
            .then((response) => response.json())
            .then((data) => {
                setFormData({
                    name: data.name,
                    password: data.password,
                    phone: data.phone,
                    email: data.email,
                });
            })
            .catch((error) => setMessage("Error fetching user details."));
    }, [username]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/student-registration/edit-details/${username}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage("Details updated successfully!");
                setTimeout(() => {
                    window.location.href = `/profile/${username}`;
                }, 1000);
            } else {
                setMessage("Error updating details. Please try again.");
            }
        } catch (error) {
            setMessage("An error occurred while updating details.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", marginTop:"50px" }}>
            <h2 style={{fontSize:"x-large"}}>Edit Details</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <button type="submit">Update</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default EditPage;