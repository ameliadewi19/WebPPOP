import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const EditKalenderAkademikModal = ({ showEditModal, setShowEditModal, selectedItemId, fetchKalenderAkademik }) => {
    const [formData, setFormData] = useState({ tanggal_mulai: '', tanggal_selesai: '', nama_kegiatan: '' });
    const modalRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/academic-events/${selectedItemId}`);
                const data = response.data;
                console.log(data);
                setFormData({
                    tanggal_mulai: data.tanggal_mulai,
                    tanggal_selesai: data.tanggal_selesai,
                    nama_kegiatan: data.nama_kegiatan,
                });
            } catch (error) {
                console.error(`Error fetching Kalender Akademik with id ${selectedItemId}:`, error);
            }
        };

        if (showEditModal && selectedItemId) {
            fetchData();
        }
    }, [showEditModal, selectedItemId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleClose = () => {
        setShowEditModal(false);
        const testData = async () => {
            try {
                const response = await axios.get(`/api/academic-events/${selectedItemId}`);
                const data = response.data;
                console.log(data);
                setFormData({
                    tanggal_mulai: data.tanggal_mulai,
                    tanggal_selesai: data.tanggal_selesai,
                    nama_kegiatan: data.nama_kegiatan,
                });
            } catch (error) {
                console.error(`Error fetching Kalender Akademik with id ${selectedItemId}:`, error);
            }
        };
        testData();
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = {
                tanggal_mulai: formData.tanggal_mulai,
                tanggal_selesai: formData.tanggal_selesai,
                nama_kegiatan: formData.nama_kegiatan,
            };

            // Send a PUT request to your API endpoint
            const response = await axios.put(`/api/academic-events/${selectedItemId}`, formDataToSend);

            // Handle the response, e.g., edit state or show a success message
            console.log('Kalender Akademik updated successfully:', response.data);

            // Reset the form values
            setFormData({
                tanggal_mulai: '',
                tanggal_selesai: '',
                nama_kegiatan: '',
            });

            // Close the modal or perform any other necessary actions
            modalRef.current.click();

            fetchKalenderAkademik();
        } catch (error) {
            // Handle errors, e.g., show an error message
            console.error(`Error updating Kalender Akademik with id ${selectedItemId}:`, error);
        }
    };

    return (
        <div className={`modal fade ${showEditModal ? 'show' : ''}`} id="editKalenderAkademikModal" tabIndex="-1" aria-labelledby="editKalenderAkademikModalLabel" aria-hidden={!showEditModal}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editKalenderAkademikModalLabel">Edit Kalender Akademik</h5>
                        <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="tanggal_mulai" className="form-label">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="tanggal_mulai"
                                    name="tanggal_mulai"
                                    value={formData.tanggal_mulai}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tanggal_selesai" className="form-label">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="tanggal_selesai"
                                    name="tanggal_selesai"
                                    value={formData.tanggal_selesai}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="nama_kegiatan" className="form-label">Nama Kegiatan</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nama_kegiatan"
                                    name="nama_kegiatan"
                                    placeholder="Nama Kegiatan"
                                    value={formData.nama_kegiatan}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>Tutup</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditKalenderAkademikModal;