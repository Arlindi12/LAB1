import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Alert } from 'react-bootstrap';
import API from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [reservationData, setReservationData] = useState({
    userId: 0,
    classId: 0,
    reservationDate: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRoleId = parseInt(localStorage.getItem('userRoleId'), 10);
    const activeUserId = parseInt(localStorage.getItem('userId'), 10);

    if (userRoleId !== 2) {
      navigate('/login');
    } else {
      setReservationData((prevData) => ({
        ...prevData,
        userId: activeUserId,
      }));
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
      await API.post('/Reservations/AddReservation', reservationData);
      setMessage('Reservation added successfully.');
      setReservationData({
        userId: reservationData.userId, // Ruajmë ID-në aktive
        classId: 0,
        reservationDate: '',
      });
      loadReservations();
    } catch (error) {
      console.error('Error adding reservation:', error);
      setMessage('Error adding reservation.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Reservations</h2>
        <p className="mb-4">
          <strong>Your ID:</strong> {reservationData.userId}
        </p>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group controlId="userId">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="number"
              value={reservationData.userId}
              readOnly // Vetëm lexueshme
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
            Add Reservation
          </Button>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Class ID</th>
              <th>Reservation Date</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.reservationId}>
                <td>{reservation.reservationId}</td>
                <td>{reservation.userId}</td>
                <td>{reservation.classId}</td>
                <td>{new Date(reservation.reservationDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Footer />
    </>
  );
};

export default Reservations;
