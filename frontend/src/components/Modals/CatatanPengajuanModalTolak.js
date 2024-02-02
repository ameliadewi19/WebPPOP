import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CatatanPengajuanModalTolak = ({ showModal, setShowModal, id, statusToChange }) => {
    const modalRef = useRef();
    const [catatan, setCatatan] = useState('');
    const [status, setStatus] = useState('');
    const [respon, setRespon] = useState(null)
  

    useEffect(() => {
      if (id && showModal == true) {
        // Gantilah URL sesuai dengan endpoint API Anda
        axios.get(`/api/peminjaman/${id}`)
          .then(response => {
            console.log("respon catatan : ", response)
            console.log("status mau diberi : ", statusToChange)
            setCatatan(response.data.catatan)
            setStatus(response.data.status_peminjaman)
          })
          .catch(error => {
            console.error(error);
          });
        console.log("status pertama : ", status)
      }
    }, [id, showModal]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
    
      if (name === 'catatan') {
        setCatatan(value);
      } 
    };      
    
    const handleSubmit = async () => {
      try {

        console.log("status saat ini before : ", status)
        console.log("status saat ini after : ", statusToChange)

        //Data formulir yang akan dikirim
        const formDataToSend = {
          catatan : catatan,
          status_peminjaman : statusToChange
        };

        const updateResponese = await axios.patch(
            `http://localhost:8000/api/peminjaman/${id}`, formDataToSend,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          console.log("update : ", updateResponese);
          setRespon(updateResponese)

        if (updateResponese) {
          // Menambahkan jeda waktu 2 detik untuk menunggu data diupdate
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Update Berhasil',
              text: 'Status peminjaman berhasil diperbarui!',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
            setRespon(null);
          }, 1000); // (1 detik)
        }
        
      } catch (error) {
        console.error(error);
      }

      setShowModal(false)
    };

    const handleTutup = async () => {
      setShowModal(false)
      setCatatan('')
    }        
  
    return (
      <div className={`modal fade ${showModal ? 'show' : ''}`} id="catatanPengajuanModalTolak" tabIndex="-1" aria-labelledby="editKAKModalLabel" aria-hidden={!showModal}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editKAKModalLabel">Masukkan Catatan</h5>
              <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form action="/edit-pengajuan" method="post">
                <div>
                <div className="mb-3">
                <span style={{ display: 'flex'}}>
                  <label htmlFor="status" className="form-label" style={{ marginRight: '10px' }}>
                    Status Diberikan :
                  </label>
                  <div style={{ color: 'red' }}>
                    <strong>{statusToChange}</strong>
                  </div>
                </span>
                  <label htmlFor="catatan" className="form-label" >Catatan : </label>
                  <textarea className="form-control" name="catatan" onChange={handleInputChange} value={catatan}/>
                </div>
                </div>
              </form>
  
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleTutup}>Tutup</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Simpan</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CatatanPengajuanModalTolak;