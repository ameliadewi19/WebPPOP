import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import TambahKegiatanTimelineModal from '../components/Modals/TambahKegiatanTimelineModal.js';
import EditKegiatanTimelineModal from '../components/Modals/EditKegiatanTimelineModal.js';

const Timeline = () => {
    const [role, setRole] = useState(null);
    const history = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editTimelineId, setEditTimelineId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts
        const role = localStorage.getItem('role');
        setRole(role);
        fetchTimeline();
        // console.log("test");
    }, []);

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleShowEditModal = (idTimeline) => {
      setEditTimelineId(idTimeline);
      setShowEditModal(true);
    };
      
    const handleDelete = (idTimeline) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    
        if (isConfirmed) {
          axios.delete(`/api/timeline/${idTimeline}`)
            .then((response) => {
              console.log(response.data.message); 
            })
            .catch((error) => {
              console.error('Error deleting item:', error);
            });

          setShowModal(false);
        }

        fetchTimeline();
    };
      

    const fetchTimeline = async () => {
        try {
            const res = await axios.get('/api/timeline');
            setTimeline(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    const handleIzinSubmit = (id_timeline) => {
        // axios.put(`http://localhost:8000/api/proker/izin-submit/${id_timeline}`)
        //   .then(response => {
        //     console.log('Izin submit updated successfully:', response.data);
        //   })
        //   .catch(error => {
        //     console.error('Error updating izin submit:', error);
        //   });
        fetchTimeline();
      }

    return (
        <main class="content">
          <div class="container-fluid p-0">
  
            <h1 class="h3 mb-3"><strong>Timeline {role}</strong></h1>
  
            <div className="row">
              <div className="col-xl-12">
                  <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title">Timeline</h5>
                      <button class="btn btn-primary mt-2" onClick={handleShowModal} data-bs-toggle="modal" data-bs-target="#addUploadKAKModal"><i className="align-middle" data-feather="plus"></i> <span className="align-middle">Tambah Kegiatan</span></button>
                      <TambahKegiatanTimelineModal showModal={showModal} setShowModal={setShowModal} reloadData={fetchTimeline}/>
                  </div>
                  <div className="card-body">
                      <div className="table-responsive">
                      <table className="table table-striped">
                          <thead>
                          <tr>
                              <th>No</th>
                              <th>Kegiatan</th>
                              <th>Tanggal Mulai</th>
                              <th>Tanggal Akhir</th>
                              <th>Aksi</th>
                              {role === 'admin' &&
                                <th>Izin Submit</th>
                              }
                          </tr>
                          </thead>
                          <tbody>
                            {timeline.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.nama_kegiatan}</td>
                                    <td>{new Date(item.tanggal_mulai).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td>{new Date(item.tanggal_selesai).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td>
                                        {/* <button className="btn btn-sm btn-primary" onClick={handleEdit}>Edit</button> */}
                                        <button class="btn btn-sm btn-primary " onClick={() => handleShowEditModal(item.id_timeline)} data-bs-toggle="modal" data-bs-target="#editUploadKAKModal"><span className="align-middle">Edit</span></button>
                                        <EditKegiatanTimelineModal showModal={showEditModal} setShowModal={setShowEditModal} reloadData={fetchTimeline} timelineId={editTimelineId}/>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id_timeline)}>Hapus</button>
                                    </td>
                                    {role === 'admin' && item.izin_submit === 'true' && <td><button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleIzinSubmit(item.id_timeline)}
                                    >
                                        {item.izin_submit}
                                    </button></td>
                                    }
                                    {role === 'admin' && item.izin_submit === 'false' && <td><button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleIzinSubmit(item.id_timeline)}
                                        >
                                            {item.izin_submit}
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
        </main>
      );
};

export default Timeline;
