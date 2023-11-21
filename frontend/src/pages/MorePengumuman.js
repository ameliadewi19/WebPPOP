// Landing.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/bootstrap.min.css';
import './css/style.css';
import './Landing.css';
// import 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css';

function MorePengumuman() {
  const navigate = useNavigate();
  const [pengumumanData, setPengumumanData] = useState([]);
  const [academicEvents, setAcademicEvents] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    fetchDataPengumuman();
  }, []);

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

      setPengumumanData(data);

      console.log(data);
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
                <a class="nav-link" href="/">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/#about">About</a>
              </li> 
              <li class="nav-item">
                <a class="nav-link" href="/#pengumuman">Pengumuman</a>
              </li> 
              <li class="nav-item">
                <a class="nav-link" href="/#kalender">Kalender</a>
              </li> 
              <li class="nav-item">
                <a class="nav-link" href="/#timeline">Timeline</a>
              </li> 
              {/* <li class="nav-item">
                <a class="nav-link" href="/">Template</a>
              </li>   */}
              <li class="nav-item">
                <a class="nav-link" href="/login">Login</a>
              </li>    
            </ul>
          </div>
        </div>
      </nav>

      <section id="pengumuman" class="portfolio section-padding">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="section-header text-center pb-5">
                      <h2>Pengumuman</h2>
                      <p>Beberapa pengumuman.<br/></p>
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

      {/* <section id="contact" class="contact section-padding">
        <div class="container mt-5 mb-5">
            <div class="row">
                <div class="col-md-12">
                    <div class="section-header text-center pb-5">
                        <h2>Contact Us</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur <br/>adipisicing elit. Non, quo.</p>
                    </div>
                </div>
            </div>
			<div class="row m-0">
				<div class="col-md-12 p-0 pt-4 pb-4">
					<form action="#" class="bg-light p-4 m-auto">
						<div class="row">
							<div class="col-md-12">
								<div class="mb-3">
									<input class="form-control" placeholder="Full Name" required="" type="text"/>
								</div>
							</div>
							<div class="col-md-12">
								<div class="mb-3">
									<input class="form-control" placeholder="Email" required="" type="email"/>
								</div>
							</div>
							<div class="col-md-12">
								<div class="mb-3">
									<textarea class="form-control" placeholder="Message" required="" rows="3"></textarea>
								</div>
							</div><button class="btn btn-warning btn-lg btn-block mt-3" type="button">Send Now</button>
						</div>
					</form>
				</div>
			</div>
		</div>
      </section> */}
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

export default MorePengumuman;
