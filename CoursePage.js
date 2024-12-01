import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./course.css";

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const currentDate = formatDate(new Date());
  const { userId } = useParams();
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getcourses`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      } 
      catch (error) {
        console.error(error.message);
      }
    };

    fetchCourses();
  }, []); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/student-registration/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } 
      catch (error) {
        console.error(error.message);
      }
    };
    fetchUserData();
  }, [userId]); 

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/student-registration/${userId}/enrolledcourses`);
        if (response.ok) {
          const data = await response.json();
          setEnrolledCourses(data);
        }
      } 
      catch (error) {
        console.error(error.message);
      }
    };
    fetchEnrolledCourses();
  }, [userId]); 

  const handleEnroll = async (course) => {
    try {
      const response = await fetch(`${BASE_URL}/student-registration/${userId}/enrollcourse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });
      if (response.ok) {
        setEnrolledCourses((prevCourses) => [...prevCourses, course]);
        const updatedEnrolledCourses = await fetch(`${BASE_URL}/student-registration/${userId}/enrolledcourses`);
        if (updatedEnrolledCourses.ok) {
          const data = await updatedEnrolledCourses.json();
          setEnrolledCourses(data);
        }
      }
    } 
    catch (error) {
      console.error(error.message);
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
            <p>No courses available. Check back later!</p>
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
                <p className="course-name">{course.courseName}</p>
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

