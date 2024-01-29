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
    const [dataProker, setDataProker] = useState([
      {
        id_proker: '',
        nama_kegiatan: '',
        tanggal_mulai: '',
        tanggal_akhir: '',
        status: '',
        lpj: {
          id_lpj: '',
          file_lpj: '',
          file_rab_lpj: '',
          status: '',
          catatan: '',
        }
      }
    ]);
    const [selectedlpjId, setSelectedlpjId] = useState(null);
    const [selectedProkerId, setSelectedProkerId] = useState(null);

    useEffect(() => {
      const idUser = localStorage.getItem('idUser');
      fetchOrmawa(idUser);
      fetchDataProker();
      fetchDatalpj();
      console.log("formData", dataProker);
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
        const response = await axios.get('/api/proker/');
        const prokerData = response.data.filter((proker) => proker.kak.id_ketua === idKetua && proker.status === 'Acc tahap akhir');

        setDataProker(prokerData);
        fetchDatalpj(prokerData);
    } catch (error) {
        console.error('Error fetching proker data:', error);
        setIsDataAvailable(false)
    } finally{
      setIsLoading(false)
    }
  };

  const fetchDatalpj = async (prokerData) => {
      try {
          const response = await axios.get('/api/lpj/');
          const lpjData = response.data;

          const updatedDataProker = prokerData.map((proker) => {
              const matchingLPJ = lpjData.find((lpj) => lpj.id_proker === proker.id_proker);

              if (matchingLPJ) {
                  return {
                      ...proker,
                      lpj: {
                          id_lpj: matchingLPJ.id_lpj,
                          file_lpj: matchingLPJ.file_lpj,
                          file_rab_lpj: matchingLPJ.file_rab_lpj,
                          status: matchingLPJ.status,
                          catatan: matchingLPJ.catatan,
                      },
                  };
              } else {
                  return proker;
              }
          });

          // Update data state with the latest data
          setData(updatedDataProker);
          setIsDataAvailable(updatedDataProker.length > 0)
          // Log the updated dataProker
          console.log("Updated Data:", updatedDataProker);
      } catch (error) {
          console.error('Error fetching lpj data:', error);
          setIsDataAvailable(false)
      } finally {
        setIsLoading(false)
      }
  };


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
                                <tbody>
                                    {data.map((proker, index) =>(
                                        <tr key={proker.id_proker}>
                                            <td>{index + 1}</td>
                                            <td>{proker.nama_kegiatan}</td>
                                            <td>{proker.tanggal_mulai}</td>
                                            <td>{proker.tanggal_akhir}</td>
                                            {proker.lpj.file_lpj && (
                                              <>
                                                <td>
                                                  <a onClick={() => handleShowFile(proker.lpj.file_lpj)} data-bs-toggle="modal" data-bs-target="#FileLpjModal" href='#'>
                                                    LPJ {proker.nama_kegiatan}
                                                  </a>
                                                  <FileLpjModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                                </td>
                                                <td>
                                                  <a onClick={() => handleShowFile(proker.lpj.file_rab_lpj)} data-bs-toggle="modal" data-bs-target="#FileLpjModal" href='#'>
                                                    RAB LPJ {proker.nama_kegiatan}
                                                  </a>
                                                  <FileLpjModal pdfData={fileData} showModal={showModal} setShowModal={setShowModal} />
                                                </td>
                                              </>
                                            ) || (
                                              <>
                                                <td></td>
                                                <td></td>
                                              </>
                                            )}
                                            <td>{proker.lpj.status}</td>
                                            <td>{proker.lpj.catatan}</td>
                                            <td>
                                              {proker.status === 'Acc tahap akhir' && proker.lpj.file_lpj === '' ? 
                                                <button class="btn btn-primary mt-2"
                                                  style={{ marginRight: '5px' }}
                                                  onClick={() => handleShowModal(proker.id_proker)}
                                                  data-bs-toggle="modal" data-bs-target="#uploadLPJModal"
                                                  disabled={isUploadDisabled(proker.tanggal_akhir)}
                                                  title={'Upload LPJ'}><i className='bi-upload'></i> LPJ</button>
                                              :
                                                <button class="btn btn-primary mt-2" onClick={() => handleEdit(proker.lpj.id_lpj, proker.id_proker)} style={{marginRight: '5px'}} data-bs-toggle="modal" data-bs-target="#editLPJModal"
                                                disabled={proker.lpj.status === 'Acc tahap akhir'}>
                                                  {proker.lpj.status === 'Revisi tahap 1' || proker.lpj.status === 'Tolak tahap 1' ? (
                                                      <><i className='bi-upload'></i> Revisi</>
                                                    ) : (
                                                      <i className='bi-pencil-square'></i>
                                                    )}
                                                </button>
                                              }
                                              {console.log("tanggal_akhir: ", proker.tanggal_akhir)}
                                              <UploadLPJModal reloadData={fetchDataProker} selectedProkerId={selectedProkerId} />
                                              <EditLPJModal reloadData={fetchDataProker} selectedlpjId={selectedlpjId} selectedProkerId={selectedProkerId} />
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
