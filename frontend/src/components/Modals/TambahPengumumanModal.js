import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const TambahPengumumanModal = ({ showModal, setShowModal, fetchPengumuman }) => {
    const [formData, setFormData] = useState({ slug: '', judul_konten: '', isi_konten: '', gambar: null, tanggal: '' });
    const modalRef = useRef();
    
    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        // If the input is a file, handle it differently
        const newValue = type === 'file' ? files[0] : value;
        
        setFormData({
          ...formData,
          [name]: newValue,
        });
    };
    
    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('slug', formData.slug);
            formDataToSend.append('judul_konten', formData.judul_konten);
            formDataToSend.append('isi_konten', formData.isi_konten);
            formDataToSend.append('gambar', formData.gambar);
            formDataToSend.append('tanggal', formData.tanggal);
    
            // Send a POST request to your API endpoint
            const response = await axios.post('/api/pengumuman', formDataToSend);
    
            // Handle the response, e.g., update state or show a success message
            console.log('Pengumuman added successfully:', response.data);
    
            // Close the modal or perform any other necessary actions
            modalRef.current.click();

            fetchPengumuman();
        } catch (error) {
            // Handle errors, e.g., show an error message
            console.error('Error adding pengumuman:', error);
        }
    };
    
    return (
      <div className={`modal fade ${showModal ? 'show' : ''}`} id="addPengumumanModal" tabIndex="-1" aria-labelledby="addPengumumanModalLabel" aria-hidden={!showModal}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addPengumumanModalLabel">Tambah Pengumuman</h5>
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
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Simpan</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default TambahPengumumanModal;
