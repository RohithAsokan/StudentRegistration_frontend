import React, { useState } from "react";
import './style.css';
const LoginPage = () => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/student-registration/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage("Login successful!");
                setTimeout(() => {
                    window.location.href = `/profile/${formData.username}`;
                }, 1000);
            } else {
                setMessage("Invalid username or password.");
            }
        } catch (error) {
            setMessage("An error occurred during login.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", marginTop:"20px" }}>
            <h2 style={{fontSize:"xx-large", marginBottom:"30px"}}>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default LoginPage;