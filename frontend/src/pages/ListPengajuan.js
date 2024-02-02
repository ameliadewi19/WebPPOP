    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import feather from 'feather-icons';
    import 'bootstrap/dist/js/bootstrap.bundle';
    import EditPengajuanSarprasModal from '../components/Modals/EditPengajuanSarprasModal';
    import CatatanPengajuanModal from '../components/Modals/CatatanPengajuanModal';
    import CatatanPengajuanModalRevisi from '../components/Modals/CatatanPengajuanModalRevisi';
    import CatatanPengajuanModalTolak from '../components/Modals/CatatanPengajuanModalTolak';
    import Swal from 'sweetalert2';
    import { useNavigate } from 'react-router-dom';

    //const bcrypt = require('bcrypt');

    // Using Arrow Function
    const ListPengajuan = () => {
        const [id_user, setIdUser] = useState(null);
        const [role, setRole] = useState(null);
        const [updateStatus, setUpdateStatus] = useState('');
        const [currentIdPeminjaman, setCurrentIdPeminjaman] = useState(null);
        const [currentIdSarpras, setCurrentIdSarpras] = useState(null);
        const [showCatatanModal, setShowCatatanModal] = useState(false);
        const [showCatatanModalRevisi, setShowCatatanModalRevisi] = useState(false);
        const [showCatatanModalTolak, setShowCatatanModalTolak] = useState(false);
        const [selectedPengajuanId, setSelectedPengajuanId] = useState(null);
        const [catatan, setCatatan] = useState('');

        useEffect(() => {
            feather.replace(); // Replace the icons after component mounts
            const id_user = localStorage.getItem('idUser');
            setIdUser(id_user);
            const role = localStorage.getItem('role');
            setRole(role);
        }, []);

        const [data, setData] = useState(null);
        useEffect(() => {}, [data]);

        const navigate = useNavigate();

        const [showModal, setShowModal] = useState(false);
        const [pdfUrl, setPdfUrl] = useState('');
        const [pengajuanData, setPengajuanData] = useState([]);
        const [allPengajuan, setAllPengajuan] = useState([]);

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await axios.get('http://localhost:8000/api/peminjaman');
                    setPengajuanData(response.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            
            fetchData();
        }, []);

        useEffect(() => {
            if (pengajuanData.length > 0) {
                const fetchDataProker = async (pengajuan) => {
                    const id_proker = pengajuan.id_proker;
                    const id_peminjaman = pengajuan.id_peminjaman;

                    console.log("Id Proker : ",id_proker)
                
                    try {
                        const responseProker = await axios.get(`http://localhost:8000/api/proker/${id_proker}`);
                        const responseInventaris = await fetchDataInventaris(id_peminjaman);
                        const responseSarpras = await fetchDataSarpras(id_peminjaman);
                
                        if (!responseProker.data || !responseInventaris) {
                            return null; // Handle the case where data is not available
                        }

                        const nama_kegiatan = Array.isArray(responseProker.data)
                        ? responseProker.data[0].nama_kegiatan
                        : responseProker.data.nama_kegiatan;

                        const tanggal = Array.isArray(responseProker.data)
                        ? responseProker.data[0].tanggal_mulai
                        : responseProker.data.tanggal_mulai;

                        console.log("Proker : ",responseProker.data)
                        console.log("Nama Proker : ",responseProker.data.nama_kegiatan)
                
                        return {
                            nama_kegiatan,
                            tanggal,
                            id: pengajuan.id_peminjaman,
                            surat: pengajuan.link_surat,
                            status: pengajuan.status_peminjaman,
                            catatan: pengajuan.catatan,
                            sarpras: responseSarpras,
                            inventaris: responseInventaris
                        };
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        return null;
                    }
                };
                
                
        
                const fetchDataInventaris = async (id_peminjaman) => {
                    try {
                        const response = await axios.get(`http://localhost:8000/api/detail-peminjaman/peminjaman/${id_peminjaman}`);                
                        const inventarisArray = [];
                
                        // Check if the response data is an array
                        if (Array.isArray(response.data)) {
                            // Iterate through the array and push each sarpras value
                            response.data.forEach(item => {                
                                if (item.id_inventaris !== null) {
                                    inventarisArray.push(item.id_inventaris);
                                }
                            });
                        } else {
                            // If it's a single object, handle it like before
                            if (response.data.id_inventaris !== null) {
                                inventarisArray.push(response.data.id_inventaris);
                            }
                        }
                
                        return inventarisArray;
                    } catch (error) {
                        console.error('Error fetching inventaris data:', error);
                        return [];
                    }
                };


                const fetchDataSarpras = async (id_peminjaman) => {
                    try {
                        const response = await axios.get(`http://localhost:8000/api/detail-peminjaman/peminjaman/${id_peminjaman}`);
                        // console.log("Id Peminjaman : ", id_peminjaman);
                        // console.log("Respon Detail Sarpras : ", response);
                
                        const sarprasArray = [];
                
                        // Check if the response data is an array
                        if (Array.isArray(response.data)) {
                            // Iterate through the array and push each sarpras value
                            response.data.forEach(item => {                
                                if (item.id_sarpras !== null) {
                                    sarprasArray.push(item.id_sarpras);
                                }
                            });
                        } else {
                            // If it's a single object, handle it like before
                            if (response.data.id_sarpras !== null) {
                                sarprasArray.push(response.data.id_sarpras);
                            }
                        }
                
                        // console.log("Sarpras Array : ", sarprasArray);
                
                        return sarprasArray;
                    } catch (error) {
                        console.error('Error fetching sarpras data:', error);
                        return [];
                    }
                };
                
        
                const fetchAllData = async () => {
                    const promises = pengajuanData.map((pengajuan) => fetchDataProker(pengajuan));
                    const result = await Promise.all(promises);
                    const filteredResult = result.filter((item) => item !== null);
        
                    setAllPengajuan(filteredResult);
                };
        
                fetchAllData();
            }
        }, [pengajuanData]);
        
        
        const [inventarisDetails, setInventarisDetails] = useState({});

        const fetchInventarisDetails = async (inventarisIds) => {
          try {
            const response = await axios.get('http://localhost:8000/api/inventaris/', { inventarisIds });
            setInventarisDetails(response.data);
          } catch (error) {
            console.error('Error fetching inventaris details:', error);
          }
        };
      
        useEffect(() => {
          if (allPengajuan.length > 0) {
            const inventarisIds = allPengajuan.map((pengajuan) => pengajuan.inventaris).flat();
            fetchInventarisDetails(inventarisIds);
          }
        }, [allPengajuan]);    
        
        const [sarprasDetails, setSarprasDetails] = useState({});

        const fetchSarprasDetails = async (sarprasIds) => {
          try {
            const response = await axios.get('http://localhost:8000/api/sarpras/', { sarprasIds });
            setSarprasDetails(response.data);
          } catch (error) {
            console.error('Error fetching sarpras details:', error);
          }
        };
      
        useEffect(() => {
          if (allPengajuan.length > 0) {
            const sarprasIds = allPengajuan.map((pengajuan) => pengajuan.sarpras).flat();
            fetchSarprasDetails(sarprasIds);
          }
        }, [allPengajuan]);  

        
        const handleEditModal = (index) => {
            setShowModal(true);
            setPdfUrl('/test.pdf')
            
            // Tampilkan modal edit pengajuan
            const modal = document.getElementById('editPengajuanSarprasModal');
            modal.classList.add('show');

            // Set data pengajuan ke modal
            const formData = new FormData(); // Buat FormData dari form
            formData.append('id', allPengajuan[index].id);
            formData.append('nama_kegiatan', allPengajuan[index].nama_kegiatan);
            formData.append('tanggal', allPengajuan[index].tanggal);
            formData.append('sarpras', allPengajuan[index].sarpras);
            allPengajuan[index].inventaris.forEach((inventaris) => {
                formData.append('inventaris[]', inventaris);
            });
            formData.append('surat', allPengajuan[index].surat);

            setData(formData);

        };

        const handleUpload = () => {
            navigate('/peminjaman-sarpras');
        };

        const handleDelete = async (index) => {
            const confirmDelete = await Swal.fire({
                title: 'Data Pengajuan Peminjaman Akan Dihapus',
                text: 'Apakah Anda Yakin ?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText : 'Batal',
                confirmButtonText: 'Ya'
            });

            if (confirmDelete.isConfirmed) {
                try {
                    // Set id data pengajuan yang akan dihapus
                    const idToDelete = allPengajuan[index].id;
                    console.log("id peminjaman : ", idToDelete);
        
                    // Lakukan penghapusan data di backend
                    await axios.delete(`http://localhost:8000/api/detail-peminjaman/peminjaman/${idToDelete}`);
                    await axios.delete(`http://localhost:8000/api/peminjaman/${idToDelete}`);
        
                    // Perbarui state allPengajuan dengan data baru (tanpa data yang dihapus)
                    const updatedAllPengajuan = [...allPengajuan];
                    updatedAllPengajuan.splice(index, 1);
                    setAllPengajuan(updatedAllPengajuan);
        
                    Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
                } catch (error) {
                    console.error("Error:", error);
                    Swal.fire('Gagal Hapus!', 'Terjadi kesalahan saat menghapus data.', 'error');
                }
            }
        }

        const getInventarisDetail = (id) => {
            const inventarisArray = Object.values(inventarisDetails);
            return inventarisArray.find(detail => detail.id_inventaris === id);
        };
             
        const getSarprasDetail = (id) => {
            const sarprasArray = Object.values(sarprasDetails);
            return sarprasArray.find(detail => detail.id_sarpras === id);
        };

        const handleAccSekumbemStatus = async (id_peminjaman) => {
            // const confirmACC = await Swal.fire({
            //     title: 'Menerima Pengajuan',
            //     text: 'Apakah Anda Yakin ?',
            //     icon: 'warning',
            //     showCancelButton: true,
            //     confirmButtonColor: '#3085d6',
            //     cancelButtonColor: '#d33',
            //     cancelButtonText : 'Batal',
            //     confirmButtonText: 'Ya'
            // });
            // if (confirmACC.isConfirmed) {
                try {
                    setUpdateStatus("ACC Tahap 1 (BEM)");
                    setCurrentIdPeminjaman(id_peminjaman);
                  } catch (error) {
                    console.error("Error during setting update status:", error);
                  }
            //}
            
            console.log("update status: ", updateStatus)
        };
        

        const handleAccAdminStatus = async (id_peminjaman) => {
            try {
                setUpdateStatus("ACC Tahap 2 (Kemahasiswaan)");
                setCurrentIdPeminjaman(id_peminjaman);
              } catch (error) {
                console.error("Error during setting update status:", error);
              }
            console.log("update status: ", updateStatus)
        };

        const handleAccSarprasStatus = async (id_peminjaman, id_sarpras) => {
            try {
                setUpdateStatus("ACC Tahap 3 (Sarpras) (Disetujui)");
                setCurrentIdPeminjaman(id_peminjaman);
                setCurrentIdSarpras(id_sarpras);
              } catch (error) {
                console.error("Error during setting update status:", error);
              }
            console.log("update status: ", updateStatus)
        };

        const handleRevisiSekumbemStatus = async (id_peminjaman) => {
            try {
                setUpdateStatus("Revisi (BEM)");
                setCurrentIdPeminjaman(id_peminjaman);
              } catch (error) {
                console.error("Error during setting update status:", error);
              }
            console.log("update status: ", updateStatus)
        };

        const handleRevisiAdminStatus = async (id_peminjaman) => {
            try {
                setUpdateStatus("Revisi (Kemahasiswaan)");
                setCurrentIdPeminjaman(id_peminjaman);
              } catch (error) {
                console.error("Error during setting update status:", error);
              }
            console.log("update status: ", updateStatus)
        };

        const handleRevisiSarprasStatus = async (id_peminjaman) => {
            try {
                setUpdateStatus("Revisi (Subbag Sarpras)");
                setCurrentIdPeminjaman(id_peminjaman);
              } catch (error) {
                console.error("Error during setting update status:", error);
              }
            console.log("update status: ", updateStatus)
        };

        const handleTolakSekumbemStatus = async (id_peminjaman) => {
            try {
                setUpdateStatus("Ditolak (BEM)");
                setCurrentIdPeminjaman(id_peminjaman);
              } catch (error) {
                console.error("Error during setting update status:", error);
              }
            console.log("update status: ", updateStatus)
        };

        const handleTolakAdminStatus = async (id_peminjaman) => {
            try {
                setUpdateStatus("Ditolak (Kemahasiswaan)");
                setCurrentIdPeminjaman(id_peminjaman);
              } catch (error) {
                console.error("Error during setting update status:", error);
              }
            console.log("update status: ", updateStatus)
        };

        const handleTolakSarprasStatus = async (id_peminjaman) => {
            try {
                setUpdateStatus("Ditolak (Subbag Sarpras)");
                setCurrentIdPeminjaman(id_peminjaman);
              } catch (error) {
                console.error("Error during setting update status:", error);
              }
            console.log("update status: ", updateStatus)
        };

        useEffect(() => {
            const updateStatusHandler = async () => {
              try {
                if (currentIdPeminjaman && updateStatus) {
                  await axios.patch(
                    `http://localhost:8000/api/peminjaman/${currentIdPeminjaman}`,
                    {
                      status_peminjaman: updateStatus,
                    },
                    {
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    }
                  );

                if (updateStatus === 'ACC Tahap 3 (Sarpras) (Disetujui)') {
                    await axios.patch(
                        `http://localhost:8000/api/sarpras/${currentIdSarpras[0]}`,
                        {
                          status_peminjaman: 'Dipinjam',
                        },
                        {
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        }
                      );
                }
                    // Jika request berhasil, reload halaman saat ini
                    window.location.reload();
                }
              } catch (error) {
                console.error("Error during ACC:", error);
              }
            };
        
            updateStatusHandler();
          }, [updateStatus, currentIdPeminjaman, ]);

        // Function to handle the button click and open the modal
        const handleOpenCatatanModal = (index) => {
            setShowCatatanModal(true);
            
            // Tampilkan modal edit pengajuan
            const modal = document.getElementById('catatanPengajuanModal');
            modal.classList.add('show');

            // Set data pengajuan ke modal
            const formData = new FormData(); // Buat FormData dari form
            formData.append('id_peminjaman', allPengajuan[index].id);

            setSelectedPengajuanId(formData.get('id_peminjaman'));

            console.log(formData.get('id_peminjaman'))
            console.log(selectedPengajuanId)
        };

        const handleOpenCatatanModalRevisi = (index) => {
            setShowCatatanModalRevisi(true);
            
            // Tampilkan modal edit pengajuan
            const modal = document.getElementById('catatanPengajuanModalRevisi');
            modal.classList.add('show');

            // Set data pengajuan ke modal
            const formData = new FormData(); // Buat FormData dari form
            formData.append('id_peminjaman', allPengajuan[index].id);

            setSelectedPengajuanId(formData.get('id_peminjaman'));

            console.log(formData.get('id_peminjaman'))
            console.log(selectedPengajuanId)
        };

        const handleOpenCatatanModalTolak = (index) => {
            setShowCatatanModalTolak(true);
            
            // Tampilkan modal edit pengajuan
            const modal = document.getElementById('catatanPengajuanModalTolak');
            modal.classList.add('show');

            // Set data pengajuan ke modal
            const formData = new FormData(); // Buat FormData dari form
            formData.append('id_peminjaman', allPengajuan[index].id);

            setSelectedPengajuanId(formData.get('id_peminjaman'));

            console.log(formData.get('id_peminjaman'))
            console.log(selectedPengajuanId)
        };

        // Function to handle the form submission in the modal
        const handleSubmitCatatan = async () => {
            try {
            // Make a request to update catatan on the server
            await axios.patch(
                `http://localhost:8000/api/peminjaman/${selectedPengajuanId}`,
                { catatan: catatan },
                { headers: {
                    'Content-Type': 'application/json',
                }}
            );
            // Close the modal and refresh the page
            setShowCatatanModal(false);
            window.location.reload();
            } catch (error) {
            console.error('Error updating catatan:', error);
            }
        };

        return (
        <main class="content">
            <div class="container-fluid p-0">

            <h1 className="h3 mb-3">Pengajuan <strong>Sarana Prasarana</strong></h1>

            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="card-title mt-1">Daftar Pengajuan Sarana Prasarana</h5>

                        {['ormawa'].includes(role) && (
                            <button class="btn btn-primary mt-2" onClick={handleUpload} ><i className="bi bi-upload" style={{ marginRight: '5px' }}></i> <span className="align-middle">Tambah Pengajuan</span></button>
                        )}

                    </div>
                    <div className="card-body">
                        <div className="table-responsive">

                        {['ormawa'].includes(role) && (
                            <table className="table datatable table-striped">
                                
                                {allPengajuan.length > 0 ? (                                
                                <thead>
                                <tr>
                                    <th>Kegiatan</th>
                                    <th>Tanggal</th>
                                    <th>Sarana Prasarana</th>
                                    <th>Inventaris</th>
                                    <th>Surat Pengajuan</th>
                                    <th>Status</th>
                                    <th>Catatan</th>
                                    <th>Edit/Batal</th>
                                </tr>
                                </thead>
                                ) : (
                                    <>
                                        Loading ...
                                    </>
                                )}
                                <tbody>
                                {console.log("List Semua Pengajuann : ", allPengajuan)} 
                                {allPengajuan.length > 0 ? (
                                    allPengajuan.map((lists_pengajuan, index) => (
                                        <tr key={index}>
                                            <td>{lists_pengajuan?.nama_kegiatan || ''}</td>
                                            <td>{lists_pengajuan.tanggal}</td>
                                            <td>
                                                {Array.isArray(lists_pengajuan.sarpras) ? (
                                                    lists_pengajuan.sarpras.map(id => {
                                                        const sarprasDetail = getSarprasDetail(id);
                                                        return sarprasDetail ? sarprasDetail.nama_sarpras : '';
                                                    }).join(', ')
                                                ) : (
                                                    'Tidak ada Sarpras yang dipinjam' // or some default value
                                                )}
                                            </td>
                                            <td>
                                                {Array.isArray(lists_pengajuan.inventaris) ? (
                                                    lists_pengajuan.inventaris.map(id => {
                                                        const inventarisDetail = getInventarisDetail(id);
                                                        return inventarisDetail ? inventarisDetail.nama_inventaris : '';
                                                    }).join(', ')
                                                ) : (
                                                    'Tidak ada inventarsi yang dipinjam' // or some default value
                                                )}
                                            </td>
                                            <td><a href={lists_pengajuan.surat}>Surat Pengajuan - {lists_pengajuan.nama_kegiatan}</a></td>
                                            <td>{lists_pengajuan.status}</td>
                                            <td>{lists_pengajuan.catatan}</td>
                                            <td>
                                                {!['ACC Tahap 3 (Sarpras) (Disetujui)', 'Ditolak (BEM)', 'Ditolak (Kemahasiswaan)', 'Ditolak (Subbag Sarpras)'].includes(lists_pengajuan.status) && (
                                                    <>
                                                        <button class="btn btn-primary mt-2" onClick={() => handleEditModal(index)} data-bs-toggle="modal" data-bs-target="#editPengajuanSarprasModal" style={{marginRight: '5px'}}><i class="bi bi-pencil-square"></i></button>
                                                        <EditPengajuanSarprasModal showModal={showCatatanModal} setShowModal={setShowCatatanModal} data={data} />
                                                        {/* <button class="btn btn-danger mt-2" onClick={() => handleDelete(index)}><i class="bi bi-trash"></i></button> */}
                                                    </>
                                                )}
                                                {!['ACC Tahap 3 (Sarpras) (Disetujui)'].includes(lists_pengajuan.status) && (
                                                    <>
                                                        {/* <button class="btn btn-primary mt-2" onClick={() => handleEditModal(index)} data-bs-toggle="modal" data-bs-target="#editPengajuanSarprasModal" style={{marginRight: '5px'}}><i class="bi bi-pencil-square"></i></button>
                                                        <EditPengajuanSarprasModal showModal={showCatatanModal} setShowModal={setShowCatatanModal} data={data} /> */}
                                                        <button class="btn btn-danger mt-2" onClick={() => handleDelete(index)}><i class="bi bi-trash"></i></button>
                                                    </>
                                                )}
     
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>

                                    </tr>
                                )}

                                </tbody>
                            </table>
                        )}

                        {['sekumbem'].includes(role) && (
                            <table className="table table-striped">
                                {allPengajuan.length > 0 ? (                                
                                <thead>
                                <tr>
                                <th>Kegiatan</th>
                                    <th>Tanggal</th>
                                    <th>Sarana Prasarana</th>
                                    <th>Inventaris</th>
                                    <th>Surat Pengajuan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                    <th>Catatan</th>
                                </tr>
                                </thead>
                                ) : (
                                <thead>
                                    <div className="text-center justify-center">
                                        Loading ...
                                    </div>
                                </thead>
                                )}
                                <tbody>
   
                                {allPengajuan.length > 0 ? (
                                    allPengajuan.map((lists_pengajuan, index) => (
                                        <tr key={index}>
                                            <td>{lists_pengajuan?.nama_kegiatan || ''}</td>
                                            <td>{lists_pengajuan.tanggal}</td>
                                            <td>
                                                {Array.isArray(lists_pengajuan.sarpras) ? (
                                                    lists_pengajuan.sarpras.map(id => {
                                                        const sarprasDetail = getSarprasDetail(id);
                                                        return sarprasDetail ? sarprasDetail.nama_sarpras : '';
                                                    }).join(', ')
                                                ) : (
                                                    'Tidak ada Sarpras yang dipinjam' // or some default value
                                                )}
                                            </td>
                                            <td>
                                                {Array.isArray(lists_pengajuan.inventaris) ? (
                                                    lists_pengajuan.inventaris.map(id => {
                                                        const inventarisDetail = getInventarisDetail(id);
                                                        return inventarisDetail ? inventarisDetail.nama_inventaris : '';
                                                    }).join(', ')
                                                ) : (
                                                    'Tidak ada inventarsi yang dipinjam' // or some default value
                                                )}
                                            </td>
                                            <td><a href={lists_pengajuan.surat}>Surat Pengajuan - {lists_pengajuan.nama_kegiatan}</a></td>
                                            <td>{lists_pengajuan.status}</td>
                                            <td>
                                                {['Diajukan', 'Revisi (BEM)'].includes(lists_pengajuan.status) && (
                                                    <>
                                                        <button class="btn btn-primary mt-2" style={{ marginRight: '5px' }} data-bs-toggle="modal" data-bs-target="#catatanPengajuanModal"onClick={() => handleOpenCatatanModal(index)}>
                                                            <i className="bi-check2"></i> Acc
                                                        </button>
                                                        <CatatanPengajuanModal showModal={showCatatanModal} setShowModal={setShowCatatanModal} id={selectedPengajuanId} statusToChange="ACC Tahap 1 (BEM)"/>
                                                        
                                                        <button className="btn btn-warning mt-2" style={{ marginRight: '5px' }} data-bs-toggle="modal" data-bs-target="#catatanPengajuanModalRevisi"onClick={() => handleOpenCatatanModalRevisi(index)}>
                                                            <i className="bi-pencil"></i> Revisi
                                                        </button>
                                                        <CatatanPengajuanModalRevisi showModal={showCatatanModalRevisi} setShowModal={setShowCatatanModalRevisi} id={selectedPengajuanId} statusToChange="Revisi (BEM)"/>

                                                        <button className="btn btn-danger mt-2" style={{ marginRight: '5px' }} data-bs-toggle="modal" data-bs-target="#catatanPengajuanModalTolak"onClick={() => handleOpenCatatanModalTolak(index)}>
                                                            <i className="bi-trash"></i> Tolak
                                                        </button>
                                                        <CatatanPengajuanModalTolak showModal={showCatatanModalTolak} setShowModal={setShowCatatanModalTolak} id={selectedPengajuanId} statusToChange="Ditolak (BEM)"/>
                                        
                                                    </>
                                                )}
                                            </td>
                                            <td>
                                                {lists_pengajuan.catatan}

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>

                                    </tr>
                                )}

                                </tbody>
                            </table>
                        )}

                        {['admin'].includes(role) && (
                            <table className="table datatable table-striped">
                                {allPengajuan.length > 0 ? (                                
                                <thead>
                                <tr>
                                <th>Kegiatan</th>
                                    <th>Tanggal</th>
                                    <th>Sarana Prasarana</th>
                                    <th>Inventaris</th>
                                    <th>Surat Pengajuan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                    <th>Catatan</th>
                                </tr>
                                </thead>
                                ) : (
                                <thead>
                                    <div className="text-center justify-center">
                                        Loading ...
                                    </div>
                                </thead>
                                )}
                                <tbody>
                                {/* {console.log("List Semua Pengajuann Woyyy : ", allPengajuan)}     */}
                                {allPengajuan.length > 0 ? (
                                    allPengajuan.map((lists_pengajuan, index) => (
                                        <tr key={index}>
                                            <td>{lists_pengajuan?.nama_kegiatan || ''}</td>
                                            <td>{lists_pengajuan.tanggal}</td>
                                            <td>
                                                {Array.isArray(lists_pengajuan.sarpras) ? (
                                                    lists_pengajuan.sarpras.map(id => {
                                                        const sarprasDetail = getSarprasDetail(id);
                                                        return sarprasDetail ? sarprasDetail.nama_sarpras : '';
                                                    }).join(', ')
                                                ) : (
                                                    'Tidak ada Sarpras yang dipinjam' // or some default value
                                                )}
                                            </td>
                                            <td>
                                                {Array.isArray(lists_pengajuan.inventaris) ? (
                                                    lists_pengajuan.inventaris.map(id => {
                                                        const inventarisDetail = getInventarisDetail(id);
                                                        return inventarisDetail ? inventarisDetail.nama_inventaris : '';
                                                    }).join(', ')
                                                ) : (
                                                    'Tidak ada inventarsi yang dipinjam' // or some default value
                                                )}
                                            </td>
                                            <td><a href={lists_pengajuan.surat}>Surat Pengajuan - {lists_pengajuan.nama_kegiatan}</a></td>
                                            <td>{lists_pengajuan.status}</td>
                                            <td>
                                                {['ACC Tahap 1 (BEM)', 'Revisi (Kemahasiswaan)'].includes(lists_pengajuan.status) && (
                                                    <>
                                                        <button class="btn btn-primary mt-2" style={{ marginRight: '5px' }} data-bs-toggle="modal" data-bs-target="#catatanPengajuanModal"onClick={() => handleOpenCatatanModal(index)}>
                                                            <i className="bi-check2"></i> Acc
                                                        </button>
                                                        <CatatanPengajuanModal showModal={showCatatanModal} setShowModal={setShowCatatanModal} id={selectedPengajuanId} statusToChange="ACC Tahap 2 (Kemahasiswaan)"/>
                                                        
                                                        <button className="btn btn-warning mt-2" style={{ marginRight: '5px' }} data-bs-toggle="modal" data-bs-target="#catatanPengajuanModalRevisi"onClick={() => handleOpenCatatanModalRevisi(index)}>
                                                            <i className="bi-pencil"></i> Revisi
                                                        </button>
                                                        <CatatanPengajuanModalRevisi showModal={showCatatanModalRevisi} setShowModal={setShowCatatanModalRevisi} id={selectedPengajuanId} statusToChange="Revisi (Kemahasiswaan)"/>
                                                        
                                                        <button className="btn btn-danger mt-2" style={{ marginRight: '5px' }} data-bs-toggle="modal" data-bs-target="#catatanPengajuanModalTolak"onClick={() => handleOpenCatatanModalTolak(index)}>
                                                            <i className="bi-trash"></i> Tolak
                                                        </button>
                                                        <CatatanPengajuanModalTolak showModal={showCatatanModalTolak} setShowModal={setShowCatatanModalTolak} id={selectedPengajuanId} statusToChange="Ditolak (Kemahasiswaan)"/>
                                                    </>
                                                )}
                                            </td>
                                            <td>
                                                {lists_pengajuan.catatan}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                    </tr>
                                )}

                                </tbody>
                            </table>
                        )}

                        {['sarpras'].includes(role) && (
                            <table className="table table-striped">
                                {allPengajuan.length > 0 ? (                                
                                <thead>
                                <tr>
                                <th>Kegiatan</th>
                                    <th>Tanggal</th>
                                    <th>Sarana Prasarana</th>
                                    <th>Inventaris</th>
                                    <th>Surat Pengajuan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                    <th>Catatan</th>
                                </tr>
                                </thead>
                                ) : (
                                <thead>
                                    <div className="text-center justify-center">
                                        Loading ...
                                    </div>
                                </thead>
                                )}
                                <tbody>
                                {/* {console.log("List Semua Pengajuann Woyyy : ", allPengajuan)}     */}
                                {allPengajuan.length > 0 ? (
                                    allPengajuan.map((lists_pengajuan, index) => (
                                        <tr key={index}>
                                            <td>{lists_pengajuan?.nama_kegiatan || ''}</td>
                                            <td>{lists_pengajuan.tanggal}</td>
                                            <td>
                                                {Array.isArray(lists_pengajuan.sarpras) ? (
                                                    lists_pengajuan.sarpras.map(id => {
                                                        const sarprasDetail = getSarprasDetail(id);
                                                        return sarprasDetail ? sarprasDetail.nama_sarpras : '';
                                                    }).join(', ')
                                                ) : (
                                                    'Tidak ada Sarpras yang dipinjam' // or some default value
                                                )}
                                            </td>
                                            <td>
                                                {Array.isArray(lists_pengajuan.inventaris) ? (
                                                    lists_pengajuan.inventaris.map(id => {
                                                        const inventarisDetail = getInventarisDetail(id);
                                                        return inventarisDetail ? inventarisDetail.nama_inventaris : '';
                                                    }).join(', ')
                                                ) : (
                                                    'Tidak ada inventarsi yang dipinjam' // or some default value
                                                )}
                                            </td>
                                            <td><a href={lists_pengajuan.surat}>Surat Pengajuan - {lists_pengajuan.nama_kegiatan}</a></td>
                                            <td>{lists_pengajuan.status}</td>
                                            <td>
                                            {['ACC Tahap 2 (Kemahasiswaan)', 'Revisi (Sarpras)'].includes(lists_pengajuan.status) && (
                                                    <>
                                                        <button class="btn btn-primary mt-2" style={{ marginRight: '5px' }} data-bs-toggle="modal" data-bs-target="#catatanPengajuanModal"onClick={() => handleOpenCatatanModal(index)}>
                                                            <i className="bi-check2"></i> Acc
                                                        </button>
                                                        <CatatanPengajuanModal showModal={showCatatanModal} setShowModal={setShowCatatanModal} id={selectedPengajuanId} statusToChange="ACC Tahap 3 (Sarpras) (Disetujui)"/>

                                                        <button className="btn btn-warning mt-2" style={{ marginRight: '5px' }} data-bs-toggle="modal" data-bs-target="#catatanPengajuanModalRevisi"onClick={() => handleOpenCatatanModalRevisi(index)}>
                                                            <i className="bi-pencil"></i> Revisi
                                                        </button>
                                                        <CatatanPengajuanModalRevisi showModal={showCatatanModalRevisi} setShowModal={setShowCatatanModalRevisi} id={selectedPengajuanId} statusToChange="Revisi (Sapras)"/>

                                                        <button className="btn btn-danger mt-2" style={{ marginRight: '5px' }} data-bs-toggle="modal" data-bs-target="#catatanPengajuanModalTolak"onClick={() => handleOpenCatatanModalTolak(index)}>
                                                            <i className="bi-trash"></i> Tolak
                                                        </button>
                                                        <CatatanPengajuanModalTolak showModal={showCatatanModalTolak} setShowModal={setShowCatatanModalTolak} id={selectedPengajuanId} statusToChange="Ditolak (Subbag Sapras)"/>
                                                    </>
                                            )}
                                            </td>
                                            <td>
                                                {lists_pengajuan.catatan}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                    </tr>
                                )}

                                </tbody>
                            </table>
                        )}

                        {/* Add the modal component */}
                        {showCatatanModal && (
                        <div className="modal fade" id="catatanModal" tabIndex="-1" aria-labelledby="catatanModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                <h5 className="modal-title" id="catatanModalLabel">Catatan Pengajuan</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowCatatanModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                    <label htmlFor="catatanTextarea" className="form-label">Catatan:</label>
                                    <textarea className="form-control" id="catatanTextarea" rows="3" value={catatan} onChange={(e) => setCatatan(e.target.value)}></textarea>
                                    </div>
                                </form>
                                </div>
                                <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleSubmitCatatan}>Simpan Catatan</button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowCatatanModal(false)}>Tutup</button>
                                </div>
                            </div>
                            </div>
                        </div>
                        )}

                        </div>
                    </div>
                    </div>
                </div>
            </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
        </main>
        );
    };

    export default ListPengajuan;
