import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import API from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom'; 

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [classData, setClassData] = useState({
    classId: 0,
    className: '',
    instructorId: 0,
    day: '',
    startTime: '',
    endTime: ''
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRoleId = parseInt(localStorage.getItem('userRoleId'), 10); 

    if (userRoleId !== 1) { 
        navigate('/login'); 
    } else {
      loadClasses();
    }
  }, [navigate]);

  

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await API.get('/Classes/GetAllClasses');
      setClasses(response.data);
    } catch (error) {
      console.error('Error loading classes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (classData.classId) {
        await API.put('/Classes/UpdateClass', classData);
        setMessage('Class updated successfully.');
      } else {
        await API.post('/Classes/AddClass', classData);
        setMessage('Class added successfully.');
      }

      setClassData({
        classId: 0,
        className: '',
        instructorId: 0,
        day: '',
        startTime: '',
        endTime: ''
      });
      loadClasses();
    } catch (error) {
      console.error('Error saving class:', error);
      setMessage('Error saving class.');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/Classes/DeleteClass/${selectedClass.classId}`);
      setMessage('Class deleted successfully.');
      setShowDeleteModal(false);
      loadClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      setMessage('Error deleting class.');
    }
  };

  const openDeleteModal = (classItem) => {
    setSelectedClass(classItem);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Classes</h2>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group controlId="className">
            <Form.Label>Class Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter class name"
              value={classData.className}
              onChange={(e) => setClassData({ ...classData, className: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="instructorId">
            <Form.Label>Instructor ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter instructor ID"
              value={classData.instructorId}
              onChange={(e) => setClassData({ ...classData, instructorId: parseInt(e.target.value) })}
              required
            />
          </Form.Group>

          <Form.Group controlId="day">
            <Form.Label>Day</Form.Label>
            <Form.Control
              as="select"
              value={classData.day}
              onChange={(e) => setClassData({ ...classData, day: e.target.value })}
              required
            >
              <option value="">Select a day</option>
              {daysOfWeek.map((day, index) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="startTime">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              value={classData.startTime}
              onChange={(e) => setClassData({ ...classData, startTime: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="endTime">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              value={classData.endTime}
              onChange={(e) => setClassData({ ...classData, endTime: e.target.value })}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-2">
            {classData.classId ? 'Update' : 'Add'}
          </Button>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Class Name</th>
              <th>Instructor ID</th>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
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
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => setClassData(classItem)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => openDeleteModal(classItem)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this class?</Modal.Body>
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

export default Classes;
