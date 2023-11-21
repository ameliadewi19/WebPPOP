import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

const MyChart = () => {
  // State to store the data from the API response
  const [chartData, setChartData] = useState(null);

  // Mock API response (replace this with actual API fetch)
  useEffect(() => {
    // Replace this with your actual API endpoint
    fetch('http://localhost:8000/api/proker/detail/jumlahTiapOrmawa')
      .then(response => response.json())
      .then(data => setChartData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Return loading or error message if chartData is not yet available
  if (!chartData) {
    return <div>Loading...</div>;
  }

  // Extract labels and dataset from the API response
  const labels = chartData.map(item => item.nama_ormawa);
  const dataset = chartData.map(item => item.total_proker);

  // Data object for Chart.js
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Proker',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: dataset,
      }
    ]
  }

  // Configuration for Chart.js
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Proker Tiap Ormawa'
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Specify the step size for y-axis ticks
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MyChart;
