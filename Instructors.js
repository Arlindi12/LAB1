import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal, Alert } from 'react-bootstrap';
import API from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom'; 


const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [instructorData, setInstructorData] = useState({ instructorId: 0, fullName: '', specialization: '', phoneNumber: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const userRoleId = parseInt(localStorage.getItem('userRoleId'), 10); 

    if (userRoleId !== 1) { 
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (instructorData.instructorId) {
        await API.put('/Instructors/UpdateInstructor', instructorData);
        setMessage('Instructor updated successfully.');
      } else {
        await API.post('/Instructors/AddInstructor', instructorData);
        setMessage('Instructor added successfully.');
      }

      setInstructorData({ instructorId: 0, fullName: '', specialization: '', phoneNumber: '' });
      loadInstructors();
    } catch (error) {
      console.error('Error saving instructor:', error);
      setMessage('Error saving instructor.');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/Instructors/DeleteInstructor/${selectedInstructor.instructorId}`);
      setMessage('Instructor deleted successfully.');
      setShowDeleteModal(false);
      loadInstructors();
    } catch (error) {
      console.error('Error deleting instructor:', error);
      setMessage('Error deleting instructor.');
    }
  };

  const openDeleteModal = (instructor) => {
    setSelectedInstructor(instructor);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Instructors</h2>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              value={instructorData.fullName}
              onChange={(e) => setInstructorData({ ...instructorData, fullName: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="specialization">
            <Form.Label>Specialization</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter specialization"
              value={instructorData.specialization}
              onChange={(e) => setInstructorData({ ...instructorData, specialization: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="phoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter phone number"
              value={instructorData.phoneNumber}
              onChange={(e) => setInstructorData({ ...instructorData, phoneNumber: e.target.value })}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-2">
            {instructorData.instructorId ? 'Update' : 'Add'}
          </Button>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Specialization</th>
              <th>Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor.instructorId}>
                <td>{instructor.instructorId}</td>
                <td>{instructor.fullName}</td>
                <td>{instructor.specialization}</td>
                <td>{instructor.phoneNumber}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Button
                      variant="warning"
                      onClick={() => setInstructorData(instructor)}
                      className="me-2 d-flex align-items-center"
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => openDeleteModal(instructor)}
                      className="d-flex align-items-center"
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this instructor?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default Instructors;
