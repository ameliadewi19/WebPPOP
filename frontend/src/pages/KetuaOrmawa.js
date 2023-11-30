import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import EditProfilModal from '../components/Modals/EditProfilModal.js';
import EditKetuaOrmawaModal from '../components/Modals/EditKetuaOrmawaModal.js';
import EditPasswordAdminModal from '../components/Modals/EditPasswordAdminModal.js';
import Swal from 'sweetalert2';
import TambahKetuaOrmawaModal from '../components/Modals/TambahKetuaOrmawaModal.js';

const KetuaOrmawa = () => {
    const [role, setRole] = useState(null);
    const history = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [IdUser, setIdUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [ketuaOrmawas, setKetuaOrmawas] = useState([]);

    useEffect(() => {
      // feather.replace(); // Replace the icons after component mounts
      const role = localStorage.getItem('role');
      setRole(role);
      fetchData();
    }, []);
  
    const handleShowModal = () => {
      setShowModal(true);
    };
  
    const handleDelete = (id_user) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/api/ketua-ormawa/${id_user}`)
            .then((response) => {
              console.log(response.data.message);
              Swal.fire(
                'Deleted!',
                'The account has been deleted.',
                'success'
              );
            })
            .catch((error) => {
              console.error('Error deleting account:', error);
              Swal.fire(
                'Error!',
                'Failed to delete the account.',
                'error'
              );
            });
    
          fetchData();
        }
      });
    };
    
  
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/ketua-ormawa');
        const ketuaOrmawaData = response.data.data;
    
        // Using Promise.all to wait for all asynchronous operations to complete
        const updatedKetuaOrmawas = await Promise.all(
          ketuaOrmawaData.map(async (ketua) => {
            const namaOrmawa = await fetchNamaOrmawa(ketua.id_ormawa);
            return { ...ketua, nama_ormawa: namaOrmawa };
          })
        );
    
        setKetuaOrmawas(updatedKetuaOrmawas);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    

    const fetchNamaOrmawa = async (id_ormawa) => {
      try {
        const response = await axios.get(`/api/ormawa/${id_ormawa}`);
        return response.data.nama_ormawa;
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
  
            <h1 class="h3 mb-3"><strong>Ketua Ormawa</strong></h1>
  
            <div className="row">
              <div className="col-xl-12">
                  <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title mt-2">Ketua Ormawa</h5>
                          {role === 'admin' && (
                            <button className="btn btn-primary" onClick={handleShowModal} data-bs-toggle="modal" data-bs-target="#addAkunModal">
                              <i className="bi-plus"></i> <span className="align-middle">Tambah Ketua</span>
                            </button>
                          )}
                          <TambahKetuaOrmawaModal showModal={showModal} setShowModal={setShowModal} reloadData={fetchData} />
                  </div>
                  <div className="card-body">
                      <div className="table-responsive">
                      <table className="table table-striped">
                          <thead>
                          <tr>
                              <th>No</th>
                              <th>ORMAWA</th>
                              <th>NIM</th>
                              <th>Nama</th>
                              <th>Tahun Jabatan</th>
                              {role === 'admin' && (
                                <th>Aksi</th>
                              )}
                          </tr>
                          </thead>
                          <tbody>
                            {ketuaOrmawas.map((ketua, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{ketua.nama_ormawa}</td>
                                <td>{ketua.nim_ketua}</td>
                                <td>{ketua.nama_ketua}</td>
                                <td>{ketua.tahun_jabatan}</td>
                                <td>
                                  {role === 'admin' && (
                                    <>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => handleShowEditModal(ketua.id_ketua)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#editKetuaOrmawaModal"
                                        style={{borderRadius: "5px"}}
                                    >
                                        <span className="align-middle"><i className='bi-pencil'></i></span>
                                    </button>
                                    <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(ketua.id_ketua)}><i className='bi-trash'></i></button>
                                    <EditKetuaOrmawaModal
                                        showModal={handleShowEditModal}
                                        setShowModal={setShowEditModal}
                                        reloadData={handleReloadData}
                                        userId={ketua.id_ketua}
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

export default KetuaOrmawa;
