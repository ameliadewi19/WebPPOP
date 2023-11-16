import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PDFViewer = ({ pdfUrl }) => {
  const [pdf, setPdf] = useState('');

  const fetchPdf = async () => {
    try {
      const response = await axios.get(`/api/kak/file/${pdfUrl}`, { responseType: 'blob' });
      const pdfBlob = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdf(pdfBlob);
    } catch (error) {
      console.error('Error fetching the PDF: ', error);
    }
  };

  useEffect(() => {
    const openModal = async () => {
      if (pdfUrl) {
        await fetchPdf();
      }
    };
    openModal();
  }, [pdfUrl]);

  useEffect(() => {
    return () => {
      setPdf('');
    };
  }, [pdfUrl]);

  return (
    <div>
      {pdf && <iframe title="PDF Viewer" width="100%" height="500" src={pdf} />}
    </div>
  );
};

export default PDFViewer;
