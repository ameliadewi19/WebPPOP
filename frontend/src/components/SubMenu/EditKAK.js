import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import feather from 'feather-icons';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditKAK = () => {
    const { kakId } = useParams();
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [namaOrmawa, setNamaOrmawa] = useState(null);

    const [formData, setFormData] = useState({
        id_ketua: '',
        file_kak: null,
        file_rab: null,
    });

    const [proker, setProker] = useState([{
        id_proker: null,
        nama_kegiatan: '',
        ketua_pelaksana: '',
        jenis_kegiatan: '',
        deskripsi_kegiatan: '',
        izin_submit: 'false',
        tanggal_mulai: '',
        tanggal_akhir: '',
        status: '',
        catatan: '',
    }]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/kak/${kakId}`);
                const data = response.data[0];
                setProker(data.prokers);
                setFormData({
                    id_ketua: data.id_ketua,
                    file_kak: data.file_kak,
                    file_rab: data.file_rab,
                });
                setNamaOrmawa(data.ketua_ormawa.ormawa.nama_ormawa);
            } catch (error) {
                console.error('Error fetching KAK data:', error);
            }
        };

        fetchData();
    }, [kakId]);

    const handleAddProker = () => {
        let object = {
            id_proker: 0,
            nama_kegiatan: '',
            ketua_pelaksana: '',
            jenis_kegiatan: '',
            deskripsi_kegiatan: '',
            izin_submit: 'false',
            tanggal_mulai: '',
            tanggal_akhir: '',
            status: '',
            catatan: '',
        };
        setProker([...proker, object]);
    };

    const handleFileKAKChange = (e) => {
        const fileKAK = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, file_kak: fileKAK }));
    };

    const handleFileRABChange = (e) => {
        const fileRAB = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, file_rab: fileRAB }));
    };

    const handleProkerChange = (e, index) => {
        let data = [...proker];
        data[index][e.target.name] = e.target.value;
        setProker(data);
    };

    const handleDeleteProker = (index) => {
        let data = [...proker];
        data.splice(index, 1);
        setProker(data);
    };

    const submit = (e) => {
        e.preventDefault();
        
        console.log(formData);
        feather.replace();
    };

    const logFormData = (formData) => {
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
    };
      
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("submit", formData); // Output formDataWithPath
        console.log("proker", proker); // Output formDataWithPath

        const formDataWithPath = new FormData();
        formDataWithPath.append('file_kak', formData.file_kak);
        formDataWithPath.append('file_rab', formData.file_rab);

        proker.forEach((prokerItem, index) => {
            Object.entries(prokerItem).forEach(([key, value]) => {
                formDataWithPath.append(`prokers[${index}][${key}]`, value);
            });
        });

        logFormData(formDataWithPath);
        try {
            const response = await axios.post(`/api/kak/${kakId}`, formDataWithPath, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("update", response.data); // Output respons dari backend
            Swal.fire({
                icon: "success",
                title: "KAK berhasil diubah",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                navigate('/kak');
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "KAK gagal diupload",
                showConfirmButton: false,
                timer: 1500
            });
        }
    };
  
    return (
        <main class="content">
            <div class="container-fluid p-0">
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label htmlFor="namaOrmawa" className="form-label">Nama ORMAWA</label>
                        <input
                            type="text"
                            disabled
                            className="form-control"
                            id="namaOrmawa"
                            name="namaOrmawa"
                            placeholder="ORMAWA"
                            value={namaOrmawa}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fileKAK" className="form-label">File KAK</label>
                        <input
                            type="file"
                            className="form-control"
                            id="fileKAK"
                            name="file_kak"
                            onChange={(e) => handleFileKAKChange(e)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fileRAB" className="form-label">File RAB</label>
                        <input
                            type="file"
                            className="form-control"
                            id="fileRAB"
                            name="file_rab"
                            onChange={(e) => handleFileRABChange(e)}
                            required
                        />
                    </div>
                    <div id='dynamic-inputs' className="mb-3">
                        <div className='row mb-3'>
                            <div className='col-sm-6'>
                                <label htmlFor="fProker" className="form-label">Program Kerja</label>
                            </div>
                            <div className='col-sm-6 '>
                                <button id='add-row' className='btn btn-primary float-end' onClick={handleAddProker}><i className="bi-plus"></i> <span className="align-middle">Tambah</span></button>
                            </div>
                        </div>
                        <div id='input-proker'>
                            {proker.map((proker, index) => (
                                <div className='row mb-3' key={index}>
                                    <div className="col-sm-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nama_kegiatan"
                                            placeholder="Nama Kegiatan"
                                            onChange={(e) => handleProkerChange(e, index)}
                                            value={proker.nama_kegiatan}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="ketua_pelaksana"
                                            placeholder="Ketua Pelaksana"
                                            onChange={(e) => handleProkerChange(e, index)}
                                            value={proker.ketua_pelaksana}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                    <select
                                        className="form-select"
                                        name="jenis_kegiatan"
                                        onChange={(e) => handleProkerChange(e, index)}
                                        value={proker.jenis_kegiatan}
                                        required
                                    >
                                        <option value="" disabled>Jenis Kegiatan</option>
                                        <option value="Karakter">Karakter</option>
                                        <option value="Penalaran/Keilmuan">Penalaran/Keilmuan</option>
                                        <option value="Peminatan">Peminatan</option>
                                        <option value="Pengabdian">Pengabdian</option>
                                    </select>

                                    </div>
                                    <div className="col-sm-4">
                                        <textarea
                                            rows="1"
                                            className="form-control"
                                            name="deskripsi_kegiatan"
                                            placeholder="Deskripsi kegiatan"
                                            onChange={(e) => handleProkerChange(e, index)}
                                            value={proker.deskripsi_kegiatan}
                                            required
                                        />
                                    </div>
                                    <div className='col-sm-1'>
                                        <button className='btn btn-danger float-end' onClick={() => handleDeleteProker(index)}>
                                            <i className="bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-3">
                        <button type="submit" className="btn btn-primary float-end" onClick={handleSubmit}>Submit</button>
                    </div>
                </form>
            </div>
        </main>
    );
  };
  
export default EditKAK;