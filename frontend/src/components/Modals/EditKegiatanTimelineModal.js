import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const EditKegiatanTimelineModal = ({ showModal, setShowModal, reloadData, timelineId }) => {
  const [formData, setFormData] = useState({
    nama_kegiatan: '',
    tanggal_mulai: '',
    tanggal_selesai: ''
  });
  const [loading, setLoading] = useState(true);
  const modalRef = useRef();

  // console.log(timelineId);

  useEffect(() => {

    console.log(timelineId);
    // Fetch data based on timelineId when showModal becomes true
    if (showModal && timelineId) {
      axios.get(`/api/timeline/${timelineId}`)
        .then((response) => {
          const fetchedData = response.data; // Adjust this based on your API response structure
          setFormData({
            nama_kegiatan: fetchedData.nama_kegiatan,
            tanggal_mulai: fetchedData.tanggal_mulai,
            tanggal_selesai: fetchedData.tanggal_selesai,
          });
          setLoading(false); // Update loading state after successful fetch
          console.log(fetchedData);
        })
        .catch((error) => {
          console.error('Error fetching timeline data:', error);
        });
    }
  }, [showModal, timelineId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/timeline', {
      nama_kegiatan: formData.nama_kegiatan,
      tanggal_mulai: formData.tanggal_mulai,
      tanggal_selesai: formData.tanggal_selesai,
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
    <div className={`modal fade ${showModal ? 'show' : ''}`} id="editUploadKAKModal" tabIndex="-1" aria-labelledby="editUploadKAKModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editUploadKAKModalLabel">Edit Timeline</h5>
            <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <form>
                <div className="mb-3">
                  <label htmlFor="namaKegiatan" className="form-label">Nama Kegiatan</label>
                  <input
                    type="text"
                    className="form-control"
                    id="namaKegiatan"
                    name="nama_kegiatan"
                    placeholder="Nama kegiatan"
                    value={formData.nama_kegiatan}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tanggal_mulai" className="form-label">Tanggal Mulai</label>
                  <input
                    type="date"
                    className="form-control"
                    id="tanggal_mulai"
                    name="tanggal_mulai"
                    placeholder="Tanggal mulai"
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
                    placeholder="ORMAWA"
                    value={formData.tanggal_selesai}
                    onChange={handleInputChange}
                  />
                </div>
              </form>
            )}
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

export default EditKegiatanTimelineModal;
