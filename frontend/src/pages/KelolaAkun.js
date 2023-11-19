import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
// import feather from 'feather-icons';
import TambahAkunModal from '../components/Modals/TambahAkunModal.js';
import EditProfilModal from '../components/Modals/EditProfilModal.js';
import EditPasswordAdminModal from '../components/Modals/EditPasswordAdminModal.js';

const KelolaAkun = () => {
    const [role, setRole] = useState(null);
    const history = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [IdUser, setIdUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
      // feather.replace(); // Replace the icons after component mounts
      const role = localStorage.getItem('role');
      setRole(role);
      fetchData();
      // console.log("test");
    }, []);
  
    const handleShowModal = () => {
      setShowModal(true);
    };
  
    const handleDelete = (id_user) => {
      const isConfirmed = window.confirm('Are you sure you want to delete this account?');
  
      if (isConfirmed) {
        axios
          .delete(`/api/auth/users/${id_user}`)
          .then((response) => {
            console.log(response.data.message);
          })
          .catch((error) => {
            console.error('Error deleting account:', error);
          });
  
        setShowModal(false);
      }
  
      fetchData();
    };
  
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/auth/users');
        setUsers(response.data.users); // Update this line
      } catch (error) {
        console.error('Error fetching timeline data:', error);
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
        fetchData();
    };

    return (
        <main class="content">
          <div class="container-fluid p-0">
  
            <h1 class="h3 mb-3"><strong>Kelola Akun</strong></h1>
  
            <div className="row">
              <div className="col-xl-12">
                  <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mt-2">Kelola Akun</h5>
                          <button className="btn btn-primary" onClick={handleShowModal} data-bs-toggle="modal" data-bs-target="#addAkunModal">
                            <i className="align-middle" data-feather="plus"></i> <span className="align-middle">Tambah Akun</span>
                          </button>
                          <TambahAkunModal showModal={showModal} setShowModal={setShowModal} reloadData={fetchData} />
                  </div>
                  <div className="card-body">
                      <div className="table-responsive">
                      <table className="table table-striped">
                          <thead>
                          <tr>
                              <th>No</th>
                              <th>Nama</th>
                              <th>Username</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Aksi</th>
                          </tr>
                          </thead>
                          <tbody>
                            {users.map((user, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{user.nama}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                  {role === 'admin' && (
                                    <>
                                    <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(user.id_user)}>Hapus</button>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleShowEditModal(user.id_user)}
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
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleShowPasswordModal(user.id_user)}
                                        data-bs-toggle="modal"
                                        style={{borderRadius: "5px"}}
                                        data-bs-target="#editPasswordModal"
                                    >
                                    <span className="align-middle">Edit Password</span>
                                    </button>
                                    <EditPasswordAdminModal
                                        showModal={handleShowPasswordModal}
                                        setShowModal={setShowPasswordModal}
                                        reloadData={handleReloadData}
                                        userId={IdUser}
                                    />
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                      </table>
                      </div>
                  </div>
                  </div>
              </div>
            </div>
          </div>
        </main>
      );
};

export default KelolaAkun;
