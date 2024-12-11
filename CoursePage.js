import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress} from "@mui/material";
import "./course.css";

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const extractUserIdFromToken = (token) => {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
  const payload = JSON.parse(jsonPayload);
  return payload.sub;
};

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const currentDate = formatDate(new Date());
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getcourses`, {
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } 
      catch (error) {
        console.error("Error fetching courses:", error.message);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = extractUserIdFromToken(token);

    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/student-registration/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } 
      catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = extractUserIdFromToken(token);

    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/student-registration/${userId}/enrolledcourses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEnrolledCourses(data);
        }
      } 
      catch (error) {
        console.error("Error fetching enrolled courses:", error.message);
      }
    };
    fetchEnrolledCourses();
  }, [navigate]);

  const handleEnroll = async (course) => {
    const token = localStorage.getItem("token");
    const userId = extractUserIdFromToken(token);

    try {
      const response = await fetch(`http://localhost:8080/student-registration/${userId}/enrollcourse`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });
      if (response.ok) {
        //const message = await response.text();
        //alert(message);
        const updatedEnrolledCourses = await fetch(`http://localhost:8080/student-registration/${userId}/enrolledcourses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (updatedEnrolledCourses.ok) {
          const data = await updatedEnrolledCourses.json();
          setEnrolledCourses(data);
        }
      }
    } 
    catch (error) {
      console.error("Error enrolling course:", error.message);
    }
  };

  return (
    <div className="course-page">
      <div className="sidebar">
        <br />
        <div className="sidebar-item" onClick={() => navigate(`/profile/${userId}`)}>MyProfile</div>
        <div className="sidebar-item" onClick={() => navigate(`/courses/${userId}`)}>Courses</div>
        <div className="sidebar-item">Comment</div>
        <div className="sidebar-item">Tools</div>
        <div className="sidebar-item">Resources</div>
      </div>

      <div className="main-content">
        <header className="header">
          <h1>Course Activity</h1>
          <p>{currentDate}</p>
        </header>

        <section className="courses">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div className="course-card" key={course.courseId}>
                <h3>{course.courseName}</h3>
                <p>{course.courseDescription}</p>
                <div className="card-footer">
                  <span>{Math.floor(Math.random() * 101)} Enrolled</span>
                  <button
                    className={`enroll-btn ${enrolledCourses.some((c) => c.courseId === course.courseId) ? "enrolled" : "enroll"}`}
                    onClick={() => handleEnroll(course)}
                    disabled={enrolledCourses.some((c) => c.courseId === course.courseId)}
                  >
                    {enrolledCourses.some((c) => c.courseId === course.courseId) ? "Enrolled" : "Enroll"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No courses available.</p>
          )}
        </section>
      </div>

      <div className="user-section">
        <div className="user-details">
          <h3>{userData ? userData.username : "username"}</h3>
          <p>{userData ? userData.email : "email@gamil.com"}</p>
        </div>

        <div className="my-learning">
          <h4>My Learning</h4>
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => (
              <div className="learning-progress" key={course.courseId}>
                <div className="course-header">
                  <p className="course-name">{course.courseName}</p>
                  <div className="progress-container">
                      <CircularProgress variant="determinate" size={35} value={Math.floor(Math.random() * 101)} />
                      <span className="progress-label">{`${Math.floor(Math.random() * 101)}%`}</span>
                  </div>
                </div>
                <p className="course-description">{course.courseDescription}</p>
                
              </div>
            ))
          ) : (
            <p>No courses enrolled yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
