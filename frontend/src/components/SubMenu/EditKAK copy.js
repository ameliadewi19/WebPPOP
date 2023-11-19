import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import feather from 'feather-icons';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditKAK = () => {
    const { kakId } = useParams();
    const navigate = useNavigate();
    const [role, setRole] = useState(null);

    const [formData, setFormData] = useState({ 
        id_ketua : null,
        file_kak: null,
        file_rab: null,
        prokers: []
    });

    const [proker, setProker] = useState([
        {
            id_kak: kakId,
            id_proker: null,
            nama_kegiatan: '',
            ketua_pelaksana: '',
            jenis_kegiatan: '',
            deskripsi_kegiatan: '',
            izin_submit: 'false',
            tanggal_mulai: '',
            tanggal_akhir: '',
            status: '',
            catatan: ''
        }
    ]);

    const [namaOrmawa, setNamaOrmawa] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('role');
        setRole(role);
        const idUser = localStorage.getItem('idUser');
        if(kakId){
            axios.get(`/api/kak/${kakId}`)
            .then(response => {
                const { id_ketua, file_kak, file_rab, prokers, ketua_ormawa } = response.data[0];
                setFormData({ ...formData, id_ketua, file_kak, file_rab, prokers : [...prokers] });
                setNamaOrmawa(ketua_ormawa.ormawa.nama_ormawa);
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }, [kakId]);

    const handleFileKAKChange = (e) => {
        setFormData(prevState => ({ ...prevState, file_kak: e.target.files[0] }));
    };
    
    const handleFileRABChange = (e) => {
        setFormData(prevState => ({ ...prevState, file_rab: e.target.files[0] }));
    };

    const handleProkerChange = (e, index) => {
        let data = [...formData.prokers];
        data[index][e.target.name] = e.target.value;
        updateProker(index, e.target.name, e.target.value); // Memperbarui state formData
        setProker(data);
    };

    const updateProker = (index, field, value) => {
        const updatedProkers = [...formData.prokers];
        updatedProkers[index][field] = value;
        setFormData(prevState => ({ ...prevState, prokers: updatedProkers }));
    };

    const addInputRow = () => {
        let newProker = {
            id_kak: kakId,
            id_proker: null,
            nama_kegiatan: '',
            ketua_pelaksana: '',
            jenis_kegiatan: '',
            deskripsi_kegiatan: '',
            izin_submit: 'false',
            tanggal_mulai: '',
            tanggal_akhir: '',
            status: '',
            catatan: ''
        };
        setFormData(prevState => ({
            ...prevState,
            prokers: [...prevState.prokers, newProker]
        }));
    };

    const handleDeleteRow = (index) => {
        let data = [...proker];
        data.splice(index, 1);
        setProker(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataWithPath = new FormData();
        formDataWithPath.append('id_ketua', formData.id_ketua);
        formDataWithPath.append('file_kak', formData.file_kak);
        formDataWithPath.append('file_rab', formData.file_rab);

        proker.forEach((prokerItem, index) => {
            Object.entries(prokerItem).forEach(([key, value]) => {
                formDataWithPath.append(`prokers[${index}][${key}]`, value);
            });
        });
        console.log("formData: ", formData);
        console.log("FormData: ", formDataWithPath);
        console.log("proker: ", proker);
        // Kirim formData ke Backend
        try {
            const response = await axios.put(`/api/kak/${kakId}`, formDataWithPath, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Pastikan untuk mengatur tipe konten
                },
            });
            console.log("update", response.data); // Output respons dari backend
            Swal.fire({
                icon: "success",
                title: "KAK berhasil diupload",
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
    
    const submit = (e) => {
      e.preventDefault();
      
      console.log(formData);
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
                                <button id='add-row' className='btn btn-primary float-end' onClick={addInputRow}><i className="bi-plus"></i> <span className="align-middle">Tambah</span></button>
                            </div>
                        </div>
                        <div id='input-proker'>
                            {formData.prokers.map((proker, index) => (
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
                                        <button className='btn btn-danger float-end' onClick={() => handleDeleteRow(index)}>
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