import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const UploadProposalModal = ({ reloadData, selectedProkerId }) => {
    const [formData, setFormData] = useState({ 
        nama_kegiatan: '',
        tanggal_mulai: '',
        tanggal_akhir: '', 
        file_proposal: null,
        file_rab: null,
        id_kak: '',
        ketua_pelaksana: '',
        deskripsi_kegiatan: '',
        catatan: '',
        izin_submit: '',
        jenis_kegiatan: '',
    });
    const modalRef = useRef();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchDataProker = async () => {
            try {
                const response = await axios.get(`/api/proker/${selectedProkerId}`);
                const data = response.data[0];
                setFormData({
                    ...formData,
                    nama_kegiatan: data.nama_kegiatan,
                    id_kak: data.id_kak,
                    ketua_pelaksana: data.ketua_pelaksana,
                    deskripsi_kegiatan: data.deskripsi_kegiatan,
                    catatan: data.catatan,
                    izin_submit: data.izin_submit,
                    jenis_kegiatan: data.jenis_kegiatan,
                })
                console.log("selectedProkerId upload", selectedProkerId);
            } catch (error) {
                console.error('Error fetching proker data:', error);
            }
        };
        fetchDataProker();
    }, [selectedProkerId]);

    const isDateDisabled = (date) => {
        const today = new Date();
        return date < today;
      };

    const handleInputChange = (e) => {
        const { name, value} = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileProposalChange = (e) => {
        const fileProposal = e.target.files[0];
        setFormData({ ...formData, file_proposal: fileProposal });
    };
    
    const handleFileRABChange = (e) => {
        const fileRAB = e.target.files[0];
        setFormData({ ...formData, file_rab: fileRAB });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formData", formData);
        const formDataToSend = new FormData();
        formDataToSend.append('nama_kegiatan', formData.nama_kegiatan);
        formDataToSend.append('tanggal_mulai', formData.tanggal_mulai);
        formDataToSend.append('tanggal_akhir', formData.tanggal_akhir);
        formDataToSend.append('file_proposal', formData.file_proposal);
        formDataToSend.append('file_rab', formData.file_rab);
        formDataToSend.append('status', 'Unggah proposal');
        try {

            // Send a POST request to your API endpoint
            const response = await axios.post(`/api/proker/${selectedProkerId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Pastikan untuk mengatur tipe konten
                },
            });

            // Handle the response, e.g., update state or show a success message
            console.log('Proposal uploaded successfully:', response.data);

            Swal.fire({
                icon: "success",
                title: "Proposal berhasil diupload",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                reloadData();
                navigate('/program-kerja');
            });

            // Reset the form values
            setFormData({
                nama_kegiatan: '',
                tanggal_mulai: '',
                tanggal_akhir: '', 
                file_proposal: null,
                file_rab: null
            });

            // Close the modal or perform any other necessary actions
            modalRef.current.click();
        } catch (error) {
            // Handle errors, e.g., show an error message
            console.error('Error uploading proposal:', error);
            Swal.fire({
                icon: "error",
                title: "Proposal gagal diupload",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const submit = (e) => {
        e.preventDefault();
    }

    return (
        <div className={`modal fade`} id="uploadProposalModal" tabIndex="-1" aria-labelledby="uploadProposalModalLabel" aria-hidden={!showModal}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="uploadProposalModalLabel">Pengajuan Proposal</h5>
                        <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={submit}>
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
                            <div className="mb-3 row">
                                <div className='col-md-6'>
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
                                <div className='col-md-6'>
                                    <label htmlFor="tanggal_akhir" className="form-label">Tanggal Akhir</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="tanggal_akhir"
                                        name="tanggal_akhir"
                                        value={formData.tanggal_akhir}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fileProposal" className="form-label">File Proposal</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="fileProposal"
                                    name="file_proposal"
                                    onChange={(e) => handleFileProposalChange(e)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fileRAB" className="form-label">File RAB</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="fileRAB"
                                    name="file_rab"
                                    onChange={(e) => handleFileRABChange(e)}
                                    required
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadProposalModal;
