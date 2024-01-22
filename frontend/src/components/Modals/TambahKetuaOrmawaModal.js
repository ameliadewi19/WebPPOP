import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const TambahKetuaOrmawaModal = ({ showModal, setShowModal, reloadData }) => {
  const [formData, setFormData] = useState({
    nim_ketua: '',
    nama_ketua: '',
    tahun_jabatan: '',
    email_pengguna: '',
    id_pengguna: '',
    id_ormawa: '',
  });

  const [allUsers, setAllUsers] = useState([]);
  const [allOrmawas, setAllOrmawas] = useState([]);
  const modalRef = useRef();

  useEffect(() => {
    fetchAllUsers();
    fetchAllOrmawas();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/auth/get-ketua');
      console.log(response.data); // Log the response to check its structure
      setAllUsers(response.data.ormawa_users);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const fetchAllOrmawas = async () => {
    try {
      const response = await axios.get('/api/ormawa');
      console.log(response.data); // Log the response to check its structure
      setAllOrmawas(response.data);
    } catch (error) {
      console.error('Error fetching Ormawa data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/api/ketua-ormawa', formData, {
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
    <div className={`modal fade`} id="addAkunModal" tabIndex="-1" aria-labelledby="addAkunModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addAkunModalLabel">Tambah Ketua Ormawa</h5>
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
                <label htmlFor="emailKetua" className="form-label">Email Ketua</label>
                <input
                  type="text"
                  className="form-control"
                  id="emailKetua"
                  name="email_ketua"
                  placeholder="Email Ketua"
                  value={formData.email_ketua}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="idPengguna" className="form-label">
                  ID Pengguna
                </label>
                <select
                  className="form-select"
                  id="idPengguna"
                  name="id_pengguna"
                  value={formData.id_pengguna}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select Pengguna
                  </option>
                  {allUsers.map((user) => (
                    <option key={user.id_user} value={user.id_user}>
                      {user.nama}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="idOrmawa" className="form-label">ID Ormawa</label>
                <select
                  className="form-select"
                  id="idOrmawa"
                  name="id_ormawa"
                  value={formData.id_ormawa}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>
                    Select Ormawa
                  </option>
                  {allOrmawas.map((ormawa) => (
                    <option key={ormawa.id_ormawa} value={ormawa.id_ormawa}>
                      {ormawa.nama_ormawa}
                    </option>
                  ))}
                </select>
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
