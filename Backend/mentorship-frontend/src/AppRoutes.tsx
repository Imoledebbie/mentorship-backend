// src/AppRoutes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BookSession from './pages/BookSession'; 
import SessionsList from './pages/SessionsList';
import AdminSessions from './pages/AdminSessions'; 

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book-session" element={<BookSession />} /> {/* ✅ NEW */}
          <Route path="/sessions" element={<SessionsList />} />
          <Route path="/admin-sessions" element={<AdminSessions />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRoutes;
