import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import AccLPJModal from '../components/Modals/AccLPJModal';
import FileProposalModal from '../components/Modals/FileProposalModal';
import FileRABModal from '../components/Modals/FileRABModal';
import FileLPJModal from '../components/Modals/FileLPJModal';

const LPJAdmin = () => {
    const location = useLocation();
    const [lpj, setLPJ] = useState([]);
    const [showAccModal, setShowAccModal] = useState(false);
    const [selectedLPJId, setSelectedLPJId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fileData, setFileData] = useState(null);

    const role = localStorage.getItem('role');

    useEffect(() => {
      fetchData();
      feather.replace();
    }, [role]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/lpj'); // Mengubah URL dari /api/proker menjadi /api/lpj
            let filteredLPJ = [];
      
            if (role === "sekumbem") {
                filteredLPJ = response.data.filter(lpj =>
                    lpj.status === 'Submit lpj' ||
                    lpj.status === 'Revisi tahap 1' ||
                    lpj.status === 'Tolak tahap 1'
                );
            } else if (role === "admin") {
                filteredLPJ = response.data;
                // filteredLPJ = response.data.filter(lpj =>
                //     lpj.status === 'Acc tahap 1' ||
                //     lpj.status === 'Revisi tahap 2' ||
                //     lpj.status === 'Tolak tahap 2'
                // );
            } 
      
            setLPJ(filteredLPJ); // Mengatur data LPJ ke state LPJ
            console.log(filteredLPJ);
        } catch (error) {
            console.error('Error fetching lpj data:', error); // Mengubah pesan error untuk mencerminkan perubahan
        }
      };
      

    const handleShowAccModal = (lpjID, status) => {
        setSelectedLPJId(lpjID);
        setSelectedStatus(status);
        setShowAccModal(true);
    }

    const handleAccSubmit = (catatan) => {
        // Lakukan sesuatu dengan catatan
        console.log('Catatan:', catatan);
    }

    const handleIzinSubmit = (id_proker) => {
      axios.put(`http://localhost:8000/api/proker/izin-submit/${id_proker}`)
        .then(response => {
          console.log('Izin submit updated successfully:', response.data);
        })
        .catch(error => {
          console.error('Error updating izin submit:', error);
        });
      fetchData();
    }

    const handleShowModal = async (file) => {
        setFileData(file);
        console.log("fileData: ", file);
        setShowModal(true);
    };

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
                      <i className="bi-check2"></i> Acc
                  </button>
                  <button
                      className="btn btn-warning mt-2"
                      style={{ marginRight: '5px' }}
                      data-bs-toggle="modal"
                      data-bs-target="#pesanModal"
                      onClick={() => handleShowAccModal(kak, "revisi")}
                  >
                      <i className="bi-edit"></i> Revisi
                  </button>
                  <button
                      className="btn btn-danger mt-2"
                      style={{ marginRight: '5px' }}
                      data-bs-toggle="modal"
                      data-bs-target="#pesanModal"
                      onClick={() => handleShowAccModal(kak, "tolak")}
                  >
                      <i className="bi-trash"></i> Tolak
                  </button>
              </div>
          );
  }

    return (
      <main className="content">
        <div className="container-fluid p-0">

          <h1 className="h3 mb-3"><strong>LPJ Proker</strong></h1>

          <div className="row">
            <div className="col-xl-12">
                <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mt-1">Laporan Pertanggung Jawaban Program Kerja</h5>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>No</th>
                            <th>Ormawa</th>
                            <th>Nama Kegiatan</th>
                            <th>Ketua Pelaksana</th>
                            <th>Deskripsi Kegiatan</th>
                            <th>Tanggal Mulai</th>
                            <th>Tanggal Akhir</th>
                            <th>Status</th>
                            <th>Catatan</th>
                            <th>File Proposal</th>
                            <th>File RAB</th>
                            <th>File LPJ</th>
                            <th>Aksi</th>
                            {role === 'admin' && <th>Izin Submit</th>}
                        </tr>
                        </thead>
                        <tbody>
                            {lpj.map((lpjItem, index) => (
                                <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{lpjItem.proker.kak.ketua_ormawa.ormawa.nama_ormawa}</td>
                                <td>{lpjItem.proker.nama_kegiatan}</td>
                                <td>{lpjItem.proker.ketua_pelaksana}</td>
                                <td>{lpjItem.proker.deskripsi_kegiatan}</td>
                                <td>{lpjItem.proker.tanggal_mulai}</td>
                                <td>{lpjItem.proker.tanggal_akhir}</td>
                                <td>{lpjItem.status}</td>
                                <td>{lpjItem.catatan}</td>
                                <td>
                                    <a onClick={() => handleShowModal(lpjItem.proker.file_proposal)} data-bs-toggle="modal" data-bs-target="#FileProposalModal" href='#'>
                                    Dokumen Proposal
                                    </a>
                                    <FileProposalModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                  </td>
                                  <td>
                                    <a onClick={() => handleShowModal(lpjItem.proker.file_rab)} data-bs-toggle="modal" data-bs-target="#FileRABModal" href='#'>
                                    Dokumen RAB
                                    </a>
                                    <FileRABModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                  </td>
                                  <td>
                                    <a onClick={() => handleShowModal(lpjItem.file_lpj)} data-bs-toggle="modal" data-bs-target="#FileLPJModal" href='#'>
                                    Dokumen RAB
                                    </a>
                                    <FileLPJModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                  </td>
                                <td>
                                {lpjItem.status === 'Acc tahap akhir' ? 'LPJ selesai diproses' :
                                    lpjItem.status === 'Submit lpj' ||
                                    lpjItem.status === 'Revisi tahap 1' ||
                                    lpjItem.status === 'Tolak tahap 1' ?
                                    'Belum di acc oleh Sekumbem' :
                                    renderButton(lpjItem.id_lpj)
                                }
                                </td>
                                {role === 'admin' && lpjItem.proker.izin_submit === 'true' &&
                                    <td>
                                        <button
                                            className="btn btn-primary mt-2"
                                            onClick={() => handleIzinSubmit(lpjItem.id_lpj)}
                                        >
                                            {lpjItem.proker.izin_submit}
                                        </button>
                                    </td>
                                }
                                {role === 'admin' && lpjItem.proker.izin_submit === 'false' &&
                                    <td>
                                        <button
                                            className="btn btn-danger mt-2"
                                                onClick={() => handleIzinSubmit(lpjItem.id_lpj)}
                                        >
                                            {lpjItem.proker.izin_submit}
                                        </button>
                                    </td>
                                }
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
        <AccLPJModal showModal={showAccModal} setShowModal={setShowAccModal} handleSubmit={handleAccSubmit} selectedLPJId={selectedLPJId} selectedStatus={selectedStatus} reloadData={fetchData}/>
      </main>
    );
};

export default LPJAdmin;
