import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataTable } from 'simple-datatables';
import UploadProposalModal from '../components/Modals/UploadProposalModal';
import FileProposalModal from '../components/Modals/FileProposalModal';
import FileRABProkerModal from '../components/Modals/FileRABProkerModal';

const ProgramKerja = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [idKetua, setIdKetua] = useState(null);
    const [dataProker, setDataProker] = useState([]);
    const [selectedProkerId, setSelectedProkerId] = useState(null);
    const [fileData, setFileData] = useState(null);

    useEffect(() => {
      const idUser = localStorage.getItem('idUser');
      fetchOrmawa(idUser);
      fetchDataProker();
    }, [idKetua]);

    const fetchOrmawa = (id) => {
      console.log("idUser fetchormawa:", id);
      axios.get(`/api/auth/get-ketua/${id}`)
          .then((res) => {
              setIdKetua(res.data.data.id_ketua);
          })
          .catch((err) => {
              console.log(err);
          });
      
      console.log("idKetua ormawa:", idKetua);
  }

    const fetchDataProker = async () => {
        try {
            const response = await axios.get('/api/proker');
            const data = response.data.filter((proker) => proker.kak.id_ketua === idKetua);
            setDataProker(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching proker data:', error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/proker/${id}`);
    }

    const handleShowModal = (idProker) => {
      setSelectedProkerId(idProker);
    }

    const handleShowFile = (file) => {
      setFileData(file);
    }

    return (
      <main class="content">
        <div class="container-fluid p-0">

          <h1 class="h3 mb-3"><strong>Program Kerja</strong></h1>

          <div className="row">
            <div className="col-xl-12">
                <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Program Kerja</h5>
                    
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                    <table className="table datatable table-striped">
                        <thead>
                        <tr>
                            <th scope='col'>No</th>
                            <th scope='col'>Nama Kegiatan</th>
                            <th scope='col'>Tanggal Mulai</th>
                            <th scope='col'>Tanggal Akhir</th>
                            <th scope='col'>File Proposal</th>
                            <th scope='col'>File RAB</th>
                            <th scope='col'>Status</th>
                            <th scope='col'>Catatan</th>
                            <th scope='col'>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                            {dataProker.map((proker, index) =>(
                                <tr key={proker.id_proker}>
                                    <td>{index + 1}</td>
                                    <td>{proker.nama_kegiatan}</td>
                                    <td>{proker.tanggal_mulai}</td>
                                    <td>{proker.tanggal_akhir}</td>
                                    <td>
                                      <a onClick={() => handleShowFile(proker.file_proposal)} data-bs-toggle="modal" data-bs-target="#FileProposalModal" href='#'>
                                        Proposal {proker.nama_kegiatan}
                                      </a>
                                      <FileProposalModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                    </td>
                                    <td>
                                      <a onClick={() => handleShowFile(proker.file_rab)} data-bs-toggle="modal" data-bs-target="#FileRabProposalModal" href='#'>
                                        RAB {proker.nama_kegiatan}
                                      </a>
                                      <FileRABProkerModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                    </td>
                                    <td>{proker.status}</td>
                                    <td>{proker.catatan}</td>
                                    <td>
                                      {proker.status === 'Diajukan' ?  
                                        <button class="btn btn-primary mt-2" style={{ marginRight: '5px' }} onClick={() => handleShowModal(proker.id_proker)} data-bs-toggle="modal" data-bs-target="#uploadProposalModal"
                                        disabled={proker.kak.status !== 'Acc tahap akhir'}><i className='bi-upload'></i> Proposal</button>
                                        :
                                        <button class="btn btn-primary mt-2" onClick={() => handleEdit(proker.id_proker)} style={{marginRight: '5px'}}
                                        disabled={proker.status === 'Acc tahap akhir'}><i className='bi-pencil-square'></i> Edit</button>
                                      }
                                      <UploadProposalModal reloadData={fetchDataProker} selectedProkerId={selectedProkerId} />
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
      </main>
    );
};

export default ProgramKerja;
