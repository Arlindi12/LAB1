import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Modal, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import API from '../services/api';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom'; 


const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState({
    subscriptionId: 0,
    userId: 0,
    subscriptionType: '',
    startDate: '',
    endDate: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [message, setMessage] = useState('');
 const navigate = useNavigate();


  useEffect(() => {
    const userRoleId = parseInt(localStorage.getItem('userRoleId'), 10); 

    if (userRoleId !== 1) { 
        navigate('/login'); 
    } else {
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
      if (subscriptionData.subscriptionId) {
        await API.put('/Subscriptions/UpdateSubscription', subscriptionData);
        setMessage('Subscription updated successfully.');
      } else {
        await API.post('/Subscriptions/AddSubscription', subscriptionData);
        setMessage('Subscription added successfully.');
      }

      setSubscriptionData({
        subscriptionId: 0,
        userId: 0,
        subscriptionType: '',
        startDate: '',
        endDate: '',
      });
      loadSubscriptions();
    } catch (error) {
      console.error('Error saving subscription:', error);
      setMessage('Error saving subscription.');
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/Subscriptions/DeleteSubscription/${selectedSubscription.subscriptionId}`);
      setMessage('Subscription deleted successfully.');
      setShowDeleteModal(false);
      loadSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      setMessage('Error deleting subscription.');
    }
  };

  const openDeleteModal = (subscription) => {
    setSelectedSubscription(subscription);
    setShowDeleteModal(true);
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
              placeholder="Enter user ID"
              value={subscriptionData.userId}
              onChange={(e) => setSubscriptionData({ ...subscriptionData, userId: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="subscriptionType">
            <Form.Label>Subscription Type</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subscription type"
              value={subscriptionData.subscriptionType}
              onChange={(e) => setSubscriptionData({ ...subscriptionData, subscriptionType: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={subscriptionData.startDate}
              onChange={(e) => setSubscriptionData({ ...subscriptionData, startDate: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={subscriptionData.endDate}
              onChange={(e) => setSubscriptionData({ ...subscriptionData, endDate: e.target.value })}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-2">
            {subscriptionData.subscriptionId ? 'Update' : 'Add'}
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
              <th>Actions</th>
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
                <td>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => setSubscriptionData(subscription)}
                  >
                    <FaEdit /> Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => openDeleteModal(subscription)}
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
          <Modal.Body>Are you sure you want to delete this subscription?</Modal.Body>
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

export default Subscriptions;
