import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

const EditPage = () => {
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        phone: "",
        email: "",
    });

    const [usernameAvailable, setUsernameAvailable] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        fetch(`http://localhost:8080/student-registration/my-profile/${userId}`)
            .then((response) => response.json())
            .then((data) => setFormData(data))
            .catch(() => setMessage("Error fetching user details."));
    }, [userId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "username") {
            fetch(`http://localhost:8080/student-registration/check-username?username=${value}`)
                .then((response) => response.json())
                .then((data) => setUsernameAvailable(data.available))
                .catch(() => setUsernameAvailable(false));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/student-registration/edit-details/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                    {!usernameAvailable && <p className="error">Username already exists!</p>}
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Phone:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <button type="submit" disabled={!usernameAvailable}>
                    Update
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>

    );
};

export default EditPage;
