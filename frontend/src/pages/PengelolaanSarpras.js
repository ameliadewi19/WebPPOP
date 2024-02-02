import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PengelolaanSarpras = () => {
    const [sarprasData, setSarprasData] = useState([]);
    const [selectedSarpras, setSelectedSarpras] = useState(null);
    const [newSarpras, setNewSarpras] = useState({
        nama_sarpras: '',
        deskripsi: '',
        daya_tampung: 0,
        gambar_sarpras: null,
    });

    const resetForm = () => {
        setNewSarpras({
            nama_sarpras: '',
            deskripsi: '',
            daya_tampung: 0,
            gambar_sarpras: null,
        });
    };

    const handleDetailClick = (sarpras) => {
        setSelectedSarpras(sarpras);
        // Open Bootstrap modal using DOM methods
        const modal = document.getElementById('detailModal');
        const bootstrapModal = new window.bootstrap.Modal(modal);
        bootstrapModal.show();
    };

    const handleAddSarprasClick = () => {
        // Open Bootstrap modal using DOM methods
        const modal = document.getElementById('CreateSarpras');
        const bootstrapModal = new window.bootstrap.Modal(modal);
        bootstrapModal.show();
    };

    const CreateSarpras = () => {
        const formData = new FormData();
        formData.append('nama_sarpras', newSarpras.nama_sarpras);
        formData.append('deskripsi', newSarpras.deskripsi);
        formData.append('daya_tampung', newSarpras.daya_tampung);
        formData.append('status_peminjaman', newSarpras.status_peminjaman);
        formData.append('gambar_sarpras', newSarpras.gambar_sarpras);

        axios.post('/api/sarpras', formData)
            .then(response => {
                axios.get('/api/sarpras')
                    .then(response => {
                        setSarprasData(response.data);
                        resetForm();
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
    };

    const UpdateSarpras = () => {
        console.log("sarpras yang mau diupdate : ", selectedSarpras)
        axios.post(`/api/sarpras/${selectedSarpras.id_sarpras}`, selectedSarpras)
            .then(response => {
                console.log("hasil update : ", response)
                // Reload sarpras data after updating
                axios.get('/api/sarpras')
                    .then(response => {
                        setSarprasData(response.data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => {
                console.error(error);
            });
    }

    const DeleteSarpras = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data sarpras ini?')) {
            axios.delete(`/api/sarpras/${selectedSarpras.id_sarpras}`)
                .then(response => {
                    // Reload sarpras data after deleting
                    axios.get('/api/sarpras')
                        .then(response => {
                            setSarprasData(response.data);
                            setSelectedSarpras(null); // Clear selectedSarpras after deletion
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    useEffect(() => {
        // Mengambil data sarpras dari API
        axios.get('/api/sarpras')
            .then(response => {
                setSarprasData(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <main className="content">
            <div className="container-fluid p-0">
                <h1 className="h3 mb-3">Pengelolaan Sarana dan Prasarana</h1>
                <button className="btn btn-primary" onClick={handleAddSarprasClick}>Tambah Sarpras</button>
                <div className="row">
                    {sarprasData.map(sarpras => (
                        <div className="col-sm-4 mb-3 mb-sm-0" key={sarpras.id_sarpras}>
                            <div className="card" style={{ width: '18rem', top: '1rem' }}>
                                <img src={sarpras.link_gambar} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <h5 className="card-title">{sarpras.nama_sarpras}</h5>
                                    <p className="card-text">
                                        Status Peminjaman:
                                        {' '}
                                        {sarpras.status_peminjaman === 'Tersedia' ? (
                                            <span className="text-success"><strong>{sarpras.status_peminjaman}</strong></span>
                                        ) : (
                                            <span className="text-danger"><strong>{sarpras.status_peminjaman}</strong></span>
                                        )}
                                    </p>
                                    <button className="btn btn-primary" onClick={() => handleDetailClick(sarpras)}>Detail Sarpras</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Tambah Sarpras Modal */}
                <div className="modal fade" id="CreateSarpras" tabIndex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="detailModalLabel">Tambah Data Sarana dan Prasarana</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-label">
                                    <label>Nama Sarpras : </label>
                                    <input type="text" className="form-control" value={newSarpras.nama_sarpras} onChange={(e) => setNewSarpras({ ...newSarpras, nama_sarpras: e.target.value })} />
                                </div>
                                <div className="form-label">
                                    <label>Deskripsi : </label>
                                    <input type="text" className="form-control" value={newSarpras.deskripsi} onChange={(e) => setNewSarpras({ ...newSarpras, deskripsi: e.target.value })} />
                                </div>
                                <div className="form-label">
                                    <label>Daya Tampung : </label>
                                    <input type="text" className="form-control" value={newSarpras.daya_tampung} onChange={(e) => setNewSarpras({ ...newSarpras, daya_tampung: e.target.value })} />
                                </div>
                                <div className="form-label">
                                    <label>Gambar Sarpras : </label>
                                    <input type="file" style={{ marginLeft: '1rem' }} className="form-control-file" onChange={(e) => setNewSarpras({ ...newSarpras, gambar_sarpras: e.target.files[0] })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={CreateSarpras}> Save </button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Bootstrap Modal */}
                <div className="modal fade" id="detailModal" tabIndex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="detailModalLabel">Detail Sarana Prasarana</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {/* Display details of selected sarpras in the modal */}
                                {selectedSarpras && (
                                    <>
                                        <p><strong>Nama Sarpras:</strong> {selectedSarpras.nama_sarpras}</p>
                                        <p><strong>Deskripsi:</strong> {selectedSarpras.deskripsi}</p>
                                        <p><strong>Daya Tampung:</strong> {selectedSarpras.daya_tampung}</p>
                                        <p><strong>Status Peminjaman:</strong> {selectedSarpras.status_peminjaman}</p>
                                    </>
                                )}

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" data-bs-target="#UpdateSarpras" data-bs-toggle="modal">
                                    <i className="align-middle" data-feather="edit"></i>
                                </button>
                                <button type="button" className="btn btn-danger" onClick={DeleteSarpras} data-bs-dismiss="modal">
                                    <i className="align-middle" data-feather="trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Update Sarpras Modal */}
                <div className="modal fade" id="UpdateSarpras" tabIndex="-1" aria-labelledby="UpdateSarpras" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="detailModalLabel">Update Data Sarana dan Prasarana</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-label">
                                    <label>Nama Sarpras : </label>
                                    <input type="text" className="form-control" value={selectedSarpras?.nama_sarpras || ''} onChange={(e) => setSelectedSarpras({ ...selectedSarpras, nama_sarpras: e.target.value })} />
                                </div>
                                <div className="form-label">
                                    <label>Deskripsi : </label>
                                    <input type="text" className="form-control" value={selectedSarpras?.deskripsi || ''} onChange={(e) => setSelectedSarpras({ ...selectedSarpras, deskripsi: e.target.value })} />
                                </div>
                                <div className="form-label">
                                    <label>Daya Tampung : </label>
                                    <input type="text" className="form-control" value={selectedSarpras?.daya_tampung || ''} onChange={(e) => setSelectedSarpras({ ...selectedSarpras, daya_tampung: e.target.value })} />
                                </div>
                                <div className="form-label">
                                    <label>Gambar Sarpras : </label>
                                    <input type="file" style={{ marginLeft: '1rem' }} className="form-control-file" onChange={(e) => setSelectedSarpras({ ...selectedSarpras, gambar_sarpras: e.target.files[0] })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={UpdateSarpras}> Update </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
};

export default PengelolaanSarpras;
