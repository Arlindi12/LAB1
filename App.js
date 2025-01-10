import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import Register from './components/Register';
import Classes from './components/Classes';
import ClassesU from './components/ClassesU';
import Instructors from './components/Instructors';
import InstructorsU from './components/InstructorsU';
import Reservations from './components/Reservations';
import ReservationsU from './components/ReservationsU';
import Subscriptions from './components/Subscriptions';
import SubscriptionsU from './components/SubscriptionsU';
import Home from './components/Home';
import Contact from './components/Contact';
import Users from './components/Users';
import Director from './components/Director';


const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Home" element={<Home />} /> 
      <Route path="/Classes" element={<Classes />} />
      <Route path="/ClassesU" element={<ClassesU />} />
      <Route path="/Instructors" element={<Instructors />} /> 
      <Route path="/InstructorsU" element={<InstructorsU />} /> 
    <Route path="/Reservations" element={<Reservations />} /> 
    <Route path="/ReservationsU" element={<ReservationsU />} /> 
    <Route path="/Subscriptions" element={<Subscriptions />} /> 
    <Route path="/SubscriptionsU" element={<SubscriptionsU />} /> 
    <Route path="/Contact" element={<Contact />} /> 
    <Route path="/Users" element={<Users />} /> 
    <Route path="/Director" element={<Director />} /> 

      





    </Routes>
  </Router>
);

export default App;
