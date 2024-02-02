import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import feather from 'feather-icons';

const CardSarpras = () => {
    const navigate = useNavigate();
    const [id_user, setIdUser] = useState(null);
    const [role, setRole] = useState(null);
    const [showDataSarpras, setShowDataSarpras] = useState([]);
    const [selectedSarpras, setSelectedSarpras] = useState(null); // Added state for selected sarpras
    const [peminjamanAcc, setPeminjamanAcc] = useState([]);
    const [peminjamanPengajuan, setPeminjamanPengajuan] = useState([]);
    const [detailPeminjamanAcc, setDetailPeminjamanAcc] = useState([]); 
    const [detailPeminjamanPengajuan, setDetailPeminjamanPengajuan] = useState([]);

    const handleUpload = () => {
        navigate('/peminjaman-sarpras')
    };

    const handleListPengajuan = () => {
        navigate('/list-pengajuan')
    };

    const handleDetailClick = async (sarpras) => {
        setSelectedSarpras(sarpras);
        // Open Bootstrap modal using DOM methods
        const modal = document.getElementById('detailModal');
        let accArray = [];
        let pengajuanArray = [];
    
        try {
            const responseDetailPeminjaman = await axios.get(`/api/detail-peminjaman/peminjaman/bySarpras/${sarpras.id_sarpras}`);
            console.log("respon detail peminjaman : ", responseDetailPeminjaman.data);
    
            // Create an array of Axios promises
            const axiosPromises = responseDetailPeminjaman.data.map(data =>
                axios.get(`/api/peminjaman/${data.id_peminjaman}`)
            );
    
            // Wait for all Axios promises to resolve
            const responses = await Promise.all(axiosPromises);
    
            responses.forEach(response => {
                console.log("respon peminjaman : ", response.data);
                if (response.data.status_peminjaman === "ACC Tahap 3 (Sarpras) (Disetujui)") {
                    console.log("id peminjaman", response.data.id_peminjaman, "diacc");
                    accArray.push(response.data.id_peminjaman);
                } else if (response.data.status_peminjaman !== "ACC Tahap 3 (Sarpras) (Disetujui)" && !response.data.status_peminjaman.includes("Ditolak")) {
                    console.log("id peminjaman", response.data.id_peminjaman, "dalam pengajuan");
                    pengajuanArray.push(response.data.id_peminjaman);
                }
            });
    
            // Set state after processing all responses
            setPeminjamanAcc(accArray);
            setPeminjamanPengajuan(pengajuanArray);
    
            // Membuat data peminjaman yang diacc
            const prokerArray = await Promise.all(accArray.map(async (id) => {
                try {
                    const responsePeminjaman = await axios.get(`/api/peminjaman/proker/${id}`);
                    const idProker = responsePeminjaman.data[0].id_proker;
    
                    const responseProker = await axios.get(`/api/proker/${idProker}`);
                    const prokerData = responseProker.data[0];
    
                    const responseKak = await axios.get(`/api/kak/${prokerData.id_kak}`);
                    const kakData = responseKak.data[0];
    
                    const responseKetua = await axios.get(`/api/ketua-ormawa/${kakData.id_ketua}`);
                    const ketuaData = responseKetua.data.data;
    
                    const responseOrmawa = await axios.get(`/api/ormawa/${ketuaData.id_ormawa}`);
                    const ormawaData = responseOrmawa.data;
    
                    // Membuat objek proker dan menyimpan data yang diambil
                    return {
                        idProker: prokerData.id_proker,
                        namaKegiatan: prokerData.nama_kegiatan,
                        tanggalMulai: prokerData.tanggal_mulai,
                        namaOrmawa: ormawaData.nama_ormawa,
                        deskripsiKegiatan: prokerData.deskripsi_kegiatan
                    };
                } catch (error) {
                    console.error(`Error saat pemanggilan axios`, error);
                    throw error;
                }
            }));

            // Membuat data peminjaman yang diajukan
            const prokerDiajukan = await Promise.all(pengajuanArray.map(async (id) => {
                try {
                    const responsePeminjaman = await axios.get(`/api/peminjaman/proker/${id}`);
                    const idProker = responsePeminjaman.data[0].id_proker;
    
                    const responseProker = await axios.get(`/api/proker/${idProker}`);
                    const prokerData = responseProker.data[0];
    
                    const responseKak = await axios.get(`/api/kak/${prokerData.id_kak}`);
                    const kakData = responseKak.data[0];
    
                    const responseKetua = await axios.get(`/api/ketua-ormawa/${kakData.id_ketua}`);
                    const ketuaData = responseKetua.data.data;
    
                    const responseOrmawa = await axios.get(`/api/ormawa/${ketuaData.id_ormawa}`);
                    const ormawaData = responseOrmawa.data;
    
                    // Membuat objek proker dan menyimpan data yang diambil
                    return {
                        idProker: prokerData.id_proker,
                        namaKegiatan: prokerData.nama_kegiatan,
                        tanggalMulai: prokerData.tanggal_mulai,
                        namaOrmawa: ormawaData.nama_ormawa,
                        deskripsiKegiatan: prokerData.deskripsi_kegiatan
                    };
                } catch (error) {
                    console.error(`Error saat pemanggilan axios`, error);
                    throw error;
                }
            }));
    
            // Set nilai detailPeminjaman dengan array proker yang didapat 
            setDetailPeminjamanAcc(prokerArray);
            setDetailPeminjamanPengajuan(prokerDiajukan);
    
            // Tampilkan array objek proker
            console.log("proker acc:", detailPeminjamanAcc);
            console.log("proker diajukan:", detailPeminjamanAcc);
    
            const bootstrapModal = new window.bootstrap.Modal(modal);
            bootstrapModal.show();
        } catch (error) {
            console.error(error);
        }
    };
    

    useEffect(() => {
        console.log("peminjaman di acc 2 : ", peminjamanAcc);
    }, [peminjamanAcc]);
    

    useEffect(() => {
        feather.replace();
        const id_user = localStorage.getItem('idUser');
        setIdUser(id_user);
        const role = localStorage.getItem('role');
        setRole(role);
    }, []);

    useEffect(() => {
        axios.get('/api/sarpras')
            .then(response => {
                setShowDataSarpras(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <main className="content">
            <div className="container-fluid p-0">
                <h1 className="h3 mb-3">Pengajuan <strong>Sarana Prasarana</strong></h1>
                {showDataSarpras.length > 0 ? (
                <div>
                {['ormawa'].includes(role) && (
                    <button className="btn btn-primary" style={{ marginTop: '20px', marginBottom: '5px' }} onClick={handleUpload}>
                        <i className="bi bi-upload" style={{ marginRight: '5px' }}></i>
                        <span className="align-middle">Tambah Pengajuan</span>
                    </button>
                
                    
                )}
                </div>
                ) : (
                    <p></p>
                )}

                {showDataSarpras.length > 0 ? (
                    <div className="row">
                        {showDataSarpras.map(sarpras => (
                            <div className="col-sm-4 mb-3 mb-sm-0" key={sarpras.id_sarpras}>
                                <div className="card" style={{ width: '18rem', top: '1rem' }}>
                                    <img src={sarpras.link_gambar} className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title">{sarpras.nama_sarpras}</h5>
                                        <p className="card-text">{sarpras.deskripsi}</p>
                                        <p className="card-text">Daya Tampung : {sarpras.daya_tampung}</p>
                                        <button className="btn btn-outline-primary" onClick={() => handleDetailClick(sarpras)}>Informasi</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}

                {/* Bootstrap Modal */}
                <div className="modal fade" id="detailModal" tabIndex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        {selectedSarpras && (   
                            <div className="modal-header">
                                <h5 className="modal-title" id="detailModalLabel">{selectedSarpras.nama_sarpras}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                        )}
                            <div className="modal-body">
                                {/* Display details of selected sarpras in the modal */}
                                {selectedSarpras && (
                                <>
                                <div style={{ color: 'green' }}><p><strong>Kegiatan Disetujui</strong></p></div>
                                
                                {detailPeminjamanAcc.length > 0 && (
                                <div>
                                    {detailPeminjamanAcc.map((proker, index) => (
                                    <div key={index}>
                                        <div style={{ fontSize:'15px', display: 'flex' }}> <div style={{ marginRight:'50px'}}> Nama Kegiatan</div> : {proker.namaKegiatan}</div>
                                        <div style={{ fontSize:'15px', display: 'flex' }}> <div style={{ marginRight:'91px'}}> Pelaksana </div> : {proker.namaOrmawa}</div>
                                        <div style={{ fontSize:'15px', display: 'flex' }}> <div style={{ marginRight:'7px'}}> Tanggal Pelaksanaan </div> : {proker.tanggalMulai}</div>
                                        <div style={{ fontSize:'15px', display: 'flex' }}> <div style={{ marginRight:'97px'}}> Deskripsi </div> : {proker.deskripsiKegiatan}</div>
                                        <br />
                                    </div>
                                    ))}
                                </div>
                                )}

                                <hr />
                                <div style={{ color: 'orange' }}><p><strong>Kegiatan Dalam Proses Pengajuan</strong></p></div>

                                {detailPeminjamanPengajuan.length > 0 && (
                                <div>
                                    {detailPeminjamanPengajuan.map((proker, index) => (
                                    <div key={index}>
                                        <div style={{ fontSize:'15px', display: 'flex' }}> <div style={{ marginRight:'50px'}}> Nama Kegiatan</div> : {proker.namaKegiatan}</div>
                                        <div style={{ fontSize:'15px', display: 'flex' }}> <div style={{ marginRight:'91px'}}> Pelaksana </div> : {proker.namaOrmawa}</div>
                                        <div style={{ fontSize:'15px', display: 'flex' }}> <div style={{ marginRight:'7px'}}> Tanggal Pelaksanaan </div> : {proker.tanggalMulai}</div>
                                        <div style={{ fontSize:'15px', display: 'flex' }}> <div style={{ marginRight:'97px'}}> Deskripsi </div> : {proker.deskripsiKegiatan}</div>
                                        <br />
                                    </div>
                                    ))}
                                </div>
                                )}

                                </>
                            )}

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                {/* Add additional buttons if needed */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default CardSarpras;
