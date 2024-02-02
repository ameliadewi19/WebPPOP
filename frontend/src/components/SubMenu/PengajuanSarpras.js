import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';

const PengajuanSarpras = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prokerData = location.state?.prokerData || null;
  const ketuaData = location.state?.ketuaData || null;
  const id_ormawa = ketuaData.data.id_ormawa;
  const [ormawaData, setOrmawaData] = useState(null);
  const [saranaPrasaranaList, setSaranaPrasaranaList] = useState([]);
  const [selectedSarana, setSelectedSarana] = useState('');
  const [inventarisList, setInventarisList] = useState([]);;
  const [waktuMulai, setWaktuMulai] = useState('');
  const [waktuSelesai, setWaktuSelesai] = useState('');
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    feather.replace(); // Replace the icons after component mounts

    // Mengambil data Proker dari API
    axios.get(`/api/ormawa/${id_ormawa}`)
        .then(response => {
            setOrmawaData(response.data);
        })
        .catch(error => {
            console.error(error);
        });
  }, []);

  console.log("nama ormawa : ",ormawaData?.nama_ormawa);

  const [prokerCollection, setProkerCollection] = useState({});

  useEffect(() => {
    // Ambil daftar proker dengan tanggal yang sama
    axios.get(`/api/proker/tanggal/${prokerData.tanggal_mulai}`)
      .then(response => {
        console.log("proker dengan tanggal", prokerData.tanggal_mulai, response);
        setProkerCollection(response);
      })
      .catch(error => {
        console.error(error);
      });
  }, [prokerData.tanggal_mulai]);
  
  const [peminjamanCollection, setPeminjamanCollection] = useState({});

  useEffect(() => {
    console.log("hasil proker : ", prokerCollection);
  
    if (prokerCollection && prokerCollection.data) {
      prokerCollection.data.forEach((proker) => {
        console.log("id_proker:", proker.id_proker);
  
        // Ambil daftar peminjaman dengan id proker yang didapat
        axios.get(`/api/peminjaman/acc/${proker.id_proker}`)
          .then(response => {
            console.log("peminjaman : ", response.data);
  
            // Pastikan response.data adalah array dan tidak kosong
            if (Array.isArray(response.data) && response.data.length > 0) {
              // Menggunakan map untuk mengakses setiap elemen dalam array
              response.data.map((peminjaman) => {
                console.log("id peminjaman : ", peminjaman.id_peminjaman);
  
                // Update state peminjamanCollection dengan respons yang diterima
                setPeminjamanCollection((prevCollection) => ({
                  ...prevCollection,
                  [peminjaman.id_peminjaman]: peminjaman,
                }));
  
                return null;
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      });
    }
    //console.log("hasil peminjaman : ", peminjamanCollection)
  }, [prokerCollection, setPeminjamanCollection]);
  
  const [sarprasCollection, setSarprasCollection] = useState([]);

  useEffect(() => {
    let idSarprasAcc = [];
    let idSarprasList = [];
  
    if (peminjamanCollection) {
      const peminjamanList = Object.keys(peminjamanCollection);
      const promises = [];
  
      peminjamanList.forEach((id_peminjaman) => {
        const promise = axios.get(`/api/detail-peminjaman/sarpras/${id_peminjaman}`)
          .then(response => {
            console.log("sarpras di acc : ", response.data[0].id_sarpras);
            return response.data[0].id_sarpras;
          })
          .catch(error => {
            console.error(error);
            return null;
          });
  
        promises.push(promise);
      });
  
      Promise.all(promises)
        .then(values => {
          idSarprasList = values;
  
          const sarprasAccPromises = axios.get(`/api/sarpras/notInSarpras/${idSarprasList.join(',')}`)
            .then(response => {
              console.log("sarpras yang tidak diacc :", response.data);
              return response.data;
            })
            .catch(error => {
              console.error(error);
              return null;
            });
  
          return sarprasAccPromises;
        })
        .then(values => {
          console.log("Values from /api/sarpras/notInSarpras:", values);
          const sarprasDetailsPromises = values.map(id =>
            axios.get(`/api/sarpras/${id.id_sarpras}`)
              .then(response => response.data)
              .catch(error => {
                console.error(error);
                return null;
              })
          );
  
          return Promise.all(sarprasDetailsPromises);
        })
        .then(listSarpras => {
          console.log("sarpras tersedia : ", listSarpras);
          setSaranaPrasaranaList(prevList => {
            console.log("list sarpras tersedia : ", prevList);
            return listSarpras;
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [peminjamanCollection]);
  

  useEffect(() => {
    // This useEffect monitors changes in listSarpras
    console.log("LIST SARPRAS TERSEDIA : ", saranaPrasaranaList);
  }, [saranaPrasaranaList]);
  

  useEffect(() => {
    // Ambil daftar inventaris berdasarkan sarana prasarana yang dipilih dari API
    if (selectedSarana) {
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

  const getSaranaById = (saranaId) => {
    return saranaPrasaranaList.find(sarana => sarana.id_sarpras == saranaId) || {};
  };  


  const handleSaranaChange = (event) => {
    // Update state saat sarana prasarana dipilih
    setSelectedSarana(event.target.value);
  };

  if (!prokerData) {
    // Tangani jika prokerData null (misalnya, pengguna mencoba mengakses langsung)
    return <div>Data Proker tidak tersedia.</div>;
  }

  //const { setFormData } = FormProvider();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mendapatkan daftar inventaris yang dipilih
    const selectedInventaris = inventarisList.filter(inventaris => {
        const checkboxId = `inventaris-${inventaris.id_inventaris}`;
        const checkbox = document.getElementById(checkboxId);
        return checkbox.checked;
    });

    // Simpan data formulir ke localStorage
    const formData = {
        prokerData,
        ormawaData,
        saranaPrasaranaList,
        selectedSarana,
        selectedInventarisIds: selectedInventaris.map(inventaris => inventaris.id_inventaris),
        inventarisList,
        // pembina,
        // ketuaPelaksana,
        waktuMulai,
        waktuSelesai,
      };
    
      localStorage.setItem('formData', JSON.stringify(formData));

    //console.log('Form submitted:', prokerData, selectedSarana, inventarisList);
    navigate('/review-pengajuan');
  };

  return (
    <main className="content">
      <div className="container-fluid p-0">
        <h1 className="h3 mb-3">Peminjaman <strong>Sarana Prasarana</strong></h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="namaKegiatan" className="form-label">Nama Kegiatan :</label>
            <input type="text" id="namaKegiatan" className="form-control" value={prokerData?.nama_kegiatan || ''} readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="pelaksanaKegiatan" className="form-label">Ormawa Pelaksana :</label>
            <input type="text" id="pelaksanaKegiatan" className="form-control" value={ormawaData?.nama_ormawa || ''} readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="pembina" className="form-label">Pembina:</label>
            <input type="text" id="pembina" className="form-control" value={ormawaData?.pembina || ''} readOnly/>
          </div>

          <div className="mb-3">
            <label htmlFor="ketuaPelaksana" className="form-label">Ketua Pelaksana:</label>
            <input type="text" id="ketuaPelaksana" className="form-control" value={prokerData?.ketua_pelaksana || ''} readOnly />
          </div>

          <div className="mb-3">
            <label htmlFor="tanggalMulai" className="form-label">Tanggal Pelaksanaan :</label>
            <input type="date" id="tanggalMulai" className="form-control" value={prokerData?.tanggal_mulai || ''} readOnly />
          </div>

          <div className="mb-3">
            <label htmlFor="waktuMulai" className="form-label">Waktu Mulai:</label>
            <input type="time" id="waktuMulai" className="form-control" value={waktuMulai} onChange={(e) => setWaktuMulai(e.target.value)} />
          </div>

          <div className="mb-3">
            <label htmlFor="waktuSelesai" className="form-label">Waktu Selesai:</label>
            <input type="time" id="waktuSelesai" className="form-control" value={waktuSelesai} onChange={(e) => setWaktuSelesai(e.target.value)} />
          </div>

          {saranaPrasaranaList.length > 0 ? (
          <div className="mb-3">
            <label htmlFor="saranaPrasarana" className="form-label">Sarana Prasarana :</label>
            <select id="saranaPrasarana" className="form-control" onChange={handleSaranaChange} value={selectedSarana}>
              <option value="">Pilih Sarana Prasarana</option>
              {saranaPrasaranaList.map(sarana => (
                <option key={sarana.id_sarpras} value={sarana.id_sarpras}>
                  {sarana.nama_sarpras}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p style={{ color: 'gray', marginTop: '5px' }}>Mengambil Sarana Prasarana Tersedia ...</p>
        )}
        
            {/* Section to display selected Sarana Prasarana details */}
            {selectedSarana && (
            <div className="mb-3">
                <div className="d-flex align-items-center">
                <img
                    src={getSaranaById(selectedSarana)?.link_gambar}
                    alt={getSaranaById(selectedSarana)?.nama_sarpras}
                    className="img-fluid mr-3"
                    style={{ width: '300px', height: '200px', objectFit: 'cover' }}
                />
                <div>
                    <h5>&nbsp;&nbsp;</h5>
                </div>
                <div>
                    <h5>{getSaranaById(selectedSarana)?.nama_sarpras}</h5>
                    <p>Deskripsi: {getSaranaById(selectedSarana)?.deskripsi}</p>
                    <p>Daya Tampung: {getSaranaById(selectedSarana)?.daya_tampung}</p>
                </div>
                </div>
            </div>
            )}

          {saranaPrasaranaList.length > 0 ? (
            <div className="mb-3">
            {inventarisList.length > 0 ? (
              inventarisList.map((inventaris) => (
                <>
                <label htmlFor="saranaPrasarana" className="form-label">Inventaris Tersedia :</label>
                <div key={inventaris.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`inventaris-${inventaris.id_inventaris}`}
                    value={inventaris.id_inventaris}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`inventaris-${inventaris.id_inventaris}`}
                  >
                    {inventaris.nama_inventaris} | Stok Tersedia : {inventaris.ketersediaan}
                  </label>
                </div>
                </>
              ))
            ) : (
              <></>
            )}

            </div>
          ) : (
            <></>
          )}


          <div className="mb-3 d-flex">
            <button type="submit" className="btn btn-primary">Ajukan Peminjaman</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default PengajuanSarpras;
