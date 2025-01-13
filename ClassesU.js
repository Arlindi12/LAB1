import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'react-bootstrap';
import API from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom'; 

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRoleId = parseInt(localStorage.getItem('userRoleId'), 10); 

    if (userRoleId !== 2) { 
        navigate('/login'); 
    } else {
      loadClasses();
    }
  }, [navigate]);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await API.get('/Classes/GetAllClasses');
      setClasses(response.data);
    } catch (error) {
      console.error('Error loading classes:', error);
      setMessage('Error loading classes.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Classes</h2>
        {message && <Alert variant="info">{message}</Alert>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Class Name</th>
              <th>Instructor ID</th>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.classId}>
                <td>{classItem.classId}</td>
                <td>{classItem.className}</td>
                <td>{classItem.instructorId}</td>
                <td>{classItem.day}</td>
                <td>{classItem.startTime}</td>
                <td>{classItem.endTime}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Footer />
    </>
  );
};

export default Classes;
