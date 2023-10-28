import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import feather from 'feather-icons';

const UploadKAK = ({ }) => {

    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts
        // Pasang event listener pada tombol "Tambah"
    }, []);

    const [formData, setFormData] = useState({ 
        namaOrmawa: '',
        fileKAK: null,
        fileRAB: null,
        proker: [
            {
                namaKegiatan: '',
                ketuaPelaksana: '',
                jenisKegiatan: ''
            }
        ]
    });
    
    const handleInputChange = (e, index) => {
        const { name, value, type, files } = e.target; 
        // Jika input adalah file, kita memerlukan penanganan khusus
        const newValue = type === 'file' ? files[0] : value;
        
        setFormData({
          ...formData,
          [name]: newValue,
        });
    };
    
    const handleSubmit = () => {
      
    };

    const handleDeleteRow = (index) => {
        const programKerja = [...formData.programKerja];
        programKerja.splice(index, 1); // Hapus baris dengan index tertentu
        setFormData({
            ...formData,
            programKerja
        });
    };

    const addInputRow = (event) => {
        event.preventDefault();
        const inputProker = document.getElementById('input-proker');
      
        // Buat elemen-elemen baru untuk baris input
        const newRow = document.createElement('div');
        newRow.classList.add('mb-3', 'row');
      
        const input1 = document.createElement('div');
        input1.classList.add('col-sm-4');
        const inputElement1 = document.createElement('input');
        inputElement1.type = 'text';
        inputElement1.className = 'form-control';
        inputElement1.name = 'fProker';
        inputElement1.placeholder = 'Nama Kegiatan';
        input1.appendChild(inputElement1);
      
        const input2 = document.createElement('div');
        input2.classList.add('col-sm-4');
        const inputElement2 = document.createElement('input');
        inputElement2.type = 'text';
        inputElement2.className = 'form-control';
        inputElement2.name = 'fProker';
        inputElement2.placeholder = 'Ketua Pelaksana';
        input2.appendChild(inputElement2);
      
        const input3 = document.createElement('div');
        input3.classList.add('col-sm-3');

        const inputElement3 = document.createElement('input');
        inputElement3.type = 'text';
        inputElement3.className = 'form-control';
        inputElement3.name = 'fProker';
        inputElement3.placeholder = 'Jenis kegiatan';
        input3.appendChild(inputElement3);

        const input4 = document.createElement('div');
        input4.classList.add('col-sm-1');
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger float-end';
        deleteButton.innerHTML = '<i class="align-middle" data-feather="trash"></i>';
        deleteButton.addEventListener('click', () => handleDeleteRow(newRow));
        input4.appendChild(deleteButton);
      
        // Tambahkan elemen-elemen ke dalam row
        newRow.appendChild(input1);
        newRow.appendChild(input2);
        newRow.appendChild(input3);
        newRow.appendChild(input4);
      
        // Tambahkan row baru ke dalam div input-proker
        inputProker.appendChild(newRow);
      };
      
  
    return (
        <main class="content">
            <div class="container-fluid p-0">
                <form>
                    <div className="mb-3">
                        <label htmlFor="namaOrmawa" className="form-label">Nama ORMAWA</label>
                        <input
                            type="text"
                            disabled
                            className="form-control"
                            id="namaOrmawa"
                            name="namaOrmawa"
                            placeholder="ORMAWA"
                            value={formData.namaOrmawa}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fileKAK" className="form-label">File KAK</label>
                        <input
                            type="file"
                            className="form-control"
                            id="fileKAK"
                            name="fileKAK"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="fileRAB" className="form-label">File RAB</label>
                        <input
                            type="file"
                            className="form-control"
                            id="fileRAB"
                            name="fileRAB"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div id='dynamic-inputs' className="mb-3">
                        <div className='row mb-3'>
                            <div className='col-sm-6'>
                                <label htmlFor="fProker" className="form-label">Program Kerja</label>
                            </div>
                            <div className='col-sm-6 '>
                                <button id='add-row' className='btn btn-primary float-end' onClick={addInputRow}><i className="align-middle" data-feather="plus"></i> <span className="align-middle">Tambah</span></button>
                            </div>
                        </div>
                        <div id='input-proker'>
                            {formData.proker.map((proker, index) => (
                                <div className='row mb-3' key={index}>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="namaKegiatan"
                                            placeholder="Nama Kegiatan"
                                            value={proker.namaKegiatan}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </div>
                                    <div className="col-sm-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="ketuaPelaksana"
                                            placeholder="Ketua Pelaksana"
                                            value={proker.ketuaPelaksana}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </div>
                                    <div className="col-sm-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="jenisKegiatan"
                                            placeholder="Jenis kegiatan"
                                            value={proker.jenisKegiatan}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </div>
                                    <div className='col-sm-1'>
                                        <button className='btn btn-danger float-end' onClick={() => handleDeleteRow(index)}>
                                            <i className="align-middle" data-feather="trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
  };
  
export default UploadKAK;