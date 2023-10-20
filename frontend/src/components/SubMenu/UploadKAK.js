import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import feather from 'feather-icons';

const UploadKAK = ({ }) => {
    const [formData, setFormData] = useState({ namaOrmawa: '', fileKAK: null, fileRAB: null });
    const modalRef = useRef();
    
    const handleInputChange = (e) => {
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
                </form>
            </div>
        </main>
    );
  };
  
  export default UploadKAK;