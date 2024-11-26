import React from "react";
import './style.css';
const HomePage = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
            <h1 style={{fontSize:"xxx-large", marginBottom:"60px"}}>Student Registration</h1>
            <button onClick={() => (window.location.href = "/login")} style={{width:"10%", marginRight:"10px"}}>Login</button>
            <button onClick={() => (window.location.href = "/register")} style={{width:"10%", marginLeft:"10px"}}>Register</button>
        </div>
    );
};

export default HomePage;
