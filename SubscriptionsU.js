import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Alert } from 'react-bootstrap';
import API from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState({
    userId: 0,
    subscriptionType: '',
    startDate: '',
    endDate: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userRoleId = parseInt(localStorage.getItem('userRoleId'), 10);

    if (userRoleId !== 2) {
      navigate('/login');
    } else {
      const activeUserId = parseInt(localStorage.getItem('userId'), 10);
      setSubscriptionData((prevData) => ({
        ...prevData,
        userId: activeUserId,
      }));
      loadSubscriptions();
    }
  }, [navigate]);

  const loadSubscriptions = async () => {
    try {
      const response = await API.get('/Subscriptions/GetAllSubscriptions');
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/Subscriptions/AddSubscription', subscriptionData);
      setMessage('Subscription added successfully.');
      setSubscriptionData({
        userId: subscriptionData.userId, // Ruaj ID-në aktive
        subscriptionType: '',
        startDate: '',
        endDate: '',
      });
      loadSubscriptions();
    } catch (error) {
      console.error('Error adding subscription:', error);
      setMessage('Error adding subscription.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Subscriptions</h2>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group controlId="userId">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="number"
              value={subscriptionData.userId}
              readOnly // Vetëm lexueshme
            />
          </Form.Group>

          <Form.Group controlId="subscriptionType">
            <Form.Label>Subscription Type</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subscription type"
              value={subscriptionData.subscriptionType}
              onChange={(e) =>
                setSubscriptionData({ ...subscriptionData, subscriptionType: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={subscriptionData.startDate}
              onChange={(e) =>
                setSubscriptionData({ ...subscriptionData, startDate: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={subscriptionData.endDate}
              onChange={(e) =>
                setSubscriptionData({ ...subscriptionData, endDate: e.target.value })
              }
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-2">
            Add Subscription
          </Button>
        </Form>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Subscription Type</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.subscriptionId}>
                <td>{subscription.subscriptionId}</td>
                <td>{subscription.userId}</td>
                <td>{subscription.subscriptionType}</td>
                <td>{new Date(subscription.startDate).toLocaleDateString()}</td>
                <td>{new Date(subscription.endDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Footer />
    </>
  );
};

export default Subscriptions;
