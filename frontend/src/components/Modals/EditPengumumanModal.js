import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const EditPengumumanModal = ({ showEditModal, setShowEditModal, selectedItemId, fetchPengumuman }) => {
    const [formData, setFormData] = useState({ slug: '', judul_konten: '', isi_konten: '', gambar: '', tanggal: '' });
    const modalRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/pengumuman/${selectedItemId}`);
                const data = response.data;

                setFormData({
                    slug: data.slug,
                    judul_konten: data.judul_konten,
                    isi_konten: data.isi_konten,
                    gambar: data.gambar,
                    tanggal: data.tanggal,
                });
            } catch (error) {
                console.error(`Error fetching pengumuman with id ${selectedItemId}:`, error);
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
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`/api/pengumuman/${selectedItemId}`, formData);

            console.log('Pengumuman updated successfully:', response.data);
            modalRef.current.click();
            fetchPengumuman();
        } catch (error) {
            console.error(`Error updating pengumuman with id ${selectedItemId}:`, error);
        }
    };

    return (
        <div className={`modal fade ${showEditModal ? 'show' : ''}`} id="editPengumumanModal" tabIndex="-1" aria-labelledby="editPengumumanModalLabel" aria-hidden={!showEditModal}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editPengumumanModalLabel">Edit Pengumuman</h5>
                        <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="slug" className="form-label">Slug</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="slug"
                                    name="slug"
                                    placeholder="Slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="judul_konten" className="form-label">Judul Konten</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="judul_konten"
                                    name="judul_konten"
                                    placeholder="Judul Konten"
                                    value={formData.judul_konten}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="isi_konten" className="form-label">Isi Konten</label>
                                <textarea
                                    className="form-control"
                                    id="isi_konten"
                                    name="isi_konten"
                                    placeholder="Isi Konten"
                                    value={formData.isi_konten}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="gambar" className="form-label">Gambar</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="gambar"
                                    name="gambar"
                                    placeholder="Gambar Path (sementara)"
                                    value={formData.gambar}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {/* <div className="mb-3">
                                <label htmlFor="gambar" className="form-label">Gambar</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="gambar"
                                    name="gambar"
                                    onChange={handleInputChange}
                                />
                            </div> */}
                            <div className="mb-3">
                                <label htmlFor="tanggal" className="form-label">Tanggal</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="tanggal"
                                    name="tanggal"
                                    value={formData.tanggal}
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

export default EditPengumumanModal;