import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import feather from 'feather-icons';

// ...

const Navbar = () => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
	const [id, setID] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setID(user.id_user);
            fetchUserProfile(user.id_user);
        } else {
            // Handle the case when there is no ID
            console.error('ID not found');
        }
    }, []);    

	const fetchUserProfile = async (id_user) => {
		if (id_user) {
			try {
				// Assuming you need to include the id_user in the request
				const response = await axios.get(`/api/auth/user-profile/${id_user}`);
				setUserData(response.data);
				console.log(response.data);
			} catch (error) {
				console.error('Error fetching user profile:', error);
			}
		}
	};	

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            await axios.post('/api/auth/logout');
            localStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="navbar navbar-expand navbar-light navbar-bg">
            <a className="sidebar-toggle js-sidebar-toggle">
                <i className="hamburger align-self-center ms-2"></i>
            </a>

            <div className="navbar-collapse collapse">
                <ul className="navbar-nav navbar-align">
                    <li className="nav-item dropdown">
                        <a className="nav-icon dropdown-toggle d-inline-block d-sm-none" href="#" data-bs-toggle="dropdown">
                            {/* <i className="bi-setting"></i> */}
                        </a>

                        {userData && (
                            <a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown">
                                <img src="img/avatars/avatar.jpg" className="avatar img-fluid rounded me-1" alt="Charles Hall" />
                                <span className="text-dark">{userData.nama}</span>
                            </a>
                        )}

                        <div className="dropdown-menu dropdown-menu-end">
                            {userData && (
                                <a className="dropdown-item" href="/profil">
                                    <i className="align-middle me-1 " data-feather="user"></i> Profile
                                </a>
                            )}
                            {/* ... (other dropdown items) */}
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="" onClick={handleLogout}>
                                Log out
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
