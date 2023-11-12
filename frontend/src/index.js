import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js/dist/popper.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8000'; // Ganti dengan URL backend Anda

const yourAuthToken = localStorage.getItem('token'); // Ambil token dari penyimpanan lokal

if (yourAuthToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${yourAuthToken}`;
  console.log("auth token:", yourAuthToken);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
