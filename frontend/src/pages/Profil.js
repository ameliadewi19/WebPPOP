import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import EditProfilModal from '../components/Modals/EditProfilModal.js';
import EditPasswordModal from '../components/Modals/EditPasswordModal.js';

// Import your TambahKalenderAkademikModal and EditKalenderAkademikModal components here

const Profil = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [id, setID] = useState('');
    const [IdUser, setIdUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

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
                setUserProfile(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        }
    };    

    const handleShowEditModal = (IdUser) => {
        setIdUser(IdUser);
        setShowEditModal(true);
    };      

    const handleShowPasswordModal = (IdUser) => {
        setIdUser(IdUser);
        setShowPasswordModal(true);
    };      

    const handleReloadData = () => {
        // Panggil fungsi fetchUserProfile untuk memperbarui userProfile
        fetchUserProfile(id);
    };
        
    return (
        <main className="content">
            <div className="container-fluid p-0">

                <h1 className="h3 mb-3"><strong>Profil</strong></h1>

                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="card-title mt-2">Profil</h5>
                                <div className="btn-group">
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleShowEditModal(id)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#editProfilModal"
                                        style={{borderRadius: "5px"}}
                                    >
                                        <span className="align-middle">Edit Profil</span>
                                    </button>
                                    <EditProfilModal
                                        showModal={handleShowEditModal}
                                        setShowModal={setShowEditModal}
                                        reloadData={handleReloadData}
                                        userId={IdUser}
                                    />
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleShowPasswordModal(id)}
                                        data-bs-toggle="modal"
                                        style={{borderRadius: "5px"}}
                                        data-bs-target="#editPasswordModal"
                                    >
                                        <span className="align-middle">Edit Password</span>
                                    </button>
                                    <EditPasswordModal
                                        showModal={handleShowPasswordModal}
                                        setShowModal={setShowPasswordModal}
                                        reloadData={handleReloadData}
                                        userId={IdUser}
                                    />
                                    </div>
                            </div>
                            <div className="card-body">
                                {/* Display user profile information in a table */}
                                {userProfile && (
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>Nama</th>
                                                <td>{userProfile.nama}</td>
                                            </tr>
                                            <tr>
                                                <th>Username</th>
                                                <td>{userProfile.username}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>{userProfile.email}</td>
                                            </tr>
                                            {/* Add more rows for additional profile information */}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </main>
    );
};

export default Profil;
