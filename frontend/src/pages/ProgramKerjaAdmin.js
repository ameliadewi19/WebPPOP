import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import AccProkerModal from '../components/Modals/AccProkerModal';
import FileProposalModal from '../components/Modals/FileProposalModal';
import FileRABProkerModal from '../components/Modals/FileRABProkerModal';
import { DataTable } from 'simple-datatables';

const ProgramKerjaAdmin = () => {
    const location = useLocation();
    const [prokers, setProkers] = useState([]);
    const [showAccModal, setShowAccModal] = useState(false);
    const [selectedProkerId, setSelectedProkerId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [fileData, setFileData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    let datatable;

    const role = localStorage.getItem('role');

    useEffect(() => {
      fetchData();
      feather.replace();
    }, [role]);

    useEffect(() => {
      if (prokers.length > 0) {
          datatable = new DataTable('.datatable', {
              sortable: false,
              searchable: false,
              paging: false
          });
          datatable.on("datatable.init", () => {
              setIsLoading(false);
              datatable.refresh();
          });
      }
  }, [prokers]);

    const fetchData = async () => {
      try {
          const response = await axios.get('/api/proker');
          let filteredProkers = [];

          if (role === "sekumbem") {
              filteredProkers = response.data.filter(proker =>
                  proker.status === 'Diajukan' ||
                  proker.status === 'Acc tahap 1' ||
                  proker.status === 'Unggah proposal' ||
                  proker.status === 'Revisi tahap 1' ||
                  proker.status === 'Tolak tahap 1'
              );
          } else if (role === "admin") {
            filteredProkers = response.data;
            //   filteredProkers = response.data.filter(proker =>
            //       proker.status === 'Acc tahap 1' ||
            //       proker.status === 'Revisi tahap 2' ||
            //       proker.status === 'Tolak tahap 2'
            //   );
          }

          setProkers(filteredProkers);

          console.log(response.data);
      } catch (error) {
          console.error('Error fetching proker data:', error);
      }
  };

    const handleShowAccModal = (prokerId, status) => {
        setSelectedProkerId(prokerId);
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
                      <i className="bi-pencil"></i> Revisi
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
      <main class="content">
        <div class="container-fluid p-0">

          <h1 class="h3 mb-3">Program<strong> Kerja</strong></h1>

          <div className="row">
            <div className="col-xl-12">
                <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mt-1">Program Kerja</h5>
                </div>
                <div className="card-body">
                    {isLoading && (
                        <div className="text-center justify-center">
                         Loading ...
                        </div>
                    )}
                    <div className="table-responsive">
                    <table className="table datatable table-striped">
                    {isLoading ? null : (
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
                            <th>Aksi</th>
                            {role === 'admin' && <th>Izin Submit</th>}
                        </tr>
                        </thead>
                    )}
                        <tbody>
                          {prokers.map((proker, index) => (
                              <tr key={index}>
                                  <td>{index + 1}</td>
                                  {/* <td>{proker.kak.ketua_ormawa.ormawa.nama_ormawa}</td>/ */}
                                  <td>{proker.kak?.ketua_ormawa?.ormawa?.nama_ormawa || 'N/A'}</td>
                                  <td>{proker.nama_kegiatan}</td>
                                  <td>{proker.ketua_pelaksana}</td>
                                  <td>{proker.deskripsi_kegiatan}</td>
                                  <td>{proker.tanggal_mulai}</td>
                                  <td>{proker.tanggal_akhir}</td>
                                  <td>{proker.status}</td>
                                  <td>{proker.catatan}</td>
                                  <td>
                                  {proker.status !== 'Diajukan' ? ( 
                                    <>
                                    <a onClick={() => handleShowModal(proker.file_proposal)} data-bs-toggle="modal" data-bs-target="#FileProposalModal" href='#'>
                                    Dokumen Proposal
                                    </a>
                                    <FileProposalModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                    </>
                                    ) : 
                                    (
                                      <p>-</p>
                                    )
                                  }
                                  </td>
                                  <td>
                                  {proker.status !== 'Diajukan' ? ( 
                                    <>
                                    <a onClick={() => handleShowModal(proker.file_rab)} data-bs-toggle="modal" data-bs-target="#FileRabProposalModal" href='#'>
                                    Dokumen RAB 
                                    </a>
                                    <FileRABProkerModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                    </>
                                    ) : 
                                    (
                                      <p>-</p>
                                    )
                                  }
                                  </td>

                                  <td>
                                    {role === 'admin' ? (
                                        proker.status === 'Acc tahap akhir' ? 'Proker selesai diproses' :
                                        proker.status === 'Diajukan' ||
                                        proker.status === 'Submit proposal' ||
                                        proker.status === 'Revisi tahap 1' ||
                                        proker.status === 'Tolak tahap 1' ?
                                        'Belum di acc oleh Sekumbem' :
                                        renderButton(proker.id_proker)
                                    ) : (
                                        role === 'sekumbem' && proker.status === 'Unggah proposal' && 
                                        renderButton(proker.id_proker)
                                    )}
                                  </td>
                                  {/* <td>{renderButton(proker.id_proker)}</td> */}
                                  {role === 'admin' && proker.izin_submit === 'true' && <td><button
                                        className="btn btn-primary mt-2"
                                        onClick={() => handleIzinSubmit(proker.id_proker)}
                                    >
                                        {proker.izin_submit}
                                    </button></td>
                                  }
                                  {role === 'admin' && proker.izin_submit === 'false' && <td><button
                                        className="btn btn-danger mt-2"
                                        onClick={() => handleIzinSubmit(proker.id_proker)}
                                    >
                                        {proker.izin_submit}
                                    </button></td>
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
        <AccProkerModal showModal={showAccModal} setShowModal={setShowAccModal} handleSubmit={handleAccSubmit} selectedProkerId={selectedProkerId} selectedStatus={selectedStatus} reloadData={fetchData}/>
      </main>
    );
};

export default ProgramKerjaAdmin;
