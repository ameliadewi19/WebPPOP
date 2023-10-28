import React from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

// import ProtectedRoute from './components/ProtectedRoute.js';
import Sidebar from './components/Sidebar.js';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';

import Login from './components/Login.js';
import Pergerakan from './components/Pergerakan.js';
import Dashboard from './components/Dashboard.js';
import KAK from './components/KAK.js';
import ProgramKerja from './components/ProgramKerja.js';
import PeminjamanSarpras from './components/PeminjamanSarpras.js';

function checkAuthorization() {
  const token = localStorage.getItem('token');

  console.log("token lokal:", token);
  
  if (!token) {
    return false;
  }
  return true;
}

function ProtectedRoute({ children }) {

  const userHasAuthorization = checkAuthorization(); 

  if (!userHasAuthorization) {
    return <Navigate to={`/`} />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <>
            <Login />
          </>
        }/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="wrapper">
              <Sidebar />
              <div className="main">
                <Navbar />
                <Dashboard />
                <Footer />
              </div>
            </div>
          </ProtectedRoute>
        }/>
        <Route path="/kak" element={
          <ProtectedRoute>
            <div className="wrapper">
              <Sidebar />
              <div className="main">
                <Navbar />
                <KAK />
                <Footer />
              </div>
            </div>
          </ProtectedRoute>
        }/>
        <Route path="/program-kerja" element={
          <ProtectedRoute>
            <div className="wrapper">
              <Sidebar />
              <div className="main">
                <Navbar />
                <ProgramKerja />
                <Footer />
              </div>
            </div>
          </ProtectedRoute>
        }/>
        <Route path="/pergerakan" element={
          <ProtectedRoute>
            <div className="wrapper">
              <Sidebar />
              <div className="main">
                <Navbar />
                <Pergerakan />
                <Footer />
              </div>
            </div>
          </ProtectedRoute>
        }/>
        <Route path="/peminjaman-sarpras" element={
          <ProtectedRoute>
            <div className="wrapper">
              <Sidebar />
              <div className="main">
                <Navbar />
                <PeminjamanSarpras />
                <Footer />
              </div>
            </div>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 

