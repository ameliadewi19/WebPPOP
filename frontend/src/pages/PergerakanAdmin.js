import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import TambahPergerakanModal from '../components/Modals/TambahPergerakanModal.js';
import EditPergerakanModal from '../components/Modals/EditPergerakanModal.js';
import { DataTable } from 'simple-datatables';

const PergerakanAdmin = () => {
    const [role, setRole] = useState(null);
    const [pergerakan, setPergerakan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [idKetua, setIdKetua] = useState(null);
    const [dataProker, setDataProker] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    let datatable;

    useEffect(() => {
      const idUser = localStorage.getItem('idUser');
      const role = localStorage.getItem('role');
      setRole(role);
      fetchOrmawa(idUser);
      fetchDataProker();
      fetchPergerakan();
    }, [idKetua]);

    useEffect(() => {
        if (pergerakan.length > 0) {
            datatable = new DataTable('.datatable', {
                sortable: false,
                searchable: false,
                paging: false
            });
            datatable.on("datatable.init", () => {
                setIsLoading(false);
                datatable.refresh();
            });
        }
    }, [pergerakan]);

    const fetchOrmawa = (id) => {
      console.log("idUser fetchormawa:", id);
      axios.get(`/api/auth/get-ketua/${id}`)
          .then((res) => {
              setIdKetua(res.data.data.id_ketua);
          })
          .catch((err) => {
              console.log(err);
          });
      
      console.log("idKetua ormawa:", idKetua);
    }

    const fetchDataProker = async () => {
        try {
            const response = await axios.get('/api/proker');
            const data = response.data.filter((proker) => proker.kak.id_ketua === idKetua);
            setDataProker(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching proker data:', error);
        }
    };

    const fetchPergerakan = async () => {
        try {
            const res = await axios.get('/api/pergerakan');
            // const data = res.data.filter((pergerakan) => pergerakan.proker.kak.id_ketua === idKetua);
            setPergerakan(res.data);
            console.log("pergerakan: ",res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getProkerNamaKegiatan = async (idProker) => {
      try {
          const response = await axios.get(`/api/proker/${idProker}`);
          const proker = response.data;
          const namaProker = proker.nama_kegiatan;
          return namaProker;
      } catch (error) {
          console.error(`Error fetching proker with id ${idProker}:`, error);
          return '';
      }
    };
  

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleUpdate = (id) => {
        // Set the selected item ID when "Update" is clicked
        setSelectedItemId(id);
        // Open the EditPergerakanModal
        setShowEditModal(true);
    };

    const handleDelete = async (id) => {
        try {
            // Show a confirmation dialog using SweetAlert
            const confirmDelete = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this pergerakan!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            });

            // If the user confirms the deletion
            if (confirmDelete.isConfirmed) {
                // Send a DELETE request to your API endpoint
                await axios.delete(`/api/pergerakan/${id}`);

                // Handle the successful deletion, e.g., update the state or show a success message
                console.log(`Pergerakan with id ${id} deleted successfully`);

                // Fetch updated data after deletion
                fetchPergerakan();

                // Show a success message
                Swal.fire('Deleted!', 'Pergerakan has been deleted.', 'success');
            }
        } catch (error) {
            // Handle errors, e.g., show an error message
            console.error(`Error deleting pergerakan with id ${id}:`, error);

            // Show an error message
            Swal.fire('Error', 'Failed to delete pergerakan.', 'error');
        }
    };

    return (
        <main className="content">
            <div className="container-fluid p-0">

                <h1 className="h3 mb-3"><strong>Pergerakan</strong></h1>

                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="card-title">Pergerakan</h5>
                                {role === 'ormawa' && (
                                    <button className="btn btn-primary mt-2" onClick={handleShowModal} data-bs-toggle="modal" data-bs-target="#addPergerakanModal">
                                        <i className="align-middle" data-feather="plus"></i> <span className="align-middle">Tambah Pergerakan</span>
                                    </button>
                                )}
                                {/* Add your Tambah Pergerakan modal component here */}
                                {/* {role === 'ormawa' && <TambahPergerakanModal showModal={showModal} setShowModal={setShowModal} fetchPergerakan={fetchPergerakan}/>} */}
                            </div>
                            <div className="card-body">
                                {isLoading && (
                                    <div className="text-center justify-center">
                                    Loading ...
                                    </div>
                                )}
                                <div className="table-responsive">
                                    <table className="table datatable table-striped">
                                      {isLoading ? null : (
                                        <thead>
                                            <tr>
                                                <th>No.</th>
                                                <th>Nama Proker</th>
                                                <th>Nama Pergerakan</th>
                                                <th>Deskripsi Pergerakan</th>
                                                {/* <th>Action</th> */}
                                            </tr>
                                        </thead>
                                      )}
                                        <tbody>
                                            {pergerakan.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {role === 'admin' ? (
                                                            item.status === 'Acc tahap akhir' ? 'Proker selesai diproses' :
                                                            item.status === 'Diajukan' ||
                                                            item.status === 'Submit proposal' ||
                                                            item.status === 'Revisi tahap 1' ||
                                                            item.status === 'Tolak tahap 1' ?
                                                            'Belum di acc oleh Sekumbem' :
                                                            (item.id_proker === 0 || !item.proker ? "No Proker" : item.proker.nama_kegiatan)
                                                        ) : (
                                                            role === 'sekumbem' && item.status === 'Unggah proposal' && 
                                                            (item.id_proker === 0 || !item.proker ? "No Proker" : item.proker.nama_kegiatan)
                                                        )}
                                                    </td>

                                                    <td>{item.nama_pergerakan}</td>
                                                    <td>{item.deskripsi_pergerakan}</td>
                                                    <td>
                                                      {role === 'ormawa' && (
                                                          <>
                                                              <button className="btn btn-sm btn-primary me-2" onClick={() => handleUpdate(item.id_pergerakan)} data-bs-toggle="modal" data-bs-target="#editPergerakanModal">
                                                                  Update
                                                              </button>
                                                              {/* <EditPergerakanModal showEditModal={showEditModal} setShowEditModal={setShowEditModal} selectedItemId={selectedItemId} fetchPergerakan={fetchPergerakan}/> */}
                                                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id_pergerakan)}>
                                                                  Delete
                                                              </button>
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

export default PergerakanAdmin;