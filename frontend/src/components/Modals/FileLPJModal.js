import React, { useState, useRef, useEffect } from 'react';
import LpjFileViewer from './LpjFileViewer';

const FileLpjModal = ({ pdfData, showModal, setShowModal }) => {
    const modalRef = useRef();

    // console.log("Ini file", pdfData);

    return (
        <div className={`modal fade`} id="FileLpjModal" tabIndex="-1" aria-labelledby="FileLpjModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="FileLpjModalLabel">File LPJ</h5>
                <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <LpjFileViewer pdfUrl={pdfData} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      );
};

export default FileLpjModal;