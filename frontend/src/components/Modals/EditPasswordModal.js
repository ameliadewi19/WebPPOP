import React, { useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditPasswordModal = ({ showModal, setShowModal, reloadData, userId }) => {
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
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

    console.log(formData);

    axios.put(`/api/auth/ubah-password/${userId}`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response);
      // Display success message using SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Password berhasil diubah!',
        showConfirmButton: false,
        timer: 1500, // Close alert after 1.5 seconds
      });
      reloadData();
      modalRef.current.click();
    })
      .catch((error) => {
        console.error('Error updating password:', error);
        Swal.fire({
          icon: 'error',
          title: 'Password gagal diubah!',
          showConfirmButton: false,
          timer: 1500, // Close alert after 1.5 seconds
        });
      });
  };

  return (
    <div className={`modal fade`} id="editPasswordModal" tabIndex="-1" aria-labelledby="editPasswordModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editPasswordModalLabel">Edit Password</h5>
            <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="old_password" className="form-label">Old Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="old_password"
                  name="old_password"
                  placeholder="Old Password"
                  value={formData.old_password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="new_password" className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="new_password"
                  name="new_password"
                  placeholder="New Password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="new_password_confirmation" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  placeholder="Confirm New Password"
                  value={formData.new_password_confirmation}
                  onChange={handleInputChange}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPasswordModal;
