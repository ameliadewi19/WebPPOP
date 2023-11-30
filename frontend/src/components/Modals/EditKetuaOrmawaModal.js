import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditKetuaOrmawaModal = ({ showModal, setShowModal, reloadData, userId }) => {
  const [formData, setFormData] = useState({
    nim_ketua: '',
    nama_ketua: '',
    tahun_jabatan: '',
    email_pengguna: '',
    id_pengguna: '',
    id_ormawa: '',
  });
  const modalRef = useRef();
  console.log("user id:", userId);

  // Fetch user profile data when the component mounts
  useEffect(() => {
    if (userId) {
      axios.get(`/api/ketua-ormawa/${userId}`)
        .then(response => {
          const fetchedData = response.data;
          console.log("fetched data:", fetchedData);
          // Update the formData state with the fetched data
          setFormData({
            nim_ketua: fetchedData.nim_ketua,
            nama_ketua: fetchedData.nama_ketua,
            tahun_jabatan: fetchedData.tahun_jabatan,
            email_pengguna: fetchedData.email_pengguna,
            id_pengguna: fetchedData.id_pengguna,
            id_ormawa: fetchedData.id_ormawa,
          });
        })
        .catch(error => {
          console.error('Error fetching ketua ormawa data:', error);
        });
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`/api/ketua-ormawa/${userId}`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log(response);

        Swal.fire({
          icon: 'success',
          title: 'Profil berhasil diubah!',
          showConfirmButton: false,
          timer: 1500, // Close alert after 1.5 seconds
        });

      })
      .catch((error) => {
        console.error('Error updating ketua ormawa profile:', error);
        Swal.fire({
          icon: 'error',
          title: 'Profil gagal diubah!',
          showConfirmButton: false,
          timer: 1500, // Close alert after 1.5 seconds
        });
      });

    modalRef.current.click();
    reloadData();
  };

  return (
    <div className={`modal fade`} id="editKetuaOrmawaModal" tabIndex="-1" aria-labelledby="editKetuaOrmawaModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editKetuaOrmawaModalLabel">Edit Profil Ketua Ormawa</h5>
            <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="nimKetua" className="form-label">NIM Ketua</label>
                <input
                  type="text"
                  className="form-control"
                  id="nimKetua"
                  name="nim_ketua"
                  placeholder="NIM Ketua"
                  value={formData.nim_ketua}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="namaKetua" className="form-label">Nama Ketua</label>
                <input
                  type="text"
                  className="form-control"
                  id="namaKetua"
                  name="nama_ketua"
                  placeholder="Nama Ketua"
                  value={formData.nama_ketua}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tahunJabatan" className="form-label">Tahun Jabatan</label>
                <input
                  type="text"
                  className="form-control"
                  id="tahunJabatan"
                  name="tahun_jabatan"
                  placeholder="Tahun Jabatan"
                  value={formData.tahun_jabatan}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="emailPengguna" className="form-label">Email Pengguna</label>
                <input
                  type="email"
                  className="form-control"
                  id="emailPengguna"
                  name="email_pengguna"
                  placeholder="Email Pengguna"
                  value={formData.email_pengguna}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="idPengguna" className="form-label">ID Pengguna</label>
                <input
                  type="text"
                  className="form-control"
                  id="idPengguna"
                  name="id_pengguna"
                  placeholder="ID Pengguna"
                  value={formData.id_pengguna}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="idOrmawa" className="form-label">ID Ormawa</label>
                <input
                  type="text"
                  className="form-control"
                  id="idOrmawa"
                  name="id_ormawa"
                  placeholder="ID Ormawa"
                  value={formData.id_ormawa}
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

export default EditKetuaOrmawaModal;