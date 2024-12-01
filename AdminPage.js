import React, { useState, useEffect } from "react";
import "./style.css";

function AdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState({ courseId: "", courseName: "", courseDescription: "" });
  const [loading, setLoading] = useState(true);
  const username = "admin";
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/getcourses`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
        }
      }
      finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const toggleForm = () => setShowForm(!showForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const addCourse = async (e) => {
    e.preventDefault();
    if (courses.some((c) => c.courseId === course.courseId)) {
      alert("A course with this Course ID already exists.");
      return;
    }

    if (course.courseId && course.courseName && course.courseDescription) {
      try {
        const response = await fetch(`http://localhost:8080/addcourse`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(course),
        });

        if (response.ok) {
          const savedCourse = await response.json();
          setCourses([...courses, savedCourse]);
          setCourse({ courseId: "", courseName: "", courseDescription: "" });
          setShowForm(false);
        } 
      } 
      catch (error) {
        console.error("Error while adding course:", error.message);
      }
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
            <textarea name="courseDescription" value={course.courseDescription} onChange={handleInputChange} className="form-input" required></textarea>
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
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.courseId}</td>
                  <td>{course.courseName}</td>
                  <td>{course.courseDescription}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No courses available. Add a new course to get started!</p>
      )}
    </div>
  );
}

export default AdminPage;
