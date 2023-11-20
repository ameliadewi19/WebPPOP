import React, { useState, useRef, useEffect } from 'react';
import PDFViewer from './PDFViewer';

const FileLPJModal = ({ pdfData, showModal, setShowModal }) => {
    const modalRef = useRef();
    return (
        <div className={'modal fade'} id="FileLPJModal" tabIndex="-1" aria-labelledby="FileLPJModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="FileLPJModalLabel">File LPJ</h5>
                <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                {pdfData && <PDFViewer pdfUrl={pdfData} />}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      );
};

export default FileLPJModal;