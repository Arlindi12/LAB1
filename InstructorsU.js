import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'react-bootstrap';
import API from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRoleId = parseInt(localStorage.getItem('userRoleId'), 10);

    if (userRoleId !== 2) {
      navigate('/login');
    } else {
      loadInstructors();
    }
  }, [navigate]);

  const loadInstructors = async () => {
    try {
      const response = await API.get('/Instructors/GetAllInstructors');
      setInstructors(response.data);
    } catch (error) {
      console.error('Error loading instructors:', error);
      setMessage('Error loading instructors.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Instructors</h2>
        {message && <Alert variant="info">{message}</Alert>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Specialization</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor.instructorId}>
                <td>{instructor.instructorId}</td>
                <td>{instructor.fullName}</td>
                <td>{instructor.specialization}</td>
                <td>{instructor.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Footer />
    </>
  );
};

export default Instructors;
