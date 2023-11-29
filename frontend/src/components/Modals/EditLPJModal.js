import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EditLPJModal = ({ reloadData, selectedLpjId, selectedProkerId }) => {
    const [formData, setFormData] = useState({ 
        id_lpj: '',
        id_proker: '',
        nama_kegiatan: '',
        file_lpj: null,
        file_rab_lpj: null,
    });
    const modalRef = useRef();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [lpjId, setLpjId] = useState(null);
    const [prokerId, setProkerId] = useState(null);

    useEffect(() => {
        setLpjId(selectedLpjId);
        setProkerId(selectedProkerId);
    }, [selectedLpjId, selectedProkerId]);

    useEffect(() => {
        console.log("LpjId upload", lpjId);
        const fetchDataLpj = async () => {
            try {
                const response = await axios.get(`/api/lpj/${prokerId}`);
                const data = response.data[0];
                setFormData({
                    ...formData,
                    id_lpj: data.id_lpj,
                    id_proker: data.id_proker,
                })
                console.log("selectedLpjId upload", prokerId);
            } catch (error) {
                console.error('Error fetching proker data:', error);
            }
        };
        const fetchDataProker =  async () => {
            try {
                const response = await axios.get(`/api/proker/${prokerId}`);
                const data = response.data[0];
                setFormData({
                    ...formData,
                    nama_kegiatan: data.nama_kegiatan,
                })
                console.log("selectedProkerId upload", prokerId);
            } catch (error) {
                console.error('Error fetching proker data:', error);
            }
        };
        fetchDataProker();
        fetchDataLpj();
        console.log("formData: ", formData)
    }, [prokerId]);

    const handleInputChange = (e) => {
        const { name, value} = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileLPJChange = (e) => {
        const fileLpj = e.target.files[0];
        setFormData({ ...formData, file_lpj: fileLpj });
    };
    const handleFileRABChange = (e) => {
        const fileRabLpj = e.target.files[0];
        setFormData({ ...formData, file_rab_lpj: fileRabLpj });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formData", formData);
        const formDataToSend = new FormData();
        formDataToSend.append('id_proker', formData.id_proker);
        formDataToSend.append('file_lpj', formData.file_lpj);
        formDataToSend.append('file_rab_lpj', formData.file_rab_lpj);
        formDataToSend.append('status', 'Submit LPJ');
        formDataToSend.append('catatan', '');
        try {

            // Send a POST request to your API endpoint
            const response = await axios.post(`/api/lpj/${prokerId}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Pastikan untuk mengatur tipe konten
                },
            });

            // Handle the response, e.g., update state or show a success message
            console.log('LPJ uploaded successfully:', response.data);

            Swal.fire({
                icon: "success",
                title: "LPJ berhasil diubah",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                reloadData();
                navigate('/lpj');
            });

            // Reset the form values
            setFormData({
                id_proker: '',
                nama_kegiatan: '',
                file_lpj: null,
            });

            // Close the modal or perform any other necessary actions
            modalRef.current.click();
        } catch (error) {
            // Handle errors, e.g., show an error message
            console.error('Error uploading proposal:', error);
            Swal.fire({
                icon: "error",
                title: "LPJ gagal diubah",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };

    const submit = (e) => {
        e.preventDefault();
    }

    return (
        <div className={`modal fade`} id="editLPJModal" tabIndex="-1" aria-labelledby="editLPJModalLabel" aria-hidden={!showModal}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editLPJModalLabel">Update LPJ Program Kerja</h5>
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
                                    disabled
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fileLPJ" className="form-label">File LPJ</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="fileLPJ"
                                    name="file_lpj"
                                    onChange={(e) => handleFileLPJChange(e)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fileRabLPJ" className="form-label">File RAB</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="fileRABLPJ"
                                    name="file_rab_lpj"
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

export default EditLPJModal;
