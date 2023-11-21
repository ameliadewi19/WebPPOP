// Landing.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/style.css';
import './Landing.css';
// import 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css';

function Landing() {
  const navigate = useNavigate();
  const [pengumumanData, setPengumumanData] = useState([]);
  const [academicEvents, setAcademicEvents] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    fetchDataPengumuman();
    fetchDataKalender();
    fetchDataTimeline();
  }, []);

  const fetchDataKalender = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/academic-events/');
      const data = await response.json();
      setAcademicEvents(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataPengumuman = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/pengumuman/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add other headers if needed
        },
      });
      const data = await response.json();

      // Sort the data based on the 'tanggal' field in descending order
      const sortedData = data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

      // Get the latest 3 items
      const latest3Data = sortedData.slice(0, 3);

      setPengumumanData(latest3Data);

      console.log(latest3Data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataTimeline = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/timeline/');
      const data = await response.json();
      setTimelineData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDownloadTemplate = () => {
    // Add logic to handle the download template action
    // For example, redirect to a download page or trigger a download
  };

  const handleLogin = () => {
    // Add logic to handle the login action
    // For example, redirect to the login page
    navigate('/login');
  };

  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div class="container">
          <a class="navbar-brand" href="/"><span class="text-gray">SiProKerOK</span></a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#about">About</a>
              </li> 
              <li class="nav-item">
                <a class="nav-link" href="#pengumuman">Pengumuman</a>
              </li> 
              <li class="nav-item">
                <a class="nav-link" href="#kalender">Kalender</a>
              </li> 
              <li class="nav-item">
                <a class="nav-link" href="#timeline">Timeline</a>
              </li> 
              {/* <li class="nav-item">
                <a class="nav-link" href="#">Template</a>
              </li>   */}
              <li class="nav-item">
                <a class="nav-link" href="/login">Login</a>
              </li>    
            </ul>
          </div>
        </div>
      </nav>
         
         
         
      <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
              <img src="img/home1.jpg" class="d-block w-100" alt="..." style={{objectFit: 'cover'}}/>
              <div class="carousel-caption">
                  <h5>Selamat Datang</h5>
                  <p>Web Pengelolaan Organisasi Mahasiswa Politeknik Negeri Bandung</p>
                  {/* <p><a href="#" class="btn btn-warning mt-3">Learn More</a></p> */}
              </div>
          </div>
          <div class="carousel-item">
            <img src="img/home2.jpg" class="d-block w-100" alt="..." style={{objectFit: 'cover'}}/>
            <div class="carousel-caption">
              <h5>Selamat Datang</h5>
              <p>Web Pengelolaan Organisasi Mahasiswa Politeknik Negeri Bandung</p>
              {/* <p><a href="#" class="btn btn-warning mt-3">Learn More</a></p> */}
            </div>
          </div>
          <div class="carousel-item">
            <img src="img/home3.jpg" class="d-block w-100" alt="..." style={{objectFit: 'cover'}}/>
            <div class="carousel-caption">
              <h5>Selamat Datang</h5>
              <p>Web Pengelolaan Organisasi Mahasiswa Politeknik Negeri Bandung</p>
              {/* <p><a href="#" class="btn btn-warning mt-3">Learn More</a></p> */}
            </div>
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <section id="about" class="about section-padding">
          <div class="container">
              <div class="row">
                  <div class="col-lg-4 col-md-12 col-12">
                      <div class="about-img">
                          <img src="img/home4.jpg" alt="" class="img-fluid"/>
                      </div>
                  </div>
                  <div class="col-lg-8 col-md-12 col-12 ps-lg-5 mt-md-5">
                      <div class="about-text">
                            <h2>Web Pengelolaan Organisasi Mahasiswa Politeknik Negeri Bandung</h2>
                            <p>Situs ini berfungsi sebagai platform penyedia layanan administrasi untuk organisasi kemahasiswaan di Politeknik Negeri Bandung. Dengan fokus pada kebutuhan ormawa, kami menyediakan layanan untuk menyusun dan mengelola berbagai dokumen administratif, termasuk KAK, Program Kerja, LPJ, dan sejumlah dokumen penting lainnya. Tujuan utama kami adalah mempermudah dan meningkatkan efisiensi proses administratif bagi ormawa, sehingga mereka dapat fokus sepenuhnya pada pencapaian tujuan dan kegiatan positif mereka.</p>
                            {/* <a href="#" class="btn btn-warning">Learn More</a> */}
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* <section class="services section-padding" id="services">
          <div class="container">
              <div class="row">
                  <div class="col-md-12">
                      <div class="section-header text-center pb-5">
                          <h2>Pengumuman</h2>
                          <p>Beberapa pengumuman terbaru.<br/></p>
                      </div>
                  </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-12 col-lg-4">
                    <div class="card text-white text-center bg-dark pb-2">
                        <div class="card-body">
                            <i class="bi bi-laptop"></i>
                            <h3 class="card-title">Best Quality</h3>
                            <p class="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci eligendi modi temporibus alias iste. Accusantium?</p>
                            <button class="btn bg-warning text-dark">Read More</button>
                        </div>
                    </div>
                </div>
                  <div class="col-12 col-md-12 col-lg-4">
                      <div class="card text-white text-center bg-dark pb-2">
                          <div class="card-body">
                            <i class="bi bi-journal"></i>
                              <h3 class="card-title">Sustainability</h3>
                              <p class="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci eligendi modi temporibus alias iste. Accusantium?</p>
                              <button class="btn bg-warning text-dark">Read More</button>
                          </div>
                      </div>
                  </div>
                  <div class="col-12 col-md-12 col-lg-4">
                      <div class="card text-white text-center bg-dark pb-2">
                          <div class="card-body">
                            <i class="bi bi-intersect"></i>
                              <h3 class="card-title">Integrity</h3>
                              <p class="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci eligendi modi temporibus alias iste. Accusantium?</p>
                              <button class="btn bg-warning text-dark">Read More</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section> */}

      <section id="pengumuman" class="portfolio section-padding">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="section-header text-center pb-5">
                      <h2>Pengumuman</h2>
                      <p>Beberapa pengumuman terbaru.<br/></p>
                      <a href="/pengumuman-more" class="btn btn-primary">Lainnya..</a>
                    </div>
                </div>
            </div>
            <div className="row">
              {pengumumanData.map((pengumuman) => (
                <div key={pengumuman.id_pengumuman} className="col-12 col-md-12 col-lg-4">
                  <div className="card text-light text-center bg-white pb-2">
                    <div className="card-body text-dark">
                      <div className="img-area mb-4">
                        <img src={`http://localhost:8000/${pengumuman.gambar}`} className="img-fluid" alt={pengumuman.judul_konten} />
                      </div>
                      <h3 className="lead" style={{fontWeight: 'bold'}}>{pengumuman.judul_konten}</h3>
                      <h3 className="lead" style={{ whiteSpace: 'pre-line' }}>{pengumuman.isi_konten}</h3>
                      {/* <button className="btn bg-primary text-white">Learn More</button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      <section class="team section-padding" id="kalender">
          <div class="container">
            <div className="row">
              <div className="col-12 col-md-12 col-lg-12">
                <div className="card text-center">
                  <div className="card-body">
                    <div class="section-header text-center pb-5 pt-5">
                        <h2>Kalender Akademik</h2>
                        <p>Informasi kegiatan resmi Politeknik Negeri Bandung</p>
                    </div>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Start Date</th>
                          <th scope="col">End Date</th>
                          <th scope="col">Nama Kegiatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {academicEvents.map((event) => (
                          <tr key={event.id_kegiatan}>
                            <td>{event.id_kegiatan}</td>
                            <td>{event.tanggal_mulai}</td>
                            <td>{event.tanggal_selesai}</td>
                            <td>{event.nama_kegiatan}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>

      <section class="team section-padding" id="timeline">
          <div class="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="card text-center">
                <div className="card-body">
                  <div className="section-header text-center pb-5 pt-5">
                    <h2>Timeline</h2>
                    <p>Informasi timeline administrasi Ormawa</p>
                  </div>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Nama Kegiatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timelineData.map((event) => (
                        <tr key={event.id_timeline}>
                          <td>{event.id_timeline}</td>
                          <td>{event.tanggal_mulai}</td>
                          <td>{event.tanggal_selesai}</td>
                          <td>{event.nama_kegiatan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          </div>
      </section>

      <footer class="bg-dark p-2 pt-4 text-center">
          <div class="container">
              <p class="text-white">All Right Reserved By @SiProKerOK</p>
          </div>
      </footer>

    <script src="js/bootstrap.bundle.min.js"></script>
    <script src="js/script.js"></script>
      
    </>
  );
}

export default Landing;
