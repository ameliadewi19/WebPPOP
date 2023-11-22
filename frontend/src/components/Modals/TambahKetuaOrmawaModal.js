import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const TambahKetuaOrmawaModal = ({ showModal, setShowModal, reloadData }) => {
  const [formData, setFormData] = useState({ nama_ormawa: '', pembina: '' });
  const modalRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/api/ormawa', {
      nama_ormawa: formData.nama_ormawa,
      pembina: formData.pembina, // add pembina to the request body
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Error submitting acc:', error);
      });

    modalRef.current.click();
    reloadData();
  };

  return (
    <div className={`modal fade`} id="addOrmawaModal" tabIndex="-1" aria-labelledby="addOrmawaModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addOrmawaModalLabel">Tambah Ormawa</h5>
            <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="namaOrmawa" className="form-label">Nama Ormawa</label>
                <input
                  type="text"
                  className="form-control"
                  id="namaOrmawa"
                  name="nama_ormawa"
                  placeholder="Nama ormawa"
                  value={formData.nama_ormawa}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="pembina" className="form-label">Pembina</label>
                <input
                  type="text"
                  className="form-control"
                  id="pembina"
                  name="pembina"
                  placeholder="Nama pembina"
                  value={formData.pembina}
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

export default TambahKetuaOrmawaModal;
