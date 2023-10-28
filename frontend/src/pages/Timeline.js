import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';

const Timeline = () => {
    const location = useLocation();
    
    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts
    }, []);

    return (
        <main class="content">
          <div class="container-fluid p-0">
  
            <h1 class="h3 mb-3"><strong>Timeline</strong></h1>
  
            <div className="row">
              <div className="col-xl-12">
                  <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                      <h5 className="card-title">KAK</h5>
                      {/* <button class="btn btn-primary mt-2" onClick={handleShowModal} data-bs-toggle="modal" data-bs-target="#addUploadKAKModal"><i className="align-middle" data-feather="upload"></i> <span className="align-middle">Upload KAK</span></button>
                      <UploadKAKModal showModal={showModal} setShowModal={setShowModal} /> */}
                  </div>
                  <div className="card-body">
                      <div className="table-responsive">
                      <table className="table table-striped">
                          <thead>
                          <tr>
                              <th>No</th>
                              <th>Dokumen KAK</th>
                              <th>Dokumen RAB</th>
                              <th>Status</th>
                              <th>Catatan</th>
                              <th>Aksi</th>
                          </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>1</td>
                              </tr>
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
