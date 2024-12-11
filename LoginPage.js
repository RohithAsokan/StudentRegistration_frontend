import React, { useState } from "react";
import './style.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({ emailId: "", password: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const extractUserIdFromToken = (token) => {
        if (!token) {
            return null;
        }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        return payload.userId;
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
            const result = await response.json();

            if (response.ok) {
                const token = result.jwt;
                localStorage.setItem("token", token);
                const userId = extractUserIdFromToken(token);

                if (result === "Invalid username or password!") {
                    setError(result);
                    setMessage("");
                } else {
                    setMessage("Login successful!");
                    setError("");
                    setTimeout(() => {
                        if (userId === "6754841a158e3700a008d58d") {
                            window.location.href = `/admin`;
                        } else {
                            window.location.href = `/profile/${userId}`;
                        }
                    }, 1000);
                }
            } else {
                setError(result);
            }
        } catch (error) {
            setError("An error occurred during login. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email Id:</label>
                    <input type="text" name="emailId" value={formData.emailId} onChange={handleInputChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <button type="submit">Login</button>
            </form>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default LoginPage;
