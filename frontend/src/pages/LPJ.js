import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataTable } from 'simple-datatables';
import UploadLPJModal from '../components/Modals/UploadLPJModal';
import FileLpjModal from '../components/Modals/FileLPJModal';
import EditLPJModal from '../components/Modals/EditLPJModal';

const LPJ = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isDataAvailable, setIsDataAvailable] = useState(true);
    let datatable;

    const [idKetua, setIdKetua] = useState(null);
    const [dataLpj, setDataLpj] = useState([]);
    const [fileData, setFileData] = useState(null);
    const [data, setData] = useState([])
    // const [dataProker, setDataProker] = useState([
    //   {
    //     id_proker: '',
    //     nama_kegiatan: '',
    //     tanggal_mulai: '',
        
    //     tanggal_akhir: '',
    //     status: '',
    //     lpj: {
    //       id_lpj: '',
    //       file_lpj: '',
    //       file_rab_lpj: '',
    //       status: '',
    //       catatan: '',
    //     }
    //   }
    // ]);
    const [dataProker, setDataProker] = useState([])
    const [selectedlpjId, setSelectedlpjId] = useState(null);
    const [selectedProkerId, setSelectedProkerId] = useState(null);

    useEffect(() => {
      const idUser = localStorage.getItem('idUser');
      fetchOrmawa(idUser);
      fetchDataProker();
      // fetchDatalpj();
      // console.log("formData", dataProker);
        console.log('Data Proker lpj: ', dataProker)
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

  // const fetchDataProker = async () => {
  //   try {
  //       const prokerResponse = axios.get('/api/proker/');
  //       const lpjResponse = axios.get('/api/lpj/');

  //       const [prokerRes, lpjRes] = await Promise.all([prokerResponse, lpjResponse]);
  //       const prokerData = prokerRes.data.filter((proker) => proker.kak.id_ketua === idKetua && proker.status === 'Acc tahap akhir');

  //       if (prokerData.length > 0) {
  //           fetchDatalpj(prokerData, lpjRes.data);
  //       } else {
  //           setIsLoading(false);
  //           setIsDataAvailable(false);
  //       }
  //   } catch (error) {
  //       console.error('Error fetching proker data:', error);
  //       setIsDataAvailable(false);
  //       setIsLoading(false);
  //   }
  // };

  // const fetchDatalpj = async (prokerData, lpjData) => {
  //     try {
  //         const updatedDataProker = prokerData.map((proker) => {
  //             const matchingLPJ = lpjData.find((lpj) => lpj.id_proker === proker.id_proker);

  //             if (matchingLPJ) {
  //                 return {
  //                     ...proker,
  //                     lpj: {
  //                         id_lpj: matchingLPJ.id_lpj,
  //                         file_lpj: matchingLPJ.file_lpj,
  //                         file_rab_lpj: matchingLPJ.file_rab_lpj,
  //                         status: matchingLPJ.status,
  //                         catatan: matchingLPJ.catatan,
  //                     },
  //                 };
  //             } else {
  //                 return {
  //                     ...proker,
  //                     lpj: null,
  //                 };
  //             }
  //         });

  //         setData(updatedDataProker);
  //         setIsDataAvailable(updatedDataProker.length > 0);
  //         setIsLoading(false);
  //         console.log("Updated Data:", updatedDataProker);
  //     } catch (error) {
  //         console.error('Error fetching lpj data:', error);
  //         setIsDataAvailable(false);
  //         setIsLoading(false);
  //     }
  // };

    // useEffect(() => {
    //   if (dataLpj.length > 0){
    //     datatable = new DataTable('.table-lpj', {
    //         sortable: false,
    //         searchable: false,
    //         paging: false
    //     });
    //     datatable.on("datatable.init", () => {
    //       setIsLoading(false);
    //       datatable.refresh();
    //     })
    //   }
    // }, [dataProker])
  
    const fetchDataProker = async () => {
      try {
        setIsLoading(true);
        console.log('idKetua in fetchproker:', idKetua)
        const responseProker = await axios.get('/api/proker');
        const prokerData = responseProker.data.filter((proker) => proker.kak.id_ketua === idKetua && proker.status === 'Acc tahap akhir');
        
        const prokerWithLPJData = await Promise.all(prokerData.map(async (proker) => {
          try {
            const responseLPJ = await axios.get(`/api/lpj/proker/${proker.id_proker}`);
            proker.lpjData = responseLPJ.data;
            return proker;
          } catch (error) {
            console.error('Error fetching LPJ data:', error);
            return proker;
          }
        }));
        
        setDataProker(prokerWithLPJData);
        setIsDataAvailable(prokerWithLPJData.length > 0);
      } catch (error) {
        console.error('Error fetching data proker:', error);
        setIsDataAvailable(false);
      } finally {
        setIsLoading(false);
      }
    }
    

    const handleShowModal = (idlpj) => {
      setSelectedProkerId(idlpj);
    }

    const handleEdit = (idLpj, idproker) => {
      setSelectedlpjId(idLpj);
      setSelectedProkerId(idproker);
    }

    const handleShowFile = (file) => {
      setFileData(file);
    }

    const isUploadDisabled = (tanggal_akhir) => {
      // Menghitung selisih hari antara tanggal akhir dan tanggal saat ini
      const today = new Date();
      const differenceInMilliseconds = today - new Date(tanggal_akhir);
      const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    

      // Menonaktifkan tombol jika selisih hari lebih dari 14
      console.log("diffdaylpj: ", differenceInDays)
      return differenceInDays > 14;
    };
    return (
      <main class="content">
        <div class="container-fluid p-0">

          <h1 class="h3 mb-3"><strong>LPJ</strong></h1>

          <div className="row">
            <div className="col-xl-12">
                <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">LPJ</h5>
                    
                </div>
                <div className="card-body">
                    {isLoading && (
                        <div className="text-center justify-center">
                         Loading ...
                        </div>
                    )}

                    {!isLoading && (
                      <>
                        {isDataAvailable && (
                          <div className="table-responsive">
                            <table className="table table-lpj table-striped">
                              {isLoading ? null: (
                                <thead>
                                  <tr>
                                      <th scope='col'>No</th>
                                      <th scope='col'>Nama Kegiatan</th>
                                      <th scope='col'>Tanggal Mulai</th>
                                      <th scope='col'>Tanggal Akhir</th>
                                      <th scope='col'>File LPJ</th>
                                      <th scope='col'>File RAB</th>
                                      <th scope='col'>Status</th>
                                      <th scope='col'>Catatan</th>
                                      <th scope='col'>Aksi</th>
                                  </tr>
                                </thead>
                              )}
                                <tbody>
                                  {dataProker.map((proker, index) => (
                                    <tr key={proker.id_proker}>
                                      <td>{index + 1}</td>
                                      <td>{proker.nama_kegiatan}</td>
                                      <td>{proker.tanggal_mulai}</td>
                                      <td>{proker.tanggal_akhir}</td>
                                      {proker.lpjData.length > 0 ? ( // Menggunakan lpjData yang diambil dari fetchDataProker
                                        <>
                                          <td>
                                            <a
                                              onClick={() => handleShowFile(proker.lpjData[0].file_lpj)}
                                              data-bs-toggle="modal"
                                              data-bs-target="#FileLpjModal"
                                              href="#"
                                            >
                                              LPJ {proker.nama_kegiatan}
                                            </a>
                                            <FileLpjModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                          </td>
                                          <td>
                                            <a
                                              onClick={() => handleShowFile(proker.lpjData[0].file_rab_lpj)}
                                              data-bs-toggle="modal"
                                              data-bs-target="#FileLpjModal"
                                              href="#"
                                            >
                                              RAB LPJ {proker.nama_kegiatan}
                                            </a>
                                            <FileLpjModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                          </td>
                                          <td>{proker.lpjData[0].status}</td>
                                          <td>{proker.lpjData[0].catatan}</td>
                                        </>
                                      ) : (
                                        <>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                          <td></td>
                                        </>
                                      )}
                                      <td>
                                        {proker.lpjData.length === 0 ? (
                                          <button
                                            className="btn btn-primary mt-2"
                                            style={{ marginRight: '5px' }}
                                            onClick={() => handleShowModal(proker.id_proker)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#uploadLPJModal"
                                            disabled={isUploadDisabled(proker.tanggal_akhir)}
                                            title={'Upload LPJ'}
                                          >
                                            <i className="bi-upload"></i> LPJ
                                          </button>
                                        ) : (
                                          <button
                                            className="btn btn-primary mt-2"
                                            onClick={() => handleEdit(proker.lpjData ? proker.lpjData.id_lpj : null, proker.id_proker)}
                                            style={{ marginRight: '5px' }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#editLPJModal"
                                            disabled={(proker.lpjData[0].status === 'Acc tahap akhir')}
                                          >
                                            {(proker.lpjData[0].status === 'Revisi tahap 1' || proker.lpjData[0].status === 'Tolak tahap 1') ? (
                                              <> <i className="bi-upload"></i> Revisi </>
                                            ) : (
                                              <i className="bi-pencil-square"></i>
                                            )}
                                          </button>
                                        )}
                                        <UploadLPJModal reloadData={fetchDataProker} selectedProkerId={selectedProkerId} />
                                        <EditLPJModal reloadData={fetchDataProker} selectedlpjId={proker.lpjData.id_lpj} selectedProkerId={selectedProkerId} />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>

                            </table>
                          </div>
                        )}

                        {!isDataAvailable && (
                            <div className="text-center justify-center">
                                Tidak ada data yang ditemukan.
                            </div>
                        )}
                      </>
                    )}
                </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    );
};

export default LPJ;
