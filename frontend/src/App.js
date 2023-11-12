import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar.js';
import Navbar from './components/Navbar.js';
import Footer from './components/Footer.js';

import Login from './pages/Login.js';
import Pergerakan from './pages/Pergerakan.js';
import Dashboard from './pages/Dashboard.js';
import DashboardAdmin from './pages/DashboardAdmin.js';
import KAK from './pages/KAK.js';
import KAKAdmin from './pages/KAKAdmin.js';
import ProgramKerja from './pages/ProgramKerja.js';
import ProgramKerjaAdmin from './pages/ProgramKerjaAdmin.js';
import PeminjamanSarpras from './pages/PeminjamanSarpras.js';
import Timeline from './pages/Timeline.js';
import Pengumuman from './pages/Pengumuman.js';
import KalenderAkademik from './pages/KalenderAkademik.js';
import UploadKAK from './components/SubMenu/UploadKAK.js';
import LPJ from './pages/LPJ.js';
import LPJAdmin from './pages/LPJAdmin.js';
import Ormawa from './pages/Ormawa.js';

function checkAuthorization() {
  const token = localStorage.getItem('token');
  console.log("token lokal:", token);
  
  if (!token) {
    return false;
    }
    return true;
  }

  function checkRole() {
    const role = localStorage.getItem('role');
    console.log("role:", role);

    return role;
  }

  function ProtectedRoute({ children }) {

    const userHasAuthorization = checkAuthorization(); 

    if (!userHasAuthorization) {
      return <Navigate to={`/`} />;
    }

    return children;
  }

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // New state to track loading

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = checkRole();
      setUserRole(role);
      setLoading(false); // Set loading to false once userRole is set
    };

    fetchUserRole();
  }, []);

  // Show loading indicator while waiting for userRole
  if (loading) {
    return <p></p>;
  }

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
                {userRole === 'ormawa' ? <Dashboard /> : <DashboardAdmin />}
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
                {userRole === 'ormawa' ? <KAK /> : <KAKAdmin />}
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
                {userRole === 'ormawa' ? <ProgramKerja /> : <ProgramKerjaAdmin />}
                <Footer />
              </div>
            </div>
          </ProtectedRoute>
        }/>
        <Route path="/lpj" element={
          <ProtectedRoute>
            <div className="wrapper">
              <Sidebar />
              <div className="main">
                <Navbar />
                {userRole === 'ormawa' ? <LPJ /> : <LPJAdmin />}
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
        <Route path="/timeline" element={
          <div className="wrapper">
            <Sidebar />
            <div className="main">
              <Navbar />
              <Timeline />
              <Footer />
            </div>
          </div>
        }/>
        <Route path="/pengumuman" element={
          <div className="wrapper">
            <Sidebar />
            <div className="main">
              <Navbar />
              <Pengumuman />
              <Footer />
            </div>
          </div>
        }/>
        <Route path="/kalender-akademik" element={
          <div className="wrapper">
            <Sidebar />
            <div className="main">
              <Navbar />
              <KalenderAkademik />
              <Footer />
            </div>
          </div>
        }/>
        <Route path="/ormawa" element={
          <div className="wrapper">
            <Sidebar />
            <div className="main">
              <Navbar />
              <Ormawa />
              <Footer />
            </div>
          </div>
        }/>
        <Route path="/upload-kak" element={
          <div className="wrapper">
            <Sidebar />
            <div className="main">
              <Navbar />
              <UploadKAK />
              <Footer />
            </div>
          </div>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 

