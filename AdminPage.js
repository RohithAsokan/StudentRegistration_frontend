import React, { useState, useEffect } from "react";
import "./style.css";

function AdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState({ courseId: "", courseName: "", courseDescription: "", credits: 0});
  const [loading, setLoading] = useState(true);
  const username = "admin";

  const fetchCourses = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

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
      } else {
        console.error("Error fetching courses:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleForm = () => setShowForm((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const addCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!course.courseId || !course.courseName || !course.courseDescription || !course.credits) {
      alert("All fields are required");
      return;
    }

    if (courses.some((c) => c.courseId === course.courseId)) {
      alert("A course with this Course ID already exists.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/addcourse`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      const message = await response.text();

      if (response.ok) {
        setCourses([...courses, course]);
        setCourse({ courseId: "", courseName: "", courseDescription: "", credits: 0});
        setShowForm(false);
      } else {
        alert(message);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  
  return (
    <div className="admin-container">
      <h1 className="admin-welcome">Welcome, {username}</h1>
      <button onClick={toggleForm} className="admin-toggle-btn">
        {showForm ? "Cancel" : "Add New Course"}
      </button>

      {showForm && (
        <form onSubmit={addCourse} className="admin-form">
          <div className="form-group">
            <label className="form-label">Enter Course ID:</label>
            <input type="text" name="courseId" value={course.courseId} onChange={handleInputChange} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Enter Course Name:</label>
            <input type="text" name="courseName" value={course.courseName} onChange={handleInputChange} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Enter Course Description:</label>
            <textarea name="courseDescription" value={course.courseDescription} onChange={handleInputChange} className="form-input" required ></textarea>
          </div>
          <div className="form-group">
            <lable className="form-lable">Enter the Credits for Course</lable>
            <input type="number" name="credits" value={course.credits} onChange={handleInputChange} className="form-input" required></input>
          </div>
          <button type="submit" className="form-submit-btn">Add</button>
        </form>
      )}

      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Course Description</th>
                <th>Course Credits</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.courseId}</td>
                  <td>{course.courseName}</td>
                  <td>{course.courseDescription}</td>
                  <td>{course.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
}

export default AdminPage;
