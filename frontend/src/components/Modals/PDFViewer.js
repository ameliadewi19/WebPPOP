import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PDFViewer = ({ pdfUrl }) => {
  const [pdf, setPdf] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  console.log("manggil:", pdfUrl);

  useEffect(() => {
    if (!isLoaded && pdfUrl) {
      axios.get(`/api/kak/file/${pdfUrl}`, { responseType: 'blob' })
        .then(response => {
          const pdfBlob = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          setPdf(pdfBlob);
          setIsLoaded(true); // Setelah selesai, tandai bahwa telah dimuat
        })
        .catch(error => {
          console.error('Error fetching the PDF: ', error);
        });
    }
  }, [pdfUrl, isLoaded]);

  return (
    <div>
      {pdf && <iframe title="PDF Viewer" width="100%" height="500" src={pdf} />}
    </div>
  );
};

export default PDFViewer;
