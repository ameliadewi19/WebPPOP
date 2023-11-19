import React, { useState, useRef, useEffect } from 'react';
import PDFViewer from './PDFViewer';

const FileKAKModal = ({ pdfData, showModal, setShowModal }) => {
    const modalRef = useRef();
    // console.log("Ini file", pdfData);

    // Pastikan pdfData tersedia sebelum membuat elemen PDFViewer
    const pdfViewerElement = pdfData ? <PDFViewer pdfUrl={pdfData} /> : null;
    
    return (
        <div className={'modal fade'} id="FileKAKModal" tabIndex="-1" aria-labelledby="FileKAKModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="FileKAKModalLabel">File KAK</h5>
                <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                {pdfViewerElement}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      );
};

export default FileKAKModal;