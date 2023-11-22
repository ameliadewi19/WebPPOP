import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import TambahPergerakanModal from '../components/Modals/TambahPergerakanModal.js';
import EditPergerakanModal from '../components/Modals/EditPergerakanModal.js';

const Pergerakan = () => {
    const [pergerakan, setPergerakan] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    useEffect(() => {
        fetchPergerakan();
    }, []);

    const fetchPergerakan = async () => {
        try {
            const res = await axios.get('/api/pergerakan');
            setPergerakan(res.data);
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
                                <button className="btn btn-primary mt-2" onClick={handleShowModal} data-bs-toggle="modal" data-bs-target="#addPergerakanModal">
                                    <i className="align-middle" data-feather="plus"></i> <span className="align-middle">Tambah Pergerakan</span>
                                </button>
                                {/* Add your Tambah Pergerakan modal component here */}
                                {/* <TambahPergerakanModal showModal={showModal} setShowModal={setShowModal} fetchPergerakan={fetchPergerakan}/> */}
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Index</th>
                                                <th>Nama Proker</th>
                                                <th>Nama Pergerakan</th>
                                                <th>Deskripsi Pergerakan</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pergerakan.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.nama_proker}</td>
                                                    <td>{item.nama_pergerakan}</td>
                                                    <td>{item.deskripsi_pergerakan}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-primary" onClick={() => handleUpdate(item.id_pergerakan)} data-bs-toggle="modal" data-bs-target="#editPergerakanModal">Update</button>
                                                        {/* <EditPergerakanModal showEditModal={showEditModal} setShowEditModal={setShowEditModal} selectedItemId={selectedItemId} fetchPergerakan={fetchPergerakan}/> */}
                                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id_pergerakan)}>Delete</button>
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

export default Pergerakan;