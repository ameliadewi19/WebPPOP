import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';

const EditPergerakanModal = ({ showEditModal, setShowEditModal, selectedItemId, fetchPergerakan, idPergerakan }) => {
    const [formData, setFormData] = useState({
        id_proker: '',
        id_kak: '',
        nama_pergerakan: '',
        deskripsi_pergerakan: '',
    });
    const [dataProker, setDataProker] = useState([]);
    const [idKetua, setIdKetua] = useState(null);
    const [idKak, setIdKak] = useState(null);
    const [kakID, setKakID] = useState(null);
    const modalRef = useRef();

    useEffect(() => {
        console.log("id pergerakan: ", idPergerakan);
        const idUser = localStorage.getItem('idUser');
    
        const fetchData = async () => {
            try {
                // Fetch pergerakan data
                const responsePergerakan = await axios.get(`/api/pergerakan/${idPergerakan}`);
                const pergerakanData = responsePergerakan.data;
    
                if (Array.isArray(pergerakanData) && pergerakanData.length > 0) {
                    // If pergerakanData is an array, take the first item
                    const firstItem = pergerakanData[0];
    
                    // Populate the form fields with existing data
                    setFormData({
                        id_proker: firstItem.id_proker,
                        id_kak: firstItem.id_kak,
                        nama_pergerakan: firstItem.nama_pergerakan,
                        deskripsi_pergerakan: firstItem.deskripsi_pergerakan,
                    });

                    console.log("data pergerakan: ", pergerakanData);
                } else {
                    console.error(`Invalid pergerakan data for id ${selectedItemId}`);
                }

                console.log("id pergerakan: ", idPergerakan);
                

                const idUser = localStorage.getItem('idUser');
                fetchOrmawa(idUser);
                fetchDataProker();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [idPergerakan, selectedItemId]);    

    const fetchOrmawa = (id) => {
        console.log("idUser fetchormawa:", id);
        axios.get(`/api/auth/get-ketua/${id}`)
            .then((res) => {
                setIdKetua(res.data.data.id_ketua);
                setKakID(res.data.data.kak.id_kak);
                console.log("id_kak", res.data.data.kak.id_kak);
            })
            .catch((err) => {
                console.log(err);
            });
        
        console.log("idKetua ormawa:", idKetua);
        }

        const fetchDataProker = async () => {
            try {
                const response = await axios.get('/api/proker');
                const data = response.data;
        
                console.log("data proker: ", data);
                if (data.length > 0) {
                    setDataProker(data);
                    setIdKak(data[0].id_kak);
                } else {
                    console.error('No matching proker data found.');
                }
            } catch (error) {
                console.error('Error fetching proker data:', error);
            }
        };
        
        

    const fetchPergerakanData = async () => {
        if (selectedItemId) {
            try {
                const response = await axios.get(`/api/pergerakan/${selectedItemId}`);
                const pergerakanData = response.data;

                // Populate the form fields with existing data
                setFormData({
                    id_proker: pergerakanData.id_proker,
                    id_kak: pergerakanData.id_kak,
                    nama_pergerakan: pergerakanData.nama_pergerakan,
                    deskripsi_pergerakan: pergerakanData.deskripsi_pergerakan,
                });
            } catch (error) {
                console.error(`Error fetching pergerakan data for id ${selectedItemId}:`, error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        setFormData({
            ...formData,
            [name]: name === 'id_proker' && value === ' ' ? 0 : value,
        });
    }

    const handleSubmit = async () => {
        try {
            await axios.put(`/api/pergerakan/${selectedItemId}`, formData);

            Swal.fire({
                icon: "success",
                title: "Pergerakan berhasil diupdate",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                fetchPergerakan();
            });

            modalRef.current.click();

            fetchPergerakan();
        } catch (error) {
            console.error('Error updating pergerakan:', error);
            Swal.fire({
                icon: "error",
                title: "Pergerakan gagal diupdate",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <div className={`modal fade`} id="editPergerakanModal" tabIndex="-1" aria-labelledby="editPergerakanModalLabel" aria-hidden={!showEditModal}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editPergerakanModalLabel">Edit Pergerakan</h5>
                        <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                        <div className="mb-3">
                                <label htmlFor="id_proker" className="form-label">Proker</label>
                                {
                                    formData.id_proker
                                }
                                <select
                                    className="form-control"
                                    id="id_proker"
                                    name="id_proker"
                                    value={formData.id_proker}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Proker</option>
                                    {dataProker.map((proker) => (
                                        <option
                                            key={proker.id_proker}
                                            value={proker.id_proker}
                                            selected={proker.id_proker === formData.id_proker}
                                        >
                                            {proker.nama_kegiatan}
                                        </option>
                                    ))}
                                    <option value="0" selected={formData.id_proker === '0'}>lainnya</option>
                                </select>

                            </div>
                            <div className="mb-3">
                                <label htmlFor="nama_pergerakan" className="form-label">Nama Pergerakan</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nama_pergerakan"
                                    name="nama_pergerakan"
                                    placeholder="Nama Pergerakan"
                                    value={formData.nama_pergerakan}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="deskripsi_pergerakan" className="form-label">Deskripsi Pergerakan</label>
                                <textarea
                                    className="form-control"
                                    id="deskripsi_pergerakan"
                                    name="deskripsi_pergerakan"
                                    placeholder="Deskripsi Pergerakan"
                                    value={formData.deskripsi_pergerakan}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowEditModal(false)}>Tutup</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPergerakanModal;