import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import API from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom'; 


const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [reservationData, setReservationData] = useState({
    reservationId: 0,
    userId: 0,
    classId: 0,
    reservationDate: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [message, setMessage] = useState('');
 const navigate = useNavigate();

  useEffect(() => {
    const userRoleId = parseInt(localStorage.getItem('userRoleId'), 10); 

    if (userRoleId !== 1) { 
        navigate('/login'); 
    } else {
      loadReservations();
    }
  }, [navigate]);

  const loadReservations = async () => {
    try {
      const response = await API.get('/Reservations/GetAllReservations');
      setReservations(response.data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reservationData.reservationId) {
        await API.put('/Reservations/UpdateReservation', reservationData);
        setMessage('Reservation updated successfully.');
      } else {
        await API.post('/Reservations/AddReservation', reservationData);
        setMessage('Reservation added successfully.');
      }

      setReservationData({
        reservationId: 0,
        userId: 0,
        classId: 0,
        reservationDate: '',
      });
      loadReservations();
    } catch (error) {
      console.error('Error saving reservation:', error);
      setMessage('Error saving reservation.');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/Reservations/DeleteReservation/${selectedReservation.reservationId}`);
      setMessage('Reservation deleted successfully.');
      setShowDeleteModal(false);
      loadReservations();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setMessage('Error deleting reservation.');
    }
  };

  const openDeleteModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowDeleteModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Reservations</h2>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group controlId="userId">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter user ID"
              value={reservationData.userId}
              onChange={(e) => setReservationData({ ...reservationData, userId: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="classId">
            <Form.Label>Class ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter class ID"
              value={reservationData.classId}
              onChange={(e) => setReservationData({ ...reservationData, classId: e.target.value })}
              required
            />
          </Form.Group>
          

          <Form.Group controlId="reservationDate">
            <Form.Label>Reservation Date</Form.Label>
            <Form.Control
              type="date"
              value={reservationData.reservationDate}
              onChange={(e) => setReservationData({ ...reservationData, reservationDate: e.target.value })}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-2">
            {reservationData.reservationId ? 'Update' : 'Add'}
          </Button>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Class ID</th>
              <th>Reservation Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.reservationId}>
                <td>{reservation.reservationId}</td>
                <td>{reservation.userId}</td>
                <td>{reservation.classId}</td>
                <td>{new Date(reservation.reservationDate).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => setReservationData(reservation)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => openDeleteModal(reservation)}
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
          <Modal.Body>Are you sure you want to delete this reservation?</Modal.Body>
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

export default Reservations;
