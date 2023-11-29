import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import TambahKalenderAkademikModal from '../components/Modals/TambahKalenderAkademikModal';
import EditKalenderAkademikModal from '../components/Modals/EditKalenderAkademikModal';

const KalenderAkademik = () => {
    const [kalenderAkademik, setKalenderAkademik] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        fetchKalenderAkademik();
        const role = localStorage.getItem('role');
        setRole(role);
    }, []);

    const fetchKalenderAkademik = async () => {
        try {
            const res = await axios.get('/api/academic-events');
            setKalenderAkademik(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleUpdate = (id) => {
      // Set the selected item ID when "Update" is clicked
      setSelectedItemId(id);
      // Open the EditPengumumanModal
      setShowEditModal(true);
    };

    const handleDelete = async (id) => {
      try {
          // Show a confirmation dialog using SweetAlert
          const confirmDelete = await Swal.fire({
              title: 'Are you sure?',
              text: 'You will not be able to recover this kalender akademik!',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Yes, delete it!'
          });
  
          // If the user confirms the deletion
          if (confirmDelete.isConfirmed) {
              // Send a DELETE request to your API endpoint
              await axios.delete(`/api/academic-events/${id}`);
  
              // Handle the successful deletion, e.g., update the state or show a success message
              console.log(`Kalender Akademik with id ${id} deleted successfully`);
  
              // Fetch updated data after deletion
              fetchKalenderAkademik();
  
              // Show a success message
              Swal.fire('Deleted!', 'Kalender Akademik has been deleted.', 'success');
          }
      } catch (error) {
          // Handle errors, e.g., show an error message
          console.error(`Error deleting kalender akademik with id ${id}:`, error);
  
          // Show an error message
          Swal.fire('Error', 'Failed to delete kalender akademik.', 'error');
      }
    };

    return (
        <main className="content">
            <div className="container-fluid p-0">

                <h1 className="h3 mb-3"><strong>Kalender Akademik</strong></h1>

                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                 
                                <h5 className="card-title">Kalender Akademik</h5>
                                { role === 'admin' &&
                                <>
                                <button className="btn btn-primary mt-2" onClick={handleShowModal} data-bs-toggle="modal" data-bs-target="#addKalenderAkademikModal">
                                    <i className="align-middle" data-feather="plus"></i> <span className="align-middle">Tambah Kalender Akademik</span>
                                </button>
                                {/* Add your Tambah Kalender Akademik modal component here */}
                                <TambahKalenderAkademikModal showModal={showModal} setShowModal={setShowModal} fetchKalenderAkademik={fetchKalenderAkademik}/>
                                </>
                            }    
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Tanggal Mulai</th>
                                                <th>Tanggal Selesai</th>
                                                <th>Nama Kegiatan</th>
                                                <th>Action</th>
                                                {/* Add more table headers as needed */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {kalenderAkademik.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.tanggal_mulai}</td>
                                                    <td>{item.tanggal_selesai}</td>
                                                    <td>{item.nama_kegiatan}</td>
                                                    { role === 'admin' &&
                                                    <td>
                                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleUpdate(item.id_kegiatan)} data-bs-toggle="modal" data-bs-target="#editKalenderAkademikModal"><i className='bi bi-pencil'></i></button>
                                                        <EditKalenderAkademikModal showEditModal={showEditModal} setShowEditModal={setShowEditModal} selectedItemId={selectedItemId} fetchKalenderAkademik={fetchKalenderAkademik}/>
                                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id_kegiatan)}><i className='bi bi-trash'></i></button>
                                                    </td>
                                                    }
                                                    { role !== 'admin' &&
                                                        <td>-</td>
                                                    }
                                                    {/* Add more table data cells as needed */}
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

export default KalenderAkademik;
