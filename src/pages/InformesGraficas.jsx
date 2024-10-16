import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const InformesGraficas = () => {
  const [data, setData] = useState({
    competencias: [],
    puntajes: [],
    avanceEvaluacion: 0,
    tendencias: [],
  });

  useEffect(() => {
    // Función para generar datos aleatorios
    const generateRandomData = (numCompetencias) => {
      const competencias = [];
      const puntajes = [];
      const tendencias = [];
      
      for (let i = 1; i <= numCompetencias; i++) {
        competencias.push(`Competencia ${i}`);
        puntajes.push(Math.floor(Math.random() * 100)); // Puntajes entre 0 y 100
        tendencias.push(Math.floor(Math.random() * 100)); // Tendencias entre 0 y 100
      }
      
      return { competencias, puntajes, tendencias };
    };

    // Simular datos
    const fetchedData = {
      ...generateRandomData(4), // Generar 4 competencias
      avanceEvaluacion: Math.floor(Math.random() * 100), // Porcentaje de avance
    };

    setData(fetchedData);
  }, []);

  const barChartData = {
    labels: data.competencias,
    datasets: [
      {
        label: 'Puntajes por Competencia',
        data: data.puntajes,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Avance Completo', 'Avance Pendiente'],
    datasets: [
      {
        data: [data.avanceEvaluacion, 100 - data.avanceEvaluacion],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const lineChartData = {
    labels: ['Evaluación 1', 'Evaluación 2', 'Evaluación 3', 'Evaluación 4'],
    datasets: [
      {
        label: 'Tendencia de Puntajes',
        data: data.tendencias,
        fill: false,
        borderColor: 'rgba(255, 159, 64, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Informes Gráficas</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Puntajes por Competencia</h2>
        <Bar data={barChartData} height={200} />
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Avance de la Evaluación</h2>
        <Pie data={pieChartData} height={200} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Tendencia de Puntajes</h2>
        <Line data={lineChartData} height={200} />
      </div>
    </div>
  );
};

export default InformesGraficas;
