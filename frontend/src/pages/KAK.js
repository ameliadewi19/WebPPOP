import React, { useState, useEffect } from 'react';
import axios from 'axios';
import feather from 'feather-icons';
import 'bootstrap/dist/js/bootstrap.bundle';
import EditKAKModal from '../components/Modals/EditKAKModal';
import FileKAKModal from '../components/Modals/FileKAKModal';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'simple-datatables';

// Using Arrow Function
const KAK = () => {

    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [idUser, setIdUser] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [dataKak, setDataKak] = useState([]);

    const [idKetua, setIdKetua] = useState(null)
    const [kakOrmawa, setKakOrmawa] = useState(null);

    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts
        const role = localStorage.getItem('role');
        const idUser = localStorage.getItem('idUser');
        setIdUser(idUser);
        setRole(role);
        fetchDataKAK();
    }, []);

    const fetchOrmawa = () => {

    }

    const fetchDataKAK = () => {
        axios.get(`/api/kak/`)
        .then((res) => {
            setDataKak(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
        console.log(dataKak);
    }

    useEffect(() => {
        if (dataKak.length > 0) {
            const table = new DataTable('.datatable', {
                columns : [
                    { select : 5, sortable : false },
                ]
            });
        }
    }, [dataKak]);

    const handleShowModal = () => {
        setShowModal(true);
        setPdfUrl('/test.pdf')
    };

    const handleUpload = () => {
        navigate('/upload-kak');
    };

    const handleDelete = async () => {
        const confirmDelete = await Swal.fire({
            title: 'Apakah Anda yakin?',
            text: 'Anda akan menghapus data ini',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText : 'Batal',
            confirmButtonText: 'Ya, hapus!'
        });
    }

    return (
      <main class="content">
        <div class="container-fluid p-0">

          <h1 class="h3 mb-3">Pengajuan<strong> KAK</strong></h1>

          <div className="row">
            <div className="col-xl-12">
                <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">KAK</h5>
                    <button class="btn btn-primary mt-2" onClick={handleUpload} ><i className="align-middle" data-feather="upload"></i> <span className="align-middle">Upload KAK</span></button>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                    <table className="table datatable table-striped">
                        <thead>
                        <tr>
                            <th scope='col'>No</th>
                            <th scope='col'>Dokumen KAK</th>
                            <th scope='col'>Dokumen RAB</th>
                            <th scope='col'>Status</th>
                            <th scope='col'>Catatan</th>
                            <th scope='col'>Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                            {dataKak.map((kak, index) => (
                                <tr key={kak.id_kak}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <a onClick={handleShowModal} data-bs-toggle="modal" data-bs-target="#FileKAKModal" href='#'>
                                            {kak.file_kak}
                                        </a>
                                        <FileKAKModal pdfUrl={pdfUrl} showModal={showModal} setShowModal={setShowModal} />
                                    </td>
                                    <td>{kak.file_rab}</td>
                                    <td>{kak.status}</td>
                                    <td>{kak.catatan}</td>
                                    <td>
                                    <button class="btn btn-primary mt-2" onClick={handleShowModal} data-bs-toggle="modal" data-bs-target="#editKAKModal" style={{marginRight: '5px'}}><i className="align-middle" data-feather="edit"></i></button>
                                    <EditKAKModal showModal={showModal} setShowModal={setShowModal} />
                                    <button class="btn btn-danger mt-2" onClick={handleDelete}><i className="align-middle" data-feather="trash"></i></button>
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

export default KAK;
