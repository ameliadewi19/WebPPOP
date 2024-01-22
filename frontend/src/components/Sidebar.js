import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';

const Sidebar = () => {
    const location = useLocation();
    const [role, setRole] = useState(null);
    
    useEffect(() => {
        const role = localStorage.getItem('role');
        setRole(role);
        feather.replace(); // Replace the icons after component mounts
    }, []);

    return (
        // <nav id="sidebar" className="sidebar js-sidebar">
            <div className="sidebar-content js-simplebar">
                <a className="sidebar-brand text-decoration-none" href="/dashboard">
                    <span className="align-middle">SipProkerOK</span>
                </a>

                <ul className="sidebar-nav">
                    <li className="sidebar-header">
                        Menu
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/dashboard">
                            <i className="align-middle" data-feather="home"></i> <span className="align-middle">Dashboard</span>
                        </a>
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/kak' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/kak">
                            <i className="align-middle" data-feather="file-text"></i> <span className="align-middle">KAK</span>
                        </a>
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/program-kerja' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/program-kerja">
                            <i className="align-middle" data-feather="briefcase"></i> <span className="align-middle">Program Kerja</span>
                        </a>
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/lpj' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/lpj">
                            <i className="align-middle" data-feather="folder"></i> <span className="align-middle">LPJ Proker</span>
                        </a>
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/pergerakan' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/pergerakan">
                            <i className="bi-list-ol"></i> <span className="align-middle">Pergerakan</span>
                        </a>
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/peminjaman-sarpras' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/list-pengajuan">
                            <i className="bi-building"></i> <span className="align-middle">Peminjaman SarPras</span>
                        </a>
                    </li>

                    {role && role !== 'ormawa' && 
                    <>

                    <li className={`sidebar-item ${location.pathname === '/ormawa' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/ormawa">
                            <i className="bi-people"></i> <span className="align-middle">Ormawa</span>
                        </a>
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/ketua-ormawa' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/ketua-ormawa">
                            <i className="bi-person-badge"></i> <span className="align-middle">Ketua Ormawa</span>
                        </a>
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/timeline' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/timeline">
                            <i className="bi-calendar-week-fill" data-feather="clock"></i> <span className="align-middle">Timeline</span>
                        </a>
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/pengumuman' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/pengumuman">
                            <i className="bi-newspaper"></i> <span className="align-middle">Pengumuman</span>
                        </a>
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/kalender-akademik' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/kalender-akademik">
                            <i className="bi-calendar"></i> <span className="align-middle">Kalender Akademik</span>
                        </a>
                    </li>

                    <li className={`sidebar-item ${location.pathname === '/kelola-akun' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/kelola-akun">
                            <i className="bi-person-fill-gear"></i> <span className="align-middle">Kelola Akun</span>
                        </a>
                    </li>

                    </>
                    
                    }

                    {role && role === 'sarpras' && 
                    <>

                    <li className={`sidebar-item ${location.pathname === '/pengelolaan-sarana-prasarana' ? 'active' : ''}`}>
                        <a className="sidebar-link" href="/pengelolaan-sarana-prasarana">
                        <i class="bi bi-building-fill-gear"></i> <span className="align-middle">Pengelolaan SarPras</span>
                        </a>
                    </li>

                    </>
                    
                    }   
                </ul>
            </div>
        // </nav>
    );
};

export default Sidebar;
