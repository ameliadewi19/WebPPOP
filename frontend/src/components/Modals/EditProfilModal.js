import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditProfilModal = ({ showModal, setShowModal, reloadData, userId }) => {
  const [formData, setFormData] = useState({ nama: '', username: '', email: '' });
  const modalRef = useRef();
  console.log("user id:", userId);

  // Fetch user profile data when the component mounts
  useEffect(() => {
    if (userId) {
      console.log("tes");
      axios.get(`/api/auth/user-profile/${userId}`)
        .then(response => {
          const fetchedData = response.data;
          // Update the formData state with the fetched data
          setFormData({
            nama: fetchedData.nama,
            username: fetchedData.username,
            email: fetchedData.email,
          });
        })
        .catch(error => {
          console.error('Error fetching user profile data:', error);
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

    axios.put(`/api/auth/ubah-profil/${userId}`, {
      nama: formData.nama,
      username: formData.username,
      email: formData.email,
    }, {
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
        console.error('Error updating user profile:', error);
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
    <div className={`modal fade`} id="editProfilModal" tabIndex="-1" aria-labelledby="editProfilModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editProfilModalLabel">Edit Profil</h5>
            <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="nama" className="form-label text-left">Nama</label>
                <input
                  type="text"
                  className="form-control"
                  id="nama"
                  name="nama"
                  placeholder="Nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
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

export default EditProfilModal;
