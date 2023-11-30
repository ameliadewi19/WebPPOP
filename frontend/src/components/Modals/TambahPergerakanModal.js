import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';

const TambahPergerakanModal = ({ showModal, setShowModal, fetchPergerakan }) => {
    const [formData, setFormData] = useState({
        id_proker: '',
        id_kak: '',
        nama_pergerakan: '',
        deskripsi_pergerakan: '',
    });
    const [dataProker, setDataProker] = useState([]);
    const [idKetua, setIdKetua] = useState(null);
    const [idKak, setIdKak] = useState(null);
    const modalRef = useRef();

    useEffect(() => {
        const idUser = localStorage.getItem('idUser');
        fetchOrmawa(idUser);
        fetchDataProker();
    }, [idKetua, idKak]);

    const fetchOrmawa = async (id) => {
        await axios.get(`/api/auth/get-ketua/${id}`)
            .then((res) => {
                setIdKetua(res.data.data.id_ketua);
                console.log("id_ketua ", res.data.data.id_ketua);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const fetchDataProker = async () => {
        try {
            const response = await axios.get('/api/proker');
            const data = response.data.filter((proker) => proker.kak.id_ketua === idKetua);
            setDataProker(data);
            setIdKak(data[0].id_kak);
            console.log("id_kak ", data[0].id_kak);
            setFormData({
                ...formData,
                id_kak : idKak,
            })
        } catch (error) {
            console.error('Error fetching proker data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        
        console.log("formData", formData)
        try {
            const response = await axios.post('/api/pergerakan', formData);

            console.log('Pergerakan added successfully:', response.data);

            setFormData({
                id_proker: '',
                id_kak: '',
                nama_pergerakan: '',
                deskripsi_pergerakan: '',
            });
            Swal.fire({
                icon: "success",
                title: "Pergerakan berhasil ditambahkan",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                fetchPergerakan();
            });

            // Reset the form values
            setFormData({
                id_proker: '',
                nama_kegiatan: '',
                file_lpj: null,
            });

            modalRef.current.click();

            fetchPergerakan();
        } catch (error) {
            console.error('Error adding pergerakan:', error);
            Swal.fire({
                icon: "error",
                title: "Pergerakan gagal ditambahkan",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    return (
        <div className={`modal fade ${showModal ? 'show' : ''}`} id="addPergerakanModal" tabIndex="-1" aria-labelledby="addPergerakanModalLabel" aria-hidden={!showModal}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addPergerakanModalLabel">Tambah Pergerakan</h5>
                        <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="id_proker" className="form-label">Proker</label>
                                <select
                                    className="form-control"
                                    id="id_proker"
                                    name="id_proker"
                                    value={formData.id_proker}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Proker</option>
                                    {dataProker.map((proker) => (
                                        <option key={proker.id_proker} value={proker.id_proker}>{proker.nama_kegiatan}</option>
                                    ))}
                                    <option value="">lainnya</option>
                                </select>
                            </div>
                            {/* <div className="mb-3">
                                <label htmlFor="id_kak" className="form-label" disabled>Ketua Kegiatan</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="id_kak"
                                    name="id_kak"
                                    value={idKak}
                                    disabled
                                />
                            </div> */}
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
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TambahPergerakanModal;