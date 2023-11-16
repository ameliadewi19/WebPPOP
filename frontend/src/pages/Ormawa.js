import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TambahOrmawaModal from '../components/Modals/TambahOrmawaModal.js';
import EditOrmawaModal from '../components/Modals/EditOrmawaModal.js';

const Ormawa = () => {
  const history = useNavigate();
  const [ormawas, setOrmawas] = useState([]);
  const [role, setRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [IdOrmawa, setIdOrmawa] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  useEffect(() => {
    const role = localStorage.getItem('role');
    setRole(role);

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // Fetch data from the API when the component mounts
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/ormawa');
      console.log('Response Data:', response.data); // Log the response data
      setOrmawas(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  }

  const handleShowEditModal = (IdOrmawa) => {
    setIdOrmawa(IdOrmawa);
    setShowEditModal(true);
  };

  const handleDelete = (id_ormawa) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');

    if (isConfirmed) {
      axios.delete(`/api/ormawa/${id_ormawa}`)
        .then((response) => {
          console.log(response.data.message); 
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
        });

      setShowModal(false);
    }

    fetchData();
};

  return (
    <main className="content">
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3"><strong>Ormawa</strong></h1>

        {/* Display data in a table */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="card-title">Ormawa</h5>
                {role === 'admin' && (
                    <>
                    <button class="btn btn-primary mt-2" onClick={handleShowModal} data-bs-toggle="modal" data-bs-target="#addOrmawaModal"><i className="align-middle" data-feather="plus"></i> <span className="align-middle">Tambah Ormawa</span></button>
                    <TambahOrmawaModal showModal={showModal} setShowModal={setShowModal} reloadData={fetchData}/>
                    </>
                )}
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nama Ormawa</th>
                        <th>Pembina</th>
                        <th>Aksi</th>
                        {/* Add more columns as needed */}
                      </tr>
                    </thead>
                    <tbody>
                      {ormawas.map((ormawa, index) => (
                        <tr key={index}>
                          <td>{index+1}</td>
                          <td>{ormawa.nama_ormawa}</td>
                          <td>{ormawa.pembina}</td>
                            {role === 'admin' && <td>
                                        <button class="btn btn-sm btn-primary " onClick={() => handleShowEditModal(ormawa.id_ormawa)} data-bs-toggle="modal" data-bs-target="#editOrmawaModal"><span className="align-middle">Edit</span></button>
                                        <EditOrmawaModal showModal={handleShowEditModal} setShowModal={setShowEditModal} reloadData={fetchData} IdOrmawa={IdOrmawa}/>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ormawa.id_ormawa)}>Hapus</button>
                                    </td>
                                    }
                                    {role !== 'admin' && <td>-</td>
                                    }
                          {/* Add more columns as needed */}
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

export default Ormawa;
