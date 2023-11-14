import React, { useState, useEffect } from 'react';
import axios from 'axios';
import feather from 'feather-icons';
import 'bootstrap/dist/js/bootstrap.bundle';
import AccModal from '../components/Modals/AccModal';
import EditKAKModal from '../components/Modals/EditKAKModal';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import FileKAKModal from '../components/Modals/FileKAKModal';

// Using Arrow Function
const KAKAdmin = () => {
    const [kaks, setKaks] = useState([]);
    const [showAccModal, setShowAccModal] = useState(false);
    const [selectedKakId, setSelectedKakId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fileData, setFileData] = useState(null);

    const role = localStorage.getItem('role');

    const handleShowModal = async (file) => {
        setFileData(file);
        // console.log("file: ", file);
        setShowModal(true);
    };

    const handleShowAccModal = (kakId, status) => {
        setSelectedKakId(kakId);
        setSelectedStatus(status);
        setShowAccModal(true);
    }

    const handleAccSubmit = (catatan) => {
        // Lakukan sesuatu dengan catatan
        console.log('Catatan:', catatan);
    }

    const fetchData = () => {
        axios.get('/api/kak')
        .then(response => {
            if (role === "sekumbem"){
                const filteredKaks = response.data.filter(kak => kak.status === 'Diajukan' || kak.status === 'Revisi tahap 1' || kak.status === 'Tolak tahap 1');
                setKaks(filteredKaks);
            } else if (role === "admin"){
                const filteredKaks = response.data.filter(kak => kak.status === 'Acc tahap 1' || kak.status === 'Revisi tahap 2' || kak.status === 'Tolak tahap 2');
                setKaks(filteredKaks);
            } else if (role === "kli"){
                const filteredKaks = response.data.filter(kak => kak.status === 'Acc tahap 2' || kak.status === 'Revisi tahap 3' || kak.status === 'Tolak tahap 3');
                setKaks(filteredKaks);
            } else if (role === "wd3"){
                const filteredKaks = response.data.filter(kak => kak.status === 'Acc tahap 3' || kak.status === 'Revisi tahap Akhir' || kak.status === 'Tolak tahap akhir');
                setKaks(filteredKaks);
            }
        })
        .catch(error => {
            console.error('Error fetching KAK data:', error);
        });
      };

    useEffect(() => {
        fetchData();
        feather.replace();
    }, []);

    const renderButton = (kak) => {
            return (
                <div>
                    <button
                        className="btn btn-primary mt-2"
                        style={{ marginRight: '5px' }}
                        data-bs-toggle="modal"
                        data-bs-target="#pesanModal"
                        onClick={() => handleShowAccModal(kak, "acc")}
                    >
                        <i className="align-middle" data-feather="check"></i> Acc
                    </button>
                    <button
                        className="btn btn-warning mt-2"
                        style={{ marginRight: '5px' }}
                        data-bs-toggle="modal"
                        data-bs-target="#pesanModal"
                        onClick={() => handleShowAccModal(kak, "revisi")}
                    >
                        <i className="align-middle" data-feather="edit"></i> Revisi
                    </button>
                    <button
                        className="btn btn-danger mt-2"
                        style={{ marginRight: '5px' }}
                        data-bs-toggle="modal"
                        data-bs-target="#pesanModal"
                        onClick={() => handleShowAccModal(kak, "tolak")}
                    >
                        <i className="align-middle" data-feather="trash"></i> Tolak
                    </button>
                </div>
            );
    }

    return (
      <main class="content">
        <div class="container-fluid p-0">

          <h1 class="h3 mb-3">Pengajuan<strong> KAK</strong></h1>

          <div className="row">
            <div className="col-xl-12">
                <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mt-1">KAK</h5>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Ormawa</th>
                            <th>Nama Ketua</th>
                            <th>Dokumen KAK</th>
                            <th>Dokumen RAB</th>
                            <th>Status</th>
                            <th>Catatan</th>
                            <th>Proker</th>
                            <th>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                        {kaks.map((kak, index) => (
                            <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{kak.ketua_ormawa.ormawa.nama_ormawa}</td>
                            <td>{kak.ketua_ormawa.nama_ketua}</td>
                            <td>
                                <a onClick={() => handleShowModal(kak.file_kak)} data-bs-toggle="modal" data-bs-target="#FileKAKModal" href='#'>
                                    Dokumen KAK
                                </a>
                                <FileKAKModal pdfData={kak.file_kak} showModal={showModal} setShowModal={setShowModal} />
                            </td>
                            <td>
                                <a href={`/storage/${kak.file_rab}`} target="_blank" rel="noopener noreferrer">Dokumen RAB</a>
                            </td>
                            <td>{kak.status}</td>
                            <td>{kak.catatan}</td>
                            <td>
                                {kak.prokers.map(proker => (
                                <div key={proker.id_proker}>
                                    Nama Kegiatan: {proker.nama_kegiatan}<br />
                                    Ketua Pelaksana: {proker.ketua_pelaksana}<br />
                                    Deskripsi Kegiatan: {proker.deskripsi_kegiatan}<br />
                                    Tanggal Mulai: {proker.tanggal_mulai}<br />
                                    Tanggal Akhir: {proker.tanggal_akhir}<br />
                                    Status: {proker.status}<br />
                                    Catatan: {proker.catatan}<br /><br />
                                </div>
                                ))}
                            </td>
                            <td>
                                {renderButton(kak.id_kak)}
                                {/* <button
                                    className="btn btn-primary mt-2"
                                    style={{ marginRight: '5px' }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#pesanModal"
                                    onClick={() => handleShowAccModal(kak.id_kak, "acc")}
                                >
                                <i className="align-middle" data-feather="check"></i> Acc
                                </button>
                                <button
                                    className="btn btn-warning mt-2"
                                    style={{ marginRight: '5px' }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#pesanModal"
                                    onClick={() => handleShowAccModal(kak.id_kak, "revisi")}
                                >
                                <i className="align-middle" data-feather="edit"></i> Revisi
                                </button>
                                <button
                                    className="btn btn-danger mt-2"
                                    style={{ marginRight: '5px' }}
                                    data-bs-toggle="modal"
                                    data-bs-target="#pesanModal"
                                    onClick={() => handleShowAccModal(kak.id_kak, "tolak")}
                                >
                                <i className="align-middle" data-feather="trash"></i> Tolak
                                </button> */}
                            </td>
                            </tr>
                        ))} 
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>
        <AccModal showModal={showAccModal} setShowModal={setShowAccModal} handleSubmit={handleAccSubmit} selectedKakId={selectedKakId} selectedStatus={selectedStatus} reloadData={fetchData}/>
      </main>
    );
};

export default KAKAdmin;
