import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const EditPengajuanSarprasModal = ({ showModal, setShowModal, data }) => {
    const modalRef = useRef();

    const [formData, setFormData] = useState({
      id: '',
      nama_kegiatan: '',
      tanggal: '',
      sarpras: '',
      inventaris: [],
      surat: null,
    });
    const [saranaPrasaranaList, setSaranaPrasaranaList] = useState([]);
    const [selectedSarana, setSelectedSarana] = useState('');
    const [selectedInventaris, setSelectedInventaris] = useState([]);
    const [inventarisList, setInventarisList] = useState([]);
    const [detailPeminjaman, setDetailPeminjaman] = useState({});
    const [waktuMulai, setWaktuMulai] = useState('');
    const [waktuSelesai, setWaktuSelesai] = useState('');
    const [existingFile, setExistingFile] = useState('');
    const [file, setFile] = useState('');

    useEffect(() => {
      // Inisialisasi formData saat nilai data berubah
      const fetchData = async () => {
        if (data) {
          setFormData({
            id: data.get('id'),
            nama_kegiatan: data.get('nama_kegiatan'),
            tanggal: data.get('tanggal'),
            sarpras: data.get('sarpras'),
            inventaris: data.get('inventaris'),
            surat: data.get('surat'),
          });
          setSelectedSarana(data.get('sarpras'));
          setInventarisList([])
          setWaktuMulai('');
          setWaktuSelesai('');
          setExistingFile('Surat Peminjaman - ' + data.get('nama_kegiatan') + '.pdf' );
  
          try {
            const response = await axios.get(`http://localhost:8000/api/detail-peminjaman/peminjaman/${data.get('id')}`);
            setDetailPeminjaman(response.data)
            setWaktuMulai(response.data[0].waktu_mulai);
            setWaktuSelesai(response.data[0].waktu_selesai);
          } catch (error) {
            console.error(error);
          }

        }
      };
  
      fetchData();
    }, [data]);
    
    useEffect(() => {
      axios.get('/api/sarpras/tersedia/show')
      .then(response => {
        // Set daftar sarana prasarana ke state
        setSaranaPrasaranaList(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }, []);
  
    const handleSaranaChange = (event) => {
      // Update state saat sarana prasarana dipilih
      setSelectedSarana(event.target.value);
    };

    useEffect(() => {
      // Ambil daftar inventaris berdasarkan sarana prasarana yang dipilih dari API
      if (selectedSarana) {
        // Gantilah URL sesuai dengan endpoint API Anda
        axios.get(`/api/inventaris/sarpras/${selectedSarana}`)
          .then(response => {
            // Set daftar inventaris ke state
            setInventarisList(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }, [selectedSarana]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
    
      if (name === 'waktuMulai') {
        setWaktuMulai(value);
      } else if (name === 'waktuSelesai') {
        setWaktuSelesai(value);
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
      
      // Mendapatkan daftar inventaris yang dipilih
      const selectInventaris = inventarisList.filter(inventaris => {
        const checkboxId = `inventaris-${inventaris.id_inventaris}`;
        const checkbox = document.getElementById(checkboxId);
        return checkbox.checked;
      });

      setSelectedInventaris(selectInventaris)
    };      
    
    const handleFileChange = (e) => {
      const fileUpload = e.target.files[0];
      setExistingFile(fileUpload.name);
      setFile(fileUpload);
    };
    
    const handleSubmit = async () => {
      try {

        // Kumpulkan data formulir yang akan dikirim
        const formDataToSend = {
          id_peminjaman: parseInt(formData.id, 10),
          id_sarpras: parseInt(selectedSarana, 10),
          id_inventaris: selectedInventaris.map(item => item.id_inventaris),
          waktu_mulai: waktuMulai,
          waktu_selesai: waktuSelesai,
          surat_peminjaman: file 
        };

        console.log(formDataToSend)
       
        const deleteResponese = await axios.delete(`http://localhost:8000/api/detail-peminjaman/peminjaman/${formDataToSend.id_peminjaman}`)
        console.log("yang dihapus : ", deleteResponese)

        // Memasukkan data sarpras
        const formDataSarpras = new FormData();
        formDataSarpras.append('id_peminjaman', formDataToSend.id_peminjaman);
        formDataSarpras.append('id_sarpras', formDataToSend.id_sarpras);
        formDataSarpras.append('waktu_mulai', formDataToSend.waktu_mulai);
        formDataSarpras.append('waktu_selesai', formDataToSend.waktu_selesai);
  
        axios.post('http://localhost:8000/api/detail-peminjaman/', formDataSarpras, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          console.log("data sarpras : ", response);
        })
        .catch(error => {
          console.error("Error:", error);
        });

        // Masukkan data inventaris
        for (const inventarisId of formDataToSend.id_inventaris) {
          const formDataInventaris = new FormData(); // Memasukkan data inventaris
          formDataInventaris.append('id_peminjaman', formDataToSend.id_peminjaman);
          formDataInventaris.append('id_inventaris', inventarisId);
          formDataInventaris.append('waktu_mulai', formDataToSend.waktu_mulai);
          formDataInventaris.append('waktu_selesai', formDataToSend.waktu_selesai);
        
          formDataInventaris.forEach((value, key) => {
            console.log("data inventaris : ", key, value);
          });
    
          axios.post('http://localhost:8000/api/detail-peminjaman/', formDataInventaris, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error("Error:", error);
          });
  
        }

        // Memasukkan data file
        const formDataFile = new FormData();
        formDataFile.append('surat_peminjaman', file);

        console.log("File name:", formDataFile.get('surat_peminjaman').name);
        console.log("File type:", formDataFile.get('surat_peminjaman').type);    

        axios.post(`http://localhost:8000/api/peminjaman/${formDataToSend.id_peminjaman}`, formDataFile, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          console.log("data file : ", response);
          window.location.reload();
        })
        .catch(error => {
          console.error("Error:", error);
        });
   
        // Tampilkan pesan keberhasilan
        //setSubmitMessage('Pengajuan berhasil disimpan!');
        
        // Lakukan hal lain jika diperlukan, seperti memperbarui status komponen atau menutup modal
      } catch (error) {
        // Tangkap dan tampilkan pesan kesalahan
        console.error(error);
        //setSubmitMessage('Gagal menyimpan pengajuan. Silakan coba lagi.');
      }
    };
        
  
    return (
      <div className={`modal fade ${showModal ? 'show' : ''}`} id="editPengajuanSarprasModal" tabIndex="-1" aria-labelledby="editKAKModalLabel" aria-hidden={!showModal}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editKAKModalLabel">Edit Pengajuan</h5>
              <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form action="/edit-pengajuan" method="post">
                <div>
                  <input type="hidden" name="id" value=""/>
                <div className="mb-3">
                  <label htmlFor="kegiatan" className="form-label">Nama Kegiatan</label>
                  <input type="text" className="form-control" name="nama_kegiatan" placeholder="Nama Kegiatan" value={formData.nama_kegiatan} disabled/>
                </div>
                <div className="mb-3">
                  <label htmlFor="tanggal" className="form-label">Tanggal Kegiatan</label>
                  <input type="date" className="form-control" name="tanggal" placeholder="Tanggal" value={formData.tanggal} disabled/>
                </div>
                <div className="mb-3">
                  <label htmlFor="sarpras" className="form-label">Tempat Kegiatan</label>                
                  <select id="saranaPrasarana" className="form-control" onChange={handleSaranaChange} value={selectedSarana}>
                  <option value="">Pilih Sarana Prasarana</option>
                  {saranaPrasaranaList.map(sarana => (
                  <option key={sarana.id_sarpras} value={sarana.id_sarpras}>
                      {sarana.nama_sarpras}
                  </option>
                  ))}
                  </select>
                </div>
                <div className="mb-3">
                <label htmlFor="inventaris" className="form-label">Inventaris Tersedia</label>   
                {inventarisList.map(inventaris => (
                  <div key={inventaris.id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`inventaris-${inventaris.id_inventaris}`}
                      name="inventaris"
                      value={inventaris.id_inventaris}
                      // checked={selectedInventaris.includes(inventaris.id_inventaris)}
                       onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor={`inventaris-${inventaris.id_inventaris}`}>
                      {inventaris.nama_inventaris} ({inventaris.ketersediaan} buah tersedia)
                    </label>
                  </div>
                ))}
                </div>
                <div className="mb-3">
                  <label htmlFor="waktuMulai" className="form-label">Waktu Mulai:</label>
                  <input type="time" id="waktuMulai" className="form-control" value={waktuMulai} onChange={(e) => setWaktuMulai(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label htmlFor="waktuSelesai" className="form-label">Waktu Selesai:</label>
                  <input type="time" id="waktuSelesai" className="form-control" value={waktuSelesai} onChange={(e) => setWaktuSelesai(e.target.value)} />
                </div>
                
                <div className="mb-3">
                <label htmlFor="suratPeminjaman" className="form-label">Surat Pengajuan Peminjaman</label>
                <input
                    type="file"
                    className="form-control"
                    id="suratPeminjaman"
                    name="suratPeminjaman"
                    onChange={handleFileChange}
                /> 
                {existingFile && <div class="mt-3"><i class="bi bi-file-earmark-pdf"> {existingFile} </i></div> }
                </div>
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
  
  export default EditPengajuanSarprasModal;